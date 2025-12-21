#!/bin/bash

# Database setup script

set -e

DB_NAME="pmp_app"
DB_USER="${DB_USER:-postgres}"

echo "🗄️  Setting up database..."

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
psql -U "$DB_USER" -d "$DB_NAME" -f backend/database/migrations/001_initial_schema.sql
echo "✓ Migrations applied"

# Seed data
echo "Seeding initial data..."
psql -U "$DB_USER" -d "$DB_NAME" -f backend/database/seeds/001_initial_data.sql
echo "✓ Data seeded"

echo ""
echo "✨ Database setup complete!"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@pmpapp.com"
echo "  Password: admin123"
echo ""
echo "⚠️  Please change the admin password in production!"

