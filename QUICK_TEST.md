# ⚡ Quick Test Guide

Fastest way to test the monolith backend.

## 1. Start the Server

```bash
cd backend/server
npm install  # First time only
cp .env.example .env  # First time only
# Edit .env with your database credentials
npm run dev
```

Wait for: `🚀 PMP Exam Prep Server running on port 3001`

## 2. Run Automated Tests

In a **new terminal**:

```bash
./scripts/test-api.sh
```

This will test:
- ✅ Health endpoint
- ✅ User registration
- ✅ User login
- ✅ Protected endpoints
- ✅ Questions API
- ✅ Progress API

## 3. Manual Quick Test

### Test Health
```bash
curl http://localhost:3001/health
```

### Test Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234","firstName":"Test","lastName":"User"}'
```

### Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test1234"}'
```

Copy the `token` from the response, then:

### Test Protected Endpoint
```bash
curl http://localhost:3001/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 4. Test with Mobile App

```bash
# Terminal 1: Backend (already running)
# Terminal 2: Mobile
cd mobile
npm start
# Press 'i' for iOS or 'a' for Android
```

## 5. Test with Web Admin

```bash
# Terminal 1: Backend (already running)
# Terminal 2: Web Admin
cd web-admin
npm run dev
# Open http://localhost:5173
```

## Troubleshooting

**Server won't start?**
- Check PostgreSQL is running
- Verify `.env` has correct database credentials
- Check port 3001 is free: `lsof -ti:3001 | xargs kill -9`

**Tests fail?**
- Make sure server is running first
- Check database connection in `.env`
- Verify database `pmp_app` exists

**Need more details?**
See [TESTING.md](TESTING.md) for comprehensive testing guide.

