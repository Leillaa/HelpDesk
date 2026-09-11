#!/bin/bash

# 🧪 QUICK TEST RUNNER - Fast development testing

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

print_color() {
    printf "${1}${2}${NC}\n"
}

print_color $BLUE "🚀 Quick Test Runner - HelpDesk System"
echo

# Backend quick tests
if [ -d "help-desk_backend-main" ]; then
    print_color $BLUE "🔧 Running backend quick tests..."
    cd help-desk_backend-main
    
    # Run only model tests (fastest)
    python3 -m unittest tests.test_models -q
    
    # Quick API test
    python3 -c "
import os, django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()
from application.models import Application
from profile.models import User
print('✅ Backend models working')
"
    
    cd ..
    print_color $GREEN "✅ Backend tests passed"
fi

# Frontend quick tests
if [ -d "help-desk_frontend-main" ]; then
    print_color $BLUE "⚛️ Running frontend quick tests..."
    cd help-desk_frontend-main
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        npm install --silent
    fi
    
    # TypeScript check only
    npx tsc --noEmit
    
    cd ..
    print_color $GREEN "✅ Frontend tests passed"
fi

print_color $GREEN "🎉 All quick tests completed!"
echo "💡 For full tests, run: ./run-tests.sh"