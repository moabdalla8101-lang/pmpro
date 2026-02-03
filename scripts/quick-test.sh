#!/bin/bash

# Quick interactive test script for PMP Exam Prep App

BASE_URL="http://localhost:3001"

echo "🧪 PMP Exam Prep - Quick Test"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if server is running
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo "❌ Backend server is not running!"
    echo "   Start it with: cd backend/server && npm run dev"
    exit 1
fi

echo "✅ Backend server is running"
echo ""

# Test 1: Health
echo "1️⃣  Testing Health Endpoint..."
HEALTH=$(curl -s "$BASE_URL/health")
echo "   Response: $HEALTH"
echo ""

# Test 2: API Info
echo "2️⃣  Getting API Information..."
API_INFO=$(curl -s "$BASE_URL/" | python3 -m json.tool 2>/dev/null | head -10)
echo "$API_INFO"
echo ""

# Test 3: Register
echo "3️⃣  Testing User Registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test'$(date +%s)'@example.com",
    "password": "test1234",
    "firstName": "Test",
    "lastName": "User"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo "   ✅ Registration successful!"
    TOKEN=$(echo "$REGISTER_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])" 2>/dev/null)
    echo "   Token: ${TOKEN:0:50}..."
    echo ""
    
    # Test 4: Get Questions (with token)
    echo "4️⃣  Testing Questions Endpoint (with auth)..."
    QUESTIONS_RESPONSE=$(curl -s "$BASE_URL/api/questions" \
      -H "Authorization: Bearer $TOKEN")
    
    if echo "$QUESTIONS_RESPONSE" | grep -q "error"; then
        echo "   ⚠️  Questions endpoint returned error (may need questions in database)"
        echo "   Response: $(echo "$QUESTIONS_RESPONSE" | python3 -m json.tool 2>/dev/null | head -5)"
    else
        echo "   ✅ Questions endpoint accessible"
    fi
    echo ""
    
    # Test 5: Get Progress
    echo "5️⃣  Testing Progress Endpoint..."
    PROGRESS_RESPONSE=$(curl -s "$BASE_URL/api/progress" \
      -H "Authorization: Bearer $TOKEN")
    echo "   Response: $(echo "$PROGRESS_RESPONSE" | python3 -m json.tool 2>/dev/null | head -5)"
    echo ""
    
else
    echo "   ❌ Registration failed"
    echo "   Response: $REGISTER_RESPONSE"
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Quick test complete!"
echo ""
echo "📱 To test the mobile app:"
echo "   1. Make sure Expo is running: cd mobile && npm start"
echo "   2. Press 'i' for iOS Simulator or 'a' for Android"
echo "   3. Use the app to register/login and test features"
echo ""



