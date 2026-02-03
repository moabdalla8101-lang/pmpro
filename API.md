# API Documentation

Complete API documentation for the PMP Exam Prep App backend services.

## Base URLs

- User Service: `http://localhost:3001`
- Content Service: `http://localhost:3002`
- Analytics Service: `http://localhost:3003`

## Authentication

Most endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## User Service API

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "subscriptionTier": "free"
  },
  "token": "jwt_token"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Request Password Reset
```http
POST /api/auth/reset-password/request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token",
  "password": "newpassword123"
}
```

### User Endpoints

#### Get Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith"
}
```

#### Get User Preferences
```http
GET /api/users/preferences
Authorization: Bearer <token>
```

#### Update User Preferences
```http
PUT /api/users/preferences
Authorization: Bearer <token>
Content-Type: application/json

{
  "difficultyLevel": "intermediate",
  "studyGoals": ["Pass PMP exam"],
  "notificationsEnabled": true
}
```

### Subscription Endpoints

#### Get Subscription
```http
GET /api/subscriptions
Authorization: Bearer <token>
```

#### Update Subscription
```http
PUT /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "tier": "premium_monthly",
  "expiresAt": "2024-12-31T23:59:59Z"
}
```

### Admin Endpoints

#### Get All Users
```http
GET /api/admin/users?search=john&subscriptionTier=premium_monthly
Authorization: Bearer <admin_token>
```

#### Get User Details
```http
GET /api/admin/users/:id
Authorization: Bearer <admin_token>
```

## Content Service API

### Question Endpoints

#### Get Questions
```http
GET /api/questions?certificationId=uuid&knowledgeAreaId=uuid&difficulty=medium&limit=50&offset=0
Authorization: Bearer <token>
```

#### Get Question
```http
GET /api/questions/:id
Authorization: Bearer <token>
```

#### Create Question (Admin)
```http
POST /api/questions
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "certificationId": "uuid",
  "knowledgeAreaId": "uuid",
  "questionText": "What is the primary purpose of...",
  "explanation": "The correct answer is...",
  "difficulty": "medium",
  "answers": [
    {
      "answerText": "Option A",
      "isCorrect": true,
      "order": 0
    },
    {
      "answerText": "Option B",
      "isCorrect": false,
      "order": 1
    }
  ]
}
```

#### Update Question (Admin)
```http
PUT /api/questions/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "questionText": "Updated question text",
  "difficulty": "hard"
}
```

#### Delete Question (Admin)
```http
DELETE /api/questions/:id
Authorization: Bearer <admin_token>
```

### Knowledge Area Endpoints

#### Get Knowledge Areas
```http
GET /api/knowledge-areas
Authorization: Bearer <token>
```

#### Get Knowledge Area
```http
GET /api/knowledge-areas/:id
Authorization: Bearer <token>
```

#### Get Knowledge Areas by Certification
```http
GET /api/knowledge-areas/certification/:certificationId
Authorization: Bearer <token>
```

### Certification Endpoints

#### Get Certifications
```http
GET /api/certifications
Authorization: Bearer <token>
```

#### Get Certification
```http
GET /api/certifications/:id
Authorization: Bearer <token>
```

### Import/Export Endpoints (Admin)

#### Import Questions
```http
POST /api/import-export/import
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

file: <CSV file>
```

#### Export Questions
```http
GET /api/import-export/export?certificationId=uuid
Authorization: Bearer <admin_token>
```

## Analytics Service API

### Progress Endpoints

#### Get User Progress
```http
GET /api/progress?certificationId=uuid
Authorization: Bearer <token>
```

#### Record Answer
```http
POST /api/progress/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionId": "uuid",
  "answerId": "uuid"
}
```

**Response:**
```json
{
  "isCorrect": true,
  "userAnswerId": "uuid"
}
```

#### Get Performance by Knowledge Area
```http
GET /api/progress/knowledge-area?certificationId=uuid
Authorization: Bearer <token>
```

### Exam Endpoints

#### Start Exam
```http
POST /api/exams/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "certificationId": "uuid",
  "totalQuestions": 180
}
```

**Response:**
```json
{
  "examId": "uuid",
  "startedAt": "2024-01-01T00:00:00Z"
}
```

#### Submit Exam
```http
POST /api/exams/:id/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": [
    {
      "questionId": "uuid",
      "answerId": "uuid"
    }
  ]
}
```

**Response:**
```json
{
  "examId": "uuid",
  "score": 85.5,
  "correctAnswers": 153,
  "totalQuestions": 180
}
```

#### Get Exam
```http
GET /api/exams/:id
Authorization: Bearer <token>
```

#### Get Exam Review
```http
GET /api/exams/:id/review
Authorization: Bearer <token>
```

#### Get User Exams
```http
GET /api/exams
Authorization: Bearer <token>
```

### Analytics Endpoints

#### Get User Analytics
```http
GET /api/analytics/user?certificationId=uuid
Authorization: Bearer <token>
```

#### Get Admin Analytics
```http
GET /api/analytics/admin
Authorization: Bearer <admin_token>
```

#### Get Usage Analytics
```http
GET /api/analytics/usage?startDate=2024-01-01&endDate=2024-01-31
Authorization: Bearer <admin_token>
```

#### Get Revenue Report
```http
GET /api/analytics/revenue
Authorization: Bearer <admin_token>
```

### Badge Endpoints

#### Get User Badges
```http
GET /api/badges
Authorization: Bearer <token>
```

#### Get User Streak
```http
GET /api/badges/streak
Authorization: Bearer <token>
```

#### Update Streak
```http
POST /api/badges/streak
Authorization: Bearer <token>
```

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": {
    "message": "Error description",
    "statusCode": 400
  }
}
```

### Common Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Rate Limiting

- Authentication endpoints: 5 requests per 15 minutes per IP
- Other endpoints: 100 requests per 15 minutes per IP

Rate limit headers are included in responses:
- `X-RateLimit-Limit` - Request limit
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset time

## Pagination

List endpoints support pagination via query parameters:
- `limit` - Number of items per page (default: 50)
- `offset` - Number of items to skip (default: 0)

## Filtering

Many endpoints support filtering via query parameters. See individual endpoint documentation for available filters.



