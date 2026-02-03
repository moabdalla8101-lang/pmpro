#!/bin/bash

# PMP Exam Prep App - Setup Script
# This script helps set up the development environment

set -e

echo "🚀 Setting up PMP Exam Prep App..."

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo -e "${BLUE}Checking prerequisites...${NC}"

command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }
command -v npm >/dev/null 2>&1 || { echo "❌ npm is required but not installed. Aborting." >&2; exit 1; }
command -v psql >/dev/null 2>&1 || { echo "⚠️  PostgreSQL not found. You'll need to set up the database manually." >&2; }

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Node.js version 18+ is recommended. Current: $(node -v)"
fi

echo -e "${GREEN}✓ Prerequisites checked${NC}"

# Setup shared package
echo -e "\n${BLUE}Setting up shared package...${NC}"
cd backend/shared
npm install
npm run build
cd ../..
echo -e "${GREEN}✓ Shared package ready${NC}"

# Setup backend services
echo -e "\n${BLUE}Setting up backend services...${NC}"

for service in user-service content-service analytics-service; do
    echo -e "${YELLOW}Setting up $service...${NC}"
    cd backend/$service
    if [ ! -f .env ]; then
        cp .env.example .env
        echo "  Created .env file (please update with your settings)"
    fi
    npm install
    cd ../..
done

echo -e "${GREEN}✓ Backend services ready${NC}"

# Setup mobile app
echo -e "\n${BLUE}Setting up mobile app...${NC}"
cd mobile
if [ ! -f .env ]; then
    cp .env.example .env
    echo "  Created .env file"
fi
npm install
cd ..
echo -e "${GREEN}✓ Mobile app ready${NC}"

# Setup web admin
echo -e "\n${BLUE}Setting up web admin...${NC}"
cd web-admin
if [ ! -f .env ]; then
    cp .env.example .env
    echo "  Created .env file"
fi
npm install
cd ..
echo -e "${GREEN}✓ Web admin ready${NC}"

# Database setup reminder
echo -e "\n${YELLOW}📋 Next steps:${NC}"
echo "1. Set up PostgreSQL database:"
echo "   createdb pmp_app"
echo ""
echo "2. Run database migrations:"
echo "   psql -d pmp_app -f backend/database/migrations/001_initial_schema.sql"
echo ""
echo "3. Seed initial data:"
echo "   psql -d pmp_app -f backend/database/seeds/001_initial_data.sql"
echo ""
echo "4. Update .env files in backend services with your database credentials"
echo ""
echo "5. Start services:"
echo "   Backend: cd backend/user-service && npm run dev"
echo "   Mobile: cd mobile && npm start"
echo "   Web Admin: cd web-admin && npm run dev"
echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"



