# Task Management System

A beautiful, modern task management application with a stunning light/dark UI, built with React for the frontend and Node.js with Express for the backend.

## 🌟 Features

✨ **Modern UI**
- Clean light theme with smooth transitions
- Dark mode toggle with system preference detection
- Responsive design for all devices
- Beautiful animations throughout

🎯 **Task Management**
- Create, edit, delete tasks
- Mark tasks as completed
- Search functionality
- Filter by category
- Set due times for tasks
- Browser notifications for due tasks

📊 **Organization**
- Task priority levels (Low, Medium, High)
- Category/Tags system
- Stats dashboard showing active, completed tasks
- Visual task status indicators

🎨 **Design**
- Tailwind CSS for styling
- Lucide React icons
- Smooth transitions and animations
- Glass-morphism effects

## 📁 Project Structure

```
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx    # Task creation form
│   │   │   ├── TaskList.jsx    # Task list display
│   │   │   └── TaskItem.jsx    # Individual task component
│   │   ├── App.jsx            # Main app component
│   │   ├── main.jsx           # Entry point
│   │   ├── index.css          # Global styles
│   │   └── ...
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── index.html

├── backend/                  # Node.js/Express backend
│   ├── server.js            # Main server file
│   ├── package.json
│   └── ...

└── package.json             # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone or extract the project**

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd frontend
   npm install
   cd ..
   ```

4. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

### Running the Application

#### Option 1: Run both frontend and backend together (from root)
```bash
npm run dev
```

#### Option 2: Run separately

**Backend** (Terminal 1):
```bash
cd backend
npm run dev
```

**Frontend** (Terminal 2):
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Building for Production

```bash
npm run build
```

## 🎨 UI Features

### Light Theme
- Clean white background with subtle gradients
- Easy on the eyes for daytime use
- Professional appearance

### Dark Theme
- Beautiful dark gradient background
- Reduced eye strain for nighttime use
- Modern glassmorphism effects

### Search & Filter
- Real-time task search
- Filter by category
- Quick task discovery

### Priority System
- **High** - Red accents
- **Medium** - Yellow accents
- **Low** - Green accents

### Task Categories
Support for custom categories:
- Work
- Personal
- Shopping
- Health
- Finance
- ...and more!

## 🔄 API Endpoints

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `PUT /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task

### Request/Response Format

**Create Task:**
```json
{
  "title": "Task title",
  "description": "Task description",
  "priority": "high|medium|low",
  "category": "Work",
  "completed": false
}
```

## 🛠️ Tech Stack

- **Frontend:**
  - React 18
  - Vite
  - Tailwind CSS 3
  - Lucide React (Icons)

- **Backend:**
  - Node.js
  - Express.js
  - CORS enabled

## 🎓 Development

### Key Components

**App.jsx** - Main app component
- State management
- API calls
- Theme switching
- Search and filter logic

**TaskForm.jsx** - Task creation component
- Form inputs
- Validation
- Submit handler

**TaskList.jsx** - Task list display
- Active tasks section
- Completed tasks section
- Loading states

**TaskItem.jsx** - Individual task
- Edit mode
- Task actions
- Priority and category badges

## 📝 Notes

- Tasks are stored in memory on the backend (not persisted)
- For production, consider adding a database
- Theme preference is saved to localStorage
- All styling is done with Tailwind CSS

## 🚀 Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- User authentication
- Task due dates
- Recurring tasks
- Task descriptions with rich text
- Email notifications
- Mobile app

## 📄 License

MIT

---

Enjoy organizing your tasks with Task Master! 🎉