# Quick Start - All Services

## Option 1: Automated Script (Recommended)

Run the automated script:
```bash
./scripts/start-all.sh
```

This will:
- Start all 3 backend services
- Start the mobile app
- Open iOS simulator automatically

## Option 2: Manual Start (4 Terminals)

### Terminal 1 - User Service
```bash
cd backend/user-service
npm run dev
```
Wait for: `User Service running on port 3001`

### Terminal 2 - Content Service
```bash
cd backend/content-service
npm run dev
```
Wait for: `Content Service running on port 3002`

### Terminal 3 - Analytics Service
```bash
cd backend/analytics-service
npm run dev
```
Wait for: `Analytics Service running on port 3003`

### Terminal 4 - Mobile App
```bash
cd mobile
npm start
```

Then:
- Press **`i`** for iOS Simulator
- Press **`a`** for Android Emulator
- Or scan QR code with Expo Go

## Verify Services

Check if services are running:
```bash
curl http://localhost:3001/health  # User Service
curl http://localhost:3002/health  # Content Service
curl http://localhost:3003/health  # Analytics Service
```

## Stop Services

If using the automated script, stop all services:
```bash
cat /tmp/pmp-services.pids | xargs kill 2>/dev/null || true
```

Or manually stop each terminal with `Ctrl+C`

## Troubleshooting

**Port already in use?**
```bash
lsof -ti:3001 | xargs kill  # User Service
lsof -ti:3002 | xargs kill  # Content Service
lsof -ti:3003 | xargs kill  # Analytics Service
```

**Services not starting?**
- Check Node.js version: `node -v` (should be 12+)
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check logs in terminal output



