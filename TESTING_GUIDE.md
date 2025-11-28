# Testing Guide - StartWise System

## Overview
This guide provides comprehensive testing instructions for the StartWise System platform.

## Prerequisites
- Node.js installed
- MongoDB Atlas account configured
- Backend and Frontend servers running

## Starting the Application

### 1. Start Backend Server
```bash
cd backend
npm run dev
```
Expected output:
```
✓ MongoDB Connected
✓ Server running on port 5000
```

### 2. Start Frontend Server
```bash
cd frontend
npm run dev
```
Expected output:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

## Test Scenarios

### Test 1: Landing Page
**Objective**: Verify the landing page loads correctly

**Steps**:
1. Open browser to http://localhost:5173
2. Verify the landing page displays with:
   - Navigation bar with logo
   - Hero section with gradient text
   - Features section (6 feature cards)
   - How It Works section
   - CTA buttons
3. Click "Get Started" button
4. Verify redirect to registration page

**Expected Result**: Landing page loads with all sections visible and animations working

---

### Test 2: User Registration (Startup)
**Objective**: Register a new startup user

**Steps**:
1. Navigate to http://localhost:5173/register
2. Select "Startup" role
3. Fill in the form:
   - Name: Test Startup
   - Email: startup@test.com
   - Phone: +1 555 000 0001
   - Password: password123
   - Confirm Password: password123
4. Click "Create Account"

**Expected Result**:
- Success message displayed
- Redirect to dashboard
- Dashboard shows startup-specific content

---

### Test 3: User Registration (Investor)
**Objective**: Register a new investor user

**Steps**:
1. Logout if logged in
2. Navigate to http://localhost:5173/register
3. Select "Investor" role
4. Fill in the form:
   - Name: Test Investor
   - Email: investor@test.com
   - Phone: +1 555 000 0002
   - Password: password123
   - Confirm Password: password123
5. Click "Create Account"

**Expected Result**:
- Success message displayed
- Redirect to dashboard
- Dashboard shows investor-specific content

---

### Test 4: User Registration (Advisor)
**Objective**: Register a new advisor user

**Steps**:
1. Logout if logged in
2. Navigate to http://localhost:5173/register
3. Select "Advisor" role
4. Fill in the form:
   - Name: Test Advisor
   - Email: advisor@test.com
   - Phone: +1 555 000 0003
   - Password: password123
   - Confirm Password: password123
5. Click "Create Account"

**Expected Result**:
- Success message displayed
- Redirect to dashboard
- Dashboard shows advisor-specific content

---

### Test 5: Login
**Objective**: Login with existing credentials

**Steps**:
1. Navigate to http://localhost:5173/login
2. Enter credentials:
   - Email: startup@test.com
   - Password: password123
3. Click "Login"

**Expected Result**:
- Success message displayed
- Redirect to dashboard
- User information displayed in navigation

---

### Test 6: Forgot Password
**Objective**: Test password recovery flow

**Steps**:
1. Navigate to http://localhost:5173/forgot-password
2. Enter email: startup@test.com
3. Click "Send OTP"
4. Check email for OTP code
5. Enter OTP and new password
6. Click "Reset Password"

**Expected Result**:
- OTP sent to email
- Password reset successful
- Can login with new password

---

### Test 7: Complete Startup Profile
**Objective**: Create a complete startup profile

**Steps**:
1. Login as startup user
2. Click "Complete Your Profile" or navigate to /startup/profile
3. Fill in the form:
   - Company Name: TechVenture Inc
   - Description: AI-powered analytics platform for businesses
   - Sector: AI/ML
   - Stage: Seed
   - Funding Required: 500000
   - Location: San Francisco, CA
   - Website: https://techventure.com
4. Click "Save Profile"

**Expected Result**:
- Profile saved successfully
- Redirect to dashboard
- Profile completion indicator updated

---

### Test 8: Complete Investor Profile
**Objective**: Create a complete investor profile

**Steps**:
1. Login as investor user
2. Navigate to /investor/profile
3. Fill in the form:
   - Firm Name: Acme Ventures
   - Description: Early-stage tech investor
   - Investment Stages: Seed, Series A (select multiple)
   - Sectors: AI/ML, SaaS, Fintech (select multiple)
   - Min Investment: 50000
   - Max Investment: 2000000
   - Geographic Focus: North America, Europe
   - Portfolio: Company A, Company B
   - Website: https://acmeventures.com
   - LinkedIn: https://linkedin.com/company/acme
4. Click "Save Profile"

**Expected Result**:
- Profile saved successfully
- Redirect to dashboard

---

### Test 9: Complete Advisor Profile
**Objective**: Create a complete advisor profile

**Steps**:
1. Login as advisor user
2. Navigate to /advisor/profile
3. Fill in the form:
   - Specialization: Business Strategy, Marketing (select multiple)
   - Expertise: 15+ years in tech startups
   - Industries: AI/ML, SaaS (select multiple)
   - Years of Experience: 15
   - Hourly Rate: 200
   - Availability: Part-time
   - Bio: Experienced advisor with track record
   - LinkedIn: https://linkedin.com/in/advisor
   - Website: https://advisor.com
4. Click "Save Profile"

**Expected Result**:
- Profile saved successfully
- Redirect to dashboard

---

### Test 10: Generate AI Matches
**Objective**: Generate matches for a startup

**Steps**:
1. Login as startup user (with complete profile)
2. Navigate to /matches
3. Click "Generate Matches"
4. Confirm in the dialog
5. Wait for AI processing

