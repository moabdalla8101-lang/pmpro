#!/bin/bash

# Start mobile app with proper Node.js version and settings

set -e

echo "📱 Starting PMP Exam Prep Mobile App..."

# Load nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"

# Use Node.js 20
nvm use 20

# Increase file descriptor limit (fixes EMFILE error)
ulimit -n 4096

# Navigate to mobile directory
cd "$(dirname "$0")/../mobile"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Fix dependency versions
echo "Fixing dependency versions..."
npx expo install --fix

# Start Expo
echo ""
echo "🚀 Starting Expo..."
echo "Press 'i' for iOS Simulator or 'a' for Android Emulator"
echo ""

npm start

