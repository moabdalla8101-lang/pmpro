# User Service

User authentication and management microservice for the PMP Exam Prep App.

## Features

- User registration and login
- Password reset via email
- Social login (Google, Apple) - placeholder
- User profile management
- Subscription management
- User preferences

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (copy `.env.example` to `.env`)

3. Run migrations (from root database directory)

4. Start the service:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/reset-password/request` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token
- `POST /api/auth/social-login` - Social login (Google/Apple)

### Users
- `GET /api/users/profile` - Get user profile (authenticated)
- `PUT /api/users/profile` - Update user profile (authenticated)
- `GET /api/users/preferences` - Get user preferences (authenticated)
- `PUT /api/users/preferences` - Update user preferences (authenticated)

### Subscriptions
- `GET /api/subscriptions` - Get subscription status (authenticated)
- `PUT /api/subscriptions` - Update subscription (authenticated)
- `DELETE /api/subscriptions` - Cancel subscription (authenticated)


