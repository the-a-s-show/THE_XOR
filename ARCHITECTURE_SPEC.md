# XOR DSA Platform - Architecture Specification

## ⚡ CRITICAL RULES & CONSTRAINTS

### 1. No Real Secrets or Credentials
- ❌ Do NOT generate or hardcode: JWT_SECRET, MONGODB_URI, CLOUDINARY_KEYS, SMTP_PASS, REDIS_URL
- ✅ Create `.env.example` files with placeholders only
- ✅ Leave credentials empty with clear comments
- ❌ Do NOT generate fake API keys or database credentials
- ❌ Do NOT fill in OAuth Client IDs/Secrets

### 2. No Deployments or Integrations
- ❌ Do NOT configure Vercel, Railway, Render, or MongoDB Atlas
- ❌ Do NOT build or push Docker images
- ❌ Do NOT set up GitHub Secrets or CI/CD
- ❌ Do NOT configure Google Analytics, Stripe, or any third-party services
- ✅ User will deploy manually

### 3. No Real Content Generation
- ❌ Do NOT generate fake DSA problems, editorials, or videos
- ❌ Do NOT create fake company logos, avatars, or images
- ✅ Create schemas and CRUD APIs only
- ✅ User will populate data manually

### 4. Mock Code Execution
- ✅ When user clicks "Run Code" or "Submit Code", return mock JSON response:
  ```json
  { "status": "Accepted", "timeMs": 45, "memoryMB": 12.5, "testsPassed": 5, "totalTests": 5 }
  ```
- ✅ Randomly vary response: "Accepted", "Wrong Answer", "Time Limit Exceeded", "Compilation Error"
- ❌ Do NOT implement actual C++/Python/Java code execution
- ❌ Do NOT use Docker containers for execution

### 5. Admin & Security
- ✅ Implement RBAC with 3 roles: SUPER_ADMIN, CONTENT_MANAGER, USER
- ✅ Create CLI script to set up first admin (interactive prompts, no hardcoding)
- ✅ Protect `/admin/*` routes with middleware
- ❌ Do NOT hardcode admin credentials

### 6. Database: MongoDB + Mongoose
- ✅ Use MongoDB collections (not SQL tables)
- ✅ Use Mongoose for schema/validation
- ✅ Think in terms of documents, references, and embedded objects
- ❌ Do NOT use SQL or relational syntax

### 7. Storage: Cloudinary (Placeholders)
- ✅ Create multer + Cloudinary integration for: avatars, logos, images, thumbnails
- ✅ Leave API credentials as placeholders
- ❌ Do NOT upload actual files
- ❌ Do NOT generate fake upload keys

### 8. Email: Nodemailer (Placeholders)
- ✅ Create email templates: verification, password reset, announcements
- ✅ Set up Nodemailer configuration
- ✅ Leave EMAIL_USER and EMAIL_PASS empty
- ❌ Do NOT configure real SMTP servers
- ❌ Do NOT send actual emails

### 9. Caching: Redis (Placeholders)
- ✅ Set up Redis client and cache keys for: leaderboard, profiles, problems, topics, daily challenge
- ✅ Leave REDIS_URL as placeholder
- ❌ Do NOT connect to actual Redis instance

### 10. Search: MongoDB Atlas Search (Future)
- ✅ Create basic MongoDB regex search for now
- ⏳ Do NOT implement Elasticsearch yet
- ⏳ MongoDB Atlas Search integration planned for later

---

## 📊 DATABASE SCHEMA

### Collections (Replace SQL tables)

#### 1. **User** (Core)
```
{
  _id: ObjectId
  email: String (UNIQUE)
  password: String (hashed)
  full_name: String
  bio: String
  avatar_url: String
  company: String
  skills: [String]
  github_url: String
  linkedin_url: String
  leetcode_handle: String
  codeforces_handle: String
  codechef_handle: String
  role: Enum (USER, CONTENT_MANAGER, SUPER_ADMIN)
  rating: Number (default: 1000)
  xp: Number (default: 0)
  level: Number (default: 1)
  coins: Number (default: 0)
  email_verified: Boolean (default: false)
  badges: [ObjectId] (ref: Badge)
  achievements: [ObjectId] (ref: Achievement)
  preferences: {
    theme: String
    notifications_enabled: Boolean
    email_notifications: Boolean
  }
  created_at: Date
  updated_at: Date
}
```

