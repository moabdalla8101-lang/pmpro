# 🚀 Quick Start - Test on Simulator

## Step-by-Step Instructions

### Step 1: Start Backend Services

Open **3 separate terminal windows** and run these commands:

**Terminal 1:**
```bash
cd /Users/mohamed/Documents/pmpro/backend/user-service
npm run dev
```
✅ Wait until you see: `User Service running on port 3001`

**Terminal 2:**
```bash
cd /Users/mohamed/Documents/pmpro/backend/content-service
npm run dev
```
✅ Wait until you see: `Content Service running on port 3002`

**Terminal 3:**
```bash
cd /Users/mohamed/Documents/pmpro/backend/analytics-service
npm run dev
```
✅ Wait until you see: `Analytics Service running on port 3003`

### Step 2: Start Mobile App & Open Simulator

Open a **4th terminal**:

```bash
cd /Users/mohamed/Documents/pmpro/mobile
npm start
```

When Expo DevTools opens:
- Press **`i`** to open iOS Simulator
- Press **`a`** to open Android Emulator
- Or scan QR code with Expo Go app

### Step 3: Test the App

1. **Register a new account:**
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

## Verify Services Are Running

Test each service:
```bash
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health
```

All should return: `{"status":"ok","service":"..."}`

## Troubleshooting

**Service won't start?**
- Make sure Node.js is installed: `node -v`
- Reinstall: `rm -rf node_modules && npm install`

**Can't connect to API?**
- Check services are running (see above)
- For iOS: Use `http://localhost:3001`
- For Android: Use `http://10.0.2.2:3001` in `.env`

**Port already in use?**
```bash
lsof -ti:3001 | xargs kill  # Kill process on port 3001
```

## Stop Services

Press `Ctrl+C` in each terminal window to stop services.

Happy testing! 🎉
