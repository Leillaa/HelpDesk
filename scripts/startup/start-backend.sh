#!/bin/bash#!/bin/bash



# Django Backend Standalone Startup Script# Скрипт для запуска только backend

# This script starts only the Django backend serverecho "Запуск Django backend..."



set -ecd "$(dirname "$0")/help-desk_backend-main"



# Colors for output# Проверка наличия виртуального окружения

GREEN='\033[0;32m'if [ ! -d "venv311" ]; then

BLUE='\033[0;34m'    echo "Создание виртуального окружения с Python 3.11..."

RED='\033[0;31m'    python3.11 -m venv venv311

YELLOW='\033[1;33m'    

NC='\033[0m'    echo "Активация и установка зависимостей..."

    venv311/bin/pip install Django==4.2 djangorestframework django-cors-headers python-decouple

log_info() {    venv311/bin/pip install djangorestframework-simplejwt django-currentuser django-storages Pillow PyJWT

    echo -e "${BLUE}ℹ️  $1${NC}"fi

}

# Применение миграций

log_success() {echo "Применение миграций..."

    echo -e "${GREEN}✅ $1${NC}"venv311/bin/python manage.py migrate

}

# Запуск сервера

log_error() {echo "Запуск Django сервера на порту 8000..."

    echo -e "${RED}❌ $1${NC}"echo "API доступен по адресу: http://localhost:8000"

}venv311/bin/python manage.py runserver 8000

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Check if backend directory exists
if [ ! -d "help-desk_backend-main" ]; then
    log_error "Backend directory not found!"
    exit 1
fi

# Check if manage.py exists
if [ ! -f "help-desk_backend-main/manage.py" ]; then
    log_error "Django manage.py not found!"
    exit 1
fi

echo "🔧 Starting Django Backend for HelpDesk System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Check if port 8000 is available
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    log_warning "Port 8000 is already in use. Trying to kill existing process..."
    lsof -ti:8000 | xargs kill -9 2>/dev/null || true
    sleep 2
fi

log_info "Changing to backend directory..."
cd help-desk_backend-main

log_info "Running Django system checks..."
python3 manage.py check

log_info "Starting Django development server..."
log_success "Backend will be available at: http://127.0.0.1:8000"
log_success "Admin panel will be available at: http://127.0.0.1:8000/admin/"

echo ""
echo "💡 Press Ctrl+C to stop the server"
echo ""

# Function to handle cleanup
cleanup() {
    echo ""
    log_info "Stopping Django backend server..."
    log_success "Backend server stopped"
    exit 0
}

# Set up signal handling
trap cleanup INT TERM

# Start Django server
python3 manage.py runserver 127.0.0.1:8000

log_success "Backend server execution completed"