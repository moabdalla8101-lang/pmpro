#!/bin/bash

# Quick script to run everything

echo "🚀 Starting PMP Exam Prep App..."
echo ""

# Check if backend is running
if ! curl -s http://localhost:3001/health > /dev/null 2>&1; then
    echo "⚠️  Backend not running. Starting it..."
    cd "$(dirname "$0")/backend/server"
    source ~/.nvm/nvm.sh 2>/dev/null
    nvm use 20 2>/dev/null
    npm run dev &
    sleep 3
    echo "✅ Backend starting..."
else
    echo "✅ Backend already running"
fi

# Check if Expo is running
if ! ps aux | grep -E "expo start" | grep -v grep > /dev/null; then
    echo "⚠️  Expo not running. Starting it..."
    cd "$(dirname "$0")/mobile"
    source ~/.nvm/nvm.sh 2>/dev/null
    nvm use 20 2>/dev/null
    ulimit -n 4096
    npm start &
    sleep 3
    echo "✅ Expo starting..."
else
    echo "✅ Expo already running"
fi

# Open Simulator
echo ""
echo "📱 Opening iOS Simulator..."
open -a Simulator 2>/dev/null

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Everything is starting!"
echo ""
echo "Next steps:"
echo "  1. Wait for Simulator to open"
echo "  2. In the Expo terminal, press 'i'"
echo "  3. The app will load in the simulator"
echo ""
echo "Or open: http://localhost:19000 in browser"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

