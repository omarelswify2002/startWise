# Troubleshooting Guide - StartWise System

## Common Issues and Solutions

### Issue 1: "Maximum update depth exceeded" Error

**Symptoms:**
- Console shows: "Maximum update depth exceeded. This can happen when a component calls setState inside useEffect..."
- Infinite redirect loop
- Application keeps refreshing

**Cause:**
- Corrupted data in localStorage
- Invalid user or token data

**Solution:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run the following command:
```javascript
localStorage.clear();
```
4. Refresh the page (F5)
5. The landing page should now load correctly

**Alternative Solution:**
1. Open browser DevTools (F12)
2. Go to Application tab (Chrome) or Storage tab (Firefox)
3. Expand "Local Storage" in the left sidebar
4. Click on "http://localhost:5173"
5. Right-click and select "Clear"
6. Refresh the page

---

### Issue 2: Framer Motion Import Error

**Symptoms:**
- Error: "Cannot find module 'framer-motion'"
- LandingPage fails to load

**Solution:**
```bash
cd frontend
npm install framer-motion
```

---

### Issue 3: Auth State Not Working

**Symptoms:**
- `useSelector((state) => state.auth)` returns undefined
- User data not available in components

**Cause:**
- Redux store not properly configured
- Provider not wrapping the app

**Solution:**
1. Check that `main.jsx` has the Provider:
```jsx
import { Provider } from 'react-redux';
import { store } from './store/store';

<Provider store={store}>
  <App />
</Provider>
```

2. Clear localStorage and try again:
```javascript
localStorage.clear();
```

---

### Issue 4: Backend Connection Errors

**Symptoms:**
- API calls fail with network errors
- CORS errors in console

**Solution:**
1. Ensure backend is running:
```bash
cd backend
node server.js
```

2. Check that backend is on port 5000:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

3. Verify frontend API configuration in `frontend/src/config/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

---

### Issue 5: MongoDB Connection Failed

**Symptoms:**
- Backend shows: "MongoDB connection failed"
- Database operations fail

**Solution:**
1. Check `.env` file in backend folder
2. Verify `MONGO_URI` is correct
3. Ensure MongoDB Atlas allows connections from your IP
4. Test connection string in MongoDB Compass

---

### Issue 6: Email Not Sending (OTP)

**Symptoms:**
- Forgot password doesn't send email
- No OTP received

**Solution:**
1. Check `.env` file:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

2. For Gmail, use App Password (not regular password):
   - Go to Google Account Settings
   - Security → 2-Step Verification
   - App Passwords → Generate new password
   - Use that password in `.env`

---

### Issue 7: File Upload Fails

**Symptoms:**
- Logo/document upload doesn't work
- Cloudinary errors

**Solution:**
1. Check `.env` file:
```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

2. Verify Cloudinary account is active
3. Check file size (max 10MB)

---

### Issue 8: AI Matching Not Working

**Symptoms:**
- "Generate Matches" button doesn't work
- No matches appear

**Solution:**
1. Ensure startup profile is complete
2. Check that there are investors/advisors in the database
3. Check backend console for errors
4. Verify Hugging Face transformers are loaded:
```
✅ MongoDB Connected
```

---

### Issue 9: Protected Routes Not Working

**Symptoms:**
- Can access protected pages without login
- Redirects not working

**Solution:**
1. Clear localStorage:
```javascript
localStorage.clear();
```

2. Check that token is being set on login
3. Verify ProtectedRoute component in `App.jsx`

---

### Issue 10: Styling Issues / Tailwind Not Working

**Symptoms:**
- No styles applied
- Plain HTML appearance

**Solution:**
1. Check that Tailwind is installed:
```bash
cd frontend
npm install -D tailwindcss postcss autoprefixer
```

2. Verify `tailwind.config.js` exists
3. Check `index.css` imports Tailwind:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## Quick Reset Procedure

If you encounter persistent issues, follow this complete reset:

### 1. Clear Browser Data
```javascript
// In browser console
localStorage.clear();
sessionStorage.clear();
```

### 2. Restart Backend
```bash
# Kill the backend process (Ctrl+C)
cd backend
node server.js
```

### 3. Restart Frontend
```bash
# Kill the frontend process (Ctrl+C)
cd frontend
npm run dev
```

### 4. Test Fresh Registration
1. Go to http://localhost:5173
2. Click "Get Started"
3. Register a new account
4. Complete profile
5. Test features

---

## Debugging Tips

### Enable Verbose Logging

**Backend:**
Add to `server.js`:
```javascript
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});
```

**Frontend:**
Add to components:
```javascript
console.log('User:', user);
console.log('Token:', token);
console.log('State:', state);
```

### Check Network Requests

1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "Fetch/XHR"
4. Check request/response for API calls

### Check Redux State

1. Install Redux DevTools extension
2. Open DevTools
3. Go to Redux tab
4. Inspect state and actions

---

## Getting Help

If issues persist:

1. **Check Console Errors**: Look for specific error messages
2. **Check Network Tab**: Verify API calls are successful
3. **Check Backend Logs**: Look for server-side errors
4. **Clear Everything**: localStorage, cookies, cache
5. **Restart Both Servers**: Backend and frontend

---

**Last Updated**: 2025-11-07

