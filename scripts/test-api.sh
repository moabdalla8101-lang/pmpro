#!/bin/bash

# Quick API testing script for PMP Exam Prep monolith

BASE_URL="http://localhost:3001"

echo "🧪 Testing PMP Exam Prep API..."
echo ""

# Check if server is running
if ! curl -s "$BASE_URL/health" > /dev/null; then
    echo "❌ Server is not running on $BASE_URL"
    echo "   Start it with: cd backend/server && npm run dev"
    exit 1
fi

# Health check
echo "1️⃣  Health check..."
HEALTH=$(curl -s "$BASE_URL/health")
if echo "$HEALTH" | grep -q "ok"; then
    echo "   ✅ Server is healthy"
    echo "   Response: $HEALTH"
else
    echo "   ❌ Health check failed"
    exit 1
fi
echo ""

# Try to register
echo "2️⃣  Registering test user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test1234",
    "firstName": "Test",
    "lastName": "User"
  }')

if echo "$REGISTER_RESPONSE" | grep -q "token"; then
    echo "   ✅ Registration successful"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
elif echo "$REGISTER_RESPONSE" | grep -q "already exists"; then
    echo "   ℹ️  User already exists, trying login..."
    LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/api/auth/login" \
      -H "Content-Type: application/json" \
      -d '{
        "email": "test@example.com",
        "password": "test1234"
      }')
    if echo "$LOGIN_RESPONSE" | grep -q "token"; then
        echo "   ✅ Login successful"
        TOKEN=$(echo "$LOGIN_RESPONSE" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    else
        echo "   ❌ Login failed"
        echo "   Response: $LOGIN_RESPONSE"
        exit 1
    fi
else
    echo "   ❌ Registration failed"
    echo "   Response: $REGISTER_RESPONSE"
    exit 1
fi
echo ""

if [ -z "$TOKEN" ]; then
    echo "❌ Failed to get authentication token"
    exit 1
fi

echo "   Token: ${TOKEN:0:30}..."
echo ""

# Test protected endpoint
echo "3️⃣  Testing protected endpoint (GET /api/users/profile)..."
PROFILE_RESPONSE=$(curl -s "$BASE_URL/api/users/profile" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROFILE_RESPONSE" | grep -q "email"; then
    echo "   ✅ Protected endpoint works"
    echo "   Response: $(echo "$PROFILE_RESPONSE" | head -c 100)..."
else
    echo "   ❌ Protected endpoint failed"
    echo "   Response: $PROFILE_RESPONSE"
    exit 1
fi
echo ""

# Test questions endpoint
echo "4️⃣  Testing questions endpoint..."
QUESTIONS_RESPONSE=$(curl -s "$BASE_URL/api/questions" \
  -H "Authorization: Bearer $TOKEN")

if echo "$QUESTIONS_RESPONSE" | grep -q "questions\|\[\]"; then
    echo "   ✅ Questions endpoint works"
else
    echo "   ⚠️  Questions endpoint returned unexpected response"
    echo "   Response: $(echo "$QUESTIONS_RESPONSE" | head -c 100)..."
fi
echo ""

# Test progress endpoint
echo "5️⃣  Testing progress endpoint..."
PROGRESS_RESPONSE=$(curl -s "$BASE_URL/api/progress" \
  -H "Authorization: Bearer $TOKEN")

if echo "$PROGRESS_RESPONSE" | grep -q "progress\|\[\]"; then
    echo "   ✅ Progress endpoint works"
else
    echo "   ⚠️  Progress endpoint returned unexpected response"
    echo "   Response: $(echo "$PROGRESS_RESPONSE" | head -c 100)..."
fi
echo ""

echo "✅ All basic tests passed!"
echo ""
echo "Next steps:"
echo "  - Test mobile app: cd mobile && npm start"
echo "  - Test web admin: cd web-admin && npm run dev"
echo "  - See TESTING.md for more detailed tests"



