# PMP Exam Prep - Monolithic Backend Server

Unified backend server combining all microservices into a single, simpler architecture.

## Architecture

This monolith combines:
- **User Service** - Authentication, user management, subscriptions
- **Content Service** - Questions, knowledge areas, certifications
- **Analytics Service** - Progress tracking, analytics, exams, badges

All services run on a single port (3001) with unified routes.

## Quick Start

### 1. Install Dependencies

```bash
cd backend/server
npm install
```

### 2. Setup Environment

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Server

```bash
npm run dev
```

Or use the startup script from root:
```bash
./scripts/start-server.sh
```

## API Endpoints

All endpoints are available on `http://localhost:3001`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/reset-password/request` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/preferences` - Get preferences
- `PUT /api/users/preferences` - Update preferences

### Subscriptions
- `GET /api/subscriptions` - Get subscription
- `PUT /api/subscriptions` - Update subscription

### Questions
- `GET /api/questions` - Get questions (with filters)
- `GET /api/questions/:id` - Get single question
- `POST /api/questions` - Create question (admin)
- `PUT /api/questions/:id` - Update question (admin)
- `DELETE /api/questions/:id` - Delete question (admin)

### Knowledge Areas
- `GET /api/knowledge-areas` - Get all knowledge areas
- `GET /api/knowledge-areas/:id` - Get single knowledge area
- `GET /api/knowledge-areas/certification/:certificationId` - Get by certification

### Certifications
- `GET /api/certifications` - Get all certifications
- `GET /api/certifications/:id` - Get single certification

### Progress
- `GET /api/progress` - Get user progress
- `GET /api/progress/knowledge-area` - Get performance by knowledge area
- `PUT /api/progress` - Update progress
- `POST /api/progress/answer` - Record answer

### Analytics
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/admin` - Get admin analytics (admin only)

### Exams
- `POST /api/exams/start` - Start mock exam
- `GET /api/exams` - Get user's exams
- `GET /api/exams/:id` - Get exam details
- `POST /api/exams/:id/submit` - Submit exam

### Badges
- `GET /api/badges` - Get user badges
- `GET /api/badges/streak` - Get streak

### Admin
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/users/:id` - Get user details (admin only)

## Environment Variables

See `.env.example` for all required environment variables.

## Development

```bash
npm run dev    # Start with hot reload
npm run build  # Build for production
npm start      # Run production build
npm test       # Run tests
```

## Database

The server uses the same PostgreSQL database as before. Make sure your database is running and migrations are applied.

See `../database/README.md` for database setup instructions.

