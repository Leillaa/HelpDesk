#!/bin/bash

# HelpDesk System Startup Script
echo "🚀 Starting HelpDesk System..."

# Check if all required directories exist
if [ ! -d "help-desk_backend-main" ]; then
    echo "❌ Backend directory not found!"
    exit 1
fi

if [ ! -d "help-desk_frontend-main" ]; then
    echo "❌ Frontend directory not found!"
    exit 1
fi

# Start Django Backend
echo "🔧 Starting Django backend server..."
cd help-desk_backend-main
python3 manage.py runserver 127.0.0.1:8000 &
BACKEND_PID=$!
echo "✅ Backend started (PID: $BACKEND_PID)"

# Start Telegram Bot
echo "📱 Starting Telegram bot..."
python3 working_bot.py &
BOT_PID=$!
echo "✅ Telegram bot started (PID: $BOT_PID)"

# Start React Frontend
echo "⚛️ Starting React frontend..."
cd ../help-desk_frontend-main
export REACT_APP_API_URL=http://127.0.0.1:8000
npm start &
FRONTEND_PID=$!
echo "✅ Frontend started (PID: $FRONTEND_PID)"

echo ""
echo "🎉 HelpDesk System is now running!"
echo "� Backend:  http://127.0.0.1:8000"
echo "🌐 Frontend: http://localhost:3000"
echo "🤖 Telegram: @Helper_desk_bot"
echo ""
echo "💡 Press Ctrl+C to stop all services"

# Function to cleanup processes
cleanup() {
    echo ""
    echo "🛑 Shutting down HelpDesk System..."
    kill $BACKEND_PID 2>/dev/null
    kill $BOT_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Trap Ctrl+C
trap cleanup INT

# Wait for all processes
wait