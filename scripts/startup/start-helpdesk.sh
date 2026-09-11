#!/bin/bash

# HelpDesk System - Advanced Startup Script
# This script starts the complete HelpDesk system with all components

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."
    
    # Check Python
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is not installed!"
        exit 1
    fi
    log_success "Python 3: $(python3 --version)"
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js is not installed!"
        exit 1
    fi
    log_success "Node.js: $(node --version)"
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        log_error "npm is not installed!"
        exit 1
    fi
    log_success "npm: $(npm --version)"
}

# Check project structure
check_project_structure() {
    log_info "Checking project structure..."
    
    if [ ! -d "help-desk_backend-main" ]; then
        log_error "Backend directory 'help-desk_backend-main' not found!"
        exit 1
    fi
    
    if [ ! -f "help-desk_backend-main/manage.py" ]; then
        log_error "Django manage.py not found in backend directory!"
        exit 1
    fi
    
    if [ ! -f "help-desk_backend-main/working_bot.py" ]; then
        log_error "Telegram bot script not found!"
        exit 1
    fi
    
    if [ ! -d "help-desk_frontend-main" ]; then
        log_error "Frontend directory 'help-desk_frontend-main' not found!"
        exit 1
    fi
    
    if [ ! -f "help-desk_frontend-main/package.json" ]; then
        log_error "Frontend package.json not found!"
        exit 1
    fi
    
    log_success "Project structure is valid"
}

# Check if ports are available
check_ports() {
    log_info "Checking if required ports are available..."
    
    if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port 8000 is already in use. Trying to kill existing process..."
        lsof -ti:8000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port 3000 is already in use. Trying to kill existing process..."
        lsof -ti:3000 | xargs kill -9 2>/dev/null || true
        sleep 2
    fi
    
    log_success "Ports are now available"
}

# Install dependencies
install_dependencies() {
    log_info "Installing frontend dependencies..."
    cd help-desk_frontend-main
    
    if [ ! -d "node_modules" ]; then
        log_info "Installing npm packages..."
        npm install
    else
        log_success "Frontend dependencies already installed"
    fi
    
    cd ..
}

# Start services
start_services() {
    log_info "Starting HelpDesk System services..."
    
    # Start Django Backend
    log_info "Starting Django backend server..."
    cd help-desk_backend-main
    python3 manage.py runserver 127.0.0.1:8000 &
    BACKEND_PID=$!
    log_success "Backend started (PID: $BACKEND_PID)"
    
    # Wait a moment for backend to start
    sleep 3
    
    # Start Telegram Bot
    log_info "Starting Telegram bot..."
    python3 working_bot.py &
    BOT_PID=$!
    log_success "Telegram bot started (PID: $BOT_PID)"
    
    # Start React Frontend
    log_info "Starting React frontend..."
    cd ../help-desk_frontend-main
    export REACT_APP_API_URL=http://127.0.0.1:8000
    npm start &
    FRONTEND_PID=$!
    log_success "Frontend started (PID: $FRONTEND_PID)"
    
    cd ..
}

# Show status
show_status() {
    echo ""
    echo "🎉 HelpDesk System is now running!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📊 Backend:   http://127.0.0.1:8000"
    echo "🌐 Frontend:  http://localhost:3000"
    echo "🤖 Telegram:  @Helper_desk_bot"
    echo "🔧 Admin:     http://127.0.0.1:8000/admin/"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📝 Features available:"
    echo "   ✓ Web-based ticket management"
    echo "   ✓ Telegram bot integration"
    echo "   ✓ Real-time replies to Telegram"
    echo "   ✓ File attachments support"
    echo "   ✓ Multi-user authentication"
    echo ""
    echo "💡 Press Ctrl+C to stop all services"
    echo ""
}

# Cleanup function
cleanup() {
    echo ""
    log_info "Shutting down HelpDesk System..."
    
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null || true
        log_success "Backend stopped"
    fi
    
    if [ ! -z "$BOT_PID" ]; then
        kill $BOT_PID 2>/dev/null || true
        log_success "Telegram bot stopped"
    fi
    
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null || true
        log_success "Frontend stopped"
    fi
    
    # Kill any remaining processes on our ports
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    lsof -ti:3000 | xargs kill -9 2>/dev/null || true
    
    log_success "All services stopped"
    exit 0
}

# Main execution
main() {
    echo "🎫 HelpDesk System - Complete Startup"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    check_requirements
    check_project_structure
    check_ports
    install_dependencies
    start_services
    show_status
    
    # Set up signal handling
    trap cleanup INT TERM
    
    # Wait for all processes
    wait
}

# Run main function
main "$@"