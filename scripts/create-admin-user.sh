#!/bin/bash

# Script to create admin user via API or SQL
# Usage: ./scripts/create-admin-user.sh [email] [password]

set -e

EMAIL="${1:-admin@pmpapp.com}"
PASSWORD="${2:-admin123}"
FIRST_NAME="${3:-Admin}"
LAST_NAME="${4:-User}"

echo "🔐 Creating Admin User..."
echo "   Email: $EMAIL"
echo "   Password: $PASSWORD"
echo ""

# Method 1: Try via API (if backend is running)
if curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ Backend is running, creating admin via API..."
    
    # First register the user
    RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
      -H "Content-Type: application/json" \
      -d "{
        \"email\": \"$EMAIL\",
        \"password\": \"$PASSWORD\",
        \"firstName\": \"$FIRST_NAME\",
        \"lastName\": \"$LAST_NAME\"
      }")
    
    if echo "$RESPONSE" | grep -q "already exists"; then
        echo "⚠️  User already exists. Updating to admin via SQL..."
        METHOD="sql"
    elif echo "$RESPONSE" | grep -q "token"; then
        echo "✅ User created! Now updating role to admin..."
        # Get user ID from response (we'll need to query DB)
        METHOD="sql"
    else
        echo "⚠️  API registration failed, trying SQL method..."
        METHOD="sql"
    fi
else
    echo "⚠️  Backend not running, using SQL method..."
    METHOD="sql"
fi

# Method 2: Direct SQL (requires psql)
if [ "$METHOD" = "sql" ]; then
    echo ""
    echo "📝 Creating admin user via SQL..."
    
    # Check if psql is available
    if ! command -v psql &> /dev/null; then
        echo "❌ psql not found. Please install PostgreSQL client tools."
        echo ""
        echo "Alternative: Start the backend server and run:"
        echo "  curl -X POST http://localhost:3001/api/auth/register \\"
        echo "    -H 'Content-Type: application/json' \\"
        echo "    -d '{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\",\"firstName\":\"$FIRST_NAME\",\"lastName\":\"$LAST_NAME\"}'"
        echo ""
        echo "Then update role manually in database."
        exit 1
    fi
    
    # Hash password using Node.js (if available) or Python
    if command -v node &> /dev/null; then
        PASSWORD_HASH=$(node -e "const bcrypt=require('bcrypt');bcrypt.hash('$PASSWORD',10).then(h=>console.log(h))" 2>/dev/null || echo "")
    fi
    
    if [ -z "$PASSWORD_HASH" ] && command -v python3 &> /dev/null; then
        PASSWORD_HASH=$(python3 -c "import bcrypt; print(bcrypt.hashpw('$PASSWORD'.encode(), bcrypt.gensalt()).decode())" 2>/dev/null || echo "")
    fi
    
    if [ -z "$PASSWORD_HASH" ]; then
        echo "⚠️  Cannot hash password automatically."
        echo "   Please install bcrypt for Node.js or Python"
        echo "   Or use the API method (start backend server first)"
        exit 1
    fi
    
    # Create SQL script
    SQL_FILE=$(mktemp)
    cat > "$SQL_FILE" <<EOF
-- Create or update admin user
INSERT INTO users (id, email, password_hash, first_name, last_name, role, subscription_tier, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    '$EMAIL',
    '$PASSWORD_HASH',
    '$FIRST_NAME',
    '$LAST_NAME',
    'admin',
    'premium',
    NOW(),
    NOW()
)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    role = 'admin',
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    updated_at = NOW()
RETURNING id, email, first_name, last_name, role, subscription_tier;
EOF
    
    # Get database connection info from .env
    if [ -f "backend/server/.env" ]; then
        source <(grep -E "^DB_" backend/server/.env | sed 's/^/export /')
    fi
    
    DB_HOST="${DB_HOST:-localhost}"
    DB_PORT="${DB_PORT:-5432}"
    DB_NAME="${DB_NAME:-pmp_app}"
    DB_USER="${DB_USER:-postgres}"
    
    echo "   Connecting to database: $DB_NAME@$DB_HOST:$DB_PORT"
    
    # Run SQL
    if PGPASSWORD="${DB_PASSWORD:-postgres}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE"; then
        echo ""
        echo "✅ Admin user created/updated successfully!"
        echo ""
        echo "🔐 Login Credentials:"
        echo "   Email: $EMAIL"
        echo "   Password: $PASSWORD"
        echo ""
        echo "🌐 Login at: http://localhost:3000"
    else
        echo "❌ Failed to create admin user"
        echo "   Check database connection and credentials in backend/server/.env"
        exit 1
    fi
    
    rm -f "$SQL_FILE"
fi



