#!/usr/bin/env python3
"""
Telegram Bot Webhook Setup Script
"""

import os
import sys
import requests
from decouple import config

def setup_webhook():
    """Set up Telegram webhook"""
    
    # Load bot token from .env
    bot_token = config('BOT_TOKEN', default='')
    
    if not bot_token or bot_token == 'YOUR_BOT_TOKEN_HERE':
        print("❌ BOT_TOKEN not set in .env file")
        print("Please run setup-bot.sh first")
        return False
    
    # Webhook URL (you'll need to replace with your actual URL)
    webhook_url = input("Enter your webhook URL (e.g., https://yourdomain.com/webhook/): ")
    
    if not webhook_url:
        print("⚠️  No webhook URL provided. Bot will work in polling mode.")
        return True
    
    # Set webhook
    url = f"https://api.telegram.org/bot{bot_token}/setWebhook"
    data = {"url": webhook_url}
    
    try:
        response = requests.post(url, data=data)
        result = response.json()
        
        if result.get("ok"):
            print(f"✅ Webhook set successfully!")
            print(f"🌐 URL: {webhook_url}")
        else:
            print(f"❌ Failed to set webhook: {result.get('description')}")
            return False
            
    except Exception as e:
        print(f"❌ Error setting webhook: {e}")
        return False
    
    return True

def test_bot():
    """Test bot connection"""
    
    bot_token = config('BOT_TOKEN', default='')
    
    if not bot_token:
        print("❌ BOT_TOKEN not set")
        return False
    
    url = f"https://api.telegram.org/bot{bot_token}/getMe"
    
    try:
        response = requests.get(url)
        result = response.json()
        
        if result.get("ok"):
            bot_info = result.get("result", {})
            print(f"✅ Bot connection successful!")
            print(f"🤖 Bot name: {bot_info.get('first_name')}")
            print(f"📛 Username: @{bot_info.get('username')}")
        else:
            print(f"❌ Bot test failed: {result.get('description')}")
            return False
            
    except Exception as e:
        print(f"❌ Error testing bot: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🤖 Telegram Bot Setup")
    print("====================")
    
    # Test bot connection first
    if not test_bot():
        sys.exit(1)
    
    # Setup webhook
    setup_webhook()
    
    print("\n📝 Manual webhook setup:")
    print("If you're developing locally, you can use ngrok:")
    print("1. Install ngrok: brew install ngrok")
    print("2. Run: ngrok http 8000")
    print("3. Use the https URL for webhook")
    print("4. Add '/webhook/' to the end of the URL")