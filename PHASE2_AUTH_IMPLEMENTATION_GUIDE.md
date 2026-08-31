# Phase 2: Authentication System - Implementation Guide

## 🎯 Overview

Phase 2 focuses on building a complete authentication system with:
- User registration & login
- JWT token management (access + refresh)
- Email verification
- Password reset functionality
- First admin user creation script
- Secure password hashing

---

## 📋 What Needs to Be Created

### 1. Auth Service Layer (`src/modules/auth/service.js`)
```
Responsibilities:
- Register new user
- Verify email
- Resend verification email
- Login user (generate tokens)
- Logout user
- Refresh access token
- Password reset flow
- Password change
```

### 2. Auth Controller (`src/modules/auth/controller.js`)
```
Endpoints to handle:
- POST /register
- POST /login
- POST /logout
- POST /refresh-token
- POST /verify-email
- POST /resend-verification
- POST /forgot-password
- POST /reset-password
- POST /change-password (authenticated)
```

### 3. Auth Routes (`src/modules/auth/route.js`)
```
Wire up all endpoints
Apply rate limiting (auth-specific)
Apply validation middleware
```

### 4. Email Service (`src/services/emailService.js`)
```
Templates needed:
- Email verification email
- Password reset email
- Welcome email
- Announcement email

Using: Nodemailer (SMTP configuration)
```

### 5. First Admin Script (`scripts/createAdmin.js`)
```
CLI tool that:
- Prompts for email
- Prompts for password
- Validates inputs
- Hashes password
- Creates SUPER_ADMIN user
- Shows confirmation

⚠️ NO hardcoded credentials
```

---

## 🔄 Authentication Flow

### Registration Flow
```
1. User submits email, password, name
2. Validate input (email format, password strength)
3. Check if email already exists
4. Hash password with bcrypt
5. Create User document
6. Generate verification token
7. Send verification email
8. Return success message
9. User checks email and verifies
10. Mark email_verified: true
```

### Login Flow
```
1. User submits email, password
2. Find user by email
3. Compare password with bcrypt.compare()
4. Generate JWT access token (24h)
5. Generate JWT refresh token (7d)
6. Store tokens (or return to client)
7. Return tokens in response
8. Client stores in localStorage/cookies
```

### Token Refresh Flow
```
1. Client sends refresh_token
2. Verify refresh_token validity
3. Generate new access_token
4. Return new access_token
5. Continue request with new token
```

### Password Reset Flow
```
1. User requests password reset (email)
2. Find user by email
3. Generate reset token
4. Send reset email with token
5. User clicks link
6. Verify reset token (must not be expired)
7. User enters new password
8. Hash new password
9. Update user password
10. Invalidate all refresh tokens (logout from all devices)
```

---

## 💾 Database Updates Required

### User Model Enhancement
```javascript
// Additional fields needed:
- verification_token (expires in 24h)
- verification_token_expires
- reset_token (for password reset)
- reset_token_expires
- refresh_tokens: [{ token, expires_at }] // Track all active tokens
```

### UserStreak Model
```javascript
// Already created, will be used by streak service
// Updates on first solve of the day
```

---

## 📧 Email Templates

### Verification Email
```
Subject: Verify Your Email - XOR DSA

Dear [User Name],

Welcome to XOR! Please verify your email to activate your account.

[VERIFY EMAIL BUTTON] or paste link: http://frontend/verify?token=...

This link expires in 24 hours.

Best regards,
XOR Team
```

### Password Reset Email
```
Subject: Reset Your Password - XOR DSA

Dear [User Name],

We received a request to reset your password.

[RESET PASSWORD BUTTON] or paste link: http://frontend/reset-password?token=...

This link expires in 1 hour.

If you didn't request this, ignore this email.

Best regards,
XOR Team
```

---

## 🔐 Security Considerations

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers, special chars
- Display password strength indicator

### Token Management
- Access tokens: 24 hours expiry
- Refresh tokens: 7 days expiry
- Store tokens in HTTP-only cookies (secure)
- Or localStorage for SPA (less secure but simpler)

### Rate Limiting
- Login: 5 attempts per 15 minutes
- Register: 5 attempts per hour per IP
- Password reset: 3 attempts per hour per email

### Password Hashing
- Use bcryptjs (already in dependencies)
- Salt rounds: 10
- Never store plaintext passwords

### Email Verification
- Must verify email before accessing problems
- Send verification email on register
- Allow resend (rate-limited)
- Tokens expire in 24 hours

---

## 🛠️ Implementation Checklist

### Auth Service
- [ ] Register function with validation
- [ ] Email verification logic
- [ ] Login function
- [ ] Token generation (access + refresh)
- [ ] Token verification
- [ ] Logout function
- [ ] Password reset request
- [ ] Password reset completion
- [ ] Refresh token rotation

