#!/bin/bash

# Database setup script
# This script can be run from any directory

set -e

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# Get the project root (parent of scripts directory)
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# Change to project root to ensure paths work correctly
cd "$PROJECT_ROOT"

DB_NAME="pmp_app"
DB_USER="${DB_USER:-postgres}"

echo "🗄️  Setting up database..."
echo "Project root: $PROJECT_ROOT"

# Check if database exists
if psql -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "Database $DB_NAME already exists."
    read -p "Do you want to drop and recreate it? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        dropdb -U "$DB_USER" "$DB_NAME"
        echo "✓ Database dropped"
    else
        echo "Skipping database creation."
        exit 0
    fi
fi

# Create database
createdb -U "$DB_USER" "$DB_NAME"
echo "✓ Database created"

# Run migrations
echo "Running migrations..."
MIGRATION_FILE="$PROJECT_ROOT/backend/database/migrations/001_initial_schema.sql"
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found: $MIGRATION_FILE"
    exit 1
fi
psql -U "$DB_USER" -d "$DB_NAME" -f "$MIGRATION_FILE"
echo "✓ Migrations applied"

# Seed data
echo "Seeding initial data..."
SEED_FILE="$PROJECT_ROOT/backend/database/seeds/001_initial_data.sql"
if [ ! -f "$SEED_FILE" ]; then
    echo "❌ Error: Seed file not found: $SEED_FILE"
    exit 1
fi
psql -U "$DB_USER" -d "$DB_NAME" -f "$SEED_FILE"
echo "✓ Data seeded"

echo ""
echo "✨ Database setup complete!"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@pmpapp.com"
echo "  Password: admin123"
echo ""
echo "⚠️  Please change the admin password in production!"



