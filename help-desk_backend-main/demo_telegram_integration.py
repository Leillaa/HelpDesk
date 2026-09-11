#!/usr/bin/env python3
"""
Создание тестовой заявки и ответа для демонстрации работы Telegram интеграции
"""
import os
import django
import requests

# Настройка Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from application.models import Application, Comment
from profile.models import User
from telegram_utils import telegram_sender

def create_test_ticket():
    """Create a test ticket as if it came from Telegram"""
    
    # Create ticket
    application = Application.objects.create(
        groups='telegram',
        team='Demo Test Ticket',
        text='This is a test ticket to demonstrate sending replies to Telegram. Please respond to it.',
        created_by_id=1,  # Default user
        telegram=True,
        chat_id='123456789',  # test chat id
        messages_id='123',
        name='Demo User'
    )
    
    print(f"✅ Created test ticket #{application.id}")
    print(f"   Chat ID: {application.chat_id}")
    print(f"   Text: {application.text[:50]}...")
    
    return application.id

def send_test_reply(ticket_id):
    """Send test reply via API"""
    
    API_BASE = "http://127.0.0.1:8000"
    token = "3c728f283cb85a6b2c5fc3731bd83fc34acfbbc5"
    
    url = f"{API_BASE}/app/comment_create/{ticket_id}/"
    headers = {'Authorization': f'Token {token}'}
    data = {
        'user_id': '6',  # Admin user ID
        'content': 'Hello! Thank you for contacting us. Your ticket has been received and is being processed. Our specialist will contact you during business hours.'
    }

def send_test_reply(ticket_id):
    """Отправляем тестовый ответ через API"""
    
    API_BASE = "http://127.0.0.1:8000"
    token = "3c728f283cb85a6b2c5fc3731bd83fc34acfbbc5"
    
    url = f"{API_BASE}/app/comment_create/{ticket_id}/"
    headers = {'Authorization': f'Token {token}'}
    data = {
        'user_id': '6',  # Admin user ID
        'content': 'Здравствуйте! Благодарим за обращение. Ваша заявка принята в работу. Наш специалист свяжется с вами в течение рабочего дня.'
    }
    
    response = requests.post(url, data=data, headers=headers)
    
    if response.status_code == 200:
        print(f"✅ Reply sent successfully via API")
        print(f"📱 Message should be delivered to Telegram chat {data}")
        return True
    else:
        print(f"❌ Failed to send reply: {response.status_code} - {response.text}")
        return False

def main():
    """Main demonstration function"""
    
    print("🧪 === DEMO: Telegram Reply Integration ===")
    print()
    
    # Create test ticket
    print("1. Creating test ticket...")
    ticket_id = create_test_ticket()
    print()
    
    # Send reply
    print("2. Sending reply via web API...")
    success = send_test_reply(ticket_id)
    print()
    
    if success:
        print("✅ DEMO COMPLETED SUCCESSFULLY!")
        print("📱 The reply should now be visible in the Telegram chat")
        print(f"🔗 You can check the ticket in admin: http://127.0.0.1:8000/admin/application/application/{ticket_id}/")
    else:
        print("❌ DEMO FAILED")
    
    print()
    print("🔔 How it works:")
    print("   1. User sends message to Telegram bot")
    print("   2. Bot creates ticket in database with chat_id")
    print("   3. Support agent replies via web interface")
    print("   4. System automatically sends reply back to Telegram")
    print("   5. User receives notification in their chat")

if __name__ == "__main__":
    main()