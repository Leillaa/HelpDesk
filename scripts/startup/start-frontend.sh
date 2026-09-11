#!/bin/bash#!/bin/bash



# React Frontend Standalone Startup Script# Скрипт для запуска только frontend

# This script starts only the React frontend applicationecho "Запуск React frontend..."



set -ecd "$(dirname "$0")/help-desk_frontend-main"



# Colors for output# Установка зависимостей

GREEN='\033[0;32m'echo "Установка зависимостей..."

BLUE='\033[0;34m'npm install

RED='\033[0;31m'

YELLOW='\033[1;33m'# Запуск приложения

NC='\033[0m'echo "Запуск React приложения на порту 3000..."

echo "Приложение доступно по адресу: http://localhost:3000"

log_info() {npm start
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if frontend directory exists
if [ ! -d "help-desk_frontend-main" ]; then
    log_error "Frontend directory not found!"
    exit 1
fi

# Check if package.json exists
if [ ! -f "help-desk_frontend-main/package.json" ]; then
    log_error "Frontend package.json not found!"
    exit 1
fi

echo "⚛️  Starting React Frontend for HelpDesk System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if port 3000 is available
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_warning "Port 3000 is already in use. Trying to kill existing process..."
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

log_info "Changing to frontend directory..."
cd help-desk_frontend-main

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    log_info "Installing npm dependencies..."
    npm install
else
    log_success "Dependencies already installed"
fi

log_info "Setting up environment variables..."
export REACT_APP_API_URL=http://127.0.0.1:8000

log_info "Starting React development server..."
log_success "Frontend will be available at: http://localhost:3000"
log_warning "Make sure the backend is running at http://127.0.0.1:8000"

echo ""
echo "💡 Press Ctrl+C to stop the server"
echo ""

# Function to handle cleanup
cleanup() {
    echo ""
    log_info "Stopping React frontend server..."
    log_success "Frontend server stopped"
    exit 0
}

# Set up signal handling
trap cleanup INT TERM

# Start React server
npm start

log_success "Frontend server execution completed"