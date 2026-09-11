#!/usr/bin/env python3
"""
Простая проверка Telegram бота (синхронная версия)
"""

import sys
import os
import requests

# Добавляем путь к Django проекту
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import django
from django.conf import settings

# Настраиваем Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')

try:
    django.setup()
    print("✅ Django setup successful")
except Exception as e:
    print(f"❌ Django setup failed: {e}")
    sys.exit(1)

# Проверяем токен
from decouple import config

bot_token = config('BOT_TOKEN', default='')
if not bot_token or bot_token == 'YOUR_BOT_TOKEN_HERE':
    print("❌ BOT_TOKEN not set in .env file")
    sys.exit(1)

print(f"✅ Bot token found: {bot_token[:10]}...")

# Тестируем подключение к Telegram через простой HTTP запрос
try:
    url = f"https://api.telegram.org/bot{bot_token}/getMe"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        if data['ok']:
            me = data['result']
            print(f"✅ Bot connection successful!")
            print(f"🤖 Bot name: {me['first_name']}")
            print(f"📛 Username: @{me['username']}")
            print(f"🆔 Bot ID: {me['id']}")
        else:
            print(f"❌ Bot API error: {data['description']}")
            sys.exit(1)
    else:
        print(f"❌ HTTP error: {response.status_code}")
        sys.exit(1)
        
except Exception as e:
    print(f"❌ Bot connection failed: {e}")
    sys.exit(1)

# Простая проверка создания заявки
print("\n🎫 Testing ticket creation...")

try:
    from application.models import Application, User
    
    # Проверяем есть ли пользователь
    try:
        user = User.objects.get(id=1)
        print(f"✅ Found user: {user.username}")
    except User.DoesNotExist:
        # Создаем тестового пользователя
        user = User.objects.create_user(
            username='telegram_bot',
            email='bot@example.com',
            password='testpass123'
        )
        print(f"✅ Created test user: {user.username}")
    
    # Создаем тестовую заявку
    test_ticket = Application.objects.create(
        groups='telegram',
        team='Bot Test',
        text='Test message from bot',
        created_by=user,
        telegram=True,
        chat_id='123456789',
        messages_id='1',
        name='Test User'
    )
    
    print(f"✅ Test ticket created: #{test_ticket.id}")
    print(f"📝 Text: {test_ticket.text}")
    print(f"👤 Created by: {test_ticket.created_by.username}")
    
except Exception as e:
    print(f"❌ Error creating test ticket: {e}")
    sys.exit(1)

print("\n🎉 All tests passed!")
print("\n📱 Your bot is ready to use!")
print(f"🔗 Start chatting: https://t.me/{me['username']}")
print("\n📋 Next steps:")
print("1. Send /start to your bot")
print("2. Send any message to create a ticket")
print("3. Check Django admin for new tickets")
print("\n⚠️  Note: This was just a test. To run the actual bot:")
print("   python3 telegram_bot.py")