#### 2. **Problem** (Core)
```
{
  _id: ObjectId
  title: String (REQUIRED)
  slug: String (UNIQUE)
  description: String
  difficulty: Enum (Easy, Medium, Hard)
  tags: [String]
  companies: [ObjectId] (ref: Company)
  topics: [ObjectId] (ref: Topic)
  constraints: String
  examples: [{ input: String, output: String, explanation: String }]
  test_cases: [{ input: String, output: String, hidden: Boolean }]
  starter_code: { [language]: String } (e.g., { python: "def solution():", java: "class Solution {}" })
  hints: [String]
  editorial: String (Markdown)
  video_solution_url: String
  time_complexity: String
  space_complexity: String
  premium: Boolean (default: false)
  points: Number
  order: Number
  is_published: Boolean (default: false)
  created_by: ObjectId (ref: User)
  created_at: Date
  updated_at: Date
}
```

#### 3. **Topic** (Core)
```
{
  _id: ObjectId
  name: String (UNIQUE)
  description: String
  icon: String (emoji or URL)
  problem_count: Number (computed)
  created_at: Date
}
```

#### 4. **Company** (Core)
```
{
  _id: ObjectId
  name: String (UNIQUE)
  logo_url: String
  website: String
  created_at: Date
}
```

#### 5. **UserProgress**
```
{
  _id: ObjectId
  user_id: ObjectId (ref: User)
  problem_id: ObjectId (ref: Problem)
  solved: Boolean
  attempts: Number
  best_time_ms: Number
  best_memory_mb: Number
  solved_at: Date
  last_attempted_at: Date
  created_at: Date
}
```

#### 6. **UserBookmark**
```
{
  _id: ObjectId
  user_id: ObjectId (ref: User)
  problem_id: ObjectId (ref: Problem)
  created_at: Date
}
```

#### 7. **UserStreak**
```
{
  _id: ObjectId
  user_id: ObjectId (ref: User, unique)
  current_streak: Number
  best_streak: Number
  last_solved_at: Date
  problems_solved_today: Number
  updated_at: Date
}
```

#### 8. **Submission**
```
{
  _id: ObjectId
  user_id: ObjectId (ref: User)
  problem_id: ObjectId (ref: Problem)
  code: String
  language: String (python, java, cpp, js, go)
  status: Enum (Accepted, Wrong Answer, Time Limit, Runtime Error, Compilation Error)
  execution_time_ms: Number
  memory_used_mb: Number
  test_results: { passed: Number, total: Number, failed_tests: [Number] }
  submitted_at: Date
  notes: String
}
```

#### 9. **Comment**
```
{
  _id: ObjectId
  user_id: ObjectId (ref: User)
  problem_id: ObjectId (ref: Problem)
  content: String
  is_solution: Boolean (default: false)
  likes: Number (default: 0)
  parent_comment_id: ObjectId (ref: Comment, for nested replies)
  created_at: Date
  updated_at: Date
  deleted_at: Date (for soft deletes)
}
```

#### 10. **Sheet**
```
{
  _id: ObjectId
  name: String
  description: String
  problem_ids: [ObjectId] (ref: Problem)
  created_by: ObjectId (ref: User)
  is_public: Boolean (default: true)
  total_problems: Number
  created_at: Date
  updated_at: Date
}
```

#### 11. **Contest**
```
{
  _id: ObjectId
  name: String
  description: String
  problem_ids: [ObjectId] (ref: Problem)
  start_time: Date
  end_time: Date
  duration_minutes: Number
  max_participants: Number
  created_by: ObjectId (ref: User)
  status: Enum (Upcoming, Ongoing, Completed)
  created_at: Date
}
```

#### 12. **ContestRegistration**
```
{
  _id: ObjectId
  contest_id: ObjectId (ref: Contest)
  user_id: ObjectId (ref: User)
  registered_at: Date
  started_at: Date
  finished_at: Date
}
```

