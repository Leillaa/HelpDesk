#!/usr/bin/env python3
"""
Тестирование отправки комментария через Telegram
"""
import os
import django
import sys

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from application.models import Application, Comment
from profile.models import User
from telegram_utils import telegram_sender

def test_telegram_reply():
    """Тестируем отправку ответа в Telegram"""
    
    try:
        # Получаем заявку, созданную через Telegram
        application = Application.objects.filter(telegram=True).first()
        if not application:
            print("❌ No Telegram tickets found")
            return False
            
        print(f"✅ Found ticket #{application.id}")
        print(f"   Chat ID: {application.chat_id}")
        print(f"   Text: {application.text[:50]}...")
        
        # Получаем или создаем пользователя
        user, created = User.objects.get_or_create(
            username='testadmin',
            defaults={'email': 'admin@test.com'}
        )
        if created:
            print(f"✅ Created test user: {user.username}")
        else:
            print(f"✅ Using existing user: {user.username}")
        
        # Создаем тестовый комментарий
        comment_text = "Здравствуйте! Это тестовый ответ от службы поддержки. Ваша заявка принята в работу."
        
        comment = Comment.objects.create(
            application=application,
            name=user,
            body=comment_text
        )
        
        print(f"✅ Created comment #{comment.id}")
        
        # Отправляем ответ в Telegram
        result = telegram_sender.send_reply_to_ticket(application.id, comment_text)
        
        if result:
            print("✅ Reply sent to Telegram successfully!")
            return True
        else:
            print("❌ Failed to send reply to Telegram")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testing Telegram reply functionality...")
    test_telegram_reply()