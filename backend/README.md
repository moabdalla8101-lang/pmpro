# Backend Services

Microservices backend for the PMP Exam Prep App.

## Services

### User Service (Port 3001)
- User authentication and registration
- Password reset
- User profile management
- Subscription management

### Content Service (Port 3002)
- Question CRUD operations
- Knowledge area management
- Certification management
- Bulk import/export

### Analytics Service (Port 3003)
- User progress tracking
- Performance analytics
- Mock exam management
- Badge and streak tracking
- Admin analytics and reporting

## Shared Package

The `shared/` directory contains common utilities and types used across all services:
- JWT token utilities
- Password hashing
- Error classes
- TypeScript types

## Database

See `database/README.md` for database setup instructions.

## Development

1. Install dependencies for each service:
```bash
cd backend/user-service && npm install
cd ../content-service && npm install
cd ../analytics-service && npm install
cd ../shared && npm install
```

2. Set up environment variables (copy `.env.example` files)

3. Run database migrations

4. Start services:
```bash
# User Service
cd backend/user-service && npm run dev

# Content Service (in another terminal)
cd backend/content-service && npm run dev

# Analytics Service (in another terminal)
cd backend/analytics-service && npm run dev
```

## API Documentation

Each service has its own README with API endpoint documentation.

## Testing

Run tests for each service:
```bash
cd backend/user-service && npm test
cd backend/content-service && npm test
cd backend/analytics-service && npm test
```


