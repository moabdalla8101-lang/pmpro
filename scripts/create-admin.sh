#!/bin/bash

# Script to create admin user
# Usage: ./scripts/create-admin.sh [email] [password]

set -e

echo "🔐 Creating Admin User..."
echo ""

# Navigate to project root
cd "$(dirname "$0")/.."

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    exit 1
fi

# Check if backend server .env exists
if [ ! -f "backend/server/.env" ]; then
    echo "⚠️  backend/server/.env not found"
    echo "   Creating from .env.example..."
    if [ -f "backend/server/.env.example" ]; then
        cp backend/server/.env.example backend/server/.env
        echo "   ⚠️  Please edit backend/server/.env with your database credentials"
    else
        echo "   ❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

# Run the Node.js script
node scripts/create-admin-user.js "$@"



