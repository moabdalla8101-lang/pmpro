#!/bin/bash

# Script to seed database with PMP questions
# Usage: ./scripts/seed-questions.sh

set -e

echo "📚 Seeding Database with PMP Questions..."
echo ""

# Load database config
if [ -f "backend/server/.env" ]; then
    export $(grep -E "^DB_" backend/server/.env | xargs)
fi

DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-5432}"
DB_NAME="${DB_NAME:-pmp_app}"
DB_USER="${DB_USER:-postgres}"
DB_PASSWORD="${DB_PASSWORD:-postgres}"

# Check if psql is available
if ! command -v psql &> /dev/null; then
    echo "❌ psql not found. Please install PostgreSQL client tools."
    exit 1
fi

# Check if database exists
if ! PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "❌ Database '$DB_NAME' does not exist."
    echo "   Create it with: createdb $DB_NAME"
    exit 1
fi

echo "✅ Database found: $DB_NAME"
echo ""

# Run seed file
SEED_FILE="backend/database/seeds/002_pmp_questions.sql"

if [ ! -f "$SEED_FILE" ]; then
    echo "❌ Seed file not found: $SEED_FILE"
    exit 1
fi

echo "📝 Running seed file: $SEED_FILE"
echo ""

PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SEED_FILE"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Questions seeded successfully!"
    echo ""
    echo "📊 Verifying data..."
    
    # Count questions
    QUESTION_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM questions;")
    ANSWER_COUNT=$(PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -t -c "SELECT COUNT(*) FROM answers;")
    
    echo "   Questions: $QUESTION_COUNT"
    echo "   Answers: $ANSWER_COUNT"
    echo ""
    echo "🎉 Database seeding complete!"
    echo ""
    echo "You can now:"
    echo "  • View questions in the web admin"
    echo "  • Practice questions in the mobile app"
    echo "  • Take mock exams"
else
    echo "❌ Failed to seed questions"
    exit 1
fi