#### 13. **Blog**
```
{
  _id: ObjectId
  title: String
  slug: String (UNIQUE)
  content: String (Markdown)
  author_id: ObjectId (ref: User)
  thumbnail_url: String
  tags: [String]
  views: Number (default: 0)
  published: Boolean (default: false)
  created_at: Date
  updated_at: Date
}
```

#### 14. **Announcement**
```
{
  _id: ObjectId
  title: String
  content: String
  type: Enum (info, warning, success, alert)
  created_by: ObjectId (ref: User)
  created_at: Date
  expires_at: Date
}
```

#### 15. **Notification**
```
{
  _id: ObjectId
  user_id: ObjectId (ref: User)
  title: String
  message: String
  type: Enum (info, warning, success)
  read: Boolean (default: false)
  created_at: Date
}
```

#### 16. **Badge**
```
{
  _id: ObjectId
  name: String
  description: String
  icon: String (emoji or URL)
  created_at: Date
}
```

#### 17. **Achievement**
```
{
  _id: ObjectId
  name: String
  description: String
  icon: String
  criteria: String
  reward_xp: Number
  created_at: Date
}
```

#### 18. **Role**
```
{
  _id: ObjectId
  name: Enum (USER, CONTENT_MANAGER, SUPER_ADMIN)
  description: String
  permissions: [String]
}
```

#### 19. **AdminLog**
```
{
  _id: ObjectId
  admin_id: ObjectId (ref: User)
  action: String
  entity_type: String (user, problem, contest, etc.)
  entity_id: ObjectId
  changes: Object
  created_at: Date
}
```

#### 20. **Analytics**
```
{
  _id: ObjectId
  date: Date
  total_users: Number
  active_users: Number
  problems_solved: Number
  new_registrations: Number
  avg_session_duration_sec: Number
}
```

---

## 🏗️ BACKEND ARCHITECTURE (Node.js + Express)

### Folder Structure
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js (MongoDB connection)
│   │   ├── env.js (environment variables)
│   │   └── redis.js (Redis client)
│   ├── middleware/
│   │   ├── auth.js (JWT verification)
│   │   ├── errorHandler.js (global error handling)
│   │   ├── validation.js (input validation)
│   │   ├── rbac.js (role-based access control)
│   │   └── rateLimiter.js (rate limiting)
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controller.js
│   │   │   ├── route.js
│   │   │   ├── service.js
│   │   │   └── model.js
│   │   ├── user/
│   │   ├── problem/
│   │   ├── submission/
│   │   ├── comment/
│   │   ├── sheet/
│   │   ├── contest/
│   │   ├── blog/
│   │   ├── company/
│   │   ├── topic/
│   │   ├── admin/
│   │   └── analytics/
│   ├── utils/
│   │   ├── logger.js
│   │   ├── helpers.js
│   │   ├── constants.js
│   │   └── validators.js
│   ├── shared/
│   │   ├── dto/
│   │   └── types/
│   └── app.js
├── scripts/
│   ├── seed.js (populate initial data)
│   ├── createAdmin.js (CLI to create first admin)
│   └── migrateData.js
├── tests/
│   ├── auth.test.js
│   ├── problem.test.js
│   └── submission.test.js
├── .env.example
├── docker-compose.yml
├── Dockerfile
├── package.json
└── server.js
```

### Endpoints (40+)

#### Auth Module
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh` - Refresh JWT
- `POST /api/auth/verify-email` - Verify email
- `POST /api/auth/resend-verification` - Resend verification email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

#### User Module
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get user public profile
- `GET /api/users/leaderboard` - Get leaderboard (paginated)
- `GET /api/users/:id/streak` - Get user streak

#### Problem Module
- `GET /api/problems` - Get all problems (filtered, paginated)
- `GET /api/problems/:id` - Get problem detail
- `POST /api/problems/:id/bookmark` - Bookmark problem
- `DELETE /api/problems/:id/bookmark` - Remove bookmark
- `GET /api/problems/:id/bookmarked` - Check if bookmarked
- `POST /api/admin/problems` - Create problem (admin)
- `PUT /api/admin/problems/:id` - Edit problem (admin)
- `DELETE /api/admin/problems/:id` - Delete problem (admin)

#### Submission Module
- `POST /api/submissions` - Submit code (mock execution)
- `GET /api/submissions/:id` - Get submission details
- `GET /api/users/me/submissions` - Get user's submissions
- `GET /api/problems/:id/submissions` - Get problem submissions

