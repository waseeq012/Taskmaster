# ❌ Email Error Fix Guide

## Error समझो (Understand the Error)

```
Error: Invalid login: 535-5.7.8 Username and Password not accepted
```

यह error मतलब: आपके Gmail credentials गलत हैं `.env` file में!

---

## 🔧 Fix करने के steps:

### Step 1: Gmail में 2-Step Verification Enable करो
1. जाओ: https://myaccount.google.com/security
2. "2-Step Verification" को find करो
3. नीचे image के अनुसार enable करो:

```
Settings → Security → Enable 2-Step Verification
    ↓
    "Get codes from the Authenticator App"
    OR
    "Get codes by text message"
    ↓
    Complete verification
```

### Step 2: Gmail App Password Generate करो

यह बहुत IMPORTANT है! Regular password से काम नहीं करेगा!

**Follow करो:**
1. जाओ: https://myaccount.google.com/apppasswords
2. 2-Step Verification verify करेगा
3. Top में "Select app" → "Mail" select करो
4. "Select device" → "Windows Computer" (या अपना device)
5. Google एक 16-character password देगा
6. **यह password copy करो** - बाद में नहीं दिखेगा!

**Example password:**
```
qwer asdf ghjk lzxc
```
(बिना quotes के, spaces के साथ)

### Step 3: backend/.env को Update करो

अब अपनी actual details से replace करो:

```env
EMAIL_USER=tumhari-email@gmail.com
EMAIL_PASSWORD=qwer asdf ghjk lzxc
EMAIL_SERVICE=gmail
JWT_SECRET=your-secret-key
PORT=3001
```

**IMPORTANT:**
- ❌ मत करो: `EMAIL_PASSWORD=your-app-password`
- ✅ करो: `EMAIL_PASSWORD=qwer asdf ghjk lzxc` (actual password)
- ❌ मत करो: Regular Gmail password
- ✅ करो: App Password (जो Google generate करे)

### Step 4: Backend को restart करो

```bash
# Terminal बंद करो (Ctrl+C)
# फिर से start करो
npm start
```

---

## ✅ Test करो

1. Frontend में login करो (तुम्हारे email से)
2. एक नया task बनाओ
3. Due time को **कल का time** दो (सही तरीके से select करो)
4. Backend console में देखो - email send होगा
5. अपना email check करो - notification आएगा! ✉️

---

## 🆘 अगर अभी भी Error हो रहा है?

### ❌ Error: "Invalid credentials"
- ✓ Check करो `.env` में email सही है?
- ✓ App Password पूरे 16 characters paste किए?
- ✓ Spaces को remove मत करो App Password से
- ✓ नया App Password generate करो - पुराना काहीं copied गलत तो नहीं?

### ❌ Error: "SMTP Connection failed"
- ✓ Check करो Gmail account को
- ✓ 2-Step Verification enable है?
- ✓ कोई Security warning आया तो approve करो

### ❌ Backend start नहीं हो रहा?
- ✓ Terminal में: `npm install` फिर से चलाओ
- ✓ Port 3001 पहले से कोई और process में use कर रहा है?
- ✓ Try करो: अलग port, जैसे PORT=3002 in `.env`

---

## 📝 Checklist

- [ ] Gmail में 2-Step Verification ON है?
- [ ] App Password generate किया?
- [ ] App Password को copy किया (16 chars)?
- [ ] `.env` में EMAIL_USER को update किया?
- [ ] `.env` में EMAIL_PASSWORD को update किया (App Password)?
- [ ] Backend को npm install किया?
- [ ] Backend को restart किया (npm start)?

---

## 🎯 Expected Output में यह दिखना चाहिए:

```
✨ Task Master Backend running on http://localhost:3001
✅ Email sent to: tumhari-email@gmail.com
```

اگر یہ دکھتا ہے تو سب ठیک ہے! ✅

---

Still stuck? Double-check:
1. App Password (not regular password)
2. 2-Step Verification is ON
3. `.env` file has ACTUAL values (not placeholder)
4. Backend restarted after `.env` changes
