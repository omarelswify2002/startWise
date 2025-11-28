# 🚀 StartWise System - Server Startup Guide

## Quick Start (Recommended)

### Option 1: Using Two Terminals (Easiest)

#### Terminal 1 - Backend Server
```bash
cd e:\projects\startWiseSystem\backend
node server.js
```

**Expected Output:**
```
[dotenv] injecting env (15) from .env
✅ MongoDB Connected to: cluster0.xxxxx.mongodb.net
🚀 Server running on port 5000
```

#### Terminal 2 - Frontend Server
```bash
cd e:\projects\startWiseSystem\frontend
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

---

## ⚠️ IMPORTANT: Clear Browser Data First!

Before accessing the application, **ALWAYS** clear localStorage to prevent errors:

### Method 1: Browser Console (Recommended)
1. Open the application: http://localhost:5173
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Type and press Enter:
```javascript
localStorage.clear();
```
5. Refresh the page (`F5`)

### Method 2: Application Tab
1. Press `F12` to open DevTools
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** in the left sidebar
4. Click on `http://localhost:5173`
5. Right-click and select **Clear**
6. Refresh the page

---

## 🔍 Troubleshooting

### Backend Won't Start

**Problem:** Port 5000 already in use
```bash
# Windows PowerShell - Find and kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force
```

**Problem:** MongoDB connection failed
- Check `.env` file in backend folder
- Verify `MONGO_URI` is correct
- Ensure MongoDB Atlas allows your IP address

**Problem:** Missing dependencies
```bash
cd backend
npm install
```

---

### Frontend Won't Start

**Problem:** Port 5173 already in use
```bash
# Windows PowerShell - Find and kill process on port 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

**Problem:** Missing dependencies
```bash
cd frontend
npm install
```

**Problem:** Vite errors
```bash
cd frontend
rm -rf node_modules
rm package-lock.json
npm install
```

---

### Application Errors

**Problem:** "Maximum update depth exceeded"
- **Solution:** Clear localStorage (see instructions above)
- Refresh the page

**Problem:** "Cannot read properties of undefined"
- **Solution:** Clear localStorage
- Make sure both servers are running
- Check browser console for specific errors

**Problem:** Blank page or infinite loading
- **Solution:** 
  1. Clear localStorage
  2. Check both servers are running
  3. Open browser console (F12) and check for errors
  4. Verify backend is responding: http://localhost:5000/api/auth/me

---

## ✅ Verification Steps

### 1. Check Backend is Running
Open browser and visit: http://localhost:5000/api/auth/me

**Expected Response:**
```json
{
  "success": false,
  "error": "Not authorized, no token"
}
```
This is correct! It means the backend is running.

### 2. Check Frontend is Running
Open browser and visit: http://localhost:5173

**Expected Result:**
- You should see the StartWise landing page
- No errors in the console (F12)

### 3. Test Registration
1. Click "Get Started" or "Sign Up"
2. Fill in the registration form
3. Select a role (Startup, Investor, or Advisor)
4. Submit the form
5. You should be redirected to the dashboard

---

## 🎯 First Time Setup Checklist

- [ ] Backend `.env` file configured with MongoDB URI
- [ ] Backend dependencies installed (`npm install`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] MongoDB Atlas IP whitelist configured
- [ ] Both servers started successfully
- [ ] Browser localStorage cleared
- [ ] Application loads without errors

---

## 📝 Environment Variables

### Backend `.env` File
```env
# Server
NODE_ENV=development
PORT=5000

# Database
MONGO_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

# Email (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Cloudinary (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env` File (Optional)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🔄 Restart Procedure

If you encounter issues, follow this complete restart:

### 1. Stop All Servers
- Press `Ctrl+C` in both terminal windows

### 2. Clear Browser Data
```javascript
// In browser console (F12)
localStorage.clear();
sessionStorage.clear();
```

### 3. Restart Backend
```bash
cd e:\projects\startWiseSystem\backend
node server.js
```

### 4. Restart Frontend
```bash
cd e:\projects\startWiseSystem\frontend
npm run dev
```

### 5. Refresh Browser
- Press `F5` or `Ctrl+R`

---

## 🎨 Professional Features Implemented

✅ **Error Boundary** - Catches and displays errors gracefully
✅ **Loading States** - Professional loading animations
✅ **404 Page** - Custom not found page
✅ **Null Safety** - All components handle missing data
✅ **Input Validation** - Form validation on all inputs
✅ **Responsive Design** - Works on all screen sizes
✅ **Professional UI** - Modern gradient designs
✅ **Error Messages** - Clear, helpful error messages
✅ **Success Feedback** - SweetAlert2 notifications

---

## 📞 Need Help?

If you're still experiencing issues:

1. **Check Console Errors**: Press F12 and look for red errors
2. **Check Network Tab**: Verify API calls are successful
3. **Check Backend Logs**: Look at the terminal running the backend
4. **Clear Everything**: localStorage, cookies, cache
5. **Restart Both Servers**: Follow the restart procedure above

---

## 🚀 Ready to Launch!

Once both servers are running and localStorage is cleared:

1. Visit: http://localhost:5173
2. Click "Get Started"
3. Register a new account
4. Complete your profile
5. Start using StartWise!

---

**Last Updated:** 2025-11-07
**Version:** 1.0.0

