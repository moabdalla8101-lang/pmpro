# Simulator Testing Guide

This guide will help you test the PMP Exam Prep App on iOS or Android simulators.

## Prerequisites

1. **Node.js 18+** (check with `node -v`)
2. **PostgreSQL** running
3. **Expo CLI** installed: `npm install -g expo-cli`
4. **iOS Simulator** (Xcode) or **Android Emulator** (Android Studio)

## Quick Setup

### Step 1: Database Setup

The database should already be set up. Verify:

```bash
psql -d pmp_app -c "SELECT COUNT(*) FROM users;"
```

If not set up:
```bash
createdb pmp_app
psql -d pmp_app -f backend/database/migrations/001_initial_schema.sql
psql -d pmp_app -f backend/database/seeds/001_initial_data.sql
```

### Step 2: Start Backend Services

Open **3 separate terminal windows**:

**Terminal 1 - User Service:**
```bash
cd backend/user-service
npm install
npm run dev
```
Should see: `User Service running on port 3001`

**Terminal 2 - Content Service:**
```bash
cd backend/content-service
npm install
npm run dev
```
Should see: `Content Service running on port 3002`

**Terminal 3 - Analytics Service:**
```bash
cd backend/analytics-service
npm install
npm run dev
```
Should see: `Analytics Service running on port 3003`

### Step 3: Configure Mobile App API URL

For **iOS Simulator**, use:
```bash
cd mobile
echo "EXPO_PUBLIC_API_URL=http://localhost:3001" > .env
```

For **Android Emulator**, use:
```bash
cd mobile
echo "EXPO_PUBLIC_API_URL=http://10.0.2.2:3001" > .env
```

### Step 4: Start Mobile App

```bash
cd mobile
npm install
npm start
```

This will open Expo DevTools. Then:
- Press **`i`** for iOS Simulator
- Press **`a`** for Android Emulator
- Or scan QR code with Expo Go app on physical device

## Testing the App

### 1. Test Registration

1. Open the app in simulator
2. Tap "Don't have an account? Sign up"
3. Fill in:
   - Email: `test@example.com`
   - Password: `test123456`
   - First Name: `Test`
   - Last Name: `User`
4. Tap "Sign Up"
5. Complete onboarding

### 2. Test Login

1. If logged out, login with:
   - Email: `test@example.com`
   - Password: `test123456`

Or use admin account:
- Email: `admin@pmpapp.com`
- Password: `admin123`

### 3. Test Features

- **Dashboard**: View progress and stats
- **Practice**: Browse and answer questions
- **Exam**: Start a mock exam (will need questions in database)
- **Progress**: View performance analytics
- **Settings**: Manage profile

## Troubleshooting

### API Connection Issues

**iOS Simulator:**
- Use `http://localhost:3001` in `.env`
- Make sure backend services are running

**Android Emulator:**
- Use `http://10.0.2.2:3001` in `.env`
- `10.0.2.2` is the special IP for host machine from Android emulator

**Physical Device:**
- Use your computer's local IP: `http://192.168.x.x:3001`
- Find IP with: `ifconfig` (macOS/Linux) or `ipconfig` (Windows)
- Make sure device and computer are on same network

### Backend Not Responding

1. Check services are running:
   ```bash
   curl http://localhost:3001/health
   curl http://localhost:3002/health
   curl http://localhost:3003/health
   ```

2. Check database connection:
   ```bash
   psql -d pmp_app -c "SELECT 1;"
   ```

3. Check logs in backend service terminals

### Expo Issues

1. Clear cache:
   ```bash
   cd mobile
   expo start -c
   ```

2. Reset Metro bundler:
   ```bash
   watchman watch-del-all
   rm -rf node_modules
   npm install
   ```

### Database Issues

If you need to reset:
```bash
dropdb pmp_app
createdb pmp_app
psql -d pmp_app -f backend/database/migrations/001_initial_schema.sql
psql -d pmp_app -f backend/database/seeds/001_initial_data.sql
```

## Adding Test Questions

To test with actual questions, you can add them via:

1. **Web Admin** (after logging in as admin):
   - Go to Questions page
   - Click "Add Question"
   - Fill in question details

2. **API** (using curl):
```bash
curl -X POST http://localhost:3002/api/questions \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "certificationId": "550e8400-e29b-41d4-a716-446655440000",
    "knowledgeAreaId": "650e8400-e29b-41d4-a716-446655440001",
    "questionText": "What is the primary purpose of project integration management?",
    "explanation": "Project integration management coordinates all project activities.",
    "difficulty": "medium",
    "answers": [
      {"answerText": "To coordinate all project activities", "isCorrect": true, "order": 0},
      {"answerText": "To manage project scope", "isCorrect": false, "order": 1},
      {"answerText": "To control project costs", "isCorrect": false, "order": 2},
      {"answerText": "To manage project resources", "isCorrect": false, "order": 3}
    ]
  }'
```

## Quick Test Checklist

- [ ] Backend services running (3 terminals)
- [ ] Database accessible
- [ ] Mobile app `.env` configured correctly
- [ ] Expo started successfully
- [ ] Simulator/emulator launched
- [ ] Can register new user
- [ ] Can login
- [ ] Can view dashboard
- [ ] Can browse questions (if questions exist)
- [ ] Can view progress

## Next Steps

Once basic testing works:
1. Add more test questions
2. Test mock exam functionality
3. Test progress tracking
4. Test all features end-to-end
5. Test on physical device

Happy testing! 🚀

