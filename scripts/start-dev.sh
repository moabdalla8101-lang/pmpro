#!/bin/bash

# Start all development services

set -e

echo "🚀 Starting PMP Exam Prep App development servers..."

# Check if Docker Compose is available
if command -v docker-compose >/dev/null 2>&1; then
    echo "Using Docker Compose..."
    cd infrastructure/docker
    docker-compose up
else
    echo "Docker Compose not found. Starting services manually..."
    echo "Make sure PostgreSQL is running and services are configured."
    echo ""
    echo "Start services in separate terminals:"
    echo "1. User Service: cd backend/user-service && npm run dev"
    echo "2. Content Service: cd backend/content-service && npm run dev"
    echo "3. Analytics Service: cd backend/analytics-service && npm run dev"
    echo "4. Web Admin: cd web-admin && npm run dev"
    echo "5. Mobile: cd mobile && npm start"
fi

