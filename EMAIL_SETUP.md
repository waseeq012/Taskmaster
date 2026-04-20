# 📧 Email Notification Setup Guide

## Overview
Your **Task Master** application is now configured to send email notifications whenever a task is delayed. Here's how to set it up:

## Step 1: Install Dependencies

Run this command in the backend folder:
```bash
npm install dotenv
```

Or if npm doesn't work, you can manually add `"dotenv": "^16.3.1"` to your `package.json` dependencies and run `npm install`.

## Step 2: Get Your Gmail App Password

Follow these steps to generate a Gmail App Password:

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Sign in to your Gmail account
3. You'll need to enable **2-Step Verification** first if you haven't already
4. Select **Mail** and **Windows Computer** (or your device)
5. Google will generate a 16-character password
6. Copy this password

## Step 3: Update .env File

Replace the placeholder values in `backend/.env`:

```env
# Replace your-email@gmail.com with your actual Gmail address
EMAIL_USER=your-email@gmail.com

# Replace your-app-password with the 16-character password from Step 2
EMAIL_PASSWORD=your-app-password

EMAIL_SERVICE=gmail
JWT_SECRET=your-secret-key
PORT=3001
```

**Example:**
```env
EMAIL_USER=john.doe@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
EMAIL_SERVICE=gmail
JWT_SECRET=your-secret-key
PORT=3001
```

## Step 4: Start the Backend Server

```bash
npm start
```

or for development with auto-reload:
```bash
npm run dev
```

## How It Works

✅ **Automatic Delay Detection:**
- Every minute, the system checks all your tasks
- If a task's due time has passed and it's not completed
- An HTML-formatted email is sent to your registered email address
- The notification includes:
  - Task title
  - Description
  - Original due time
  - Priority level
  - Category

📧 **Email Features:**
- Professional HTML formatted emails
- Once sent, a task won't send duplicate emails (marked as notified)
- Emails are sent automatically without user intervention

## Troubleshooting

**Issue: Emails not sending?**
- ✓ Check if `EMAIL_USER` and `EMAIL_PASSWORD` are correct in `.env`
- ✓ Verify App Password was created correctly (not regular password)
- ✓ Check server console for error messages
- ✓ Make sure 2-Step Verification is enabled on Gmail account

**Issue: Backend won't start?**
- ✓ Run `npm install` to install all dependencies including dotenv
- ✓ Make sure port 3001 is not already in use

**Issue: Tasks not being detected as delayed?**
- ✓ Verify dueTime is set correctly when creating tasks
- ✓ Check server is running (check console for "running on http://localhost:3001")

---

Once set up, you'll receive email notifications automatically whenever any task becomes delayed! 🎉
