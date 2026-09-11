#!/bin/bash

# Telegram Bot Standalone Startup Script
# This script starts only the Telegram bot component

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if backend directory exists
if [ ! -d "help-desk_backend-main" ]; then
    log_error "Backend directory not found!"
    exit 1
fi

# Check if bot script exists
if [ ! -f "help-desk_backend-main/working_bot.py" ]; then
    log_error "Telegram bot script not found!"
    exit 1
fi

# Check if .env file exists
if [ ! -f "help-desk_backend-main/.env" ]; then
    log_error ".env file not found! Please configure your bot token."
    exit 1
fi

echo "🤖 Starting Telegram Bot for HelpDesk System"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

log_info "Changing to backend directory..."
cd help-desk_backend-main

log_info "Starting Telegram bot..."
log_success "Bot is connecting to Telegram API..."

# Function to handle cleanup
cleanup() {
    echo ""
    log_info "Stopping Telegram bot..."
    log_success "Bot stopped"
    exit 0
}

# Set up signal handling
trap cleanup INT TERM

# Start the bot
python3 working_bot.py

log_success "Bot execution completed"