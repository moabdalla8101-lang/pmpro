# 🧪 Testing Guide

Complete guide to test the PMP Exam Prep monolith backend.

## Prerequisites

1. **PostgreSQL running** with database `pmp_app` created
2. **Node.js 20+** installed
3. **Database migrations** applied (if not done yet)

## Quick Test (5 minutes)

### 1. Start the Server

```bash
cd backend/server
npm install  # If not done yet
cp .env.example .env  # If not done yet
# Edit .env with your database credentials
npm run dev
```

You should see:
```
🚀 PMP Exam Prep Server running on port 3001
📚 All services unified in monolith architecture
```

### 2. Test Health Endpoint

```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","service":"pmp-app-server"}
```

### 3. Test Registration

```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    "firstName": "Test",
    "lastName": "User",
    "role": "user",
    "subscriptionTier": "free"
  },
  "token": "jwt_token_here"
}
```

### 4. Test Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "uuid",
    "email": "test@example.com",
    ...
  },
  "token": "jwt_token_here"
}
```

### 5. Test Protected Endpoint (with token)

```bash
# Save token from login response
TOKEN="your_jwt_token_here"

curl http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

Expected response:
```json
{
  "id": "uuid",
  "email": "test@example.com",
  ...
}
```

## Full API Testing

### Authentication Endpoints

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'

# Request password reset
curl -X POST http://localhost:3001/api/auth/reset-password/request \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com"}'
```

### Questions Endpoints

```bash
TOKEN="your_token_here"

# Get questions
curl http://localhost:3001/api/questions \
  -H "Authorization: Bearer $TOKEN"

# Get single question
curl http://localhost:3001/api/questions/:id \
  -H "Authorization: Bearer $TOKEN"
```

### Progress Endpoints

```bash
TOKEN="your_token_here"

# Get user progress
curl http://localhost:3001/api/progress \
  -H "Authorization: Bearer $TOKEN"

# Record answer
curl -X POST http://localhost:3001/api/progress/answer \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "questionId": "uuid",
    "answerId": "uuid",
    "isCorrect": true
  }'
```

### Exams Endpoints

```bash
TOKEN="your_token_here"

# Start exam
curl -X POST http://localhost:3001/api/exams/start \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "certificationId": "uuid",
    "totalQuestions": 180
  }'

# Get user exams
curl http://localhost:3001/api/exams \
  -H "Authorization: Bearer $TOKEN"
```

## Testing with Mobile App

### 1. Start Backend Server

```bash
cd backend/server
npm run dev
```

### 2. Start Mobile App

```bash
cd mobile
npm start
```

### 3. In Expo DevTools:
- Press **`i`** for iOS Simulator
- Press **`a`** for Android Emulator

### 4. Test in App:
- Register a new account
- Login
- Browse questions
- Start a practice session
- View progress

## Testing with Web Admin

### 1. Start Backend Server

```bash
cd backend/server
npm run dev
```

### 2. Start Web Admin

```bash
cd web-admin
npm install  # If not done yet
npm run dev
```

### 3. Open Browser

Navigate to `http://localhost:5173` (or the port shown)

### 4. Test Features:
- Login with admin credentials
- View dashboard
- Manage questions
- View analytics

## Automated Testing Script

Create a test script:

```bash
#!/bin/bash

BASE_URL="http://localhost:3001"

echo "🧪 Testing PMP Exam Prep API..."

# Health check
echo "1. Health check..."
curl -s $BASE_URL/health | jq .

# Register
echo "2. Registering user..."
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test1234","firstName":"Test","lastName":"User"}')

echo $REGISTER_RESPONSE | jq .

# Extract token
TOKEN=$(echo $REGISTER_RESPONSE | jq -r '.token')

if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Registration failed or user already exists"
  echo "Trying login instead..."
  
  LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test1234"}')
  
  TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.token')
fi

if [ "$TOKEN" != "null" ] && [ -n "$TOKEN" ]; then
  echo "✅ Got token: ${TOKEN:0:20}..."
  
  # Test protected endpoint
  echo "3. Testing protected endpoint..."
  curl -s $BASE_URL/api/users/profile \
    -H "Authorization: Bearer $TOKEN" | jq .
  
  echo "✅ All tests passed!"
else
  echo "❌ Failed to get token"
fi
```

Save as `scripts/test-api.sh` and run:
```bash
chmod +x scripts/test-api.sh
./scripts/test-api.sh
```

## Testing Checklist

- [ ] Server starts without errors
- [ ] Health endpoint returns OK
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can access protected endpoints with token
- [ ] Can get questions
- [ ] Can record progress
- [ ] Can start exam
- [ ] Mobile app connects to backend
- [ ] Web admin connects to backend

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Database Connection Error
- Check PostgreSQL is running
- Verify `.env` has correct database credentials
- Ensure database `pmp_app` exists

### Token Invalid
- Make sure to include `Bearer ` prefix
- Check token hasn't expired (1 hour default)
- Verify JWT_SECRET in `.env`

## Next Steps

Once basic tests pass:
1. Test all API endpoints
2. Test mobile app integration
3. Test web admin integration
4. Run load tests (optional)
5. Test error handling

