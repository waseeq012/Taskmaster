require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const mongoose = require('mongoose');

const app = express();
const PORT = parseInt(process.env.PORT, 10) || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskmaster';

app.use(cors());
app.use(express.json());

mongoose.connect(MONGO_URI)
  .then(() => console.log(`✅ MongoDB connected to ${MONGO_URI}`))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  completed: { type: Boolean, default: false },
  priority: { type: String, default: 'medium' },
  category: { type: String, default: '' },
  dueTime: { type: Date, default: null },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  notified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Task = mongoose.model('Task', taskSchema);
const { ObjectId } = mongoose.Types;

// Email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Verify email configuration on startup
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
  console.warn('\n⚠️  WARNING: Email credentials not configured!');
  console.warn('📋 To fix this:');
  console.warn('   1. Open backend/.env file');
  console.warn('   2. Replace EMAIL_USER with your Gmail address');
  console.warn('   3. Replace EMAIL_PASSWORD with your App Password');
  console.warn('   4. Get App Password from: https://myaccount.google.com/apppasswords');
  console.warn('   5. Restart the backend server\n');
} else {
  console.log('✅ Email configuration loaded');
}

// Middleware to verify JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      message: 'Authentication required. Please login through the frontend on the same server.',
    });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    if (!user || !user.id) return res.status(403).json({ message: 'Invalid token payload' });
    req.user = { ...user, id: String(user.id) };
    next();
  });
};

// User registration
app.post('/api/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Register error:', error.message);
    res.status(500).json({ message: 'Registration failed' });
  }
});

// User login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id.toString(), email: user.email }, JWT_SECRET);
    res.json({ token, user: { id: user._id.toString(), email: user.email } });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Login failed' });
  }
});

app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    if (!ObjectId.isValid(req.user.id)) {
      return res.status(403).json({ message: 'Invalid user ID' });
    }
    const tasks = await Task.find({ userId: new ObjectId(req.user.id) });
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error.message);
    res.status(500).json({ message: 'Could not fetch tasks' });
  }
});

app.post('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, description, priority, category, dueTime, completed } = req.body;
    if (!ObjectId.isValid(req.user.id)) {
      return res.status(403).json({ message: 'Invalid user ID' });
    }
    const newTask = new Task({
      title,
      description: description || '',
      priority: priority || 'medium',
      category: category || '',
      dueTime: dueTime ? new Date(dueTime) : null,
      completed: completed || false,
      userId: new ObjectId(req.user.id),
    });
    await newTask.save();
    res.json(newTask);
  } catch (error) {
    console.error('Create task error:', error.message);
    res.status(500).json({ message: 'Could not create task' });
  }
});

app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority, category, dueTime } = req.body;
    if (!ObjectId.isValid(req.user.id)) {
      return res.status(403).json({ message: 'Invalid user ID' });
    }
    const task = await Task.findOne({ _id: id, userId: new ObjectId(req.user.id) });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const dueTimeChanged = dueTime !== undefined && new Date(dueTime).getTime() !== (task.dueTime ? task.dueTime.getTime() : null);

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    task.priority = priority !== undefined ? priority : task.priority;
    task.category = category !== undefined ? category : task.category;
    task.dueTime = dueTime !== undefined ? (dueTime ? new Date(dueTime) : null) : task.dueTime;

    if (dueTimeChanged) {
      task.notified = false;
    }

    await task.save();
    res.json(task);
  } catch (error) {
    console.error('Update task error:', error.message);
    res.status(500).json({ message: 'Could not update task' });
  }
});

app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    if (!ObjectId.isValid(req.user.id)) {
      return res.status(403).json({ message: 'Invalid user ID' });
    }
    const result = await Task.deleteOne({ _id: id, userId: new ObjectId(req.user.id) });
    if (result.deletedCount === 0) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error('Delete task error:', error.message);
    res.status(500).json({ message: 'Could not delete task' });
  }
});

// Cron job to check for missed tasks every minute
cron.schedule('* * * * *', async () => {
  const now = new Date();
  try {
    const tasksToNotify = await Task.find({ dueTime: { $ne: null }, completed: false, notified: false });
    for (const task of tasksToNotify) {
      const dueDate = new Date(task.dueTime);
      if (dueDate < now) {
        const user = await User.findById(task.userId);
        if (user && process.env.EMAIL_USER) {
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: '⏰ Task Master - Task Delayed Notification',
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #d97706;">⏰ Task Delayed</h2>
                <p>Hello,</p>
                <p>Your task has been delayed and needs your attention:</p>
                <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #d97706; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1f2937;">${task.title}</h3>
                  <p><strong>Description:</strong> ${task.description || 'No description'}</p>
                  <p><strong>Was due at:</strong> ${dueDate.toLocaleString()}</p>
                  <p><strong>Priority:</strong> ${task.priority}</p>
                  <p><strong>Category:</strong> ${task.category || 'Uncategorized'}</p>
                </div>
                <p>Please complete this task as soon as possible or update its status in Task Master.</p>
                <p>Best regards,<br>Task Master Team</p>
              </div>
            `
          };

          transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
              console.error('\n❌ Error sending email to:', user.email);
              console.error('Error details:', error.message);
              if (error.message.includes('Invalid login')) {
                console.error('\n💡 TIP: Check your email credentials in backend/.env');
                console.error('   - EMAIL_USER: Verify it\'s correct');
                console.error('   - EMAIL_PASSWORD: Must be App Password (not regular password)');
                console.error('   - Get App Password from: https://myaccount.google.com/apppasswords\n');
              } else if (error.message.includes('Username and Password not accepted')) {
                console.error('\n💡 TIP: Gmail credentials are incorrect!');
                console.error('   - Generate new App Password: https://myaccount.google.com/apppasswords');
                console.error('   - Make sure 2-Step Verification is enabled\n');
              }
            } else {
              console.log('✅ Email sent to:', user.email);
              task.notified = true;
              await task.save();
            }
          });
        }
      }
    }
  } catch (error) {
    console.error('Cron job error:', error.message);
  }
});

// Serve frontend
const rootDistPath = path.join(__dirname, '../dist');
const frontendDistPath = path.join(__dirname, '../frontend/dist');
const clientBuildPath = fs.existsSync(rootDistPath) ? rootDistPath : frontendDistPath;

if (fs.existsSync(clientBuildPath)) {
  console.log(`✅ Serving frontend from: ${clientBuildPath}`);
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: 'API route not found.' });
    }
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
} else {
  console.warn(`⚠️  No client build found at ${clientBuildPath}`);
  console.warn('📋 Please run: cd frontend && npm run build');
}

const startServer = (port, attempt = 0) => {
  const numericPort = Number(port);
  const server = app.listen(numericPort, () => {
    console.log(`✨ Task Master Backend running on http://localhost:${numericPort}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      if (attempt < 2) {
        const nextPort = numericPort + 1;
        console.warn(`\n⚠️ Port ${numericPort} is already in use. Trying port ${nextPort}...`);
        startServer(nextPort, attempt + 1);
      } else {
        console.error(`\n❌ Port ${numericPort} is already in use.`);
        console.error('Please stop the existing process or change PORT in backend/.env.');
        process.exit(1);
      }
    } else {
      console.error('❌ Server error:', err);
      process.exit(1);
    }
  });
};

startServer(PORT);