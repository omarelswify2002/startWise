# StartWise System - AI-Powered Startup-Investor Matching Platform

A comprehensive full-stack web application that connects startups with investors and advisors through intelligent AI-powered matching.

## 🚀 Project Overview

StartWise is a smart platform designed to bridge the gap between startups seeking funding and investors/advisors looking for promising opportunities. The platform uses advanced AI algorithms to analyze profiles and generate highly compatible matches based on multiple factors including industry, stage, funding requirements, and semantic similarity.

## ✨ Key Features

### For Startups
- **Profile Creation**: Complete startup profile with pitch deck upload
- **AI Matching**: Get matched with relevant investors and advisors
- **Compatibility Scores**: See detailed match scores (0-100%) with breakdown
- **Direct Communication**: In-platform messaging with matches
- **Meeting Scheduling**: Schedule and manage meetings
- **Progress Tracking**: Monitor match status and interactions

### For Investors
- **Investment Preferences**: Set sectors, stages, and investment ranges
- **Startup Discovery**: Browse and filter matched startups
- **Portfolio Management**: Track investments and opportunities
- **Due Diligence**: Access pitch decks and business plans
- **Communication**: Direct messaging with startups

### For Advisors
- **Expertise Profile**: Showcase specializations and experience
- **Startup Matching**: Get matched with startups needing your expertise
- **Rating System**: Build reputation through reviews
- **Availability Management**: Set hourly rates and availability
- **Advisory Services**: Offer guidance to matched startups

### For Admins
- **User Management**: Manage all platform users
- **Analytics Dashboard**: Platform statistics and insights
- **Profile Verification**: Verify investor and advisor profiles
- **Reports**: User growth, match success rates, sector distribution

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas (Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens)
- **File Storage**: Cloudinary
- **AI/ML**: Hugging Face Transformers (@xenova/transformers)
- **Real-time**: Socket.io
- **Email**: Nodemailer
- **Security**: bcryptjs, helmet, express-rate-limit

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Notifications**: SweetAlert2
- **Real-time**: Socket.io Client

## 📁 Project Structure

```
startWiseSystem/
├── backend/
│   ├── config/
│   │   ├── cloudinary.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── advisorController.js
│   │   ├── authController.js
│   │   ├── investorController.js
│   │   ├── matchController.js
│   │   ├── meetingController.js
│   │   ├── messageController.js
│   │   ├── startupController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── upload.js
│   ├── models/
│   │   ├── Advisor.js
│   │   ├── Investor.js
│   │   ├── Match.js
│   │   ├── Meeting.js
│   │   ├── Message.js
│   │   ├── Startup.js
│   │   └── User.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── advisorRoutes.js
│   │   ├── authRoutes.js
│   │   ├── investorRoutes.js
│   │   ├── matchRoutes.js
│   │   ├── meetingRoutes.js
│   │   ├── messageRoutes.js
│   │   ├── startupRoutes.js
│   │   └── userRoutes.js
│   ├── services/
│   │   └── matchingService.js
│   ├── utils/
│   │   └── sendEmail.js
│   ├── .env
│   ├── package.json
│   ├── README.md
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   └── AdminPanel.jsx
│   │   │   ├── advisor/
│   │   │   │   └── AdvisorProfile.jsx
│   │   │   ├── auth/
│   │   │   │   ├── ForgotPassword.jsx
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── investor/
│   │   │   │   └── InvestorProfile.jsx
│   │   │   ├── startup/
│   │   │   │   └── StartupProfile.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── LandingPage.jsx
│   │   │   ├── Matches.jsx
│   │   │   ├── Meetings.jsx
│   │   │   └── Messages.jsx
│   │   ├── store/
│   │   │   ├── slices/
│   │   │   │   ├── advisorSlice.js
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── investorSlice.js
│   │   │   │   ├── matchSlice.js
│   │   │   │   ├── meetingSlice.js
│   │   │   │   ├── messageSlice.js
│   │   │   │   └── startupSlice.js
│   │   │   └── store.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Email service (Gmail or SendGrid)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd startWiseSystem
```

2. **Backend Setup**
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@startwisesystem.com
FRONTEND_URL=http://localhost:5173
OTP_EXPIRE_MINUTES=10
```

3. **Frontend Setup**
```bash
cd ../frontend
npm install
```

Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

### Running the Application

1. **Start Backend Server**
```bash
cd backend
npm run dev
```
Backend will run on http://localhost:5000

2. **Start Frontend Development Server**
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

3. **Open your browser**
Navigate to http://localhost:5173

## 🤖 AI Matching Algorithm

The platform uses a sophisticated AI matching algorithm that considers:

### For Investor Matching:
- **Sector Match (25%)**: Industry alignment between startup and investor
- **Stage Match (20%)**: Funding stage compatibility
- **Funding Match (20%)**: Investment range alignment
- **Location Match (10%)**: Geographic preferences
- **Semantic Similarity (25%)**: NLP-based description matching using Hugging Face transformers

### For Advisor Matching:
- **Industry Match (30%)**: Sector expertise alignment
- **Experience (25%)**: Years of relevant experience
- **Semantic Similarity (30%)**: Skill and need alignment
- **Rating (15%)**: Advisor performance rating

The matching engine uses the `all-MiniLM-L6-v2` model for semantic text analysis and cosine similarity for comparing embeddings.

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP

### Startups
- `GET /api/startups` - Get all startups
- `POST /api/startups` - Create startup profile
- `PUT /api/startups/:id` - Update startup
- `POST /api/startups/:id/upload` - Upload documents

### Matches
- `POST /api/matches/generate` - Generate AI matches
- `GET /api/matches/:startupId` - Get matches for startup
- `PUT /api/matches/:id/status` - Update match status

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:userId` - Get conversation

### Meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings` - Get all meetings
- `PUT /api/meetings/:id/respond` - Respond to invitation

See `backend/README.md` for complete API documentation.

## 🎨 Features Implemented

### ✅ Completed
- [x] Backend API with all endpoints
- [x] Database models and relationships
- [x] JWT authentication and authorization
- [x] AI matching engine
- [x] File upload with Cloudinary
- [x] Email notifications
- [x] Real-time messaging setup
- [x] Frontend project setup with Redux
- [x] Landing page
- [x] Authentication pages (Login, Register, Forgot Password)
- [x] Dashboard (role-based)
- [x] Basic profile pages

### 🚧 In Progress / To Be Enhanced
- [ ] Complete profile forms (Investor, Advisor)
- [ ] Matches page with filtering
- [ ] Real-time messaging interface
- [ ] Meeting scheduling interface
- [ ] Admin panel with analytics
- [ ] File upload UI
- [ ] Notifications system
- [ ] Search and filtering
- [ ] Reviews and ratings UI

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting
- CORS configuration
- Helmet security headers
- OTP-based password recovery

## 📝 License

ISC

## 👥 Support

For support, email support@startwisesystem.com

## 🙏 Acknowledgments

- Hugging Face for the transformers library
- MongoDB Atlas for database hosting
- Cloudinary for file storage
- All open-source contributors

---

**Built with ❤️ for the startup ecosystem**

