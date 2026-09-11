#!/usr/bin/env python3
"""
Тестирование добавления комментариев из Telegram
"""
import os
import django

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from application.models import Application, Comment
from profile.models import User

def test_telegram_comments():
    """Тестируем логику добавления комментариев"""
    
    print("🧪 Testing Telegram comment functionality...")
    
    # Проверяем существующие заявки
    telegram_tickets = Application.objects.filter(telegram=True, status='Active')
    print(f"📋 Found {len(telegram_tickets)} active Telegram tickets:")
    
    for ticket in telegram_tickets[:3]:
        print(f"  - Ticket #{ticket.id}: {ticket.text[:50]}... (Chat: {ticket.chat_id})")
        
        # Проверяем комментарии к этой заявке
        comments = Comment.objects.filter(application=ticket)
        print(f"    💬 Comments: {len(comments)}")
        for comment in comments[:2]:
            print(f"      - {comment.body[:30]}... (Telegram: {comment.telegram})")
    
    print()
    print("🔍 Testing find_active_ticket logic...")
    
    # Имитируем поиск активной заявки
    test_chat_id = "123456789"  # test chat id
    
    active_ticket = Application.objects.filter(
        chat_id=test_chat_id,
        telegram=True,
        status='Active'
    ).order_by('-created').first()
    
    if active_ticket:
        print(f"✅ Found active ticket #{active_ticket.id} for chat {test_chat_id}")
        print(f"   Text: {active_ticket.text[:50]}...")
        print(f"   Created: {active_ticket.created}")
    else:
        print(f"❌ No active ticket found for chat {test_chat_id}")
    
    print()
    print("👤 Checking telegram_user...")
    
    # Проверяем/создаем пользователя для комментариев
    telegram_user, created = User.objects.get_or_create(
        username='telegram_user',
        defaults={
            'email': 'telegram@helpdesk.com'
        }
    )
    
    if created:
        print(f"✅ Created telegram_user: {telegram_user.id}")
    else:
        print(f"✅ Found existing telegram_user: {telegram_user.id}")
    
    print()
    print("📝 Summary:")
    print("   - Bot will now check for active tickets before creating new ones")
    print("   - New messages will be added as comments to existing tickets")
    print("   - Comments from Telegram will be marked with telegram=True")
    print("   - Use /tickets command to see user's tickets")

if __name__ == "__main__":
    test_telegram_comments()