# 🧪 Testing Checklist - StartWise System

## Quick Testing Guide for Client Presentation

---

## ✅ Pre-Testing Setup

- [ ] Backend server running on `http://localhost:5000`
- [ ] Frontend server running on `http://localhost:5174`
- [ ] MongoDB connected successfully
- [ ] No errors in backend terminal
- [ ] No errors in browser console

---

## 1️⃣ Landing Page

- [ ] Visit `http://localhost:5174`
- [ ] Check that statistics show real numbers (not 0)
- [ ] Click "Get Started" button
- [ ] Navigation menu works
- [ ] Footer links work
- [ ] Responsive design on mobile

---

## 2️⃣ User Registration & Login

### Register New Startup
- [ ] Click "Get Started" or "Sign Up"
- [ ] Fill in registration form
- [ ] Select role: **Startup**
- [ ] Submit form
- [ ] Should redirect to dashboard
- [ ] Check email for welcome message

### Register New Investor
- [ ] Logout (if logged in)
- [ ] Register with role: **Investor**
- [ ] Should redirect to dashboard

### Register New Advisor
- [ ] Logout (if logged in)
- [ ] Register with role: **Advisor**
- [ ] Should redirect to dashboard

### Login
- [ ] Logout
- [ ] Click "Login"
- [ ] Enter credentials
- [ ] Should redirect to dashboard
- [ ] User name displayed correctly

---

## 3️⃣ Startup Profile

- [ ] Login as Startup user
- [ ] Go to Dashboard
- [ ] Click "Complete Profile" button
- [ ] Fill in ALL required fields:
  - [ ] Company Name
  - [ ] Description (max 2000 chars)
  - [ ] Sector
  - [ ] Stage
  - [ ] Min Funding (e.g., 50000)
  - [ ] Max Funding (e.g., 500000)
- [ ] Fill optional fields (tagline, team size, etc.)
- [ ] Click "Create Profile"
- [ ] ✅ Should show success message
- [ ] Should redirect to dashboard
- [ ] Go back to profile page
- [ ] ✅ Should load existing data
- [ ] Edit some fields
- [ ] Click "Update Profile"
- [ ] ✅ Should save changes

---

## 4️⃣ Investor Profile

- [ ] Login as Investor user
- [ ] Go to Dashboard
- [ ] Click "Complete Profile"
- [ ] Fill in ALL required fields:
  - [ ] Investor Name
  - [ ] Investor Type
  - [ ] Min Investment (e.g., 10000)
  - [ ] Max Investment (e.g., 1000000)
- [ ] Select preferred stages (checkboxes)
- [ ] Select preferred sectors (checkboxes)
- [ ] Select geographic focus (checkboxes)
- [ ] Click "Save Profile"
- [ ] ✅ Should show success message
- [ ] Profile should be created in database

---

## 5️⃣ Advisor Profile

- [ ] Login as Advisor user
- [ ] Go to Dashboard
- [ ] Click "Complete Profile"
- [ ] Fill in ALL required fields:
  - [ ] Advisor Name
  - [ ] Bio (max 1000 chars)
  - [ ] Years of Experience
- [ ] Select specializations (checkboxes)
- [ ] Enter hourly rate (optional)
- [ ] Select availability
- [ ] Click "Save Profile"
- [ ] ✅ Should show success message
- [ ] Profile should be created in database

---

## 6️⃣ Matches Page (Startup Only)

- [ ] Login as Startup user (with profile created)
- [ ] Go to **Matches** page
- [ ] ✅ Page should load without errors
- [ ] ✅ No "undefined" errors in console
- [ ] If no matches: Shows "No matches found"
- [ ] Click "Generate Matches" button
- [ ] Should show confirmation dialog
- [ ] Confirm generation
- [ ] Wait for AI to generate matches
- [ ] ✅ Matches should appear
- [ ] Filter by type (Investor/Advisor)
- [ ] Filter by status
- [ ] Click on a match to view details

---

## 7️⃣ Messages

- [ ] Login as any user
- [ ] Go to **Messages** page
- [ ] ✅ Should load without errors
- [ ] If no conversations: Shows empty state
- [ ] Create new conversation (if feature available)
- [ ] Send a message
- [ ] Receive messages

---

## 8️⃣ Meetings

- [ ] Login as any user
- [ ] Go to **Meetings** page
- [ ] ✅ Should load without errors
- [ ] Click "Schedule Meeting" button
- [ ] Fill in meeting details:
  - [ ] Title
  - [ ] Description
  - [ ] Date & Time
  - [ ] Duration
  - [ ] Meeting Link (Zoom/Google Meet)
- [ ] Submit form
- [ ] ✅ Meeting should be created
- [ ] View upcoming meetings
- [ ] View past meetings
- [ ] Accept/Decline meeting invitations

---

## 9️⃣ Admin Panel

- [ ] Login as Admin user
- [ ] Go to **Admin Panel**

### Dashboard Statistics
- [ ] ✅ Total Users shows correct count (not 0)
- [ ] ✅ Total Startups shows correct count
- [ ] ✅ Total Investors shows correct count
- [ ] ✅ Total Advisors shows correct count
- [ ] ✅ Total Matches shows count
- [ ] ✅ Total Messages shows count

### User Management
- [ ] View all users
- [ ] Filter by role (All/Startups/Investors/Advisors)
- [ ] Check user verification status
- [ ] Find a "Not Verified" user
- [ ] Click "Verify" button
- [ ] ✅ Should show success message
- [ ] ✅ Status changes to "Verified" with green checkmark
- [ ] ✅ "Verify" button disappears
- [ ] Refresh page
- [ ] ✅ User remains verified
- [ ] Delete a user (test carefully!)

---

## 🔟 Error Handling

- [ ] Try to create profile without required fields
- [ ] ✅ Should show validation error
- [ ] Try to login with wrong password
- [ ] ✅ Should show error message
- [ ] Try to access protected route without login
- [ ] ✅ Should redirect to login
- [ ] Try to access admin panel as non-admin
- [ ] ✅ Should show unauthorized error

---

## 🎯 Final Checks

- [ ] No errors in browser console
- [ ] No errors in backend terminal
- [ ] All pages load quickly
- [ ] UI is responsive on mobile
- [ ] All buttons work
- [ ] All forms validate properly
- [ ] Success messages appear
- [ ] Error messages are user-friendly
- [ ] Navigation works smoothly
- [ ] Data persists after refresh

---

## 📊 Database Verification

Open MongoDB Compass or Atlas and verify:
- [ ] Users collection has all registered users
- [ ] Startups collection has startup profiles
- [ ] Investors collection has investor profiles
- [ ] Advisors collection has advisor profiles
- [ ] Matches collection has generated matches
- [ ] Messages collection has messages
- [ ] Meetings collection has meetings

---

## 🎉 Client Presentation Checklist

- [ ] All features demonstrated
- [ ] No errors occurred
- [ ] Professional UI/UX
- [ ] Fast performance
- [ ] Data accuracy
- [ ] Admin panel impressive
- [ ] Matching algorithm works
- [ ] Real-time updates work

---

## ✅ Sign-Off

**Tested By:** _______________  
**Date:** _______________  
**Status:** ⬜ Pass ⬜ Fail  
**Notes:** _______________

---

**If all items are checked, your project is ready for the client!** 🎊👑

