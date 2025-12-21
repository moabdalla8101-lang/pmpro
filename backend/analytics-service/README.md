# Analytics Service

Analytics and reporting microservice for the PMP Exam Prep App.

## Features

- User progress tracking
- Performance analytics
- Streak tracking
- Badge assignment
- Mock exam management
- Admin analytics and reporting

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy `.env.example` to `.env`)

3. Run migrations (from root database directory)

4. Start the service:
```bash
npm run dev
```

## API Endpoints

### Progress
- `GET /api/progress` - Get user progress
- `GET /api/progress/knowledge-area` - Get performance by knowledge area
- `PUT /api/progress` - Update user progress
- `POST /api/progress/answer` - Record user answer

### Analytics
- `GET /api/analytics/user` - Get user analytics
- `GET /api/analytics/admin` - Get admin analytics (admin only)
- `GET /api/analytics/usage` - Get usage analytics (admin only)
- `GET /api/analytics/revenue` - Get revenue report (admin only)

### Exams
- `POST /api/exams/start` - Start a mock exam
- `GET /api/exams` - Get user's exams
- `GET /api/exams/:id` - Get exam details
- `GET /api/exams/:id/review` - Get exam review
- `POST /api/exams/:id/submit` - Submit exam

### Badges
- `GET /api/badges` - Get user badges
- `GET /api/badges/streak` - Get user streak
- `POST /api/badges/streak` - Update streak


