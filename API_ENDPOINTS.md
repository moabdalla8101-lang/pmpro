# 📚 PMP Exam Prep API - Complete Endpoint Reference

## Base URL
```
http://localhost:3001
```

## API Information
```bash
GET /
```
Returns API information and available endpoints.

## Health Check
```bash
GET /health
```
Returns server status.

---

## 🔐 Authentication Endpoints

### Register
```bash
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### Request Password Reset
```bash
POST /api/auth/reset-password/request
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```bash
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset-token",
  "password": "newpassword123"
}
```

### Social Login
```bash
POST /api/auth/social-login
Content-Type: application/json

{
  "provider": "google",  // or "apple"
  "token": "oauth-token"
}
```

---

## 👤 User Endpoints

### Get User Profile
```bash
GET /api/users/profile
Authorization: Bearer <token>
```

### Update User Profile
```bash
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe"
}
```

---

## 💳 Subscription Endpoints

### Get User Subscription
```bash
GET /api/subscriptions
Authorization: Bearer <token>
```

### Update Subscription
```bash
PUT /api/subscriptions
Authorization: Bearer <token>
Content-Type: application/json

{
  "tier": "premium",
  "expiresAt": "2024-12-31"
}
```

---

## ❓ Question Endpoints

### Get Questions
```bash
GET /api/questions
Authorization: Bearer <token>
Query params:
  - knowledgeAreaId: filter by knowledge area
  - difficulty: filter by difficulty
  - limit: number of results
  - offset: pagination offset
```

### Get Question by ID
```bash
GET /api/questions/:id
Authorization: Bearer <token>
```

### Create Question (Admin)
```bash
POST /api/questions
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Question text",
  "knowledgeAreaId": "uuid",
  "difficulty": "medium",
  "answers": [...]
}
```

### Update Question (Admin)
```bash
PUT /api/questions/:id
Authorization: Bearer <token>
```

### Delete Question (Admin)
```bash
DELETE /api/questions/:id
Authorization: Bearer <token>
```

---

## 📖 Knowledge Area Endpoints

### Get Knowledge Areas
```bash
GET /api/knowledge-areas
Authorization: Bearer <token>
```

### Get Knowledge Area by ID
```bash
GET /api/knowledge-areas/:id
Authorization: Bearer <token>
```

### Create Knowledge Area (Admin)
```bash
POST /api/knowledge-areas
Authorization: Bearer <token>
```

### Update Knowledge Area (Admin)
```bash
PUT /api/knowledge-areas/:id
Authorization: Bearer <token>
```

### Delete Knowledge Area (Admin)
```bash
DELETE /api/knowledge-areas/:id
Authorization: Bearer <token>
```

---

## 🎓 Certification Endpoints

### Get Certifications
```bash
GET /api/certifications
Authorization: Bearer <token>
```

### Get Certification by ID
```bash
GET /api/certifications/:id
Authorization: Bearer <token>
```

### Create Certification (Admin)
```bash
POST /api/certifications
Authorization: Bearer <token>
```

### Update Certification (Admin)
```bash
PUT /api/certifications/:id
Authorization: Bearer <token>
```

### Delete Certification (Admin)
```bash
DELETE /api/certifications/:id
Authorization: Bearer <token>
```

---

## 📊 Progress Endpoints

### Get User Progress
```bash
GET /api/progress
Authorization: Bearer <token>
```

### Update Progress
```bash
POST /api/progress
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionId": "uuid",
  "isCorrect": true,
  "timeSpent": 30
}
```

---

## 📈 Analytics Endpoints

### Get User Analytics
```bash
GET /api/analytics
Authorization: Bearer <token>
```

### Get Performance Metrics
```bash
GET /api/analytics/performance
Authorization: Bearer <token>
```

### Get Knowledge Area Stats
```bash
GET /api/analytics/knowledge-areas
Authorization: Bearer <token>
```

---

## 📝 Exam Endpoints

### Start Exam
```bash
POST /api/exams/start
Authorization: Bearer <token>
Content-Type: application/json

{
  "certificationId": "uuid",
  "questionCount": 50
}
```

### Submit Answer
```bash
POST /api/exams/:examId/answer
Authorization: Bearer <token>
Content-Type: application/json

{
  "questionId": "uuid",
  "answerId": "uuid"
}
```

### Finish Exam
```bash
POST /api/exams/:examId/finish
Authorization: Bearer <token>
```

### Get Exam Results
```bash
GET /api/exams/:examId
Authorization: Bearer <token>
```

---

## 🏆 Badge Endpoints

### Get User Badges
```bash
GET /api/badges
Authorization: Bearer <token>
```

### Get Badge by ID
```bash
GET /api/badges/:id
Authorization: Bearer <token>
```

---

## 👨‍💼 Admin Endpoints

### Get All Users
```bash
GET /api/admin/users
Authorization: Bearer <admin-token>
```

### Get User by ID
```bash
GET /api/admin/users/:id
Authorization: Bearer <admin-token>
```

### Update User (Admin)
```bash
PUT /api/admin/users/:id
Authorization: Bearer <admin-token>
```

### Delete User (Admin)
```bash
DELETE /api/admin/users/:id
Authorization: Bearer <admin-token>
```

---

## 📥 Import/Export Endpoints

### Export Questions (CSV)
```bash
GET /api/import-export/questions/export
Authorization: Bearer <admin-token>
```

### Import Questions (CSV)
```bash
POST /api/import-export/questions/import
Authorization: Bearer <admin-token>
Content-Type: multipart/form-data

file: <CSV file>
```

---

## 🔒 Authentication

Most endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by logging in via `/api/auth/login`.

---

## 📝 Notes

- All timestamps are in ISO 8601 format
- All UUIDs are in standard UUID v4 format
- Rate limiting is applied to all endpoints
- Admin endpoints require admin role in JWT token



