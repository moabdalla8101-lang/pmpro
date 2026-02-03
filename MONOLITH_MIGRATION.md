# 🏗️ Monolith Migration Guide

The backend has been refactored from a microservices architecture to a **monolithic architecture** for simplicity and easier development.

## What Changed

### Before (Microservices)
- **3 separate services** running on different ports:
  - User Service (port 3001)
  - Content Service (port 3002)
  - Analytics Service (port 3003)
- Each service had its own dependencies, database connection, and deployment

### After (Monolith)
- **1 unified server** running on port 3001
- All routes combined in a single Express app
- Single database connection pool
- Simplified deployment and development

## New Structure

```
backend/
  server/              # New monolithic server
    src/
      controllers/     # All controllers from 3 services
      routes/          # All routes from 3 services
      middleware/      # Shared middleware
      db/              # Single database connection
    package.json       # Combined dependencies
    tsconfig.json
    .env.example

  user-service/        # OLD - Can be removed
  content-service/     # OLD - Can be removed
  analytics-service/   # OLD - Can be removed
```

## Quick Start

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

Or use the script:
```bash
./scripts/start-server.sh
```

## API Endpoints

All endpoints are now available on **port 3001**:

- `http://localhost:3001/api/auth/*` - Authentication
- `http://localhost:3001/api/users/*` - User management
- `http://localhost:3001/api/subscriptions/*` - Subscriptions
- `http://localhost:3001/api/questions/*` - Questions
- `http://localhost:3001/api/knowledge-areas/*` - Knowledge Areas
- `http://localhost:3001/api/certifications/*` - Certifications
- `http://localhost:3001/api/progress/*` - Progress tracking
- `http://localhost:3001/api/analytics/*` - Analytics
- `http://localhost:3001/api/exams/*` - Exams
- `http://localhost:3001/api/badges/*` - Badges
- `http://localhost:3001/api/admin/*` - Admin endpoints

## Mobile App

The mobile app **already works** with the monolith! It uses a single API client that points to one base URL. No changes needed.

## Web Admin

The web admin may need to be updated if it was using multiple service URLs. Check `web-admin/src/services/api/client.ts` to ensure it uses a single base URL.

## Benefits

✅ **Simpler Development** - One service to start, one port to manage
✅ **Easier Debugging** - All code in one place
✅ **Faster Startup** - No need to coordinate multiple services
✅ **Less Overhead** - Single database connection pool
✅ **Easier Testing** - One service to test

## Migration Notes

- Database schema remains the same
- API endpoints remain the same (just on one port)
- Authentication tokens work the same way
- All existing functionality preserved

## Cleanup (Optional)

Once you've verified everything works, you can remove the old microservices:

```bash
rm -rf backend/user-service
rm -rf backend/content-service
rm -rf backend/analytics-service
```

Or keep them for reference - they're not hurting anything!

## Need Help?

See `backend/server/README.md` for detailed server documentation.