#### Comment Module
- `GET /api/problems/:id/comments` - Get comments on problem
- `POST /api/problems/:id/comments` - Post comment
- `PUT /api/comments/:id` - Edit comment
- `DELETE /api/comments/:id` - Delete comment
- `POST /api/comments/:id/like` - Like comment

#### Sheet Module
- `GET /api/sheets` - Get all sheets
- `GET /api/sheets/:id` - Get sheet details
- `POST /api/admin/sheets` - Create sheet (admin)
- `PUT /api/admin/sheets/:id` - Edit sheet (admin)
- `DELETE /api/admin/sheets/:id` - Delete sheet (admin)
- `GET /api/sheets/:id/progress` - Get user progress on sheet

#### Contest Module
- `GET /api/contests` - Get all contests
- `GET /api/contests/:id` - Get contest detail
- `POST /api/contests/:id/register` - Register for contest
- `GET /api/contests/:id/leaderboard` - Contest leaderboard (live)
- `POST /api/admin/contests` - Create contest (admin)
- `PUT /api/admin/contests/:id` - Edit contest (admin)

#### Blog Module
- `GET /api/blog` - Get all blog posts
- `GET /api/blog/:slug` - Get blog post
- `POST /api/admin/blog` - Create post (admin)
- `PUT /api/admin/blog/:id` - Edit post (admin)
- `DELETE /api/admin/blog/:id` - Delete post (admin)

#### Admin Module
- `GET /api/admin/analytics` - Dashboard analytics
- `GET /api/admin/users` - User management
- `GET /api/admin/problems` - Problem management
- `PUT /api/admin/users/:id` - Ban/suspend user
- `POST /api/admin/announcements` - Create announcement
- `DELETE /api/admin/logs` - View admin logs

---

## 🎨 FRONTEND ARCHITECTURE (React + Vite)

