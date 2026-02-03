# PMP Exam Prep App - Setup Guide

This guide will help you set up and run the PMP Exam Prep application locally.

## Prerequisites

- Node.js 20+ and npm
- PostgreSQL 15+
- Docker and Docker Compose (optional, for containerized setup)
- Expo CLI (for mobile app development)

## Quick Start with Docker

The easiest way to get started is using Docker Compose:

```bash
cd infrastructure/docker
docker-compose up
```

This will start:
- PostgreSQL database on port 5432
- User Service on port 3001
- Content Service on port 3002
- Analytics Service on port 3003

## Manual Setup

### 1. Database Setup

```bash
# Create database
createdb pmp_app

# Run migrations
psql -d pmp_app -f backend/database/migrations/001_initial_schema.sql

# Seed initial data
psql -d pmp_app -f backend/database/seeds/001_initial_data.sql
```

### 2. Backend Services Setup

#### Shared Package
```bash
cd backend/shared
npm install
npm run build
```

#### User Service
```bash
cd backend/user-service
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

#### Content Service
```bash
cd backend/content-service
npm install
cp .env.example .env
npm run dev
```

#### Analytics Service
```bash
cd backend/analytics-service
npm install
cp .env.example .env
npm run dev
```

### 3. Mobile App Setup

```bash
cd mobile
npm install

# Create .env file
echo "EXPO_PUBLIC_API_URL=http://localhost:3001" > .env

# Start Expo
npm start
```

### 4. Web Admin Setup

```bash
cd web-admin
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:3001" > .env

# Start dev server
npm run dev
```

## Environment Variables

### Backend Services

Each service needs a `.env` file. Copy from `.env.example`:

- `DB_HOST` - PostgreSQL host (default: localhost)
- `DB_PORT` - PostgreSQL port (default: 5432)
- `DB_NAME` - Database name (default: pmp_app)
- `DB_USER` - Database user (default: postgres)
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret key for JWT tokens (change in production!)
- `PORT` - Service port (3001, 3002, 3003)

### Mobile App

- `EXPO_PUBLIC_API_URL` - Backend API URL

### Web Admin

- `VITE_API_URL` - Backend API URL

## Default Admin Account

After running seeds, you can login with:
- Email: `admin@pmpapp.com`
- Password: `admin123` (change immediately in production!)

## API Endpoints

### User Service (Port 3001)
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/users/profile` - Get user profile
- `GET /api/admin/users` - Get all users (admin only)

### Content Service (Port 3002)
- `GET /api/questions` - Get questions
- `POST /api/questions` - Create question (admin)
- `GET /api/knowledge-areas` - Get knowledge areas
- `GET /api/certifications` - Get certifications

### Analytics Service (Port 3003)
- `GET /api/progress` - Get user progress
- `POST /api/exams/start` - Start mock exam
- `GET /api/analytics/admin` - Admin analytics (admin only)

## Testing

### Backend
```bash
cd backend/user-service
npm test

cd ../content-service
npm test

cd ../analytics-service
npm test
```

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check database credentials in `.env` files
- Verify database exists: `psql -l | grep pmp_app`

### Port Conflicts
- Change ports in `.env` files if default ports are in use
- Update API URLs in mobile and web-admin accordingly

### Mobile App Issues
- Clear Expo cache: `expo start -c`
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Next Steps

1. Set up production environment variables
2. Configure email service (SMTP) for password resets
3. Set up OAuth providers (Google, Apple) for social login
4. Configure push notifications for mobile app
5. Set up CI/CD pipeline
6. Deploy to AWS/GCP/Azure

## Production Deployment

See `infrastructure/README.md` for Kubernetes and AWS deployment instructions.



