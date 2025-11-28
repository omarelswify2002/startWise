# StartWise System - Backend API

A comprehensive backend API for the Smart Platform connecting Startups with Investors and Advisors.

## 🚀 Features

- **Authentication & Authorization**: JWT-based auth with role-based access control
- **User Roles**: Startup, Investor, Advisor, Admin
- **AI-Powered Matching**: Intelligent matching engine using NLP and semantic similarity
- **Real-time Messaging**: Socket.io integration for instant communication
- **File Upload**: Cloudinary integration for documents and images
- **Email Notifications**: Automated emails for OTP, welcome, and match notifications
- **Meeting Management**: Schedule and manage meetings between users
- **Admin Dashboard**: Comprehensive analytics and user management

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Cloudinary account
- Email service (Gmail or SendGrid)

## 🛠️ Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the backend directory with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@startwisesystem.com

# Frontend URL
FRONTEND_URL=http://localhost:5173

# OTP Configuration
OTP_EXPIRE_MINUTES=10
```

3. Start the server:

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `PUT /api/auth/update-profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### Startups
- `GET /api/startups` - Get all startups (with filters)
- `GET /api/startups/:id` - Get single startup
- `POST /api/startups` - Create startup profile
- `PUT /api/startups/:id` - Update startup
- `DELETE /api/startups/:id` - Delete startup
- `POST /api/startups/:id/upload` - Upload documents
- `GET /api/startups/user/:userId` - Get startup by user ID

### Investors
- `GET /api/investors` - Get all investors (with filters)
- `GET /api/investors/:id` - Get single investor
- `POST /api/investors` - Create investor profile
- `PUT /api/investors/:id` - Update investor
- `DELETE /api/investors/:id` - Delete investor
- `GET /api/investors/user/:userId` - Get investor by user ID

### Advisors
- `GET /api/advisors` - Get all advisors (with filters)
- `GET /api/advisors/:id` - Get single advisor
- `POST /api/advisors` - Create advisor profile
- `PUT /api/advisors/:id` - Update advisor
- `DELETE /api/advisors/:id` - Delete advisor
- `POST /api/advisors/:id/reviews` - Add review
- `GET /api/advisors/user/:userId` - Get advisor by user ID

### Matches
- `POST /api/matches/generate` - Generate AI matches for startup
- `GET /api/matches/:startupId` - Get matches for startup
- `GET /api/matches/detail/:id` - Get single match
- `PUT /api/matches/:id/status` - Update match status
- `DELETE /api/matches/:id` - Delete match
- `GET /api/matches/:startupId/stats` - Get match statistics

### Messages
- `POST /api/messages` - Send message
- `GET /api/messages/conversations` - Get all conversations
- `GET /api/messages/conversation/:userId` - Get conversation with user
- `PUT /api/messages/read/:conversationId` - Mark messages as read
- `GET /api/messages/unread/count` - Get unread count
- `DELETE /api/messages/:id` - Delete message

### Meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings` - Get all meetings
- `GET /api/meetings/:id` - Get single meeting
- `PUT /api/meetings/:id` - Update meeting
- `PUT /api/meetings/:id/respond` - Respond to invitation
- `DELETE /api/meetings/:id` - Cancel meeting

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/reports` - Get platform reports
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/verify/:type/:id` - Verify investor/advisor

## 🤖 AI Matching Engine

The platform uses an advanced AI matching algorithm that considers:

### For Investor Matching:
- **Sector Match (25%)**: Industry alignment
- **Stage Match (20%)**: Funding stage compatibility
- **Funding Match (20%)**: Investment range alignment
- **Location Match (10%)**: Geographic preferences
- **Semantic Similarity (25%)**: NLP-based description matching

### For Advisor Matching:
- **Industry Match (30%)**: Sector expertise
- **Experience (25%)**: Years of experience
- **Semantic Similarity (30%)**: Skill and need alignment
- **Rating (15%)**: Advisor performance rating

The matching engine uses the `@xenova/transformers` library with the `all-MiniLM-L6-v2` model for semantic text analysis.

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## 📊 Database Models

- **User**: Base user model with role-based access
- **Startup**: Startup profile with company details
- **Investor**: Investor profile with investment preferences
- **Advisor**: Advisor profile with expertise and ratings
- **Match**: AI-generated matches with scores
- **Message**: In-platform messaging
- **Meeting**: Meeting scheduling and management

## 🌐 Real-time Features

Socket.io is used for:
- Real-time messaging
- Typing indicators
- Notification alerts

## 📧 Email Templates

Pre-built email templates for:
- OTP verification
- Welcome emails
- Match notifications
- Meeting invitations

## 🔧 Error Handling

Centralized error handling middleware catches:
- Validation errors
- Authentication errors
- Database errors
- Custom application errors

## 📝 Logging

Morgan middleware for HTTP request logging in development mode.

## 🚦 Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## 🧪 Testing

To test the API, you can use:
- Postman
- Thunder Client (VS Code extension)
- cURL

## 📦 Project Structure

```
backend/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── services/        # Business logic (AI matching)
├── utils/           # Utility functions
├── .env            # Environment variables
├── server.js       # Entry point
└── package.json    # Dependencies
```

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 👥 Support

For support, email support@startwisesystem.com

