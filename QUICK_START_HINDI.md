# ⚡ Quick Start - Email Notifications

## क्या किया गया? (What was Done?)
✅ Task delay होने पर email भेजने की system setup की  
✅ Automatic email notifications हर 1 मिनट में check होते हैं  
✅ Professional email template add किया  
✅ Secure .env file setup किया  

---

## अभी क्या करना है? (What to Do Now?)

### Step 1: Gmail से App Password लें (Get Gmail App Password)
1. जाओ: https://myaccount.google.com/apppasswords
2. **2-Step Verification enable** करो (अगर enable नहीं है)
3. **Mail** और **Windows Computer** select करो
4. 16 character का password मिलेगा - copy करो

### Step 2: Backend में npm install करो
```bash
cd backend
npm install
```

### Step 3: `backend/.env` file को update करो
अपनी actual email और password से replace करो:

```env
EMAIL_USER=tumhari-email@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### Step 4: Backend start करो
```bash
npm start
```

---

## कैसे काम करता है? (How It Works?)

1. **Automatic Check**: हर 1 मिनट में system check करता है
2. **Task Delay**: अगर कोई task का time pass हो गया है
3. **Email Send**: Automatically email भेज दिया जाता है
4. **Done**: Task complete करो तो email नहीं आएगा

---

## Testing करो (Test It!)

1. New task create करो
2. Due time को **कल का time** set करो (tomorrow)
3. Wait करो 1 minute
4. अपका email check करो ✉️

---

## समस्या हो रही है? (Troubleshooting?)

### Email नहीं जा रहा?
- ✓ Check करो: `backend/.env` में जो email/password दिया वो सही है?
- ✓ Gmail में 2-Step Verification enable है?
- ✓ App Password generate किया ठीक से?

### Backend start नहीं हो रहा?
- ✓ `npm install` चलाया?
- ✓ Port 3001 पहले से काहीं in-use तो नहीं?

---

## Files बनाई गई:
📄 `backend/.env` - Email credentials (Secret)  
📄 `backend/.env.example` - Template file  
📄 `backend/.gitignore` - .env को hide रखने के लिए  
📄 `backend/server.js` - Updated with email logic  
📄 `EMAIL_SETUP.md` - Detailed guide  
📄 `DELAYED_TASK_EMAIL_FIX.md` - Full documentation  

---

**Bas itna ही! Now you're all set! 🎉**
