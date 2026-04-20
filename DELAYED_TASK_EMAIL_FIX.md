# 🎯 Delayed Task Email Notification - SETUP GUIDE

## What Was Fixed ✅

Your Task Master application now sends **automatic email notifications** whenever a task becomes delayed!

### Changes Made:

1. **Backend Configuration** (`backend/server.js`):
   - ✅ Added `dotenv` support to read environment variables
   - ✅ Updated email transporter to use Gmail credentials from `.env`
   - ✅ Enhanced cron job to send professional HTML emails
   - ✅ Added logic to reset notification flag when task is updated
   - ✅ Improved email template with task details

2. **Environment Setup**:
   - ✅ Created `backend/.env` file for secure credential storage
   - ✅ Created `backend/.env.example` as a template
   - ✅ Created `backend/.gitignore` to prevent committing `.env`

3. **Dependencies**:
   - ✅ Added `dotenv` to `backend/package.json`

---

## 🚀 How to Complete Setup (IMPORTANT!)

### Step 1: Install the dotenv package

```bash
cd backend
npm install
```

### Step 2: Generate Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Make sure **2-Step Verification** is enabled
3. Select **Mail** and **Windows Computer**
4. Copy the 16-character password generated

### Step 3: Update Your Email Credentials

Edit `backend/.env` and replace with your actual credentials:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_SERVICE=gmail
JWT_SECRET=your-secret-key
PORT=3001
```

**Example (DO NOT USE THIS):**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=qwer asdf ghjk lzxc
EMAIL_SERVICE=gmail
JWT_SECRET=my-super-secret-key-12345
PORT=3001
```

---

## 📧 How the System Works

### Automatic Checks:
- ✅ Every **1 minute**, the system checks all your tasks
- ✅ If a task's due time has **PASSED** and it's **NOT COMPLETED**
- ✅ An email is sent to your registered email address
- ✅ The task is marked as "notified" to avoid duplicate emails

### Email Notification Contains:
```
📌 Task Title
📝 Description
⏰ Was due at: [Date & Time]
⭐ Priority: High/Medium/Low
📂 Category: [Category Name]
```

### Automatic Notification Reset:
- ✅ If you change a task's due date → notification resets
- ✅ If you mark task as complete → no more emails  
- ✅ If you reopen a delayed task → email sends again

---

## ✨ Feature Highlights

| Feature | Details |
|---------|---------|
| **Frequency** | Checks every minute |
| **Format** | Professional HTML email |
| **Smart Reset** | Resets notification when task is updated |
| **No Duplicates** | Marks notified tasks to avoid spam |
| **Secure** | Credentials stored in `.env` (not in code) |
| **Gmail Support** | Works with Gmail App Passwords |

---

## 🐛 Troubleshooting

### ❌ Emails not sending?

**Check 1: Email Credentials**
```bash
# Verify your credentials are correct in backend/.env
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Check 2: Gmail Settings**
- Go to https://myaccount.google.com/security
- Verify 2-Step Verification is ON
- Check App Passwords section
- Gmail account might not have SMTP enabled

**Check 3: Server Logs**
- Look at backend console for error messages
- Error messages will show email sending issues

### ❌ Backend won't start?
```bash
# Make sure dotenv is installed
npm install dotenv

# Check if port 3001 is in use
# Try changing PORT in .env to another port like 3002

# Restart backend
npm start
```

### ❌ Tasks not detected as delayed?
- Verify `dueTime` is set correctly when creating tasks
- Check that the due time is in the PAST (not future)
- Make sure task is NOT marked as completed
- Check server console shows "running on http://localhost:3001"

---

## 📋 Testing the Feature

To test without waiting for actual delays:

1. Create a task with a due time in the **PAST** (e.g., yesterday)
2. Make sure it's **NOT COMPLETED**
3. Start the backend server: `npm start`
4. Wait up to 1 minute
5. Check your email for the notification ✉️

---

## 🔒 Security Notes

- ✅ `.env` file is listed in `.gitignore` - never commits credentials
- ✅ Never share your `.env` file or app password
- ✅ Always use App Passwords, not your main Gmail password
- ✅ Consider using `.env.example` as template for team collaboration

---

## 📞 Next Steps

1. **Generate App Password**: https://myaccount.google.com/apppasswords
2. **Run**: `cd backend && npm install`
3. **Update**: Edit `backend/.env` with your credentials
4. **Start**: `npm start`
5. **Test**: Create a task with past due time
6. **Verify**: Check your email! 📧

---

### Made with ❤️ for Task Master!
