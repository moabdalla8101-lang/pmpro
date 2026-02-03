# Database

PostgreSQL database for the PMP Exam Prep App.

## Setup

1. Install PostgreSQL (if not already installed)

2. Create the database:
```bash
createdb pmp_app
```

3. Run migrations:
```bash
psql -d pmp_app -f migrations/001_initial_schema.sql
```

4. Seed initial data:
```bash
psql -d pmp_app -f seeds/001_initial_data.sql
```

## Database Schema

### Core Tables
- `users` - User accounts and authentication
- `certifications` - Available certifications (PMP, etc.)
- `knowledge_areas` - Knowledge areas per certification
- `questions` - Question bank
- `answers` - Answer options for questions

### User Data Tables
- `user_progress` - User performance tracking
- `user_answers` - Individual answer history
- `bookmarks` - User bookmarked questions
- `mock_exams` - Exam session tracking
- `badges` - Gamification badges
- `streaks` - Daily study streaks

### System Tables
- `password_reset_tokens` - Password reset tokens

## Environment Variables

Set these in your `.env` files:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=pmp_app
DB_USER=postgres
DB_PASSWORD=postgres
```

## Notes

- All IDs use UUID v4
- Timestamps are stored in UTC
- Indexes are created for frequently queried columns
- Foreign keys have CASCADE delete where appropriate