### Auth Controller
- [ ] POST /auth/register handler
- [ ] POST /auth/login handler
- [ ] POST /auth/logout handler
- [ ] POST /auth/refresh-token handler
- [ ] POST /auth/verify-email handler
- [ ] POST /auth/resend-verification handler
- [ ] POST /auth/forgot-password handler
- [ ] POST /auth/reset-password handler
- [ ] All error handling

### Auth Routes
- [ ] Import controller methods
- [ ] Create Express router
- [ ] Apply rate limiting middleware
- [ ] Apply input validation
- [ ] Export routes

### Email Service
- [ ] Nodemailer configuration
- [ ] Verification email template
- [ ] Password reset email template
- [ ] Error handling
- [ ] Graceful fallback (console log if SMTP not configured)

### First Admin Script
- [ ] CLI prompts (email, password, name)
- [ ] Input validation
- [ ] Password confirmation
- [ ] Check if admin already exists
- [ ] Hash password
- [ ] Create SUPER_ADMIN user
- [ ] Success message

### Main App
- [ ] Import auth routes
- [ ] Register auth routes in app.js
- [ ] Test all endpoints

---

## 📝 API Endpoint Specifications

### POST /api/auth/register
```
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe"
}

Response (201):
{
  "success": true,
  "message": "User registered. Check email to verify account.",
  "data": {
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}

Error (400):
{
  "success": false,
  "message": "Email already exists",
  "statusCode": 400
}
```

### POST /api/auth/login
```
Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200):
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOi...",
    "refresh_token": "eyJhbGciOi...",
    "user": {
      "id": "...",
      "email": "user@example.com",
      "full_name": "John Doe",
      "role": "USER"
    }
  }
}

Error (401):
{
  "success": false,
  "message": "Invalid email or password",
  "statusCode": 401
}
```

### POST /api/auth/refresh-token
```
Request:
{
  "refresh_token": "eyJhbGciOi..."
}

Response (200):
{
  "success": true,
  "message": "Token refreshed",
  "data": {
    "access_token": "eyJhbGciOi..."
  }
}

Error (401):
{
  "success": false,
  "message": "Invalid refresh token",
  "statusCode": 401
}
```

### POST /api/auth/verify-email
```
Request:
{
  "token": "verification-token-from-email"
}

Response (200):
{
  "success": true,
  "message": "Email verified successfully",
  "data": {
    "email_verified": true
  }
}

Error (400):
{
  "success": false,
  "message": "Invalid or expired verification token",
  "statusCode": 400
}
```

### POST /api/auth/forgot-password
```
Request:
{
  "email": "user@example.com"
}

Response (200):
{
  "success": true,
  "message": "Password reset email sent",
  "data": {}
}
```

### POST /api/auth/reset-password
```
Request:
{
  "token": "reset-token-from-email",
  "password": "NewSecurePass123!",
  "confirm_password": "NewSecurePass123!"
}

Response (200):
{
  "success": true,
  "message": "Password reset successful",
  "data": {}
}
```

---

## 🧪 Testing Commands

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "full_name": "Test User"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

### Refresh Token
```bash
curl -X POST http://localhost:5000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refresh_token": "eyJhbGciOi..."
  }'
```

---

## 📚 Dependencies Already Installed

- ✅ jsonwebtoken - Token generation/verification
- ✅ bcryptjs - Password hashing
- ✅ nodemailer - Email sending
- ✅ dotenv - Environment variables

---

## 🎯 Success Criteria

- [ ] User can register with valid email/password
- [ ] Verification email is sent
- [ ] User can verify email via token
- [ ] User can login and receive tokens
- [ ] Access tokens work for 24 hours
- [ ] Refresh tokens work for 7 days
- [ ] User can reset password
- [ ] First admin can be created via CLI script
- [ ] Rate limiting prevents brute force attacks
- [ ] All passwords are bcrypt hashed
- [ ] No real email credentials in code
- [ ] No hardcoded tokens or secrets
- [ ] All errors handled gracefully

---

## 📋 Files to Create

```
✅ src/modules/auth/service.js         (main auth logic)
✅ src/modules/auth/controller.js      (request handlers)
✅ src/modules/auth/route.js           (Express routes)
✅ src/services/emailService.js        (email templates & sending)
✅ scripts/createAdmin.js              (CLI for first admin)
```

---

## 🚀 Next Phase (Phase 3)

Once authentication is complete, Phase 3 will implement:
- User profile endpoints
- Problem CRUD endpoints
- Submission endpoints (with mock responses)
- Comment CRUD endpoints

---

**Ready to begin Phase 2? Confirm and I'll start implementing authentication!**