**Expected Result**:
- Loading indicator shown
- Matches generated with compatibility scores
- Matches displayed with:
  - Match type (Investor/Advisor)
  - Compatibility score (0-100%)
  - Reason for match
  - Key highlights

---

### Test 11: Filter Matches
**Objective**: Test match filtering functionality

**Steps**:
1. On matches page with generated matches
2. Test filters:
   - Select "Investors" from Match Type
   - Select "Pending" from Status
   - Adjust Min Score slider to 60%
3. Verify filtered results

**Expected Result**:
- Matches filtered correctly based on criteria
- Only matching results displayed

---

### Test 12: Accept/Reject Matches
**Objective**: Update match status

**Steps**:
1. On matches page
2. Find a pending match
3. Click "Accept Match"
4. Verify status changes to "Accepted"
5. Find another pending match
6. Click "Reject"
7. Verify status changes to "Rejected"

**Expected Result**:
- Match status updated successfully
- UI reflects new status
- Accepted matches show "Send Message" button

---

### Test 13: Send Message
**Objective**: Test messaging functionality

**Steps**:
1. Login as startup user
2. Navigate to /messages
3. Select a conversation or start new one
4. Type a message: "Hello, interested in discussing investment"
5. Click "Send"

**Expected Result**:
- Message sent successfully
- Message appears in chat
- Timestamp displayed

---

### Test 14: Receive and Reply to Message
**Objective**: Test two-way messaging

**Steps**:
1. Login as investor user (recipient)
2. Navigate to /messages
3. See unread message indicator
4. Click on conversation
5. Read message
6. Reply: "Thanks for reaching out. Let's schedule a call"
7. Click "Send"

**Expected Result**:
- Unread indicator shown
- Message marked as read when opened
- Reply sent successfully
- Both messages visible in conversation

---

### Test 15: Search Conversations
**Objective**: Test conversation search

**Steps**:
1. On messages page with multiple conversations
2. Type in search box: "startup"
3. Verify filtered results

**Expected Result**:
- Conversations filtered by participant name
- Only matching conversations shown

---

### Test 16: Admin Panel - View Stats
**Objective**: Test admin dashboard statistics

**Steps**:
1. Create admin user (update role in database)
2. Login as admin
3. Navigate to /admin
4. View statistics cards

**Expected Result**:
- All statistics displayed:
  - Total Users
  - Total Startups
  - Total Investors
  - Total Advisors
  - Total Matches
  - Total Messages

---

### Test 17: Admin Panel - User Management
**Objective**: Test user management features

**Steps**:
1. On admin panel
2. View users table
3. Filter by role (Startup, Investor, Advisor)
4. Click "Verify" on unverified user
5. Confirm verification

**Expected Result**:
- Users table displays all users
- Filters work correctly
- User verification successful
- Status updated in table

---

### Test 18: Admin Panel - Delete User
**Objective**: Test user deletion

**Steps**:
1. On admin panel
2. Find a test user
3. Click "Delete"
4. Confirm deletion in dialog

**Expected Result**:
- Confirmation dialog shown
- User deleted successfully
- User removed from table

---

### Test 19: Logout
**Objective**: Test logout functionality

**Steps**:
1. While logged in
2. Click user avatar/menu
3. Click "Logout"

**Expected Result**:
- User logged out
- Redirect to landing page
- Cannot access protected routes

---

### Test 20: Protected Routes
**Objective**: Verify route protection

**Steps**:
1. Logout if logged in
2. Try to access:
   - http://localhost:5173/dashboard
   - http://localhost:5173/matches
   - http://localhost:5173/messages

**Expected Result**:
- Redirect to login page
- Cannot access without authentication

---

## API Testing with Postman/Thunder Client

### 1. Register User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "API Test User",
  "email": "apitest@test.com",
  "password": "password123",
  "phone": "+1 555 000 0010",
  "role": "Startup"
}
```

### 2. Login
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "apitest@test.com",
  "password": "password123"
}
```

### 3. Get Current User
```
GET http://localhost:5000/api/auth/me
Authorization: Bearer YOUR_TOKEN
```

### 4. Create Startup
```
POST http://localhost:5000/api/startups
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "companyName": "API Startup",
  "description": "Test startup via API",
  "sector": "SaaS",
  "stage": "Seed",
  "fundingRequired": 300000,
  "location": "New York, NY"
}
```

### 5. Generate Matches
```
POST http://localhost:5000/api/matches/generate
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "startupId": "YOUR_STARTUP_ID"
}
```

## Known Issues & Limitations

1. **Real-time Messaging**: Socket.io integration is set up but requires additional testing
2. **File Upload**: UI for document upload not yet implemented
3. **Email Notifications**: Requires valid SMTP credentials
4. **AI Matching**: Requires Hugging Face model download on first run

## Performance Testing

### Load Testing
- Test with 100+ users
- Test with 1000+ matches
- Test concurrent messaging

### Browser Compatibility
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Security Testing

1. **Authentication**: Verify JWT tokens expire correctly
2. **Authorization**: Verify role-based access control
3. **Input Validation**: Test with malicious inputs
4. **XSS Protection**: Test script injection
5. **CSRF Protection**: Verify CORS configuration

## Reporting Issues

When reporting issues, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Screenshots/error messages
5. Browser/environment details

---

**Testing Checklist**:
- [ ] All registration flows work
- [ ] Login/logout works
- [ ] Password recovery works
- [ ] All profile forms save correctly
- [ ] AI matching generates results
- [ ] Match filtering works
- [ ] Match status updates work
- [ ] Messaging works both ways
- [ ] Admin panel displays stats
- [ ] User management works
- [ ] Protected routes are secure
- [ ] API endpoints respond correctly

