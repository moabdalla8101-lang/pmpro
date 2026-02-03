#!/bin/bash

# Start all services and open simulator

set -e

echo "🚀 Starting all PMP Exam Prep services..."

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Check if services are already running
check_port() {
    lsof -ti:$1 > /dev/null 2>&1
}

if check_port 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 already in use. User service might be running.${NC}"
fi

if check_port 3002; then
    echo -e "${YELLOW}⚠️  Port 3002 already in use. Content service might be running.${NC}"
fi

if check_port 3003; then
    echo -e "${YELLOW}⚠️  Port 3003 already in use. Analytics service might be running.${NC}"
fi

# Start User Service
echo -e "\n${BLUE}Starting User Service (port 3001)...${NC}"
cd backend/user-service
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev > /tmp/user-service.log 2>&1 &
USER_PID=$!
echo "User Service PID: $USER_PID"
cd ../..

# Wait a bit
sleep 2

# Start Content Service
echo -e "\n${BLUE}Starting Content Service (port 3002)...${NC}"
cd backend/content-service
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev > /tmp/content-service.log 2>&1 &
CONTENT_PID=$!
echo "Content Service PID: $CONTENT_PID"
cd ../..

# Wait a bit
sleep 2

# Start Analytics Service
echo -e "\n${BLUE}Starting Analytics Service (port 3003)...${NC}"
cd backend/analytics-service
if [ ! -d "node_modules" ]; then
    npm install
fi
npm run dev > /tmp/analytics-service.log 2>&1 &
ANALYTICS_PID=$!
echo "Analytics Service PID: $ANALYTICS_PID"
cd ../..

# Wait for services to start
echo -e "\n${BLUE}Waiting for services to initialize...${NC}"
sleep 5

# Check if services are running
check_service() {
    local port=$1
    local name=$2
    if curl -s http://localhost:$port/health > /dev/null 2>&1; then
        echo -e "${GREEN}✓ $name is running${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $name might not be ready yet${NC}"
        return 1
    fi
}

check_service 3001 "User Service"
check_service 3002 "Content Service"
check_service 3003 "Analytics Service"

# Start Mobile App
echo -e "\n${BLUE}Starting Mobile App...${NC}"
cd mobile

# Ensure .env exists
if [ ! -f .env ]; then
    echo "EXPO_PUBLIC_API_URL=http://localhost:3001" > .env
    echo -e "${GREEN}✓ Created .env file${NC}"
fi

if [ ! -d "node_modules" ]; then
    echo "Installing mobile app dependencies (this may take a while)..."
    npm install
fi

echo -e "\n${GREEN}✅ All services starting!${NC}"
echo -e "\n${YELLOW}Services are running in the background.${NC}"
echo -e "${YELLOW}Logs are available at:${NC}"
echo "  - User Service: /tmp/user-service.log"
echo "  - Content Service: /tmp/content-service.log"
echo "  - Analytics Service: /tmp/analytics-service.log"
echo ""
echo -e "${BLUE}Starting Expo and opening simulator...${NC}"
echo ""

# Start Expo and open iOS simulator
npm start -- --ios

# Save PIDs to file for later cleanup
echo "$USER_PID" > /tmp/pmp-services.pids
echo "$CONTENT_PID" >> /tmp/pmp-services.pids
echo "$ANALYTICS_PID" >> /tmp/pmp-services.pids



