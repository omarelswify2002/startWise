# Quick Start Guide - StartWise System

## 🎯 What Has Been Built

A complete full-stack AI-powered startup-investor matching platform with:

### ✅ Backend (100% Complete)
- **Authentication System**: JWT-based auth with OTP password recovery
- **Database Models**: User, Startup, Investor, Advisor, Match, Message, Meeting
- **AI Matching Engine**: Semantic similarity using Hugging Face transformers
- **REST API**: 50+ endpoints for all features
- **Real-time Messaging**: Socket.io integration
- **File Upload**: Cloudinary integration for documents
- **Email System**: Nodemailer with HTML templates

### ✅ Frontend (60% Complete)
- **Landing Page**: Beautiful, responsive landing page with animations
- **Authentication**: Login, Register, Forgot Password pages
- **Dashboard**: Role-based dashboards for all user types
- **Redux Store**: Complete state management setup
- **Routing**: Protected routes with role-based access
- **Profile Pages**: Basic profile forms (Startup profile started)

### 🚧 To Be Completed
- Full profile forms for Investor and Advisor
- Matches page with AI match display
- Real-time messaging interface
- Meeting scheduling UI
- Admin panel with analytics
- File upload UI components

## 🚀 How to Run the Application

### Step 1: Configure Environment Variables

**Backend (.env in backend folder):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://startwise:startwise123@cluster0.mongodb.net/startwiseDB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=dqhxqwqjy
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@startwisesystem.com
FRONTEND_URL=http://localhost:5173
OTP_EXPIRE_MINUTES=10
```

**Frontend (.env in frontend folder):**
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Step 2: Install Dependencies

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm install
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
```

### Step 3: Start the Servers

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
You should see:
```
✓ MongoDB Connected
✓ Server running on port 5000
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm run dev
```
You should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

### Step 4: Open the Application

Open your browser and navigate to: **http://localhost:5173**

## 📱 Testing the Application

### 1. Register a New User

1. Click "Get Started" or "Register"
2. Select a role (Startup, Investor, or Advisor)
3. Fill in the registration form:
   - Name: John Doe
   - Email: john@example.com
   - Password: password123
   - Phone: +1 555 000 0000
4. Click "Create Account"

### 2. Login

1. Go to Login page
2. Enter your credentials
3. You'll be redirected to the dashboard

### 3. Explore the Dashboard

Based on your role, you'll see:
- **Startup**: Matches, Messages, Meetings, Profile completion
- **Investor**: Recommended startups, Messages, Meetings
- **Advisor**: Matched startups, Messages, Meetings
- **Admin**: Platform statistics and management

### 4. Complete Your Profile

Click on "Complete Your Profile" to add more details:
- **Startup**: Company details, pitch deck, funding requirements
- **Investor**: Investment preferences, portfolio, sectors
- **Advisor**: Expertise, specializations, hourly rate

### 5. Generate Matches (Startup Only)

Once your startup profile is complete:
1. Click "Generate Matches"
2. The AI will analyze your profile
3. You'll receive matches with compatibility scores

## 🔧 Troubleshooting

### Backend Won't Start
- Check if MongoDB URI is correct
- Ensure port 5000 is not in use
- Verify all environment variables are set

### Frontend Won't Start
- Check if port 5173 is available
- Ensure all dependencies are installed
- Verify .env file exists with correct API URL

### Can't Login
- Check if backend is running
- Verify MongoDB connection
- Check browser console for errors

### Email Not Sending
- Verify EMAIL_USER and EMAIL_PASSWORD
- For Gmail, use App Password (not regular password)
- Enable "Less secure app access" or use OAuth2

## 📊 API Testing with Postman

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1 555 000 0000",
  "role": "Startup"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Copy the `token` from the response.

### 3. Get Current User
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```

### 4. Create Startup Profile
```
POST http://localhost:5000/api/startups
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "companyName": "TechStartup Inc",
  "description": "AI-powered solution for businesses",
  "sector": "AI/ML",
  "stage": "Seed",
  "fundingRequired": 500000,
  "location": "San Francisco, CA",
  "website": "https://techstartup.com"
}
```

### 5. Generate Matches
```
POST http://localhost:5000/api/matches/generate
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "startupId": "YOUR_STARTUP_ID"
}
```

## 🎨 Key Features to Test

### 1. Authentication Flow
- [x] Register with different roles
- [x] Login/Logout
- [x] Forgot Password (OTP via email)
- [x] Reset Password

### 2. Profile Management
- [x] Create startup profile
- [ ] Create investor profile
- [ ] Create advisor profile
- [x] Update profile

### 3. AI Matching
- [ ] Generate matches for startup
- [ ] View match scores
- [ ] Filter matches by type
- [ ] Update match status

### 4. Messaging
- [ ] Send message to match
- [ ] View conversations
- [ ] Real-time message updates
- [ ] Mark as read

### 5. Meetings
- [ ] Schedule meeting
- [ ] Accept/Decline invitation
- [ ] View upcoming meetings
- [ ] Cancel meeting

## 📝 Next Steps for Development

1. **Complete Profile Forms**
   - Investor profile form with investment preferences
   - Advisor profile form with expertise and rates
   - File upload components for documents

2. **Matches Page**
   - Display AI-generated matches
   - Show compatibility scores with breakdown
   - Filter by match type (Investor/Advisor)
   - Contact/Message buttons

3. **Messaging Interface**
   - Conversation list with unread counts
   - Real-time chat interface
   - Socket.io client integration
   - File attachments

4. **Meeting Scheduler**
   - Calendar view
   - Create meeting form
   - Participant management
   - Email notifications

5. **Admin Panel**
   - User management table
   - Platform statistics charts
   - Verification system
   - Reports and analytics

## 🔐 Default Admin Account

To create an admin account, register normally and then update the role in MongoDB:

```javascript
// In MongoDB Compass or Shell
db.users.updateOne(
  { email: "admin@startwisesystem.com" },
  { $set: { role: "Admin" } }
)
```

## 📚 Additional Resources

- **Backend API Docs**: See `backend/README.md`
- **Database Schema**: See model files in `backend/models/`
- **Frontend Components**: See `frontend/src/pages/`
- **Redux Store**: See `frontend/src/store/`

## 💡 Tips

1. **Use Redux DevTools**: Install Redux DevTools extension for debugging
2. **Check Console**: Always check browser console for errors
3. **Network Tab**: Monitor API calls in browser DevTools
4. **MongoDB Compass**: Use MongoDB Compass to view database
5. **Postman Collection**: Create a Postman collection for API testing

## 🆘 Getting Help

If you encounter issues:
1. Check the error message in console
2. Verify environment variables
3. Ensure both servers are running
4. Check MongoDB connection
5. Review the README.md files

---

**Happy Coding! 🚀**