### Folder Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Nav.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── RightPanel.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Problems.jsx
│   │   │   ├── ProblemDetail.jsx
│   │   │   ├── Sheets.jsx
│   │   │   ├── Contests.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Leaderboard.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── ForgotPassword.jsx
│   │   │   └── EmailVerification.jsx
│   │   ├── modals/
│   │   │   ├── SubmissionModal.jsx
│   │   │   ├── VideoModal.jsx
│   │   │   └── CommentModal.jsx
│   │   └── ui/
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Modal.jsx
│   │       ├── Input.jsx
│   │       ├── Tabs.jsx
│   │       └── Badge.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useUser.js
│   │   ├── useProblems.js
│   │   └── usePagination.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── services/
│   │   ├── api.js (axios instance)
│   │   ├── authService.js
│   │   ├── problemService.js
│   │   ├── userService.js
│   │   └── submissionService.js
│   ├── utils/
│   │   ├── formatters.js
│   │   ├── validators.js
│   │   └── constants.js
│   ├── styles/
│   │   ├── App.css
│   │   ├── variables.css
│   │   └── responsive.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env.example
└── package.json
```

### Routes
```
/                   - Home/Landing
/problems           - Problems list
/problems/:id       - Problem detail
/sheets             - Sheets list
/contests           - Contests list
/blog               - Blog list
/leaderboard        - Full leaderboard
/auth/login         - Login page
/auth/signup        - Signup page
/profile            - User profile
/profile/edit       - Edit profile
/admin/*            - Admin panel (protected)
```

---

## 🛡️ SECURITY & RBAC

### Roles
1. **USER** - Normal user, can solve problems, comment, bookmark
2. **CONTENT_MANAGER** - Can create/edit problems, sheets, blog posts
3. **SUPER_ADMIN** - Full access to all admin features

### Protected Routes
- `/admin/*` - Require SUPER_ADMIN or CONTENT_MANAGER
- `/api/admin/*` - Require SUPER_ADMIN or CONTENT_MANAGER
- `/users/me` - Require authenticated user
- `/submissions` - Require authenticated user

---

## 📦 DEPENDENCIES

### Backend
```json
{
  "express": "^4.18.0",
  "mongoose": "^7.0.0",
  "jsonwebtoken": "^9.0.0",
  "bcryptjs": "^2.4.3",
  "dotenv": "^16.0.0",
  "multer": "^1.4.5",
  "redis": "^4.6.0",
  "nodemailer": "^6.9.0",
  "cors": "^2.8.5",
  "helmet": "^7.0.0",
  "express-rate-limit": "^6.7.0"
}
```

### Frontend
```json
{
  "react": "^19.2.6",
  "react-router-dom": "^6.0.0",
  "axios": "^1.4.0",
  "@tanstack/react-query": "^5.0.0",
  "react-hook-form": "^7.0.0",
  "zod": "^3.22.0",
  "framer-motion": "^10.16.0",
  "monaco-editor": "^0.50.0"
}
```

### Admin Panel
```json
{
  "react": "^19.2.6",
  "react-router-dom": "^6.0.0",
  "@tanstack/react-table": "^8.0.0",
  "recharts": "^2.10.0",
  "axios": "^1.4.0"
}
```

---

## 🚀 IMPLEMENTATION PHASES

### Phase 1: Backend Setup (Foundation)
- [ ] Project structure
- [ ] MongoDB models (all 20 collections)
- [ ] Auth system (JWT, refresh, email verification)
- [ ] RBAC middleware
- [ ] First admin creation script
- [ ] Error handling & validation
- [ ] .env.example

### Phase 2: Backend APIs
- [ ] Auth endpoints
- [ ] User endpoints
- [ ] Problem CRUD (with mock execution)
- [ ] Submission endpoints (mock responses)
- [ ] Comment endpoints
- [ ] Sheet/Contest endpoints
- [ ] Blog endpoints
- [ ] Admin endpoints

### Phase 3: Storage & Email
- [ ] Cloudinary integration (multer)
- [ ] Nodemailer setup
- [ ] Email templates
- [ ] Redis caching

### Phase 4: Frontend Refactoring
- [ ] Component-based structure
- [ ] React Router setup
- [ ] Auth Context & hooks
- [ ] API service layer

### Phase 5: Frontend Pages
- [ ] Auth pages (Login, Signup, etc.)
- [ ] Problem detail page
- [ ] Submission form with mock execution
- [ ] Profile page
- [ ] Leaderboard

### Phase 6: Admin Panel
- [ ] Dashboard
- [ ] User management
- [ ] Problem management
- [ ] Analytics

### Phase 7: Polish & Deployment
- [ ] Docker setup
- [ ] Documentation
- [ ] Security audit
- [ ] Cleanup

---

## ✅ SECURITY CHECKLIST

- [ ] No hardcoded secrets
- [ ] JWT with refresh tokens
- [ ] Password hashing (bcrypt)
- [ ] RBAC middleware
- [ ] Rate limiting
- [ ] Input validation
- [ ] SQL injection prevention (Mongoose)
- [ ] XSS protection
- [ ] CORS configuration
- [ ] Helmet security headers
- [ ] Admin audit logs

---

## 🚫 WHAT NOT TO DO

1. ❌ Generate fake problems
2. ❌ Deploy to Vercel/Railway
3. ❌ Configure MongoDB Atlas
4. ❌ Implement real code execution
5. ❌ Hardcode credentials
6. ❌ Generate OAuth keys
7. ❌ Upload files to Cloudinary
8. ❌ Send real emails
9. ❌ Create fake company logos
10. ❌ Build/push Docker images

---

## ✅ WHAT TO DO

1. ✅ Create schemas & models
2. ✅ Build API endpoints
3. ✅ Return mock responses
4. ✅ Use .env placeholders
5. ✅ Set up directory structure
6. ✅ Create admin script
7. ✅ Write seed script (no problems)
8. ✅ Add error handling
9. ✅ Document setup
10. ✅ Audit security

---

## 📝 NOTES FOR DEVELOPER

- User will manually:
  - Set MongoDB URI
  - Configure Cloudinary credentials
  - Set up SMTP for email
  - Configure Redis
  - Deploy to hosting
  - Populate problems manually
  - Create OAuth apps
  - Add company logos

- Focus on:
  - Clean architecture
  - Proper error handling
  - Scalable structure
  - Security best practices
  - Good documentation

---

**Created**: July 9, 2026
**Last Updated**: July 9, 2026
