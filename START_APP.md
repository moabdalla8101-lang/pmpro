# 🚀 How to Run the App and Simulator

Simple step-by-step guide to get everything running.

---

## 📋 Prerequisites

- Node.js 20+ installed
- PostgreSQL running
- Database `pmp_app` created

---

## 🎯 Quick Start (2 Steps)

### Step 1: Start Backend Server

Open **Terminal 1**:

```bash
cd /Users/mohamed/Documents/pmpro/backend/server
source ~/.nvm/nvm.sh  # If using NVM
nvm use 20            # If using NVM
npm run dev
```

Wait for: `🚀 PMP Exam Prep Server running on port 3001`

### Step 2: Start Mobile App & Simulator

Open **Terminal 2**:

```bash
cd /Users/mohamed/Documents/pmpro/mobile
source ~/.nvm/nvm.sh  # If using NVM
nvm use 20            # If using NVM
npm start
```

Then:
- Press **`i`** for iOS Simulator
- Press **`a`** for Android Emulator

---

## 📱 Detailed Steps

### 1. Start Backend Server

```bash
# Navigate to server directory
cd /Users/mohamed/Documents/pmpro/backend/server

# Activate Node.js 20 (if using NVM)
source ~/.nvm/nvm.sh
nvm use 20

# Install dependencies (first time only)
npm install

# Start server
npm run dev
```

**You should see:**
```
🚀 PMP Exam Prep Server running on port 3001
📚 All services unified in monolith architecture
```

**Keep this terminal open!**

---

### 2. Start Mobile App

Open a **new terminal**:

```bash
# Navigate to mobile directory
cd /Users/mohamed/Documents/pmpro/mobile

# Activate Node.js 20 (if using NVM)
source ~/.nvm/nvm.sh
nvm use 20

# Increase file limit (fixes potential errors)
ulimit -n 4096

# Install dependencies (first time only)
npm install

# Start Expo
npm start
```

**You should see:**
- QR code
- Expo DevTools URL
- Options to press `i` or `a`

---

### 3. Open Simulator

#### Option A: iOS Simulator (Recommended)

**Method 1 - Press Key:**
- In the Expo terminal, press **`i`**
- iOS Simulator will open automatically

**Method 2 - Manual:**
```bash
# Open Simulator app
open -a Simulator

# Then press 'i' in Expo terminal
```

**Method 3 - Browser:**
- Open http://localhost:19000 in browser
- Click "Run on iOS simulator" button

#### Option B: Android Emulator

**Method 1 - Press Key:**
- In the Expo terminal, press **`a`**
- Android Emulator will open (if already running)

**Method 2 - Start Emulator First:**
```bash
# Start Android Studio
# Open AVD Manager
# Start an emulator
# Then press 'a' in Expo terminal
```

---

## 🎬 Using the Startup Scripts

### Backend Server Script

```bash
cd /Users/mohamed/Documents/pmpro
./scripts/start-server.sh
```

### Mobile App Script

```bash
cd /Users/mohamed/Documents/pmpro
./scripts/start-mobile.sh
```

---

## ✅ Verify Everything is Running

### Check Backend:
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok","service":"pmp-app-server"}`

### Check Mobile:
- Simulator should be open
- App should be loading
- No red error screens

---

## 🐛 Troubleshooting

### Backend Won't Start

**Port already in use:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Missing .env file:**
```bash
cd backend/server
cp .env.example .env
# Edit .env with your database credentials
```

**Wrong Node.js version:**
```bash
source ~/.nvm/nvm.sh
nvm use 20
```

### Mobile App Won't Start

**Expo not found:**
```bash
cd mobile
npm install
```

**File limit error:**
```bash
ulimit -n 4096
npm start
```

**Simulator won't open:**
- Make sure Xcode is installed (for iOS)
- Or Android Studio is installed (for Android)
- Try opening Simulator manually first

### App Won't Connect to Backend

**Check backend is running:**
```bash
curl http://localhost:3001/health
```

**For iOS Simulator:**
- Use: `http://localhost:3001`

**For Android Emulator:**
- Use: `http://10.0.2.2:3001`

**For Physical Device:**
- Use: `http://YOUR_COMPUTER_IP:3001`
- Find IP: `ifconfig | grep "inet "`

---

## 📝 Quick Reference

### Terminal 1 - Backend:
```bash
cd backend/server && npm run dev
```

### Terminal 2 - Mobile:
```bash
cd mobile && npm start
# Then press 'i' or 'a'
```

### Test Backend:
```bash
curl http://localhost:3001/health
```

---

## 🎉 You're Ready!

Once both are running:
1. ✅ Backend on port 3001
2. ✅ Simulator open
3. ✅ App loaded

You can now:
- Register a new account
- Login
- Browse questions
- Take practice exams
- View progress

---

## 💡 Pro Tips

1. **Keep both terminals open** - Don't close them while testing
2. **Watch the logs** - They show errors and API calls
3. **Hot reload** - Changes auto-reload in simulator
4. **Restart if stuck** - Stop both services and restart

---

Need help? Check:
- `HOW_TO_TEST.md` - Testing guide
- `API_ENDPOINTS.md` - API documentation
- `TROUBLESHOOTING.md` - Common issues



