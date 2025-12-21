# 🚀 Simple Start Guide - Monolith Edition

## Prerequisites

- Node.js 20+ (use `nvm use 20` if you have NVM)
- PostgreSQL running locally
- Database created: `pmp_app`

## Quick Start (3 Steps)

### 1. Install Dependencies

```bash
cd backend/server
npm install
```

### 2. Setup Environment

```bash
cd backend/server
cp .env.example .env
# Edit .env with your database credentials
```

### 3. Start Server

```bash
cd backend/server
npm run dev
```

**That's it!** The server runs on `http://localhost:3001`

## Start Everything (Full Stack)

### Terminal 1 - Backend Server
```bash
cd backend/server
npm run dev
```

### Terminal 2 - Mobile App
```bash
cd mobile
npm start
# Press 'i' for iOS or 'a' for Android
```

### Terminal 3 - Web Admin (Optional)
```bash
cd web-admin
npm run dev
```

## API Base URL

All API endpoints are now on **one port**:
- `http://localhost:3001/api/*`

## Test It

1. **Health Check**: `curl http://localhost:3001/health`
2. **Register**: `curl -X POST http://localhost:3001/api/auth/register -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test1234"}'`
3. **Login**: `curl -X POST http://localhost:3001/api/auth/login -H "Content-Type: application/json" -d '{"email":"test@test.com","password":"test1234"}'`

## What Changed?

- ✅ **Before**: 3 separate services (ports 3001, 3002, 3003)
- ✅ **Now**: 1 unified server (port 3001)
- ✅ **Simpler**: One service to start, one port to manage
- ✅ **Same API**: All endpoints work the same, just on one port

## Need Help?

- See [MONOLITH_MIGRATION.md](MONOLITH_MIGRATION.md) for details
- See [backend/server/README.md](backend/server/README.md) for API docs

