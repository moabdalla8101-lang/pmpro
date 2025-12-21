# Quick Start for Simulator Testing

## Step-by-Step Instructions

### 1. Start Backend Services

Open **3 terminal windows** and run:

**Terminal 1:**
```bash
cd backend/user-service
npm install
npm run dev
```

**Terminal 2:**
```bash
cd backend/content-service  
npm install
npm run dev
```

**Terminal 3:**
```bash
cd backend/analytics-service
npm install
npm run dev
```

Wait until you see "running on port" messages for all three.

### 2. Start Mobile App

Open a **4th terminal**:

```bash
cd mobile
npm install
npm start
```

### 3. Launch Simulator

When Expo DevTools opens:
- Press **`i`** for iOS Simulator (requires Xcode)
- Press **`a`** for Android Emulator (requires Android Studio)
- Or scan QR code with Expo Go app on your phone

### 4. Test the App

1. **Register a new user:**
   - Email: `test@example.com`
   - Password: `test123456`

2. **Or login as admin:**
   - Email: `admin@pmpapp.com`
   - Password: `admin123`

3. **Explore features:**
   - Dashboard
   - Practice Questions
   - Mock Exams
   - Progress Tracking

## Troubleshooting

**API not connecting?**
- iOS: Make sure `.env` has `EXPO_PUBLIC_API_URL=http://localhost:3001`
- Android: Use `EXPO_PUBLIC_API_URL=http://10.0.2.2:3001` in `.env`

**Backend not responding?**
- Check all 3 services are running
- Test: `curl http://localhost:3001/health`

**Database issues?**
- Database is already set up from the script
- Verify: `psql -d pmp_app -c "SELECT COUNT(*) FROM users;"`

See SIMULATOR_TESTING.md for detailed troubleshooting.
