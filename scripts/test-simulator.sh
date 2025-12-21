#!/bin/bash

# Test script for running the app on a simulator

set -e

echo "🧪 Setting up PMP Exam Prep App for Simulator Testing..."
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if PostgreSQL is running
echo -e "${BLUE}Checking PostgreSQL...${NC}"
if ! pg_isready >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  PostgreSQL is not running. Starting it...${NC}"
    # Try to start PostgreSQL (macOS)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start postgresql@15 || brew services start postgresql || echo "Please start PostgreSQL manually"
    fi
    sleep 2
fi

# Check if database exists
echo -e "${BLUE}Setting up database...${NC}"
if ! psql -lqt | cut -d \| -f 1 | grep -qw pmp_app; then
    echo "Creating database..."
    createdb pmp_app 2>/dev/null || echo "Database might already exist or need manual creation"
    
    echo "Running migrations..."
    psql -d pmp_app -f backend/database/migrations/001_initial_schema.sql 2>/dev/null || echo "Migrations might already be applied"
    
    echo "Seeding data..."
    psql -d pmp_app -f backend/database/seeds/001_initial_data.sql 2>/dev/null || echo "Data might already be seeded"
else
    echo -e "${GREEN}✓ Database already exists${NC}"
fi

# Build shared package
echo -e "\n${BLUE}Building shared package...${NC}"
cd backend/shared
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run build
cd ../..
echo -e "${GREEN}✓ Shared package built${NC}"

# Check backend services
echo -e "\n${BLUE}Checking backend services...${NC}"
echo "Make sure backend services are running in separate terminals:"
echo ""
echo "Terminal 1 - User Service:"
echo "  cd backend/user-service"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "Terminal 2 - Content Service:"
echo "  cd backend/content-service"
echo "  npm install"
echo "  npm run dev"
echo ""
echo "Terminal 3 - Analytics Service:"
echo "  cd backend/analytics-service"
echo "  npm install"
echo "  npm run dev"
echo ""

# Setup mobile app
echo -e "${BLUE}Setting up mobile app...${NC}"
cd mobile

if [ ! -f .env ]; then
    echo "EXPO_PUBLIC_API_URL=http://localhost:3001" > .env
    echo -e "${GREEN}✓ Created .env file${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing mobile app dependencies..."
    npm install
fi

echo -e "\n${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Start backend services (see above)"
echo "2. Run: cd mobile && npm start"
echo "3. Press 'i' for iOS simulator or 'a' for Android emulator"
echo ""
echo "Default admin credentials:"
echo "  Email: admin@pmpapp.com"
echo "  Password: admin123"
echo ""

