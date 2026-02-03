# Quick Start Guide

Get the PMP Exam Prep App running in 5 minutes!

## Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/moabdalla8101-lang/pmpro.git
cd pmpro

# Start everything with Docker
cd infrastructure/docker
docker-compose up
```

That's it! The services will be available at:
- User Service: http://localhost:3001
- Content Service: http://localhost:3002
- Analytics Service: http://localhost:3003
- Database: localhost:5432

## Option 2: Manual Setup

### 1. Run Setup Script

```bash
./scripts/setup.sh
```

This will:
- Install all dependencies
- Build shared packages
- Create .env files

### 2. Set Up Database

```bash
./scripts/db-setup.sh
```

Or manually:
```bash
createdb pmp_app
psql -d pmp_app -f backend/database/migrations/001_initial_schema.sql
psql -d pmp_app -f backend/database/seeds/001_initial_data.sql
```

### 3. Start Services

**Terminal 1 - User Service:**
```bash
cd backend/user-service
npm run dev
```

**Terminal 2 - Content Service:**
```bash
cd backend/content-service
npm run dev
```

**Terminal 3 - Analytics Service:**
```bash
cd backend/analytics-service
npm run dev
```

**Terminal 4 - Web Admin:**
```bash
cd web-admin
npm run dev
```

**Terminal 5 - Mobile App:**
```bash
cd mobile
npm start
```

## Test the Setup

### 1. Test API

```bash
# Health check
curl http://localhost:3001/health

# Register a user
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123456"}'
```

### 2. Access Web Admin

1. Open http://localhost:3000
2. Login with:
   - Email: `admin@pmpapp.com`
   - Password: `admin123`

### 3. Test Mobile App

1. Install Expo Go on your phone
2. Scan QR code from `npm start` output
3. Or press `i` for iOS simulator / `a` for Android emulator

## Default Credentials

**Admin Account:**
- Email: `admin@pmpapp.com`
- Password: `admin123`

⚠️ **Change this password immediately in production!**

## Common Issues

### Port Already in Use
Change ports in `.env` files or stop conflicting services.

### Database Connection Error
Ensure PostgreSQL is running:
```bash
pg_isready
```

### Module Not Found
Run setup script again or manually install:
```bash
cd backend/shared && npm install && npm run build
```

## Next Steps

- Read [SETUP.md](SETUP.md) for detailed setup
- Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for issues
- See [DEPLOYMENT.md](DEPLOYMENT.md) for production deployment

## Need Help?

- Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) guide
- Review service-specific README files
- Check GitHub issues

Happy coding! 🚀



