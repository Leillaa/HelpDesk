#!/bin/bash

# Telegram Bot Setup Script
echo "🤖 Setting up Telegram Bot for HelpDesk"
echo "======================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Check if BOT_TOKEN is set
BOT_TOKEN=$(grep "^BOT_TOKEN=" .env | cut -d '=' -f2)
if [ "$BOT_TOKEN" = "YOUR_BOT_TOKEN_HERE" ] || [ -z "$BOT_TOKEN" ]; then
    echo "❌ Please set your BOT_TOKEN in .env file"
    echo ""
    echo "📝 How to get a bot token:"
    echo "1. Open Telegram and search for @BotFather"
    echo "2. Send /newbot command"
    echo "3. Follow instructions to create your bot"
    echo "4. Copy the token and paste it in .env file"
    echo ""
    echo "🔧 Edit .env file and replace:"
    echo "BOT_TOKEN=YOUR_BOT_TOKEN_HERE"
    echo "with:"
    echo "BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz"
    exit 1
fi

echo "✅ Bot token found"

# Install required packages
echo "📦 Installing required Python packages..."
pip3 install --break-system-packages python-telegram-bot==13.7 pika minio

# Check if services are running
echo ""
echo "🔍 Checking required services..."

# Check RabbitMQ
if ! command -v rabbitmq-server &> /dev/null; then
    echo "⚠️  RabbitMQ not installed. Installing via Homebrew..."
    brew install rabbitmq
fi

# Check if RabbitMQ is running
if ! pgrep -x "rabbitmq-server" > /dev/null; then
    echo "🚀 Starting RabbitMQ..."
    brew services start rabbitmq
    sleep 3
fi

# Check MinIO
if ! command -v minio &> /dev/null; then
    echo "⚠️  MinIO not installed. Installing via Homebrew..."
    brew install minio/stable/minio
fi

# Start MinIO if not running
if ! pgrep -x "minio" > /dev/null; then
    echo "🚀 Starting MinIO..."
    mkdir -p ~/minio-data
    minio server ~/minio-data --address :9000 &
    sleep 3
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🤖 Bot token: ${BOT_TOKEN:0:10}..."
echo "🐰 RabbitMQ: Running on localhost:5672"
echo "📦 MinIO: Running on localhost:9000"
echo ""
echo "📱 Next steps:"
echo "1. Set webhook for your bot (see setup-webhook.py)"
echo "2. Test your bot by sending a message"
echo "3. Check the Django admin for new tickets"