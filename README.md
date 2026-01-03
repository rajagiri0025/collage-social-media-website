College Social Media - React Authentication App

A modern React application with email OTP authentication for a college social media platform.

Features

College selection with search functionality

Email OTP authentication using EmailJS

Secure registration and login flow

Modern UI with glassmorphism effects

Fully responsive design

Fast and smooth animations

Protected routes for authenticated users

Tech Stack

React 18 – UI library

Vite – Build tool

React Router – Routing

EmailJS – Email service for OTP delivery

CSS3 – Modern styling with animations

Setup Instructions
1. Install Dependencies
npm install

2. Configure EmailJS

Sign up for a free account at https://www.emailjs.com/

Create an email service (Gmail, Outlook, etc.)

Create an email template with these variables:

{{to_email}} – Recipient email

{{to_name}} – Recipient name

{{otp_code}} – The OTP code

Example email template:

Hello {{to_name}},

Your OTP code is: {{otp_code}}

This code will expire in 10 minutes.

Thanks,
Campus Connect Team


Get your credentials:

Service ID

Template ID

Public Key

Update src/config/emailConfig.js with your credentials:

export const EMAILJS_CONFIG = {
  SERVICE_ID: 'your_service_id',
  TEMPLATE_ID: 'your_template_id',
  PUBLIC_KEY: 'your_public_key',
};

3. Run the Application
npm run dev


The app will open at http://localhost:5173

Usage Flow

Select College – Choose your college from the list

Register/Login – Create a new account or log in

OTP Verification – Enter the 6-digit OTP sent to your email

Dashboard – Access your personalized dashboard

Project Structure
src/
├── components/
│   ├── CollegeSelection.jsx    # College selection page
│   ├── Login.jsx               # Login form
│   ├── Register.jsx            # Registration form
│   ├── OTPVerification.jsx     # OTP input
│   ├── Dashboard.jsx           # User dashboard
│   ├── ProtectedRoute.jsx      # Route guard
│   ├── Auth.css                # Auth pages styling
│   ├── CollegeSelection.css    # College page styling
│   └── Dashboard.css           # Dashboard styling
├── context/
│   └── AuthContext.jsx         # Authentication state
├── config/
│   └── emailConfig.js          # EmailJS configuration
├── App.jsx                     # Main app component
├── App.css                     # Global styles
└── main.jsx                    # Entry point

Features Breakdown
Authentication System

Email-based OTP verification

Secure user registration

Login with existing account

Protected routes

Session persistence with localStorage

UI/UX

Glassmorphism design

Smooth animations and transitions

Dynamic backgrounds (day/evening/night)

Responsive grid layouts

Interactive hover effects

Custom scrollbar

Build for Production
npm run build


The optimized files will be in the dist/ folder.

Notes

OTP codes are 6 digits

User data is stored in localStorage

Make sure to configure EmailJS before testing

Check spam folder if OTP email doesn't arrive

Support

For issues with EmailJS setup, visit https://www.emailjs.com/docs/
