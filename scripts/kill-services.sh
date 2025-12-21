#!/bin/bash

# Kill all PMP services running on ports 3001, 3002, 3003

echo "🛑 Stopping all PMP services..."

# Kill processes on specific ports
for port in 3001 3002 3003; do
    PID=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$PID" ]; then
        kill -9 $PID 2>/dev/null
        echo "✅ Killed process on port $port"
    else
        echo "ℹ️  No process on port $port"
    fi
done

# Kill any ts-node-dev processes
pkill -9 -f "ts-node-dev" 2>/dev/null && echo "✅ Killed ts-node-dev processes" || echo "ℹ️  No ts-node-dev processes"

# Kill any expo processes
pkill -9 -f "expo" 2>/dev/null && echo "✅ Killed expo processes" || echo "ℹ️  No expo processes"

echo ""
echo "✅ All services stopped. Ports are now free."
echo ""
echo "You can now start services again:"
echo "  Terminal 1: cd backend/user-service && npm run dev"
echo "  Terminal 2: cd backend/content-service && npm run dev"
echo "  Terminal 3: cd backend/analytics-service && npm run dev"
echo "  Terminal 4: cd mobile && npm start"

