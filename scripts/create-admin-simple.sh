#!/bin/bash

# Simple script to create admin user using psql
# Requires: PostgreSQL client and bcrypt (via Node.js or Python)

EMAIL="${1:-admin@pmpapp.com}"
PASSWORD="${2:-admin123}"

echo "🔐 Creating Admin User..."
echo "   Email: $EMAIL"
echo "   Password: $PASSWORD"
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

# Hash password
echo "🔒 Hashing password..."
if command -v node &> /dev/null; then
    # Try using backend/server's bcrypt
    if [ -d "backend/server/node_modules/bcrypt" ]; then
        PASSWORD_HASH=$(cd backend/server && node -e "const bcrypt=require('bcrypt');bcrypt.hash('$PASSWORD',10).then(h=>process.stdout.write(h))")
    elif [ -d "node_modules/bcrypt" ]; then
        PASSWORD_HASH=$(node -e "const bcrypt=require('bcrypt');bcrypt.hash('$PASSWORD',10).then(h=>process.stdout.write(h))")
    else
        echo "⚠️  bcrypt not found, trying to use API method..."
        # Try API method instead
        if curl -s http://localhost:3001/health > /dev/null 2>&1; then
            echo "✅ Backend is running, using API to create admin..."
            # Register user first
            curl -s -X POST http://localhost:3001/api/auth/register \
              -H "Content-Type: application/json" \
              -d "{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"firstName\":\"Admin\",\"lastName\":\"User\"}" > /dev/null
            
            # Then update role via SQL (simpler)
            echo "   Updating role to admin..."
            PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -c "UPDATE users SET role='admin', subscription_tier='premium' WHERE email='$EMAIL';" > /dev/null
            echo "✅ Admin user created via API + SQL!"
            echo ""
            echo "🔐 Login Credentials:"
            echo "   Email: $EMAIL"
            echo "   Password: $PASSWORD"
            exit 0
        else
            echo "❌ Need bcrypt to hash password and backend is not running"
            echo "   Option 1: Start backend: cd backend/server && npm run dev"
            echo "   Option 2: Install bcrypt: cd backend/server && npm install"
            exit 1
        fi
    fi
elif command -v python3 &> /dev/null && python3 -c "import bcrypt" 2>/dev/null; then
    PASSWORD_HASH=$(python3 -c "import bcrypt; print(bcrypt.hashpw('$PASSWORD'.encode(), bcrypt.gensalt()).decode())")
else
    echo "❌ Need bcrypt to hash password"
    echo "   Install: cd backend/server && npm install"
    exit 1
fi

echo "✅ Password hashed"
echo ""

# Create admin user
echo "📝 Creating admin user in database..."
PGPASSWORD="$DB_PASSWORD" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" <<EOF
INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '$EMAIL',
    '$PASSWORD_HASH',
    'Admin',
    'User',
    'admin',
    'premium',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'admin',
    updated_at = NOW()
RETURNING id, email, role, subscription_tier;
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Admin user created successfully!"
    echo ""
    echo "🔐 Login Credentials:"
    echo "   Email: $EMAIL"
    echo "   Password: $PASSWORD"
    echo ""
    echo "🌐 Login at: http://localhost:3000"
else
    echo "❌ Failed to create admin user"
    exit 1
fi

