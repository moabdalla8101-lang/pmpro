# 🧪 How to Test the PMP Exam Prep App

Complete guide to test both the backend API and mobile app.

---

## 🚀 Quick Start Testing

### Step 1: Start the Backend Server

```bash
cd backend/server
npm run dev
```

Wait for: `🚀 PMP Exam Prep Server running on port 3001`

### Step 2: Start the Mobile App

```bash
cd mobile
npm start
```

Then press `i` for iOS Simulator or `a` for Android Emulator.

---

## 📱 Testing the Mobile App

### Option 1: iOS Simulator (Recommended)

1. **Start the simulator:**
   ```bash
   # In the mobile terminal, press 'i'
   # Or open Xcode → Developer Tools → Simulator
   ```

2. **The app should automatically load** in the simulator

3. **Test the app:**
   - Register a new account
   - Login
   - Browse questions
   - Take a practice quiz
   - View progress

### Option 2: Android Emulator

1. **Start Android Studio** and open an emulator
2. **In the mobile terminal, press 'a'**
3. **The app will load** in the Android emulator

### Option 3: Physical Device

1. **Install Expo Go** app on your phone
2. **Scan the QR code** shown in the terminal
3. **The app will load** on your device

---

## 🔌 Testing the Backend API

### Automated Testing Script

```bash
./scripts/test-api.sh
```

This script tests:
- ✅ Health endpoint
- ✅ User registration
- ✅ User login
- ✅ Protected endpoints
- ✅ Questions API
- ✅ Progress API

### Manual API Testing

#### 1. Health Check
```bash
curl http://localhost:3001/health
```

Expected:
```json
{"status":"ok","service":"pmp-app-server"}
```

#### 2. View API Info
```bash
curl http://localhost:3001/
```

#### 3. Register a User
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

Expected: Returns user object with JWT token

#### 4. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234"
  }'
```

Expected: Returns JWT token

#### 5. Get Questions (with token)
```bash
# Replace YOUR_TOKEN with the token from login
curl http://localhost:3001/api/questions \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### 6. Get User Progress
```bash
curl http://localhost:3001/api/progress \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🧪 End-to-End Testing Flow

### Complete User Journey Test

1. **Register a new user**
   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@test.com","password":"test1234","firstName":"John","lastName":"Doe"}'
   ```
   - Save the token from response

2. **Login**
   ```bash
   curl -X POST http://localhost:3001/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@test.com","password":"test1234"}'
   ```

3. **Get questions**
   ```bash
   curl http://localhost:3001/api/questions \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

4. **Start an exam**
   ```bash
   curl -X POST http://localhost:3001/api/exams/start \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"certificationId":"uuid","questionCount":10}'
   ```

5. **Submit an answer**
   ```bash
   curl -X POST http://localhost:3001/api/exams/EXAM_ID/answer \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"questionId":"uuid","answerId":"uuid"}'
   ```

6. **View progress**
   ```bash
   curl http://localhost:3001/api/progress \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

---

## 🎯 Testing Specific Features

### Authentication Flow
- ✅ Register with valid email/password
- ✅ Register with invalid email (should fail)
- ✅ Register with short password (should fail)
- ✅ Login with correct credentials
- ✅ Login with wrong password (should fail)
- ✅ Access protected route without token (should fail)
- ✅ Access protected route with token (should work)

### Questions Feature
- ✅ Get all questions (requires auth)
- ✅ Filter questions by knowledge area
- ✅ Filter questions by difficulty
- ✅ Paginate questions

### Progress Tracking
- ✅ Record answer (correct/incorrect)
- ✅ View progress summary
- ✅ View progress by knowledge area
- ✅ View streak count

### Exam Simulator
- ✅ Start exam
- ✅ Submit answers
- ✅ Finish exam
- ✅ View exam results

---

## 🐛 Debugging Tips

### Backend Not Starting?
```bash
# Check if port 3001 is in use
lsof -i :3001

# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Check Node.js version
node -v  # Should be 20+

# Check if .env file exists
cd backend/server
ls -la .env
```

### Mobile App Not Connecting?
```bash
# Check backend is running
curl http://localhost:3001/health

# For iOS Simulator, use: http://localhost:3001
# For Android Emulator, use: http://10.0.2.2:3001
# For physical device, use: http://YOUR_IP:3001
```

### Database Connection Issues?
```bash
# Check PostgreSQL is running
psql -U postgres -c "SELECT version();"

# Check database exists
psql -U postgres -l | grep pmp_app

# Test connection
psql -U postgres -d pmp_app -c "SELECT 1;"
```

---

## 📊 Testing Checklist

### Backend API
- [ ] Health endpoint responds
- [ ] Root endpoint shows API info
- [ ] User registration works
- [ ] User login works
- [ ] JWT tokens are generated
- [ ] Protected routes require auth
- [ ] Questions can be fetched
- [ ] Progress can be tracked
- [ ] Exams can be started/completed

### Mobile App
- [ ] App loads in simulator
- [ ] Registration screen works
- [ ] Login screen works
- [ ] Dashboard loads
- [ ] Questions display
- [ ] Can answer questions
- [ ] Progress updates
- [ ] Navigation works

### Integration
- [ ] Mobile app connects to backend
- [ ] API calls succeed
- [ ] Error handling works
- [ ] Loading states display
- [ ] Data persists

---

## 🚀 Quick Test Commands

```bash
# Test everything at once
./scripts/test-api.sh

# Test health
curl http://localhost:3001/health

# Test registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234","firstName":"Test","lastName":"User"}'

# View all endpoints
curl http://localhost:3001/ | python3 -m json.tool
```

---

## 📝 Next Steps

1. **Run automated tests:** `./scripts/test-api.sh`
2. **Test in mobile app:** Start simulator and use the app
3. **Check logs:** Watch terminal output for errors
4. **Test edge cases:** Invalid inputs, network errors, etc.

For detailed API documentation, see [API_ENDPOINTS.md](API_ENDPOINTS.md)

