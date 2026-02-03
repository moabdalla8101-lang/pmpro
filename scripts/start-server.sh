#!/bin/bash

# Start monolithic backend server

set -e

echo "🚀 Starting PMP Exam Prep Server (Monolith)..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 20
nvm use 20

# Navigate to server directory
cd "$(dirname "$0")/../backend/server"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from .env.example..."
    cp .env.example .env
    echo "⚠️  Please update .env with your configuration before starting!"
fi

# Start server
echo ""
echo "🚀 Starting server on port 3001..."
echo ""

npm run dev



