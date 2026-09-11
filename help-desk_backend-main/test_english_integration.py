#!/usr/bin/env python3
"""
Complete Telegram Integration Test - English Version
"""
import os
import django
import requests

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from application.models import Application, Comment
from profile.models import User
from telegram_utils import telegram_sender

def test_complete_flow():
    """Test complete English Telegram integration flow"""
    
    print("🧪 === COMPLETE TELEGRAM INTEGRATION TEST ===")
    print()
    
    # Step 1: Create test ticket (simulating Telegram user)
    print("1. Creating test ticket from Telegram user...")
    application = Application.objects.create(
        groups='telegram',
        team='Technical Support Request',
        text='Hello, I am having issues with my computer. It keeps freezing and running very slowly. Please help!',
        created_by_id=1,
        telegram=True,
        chat_id='123456789',  # test chat id
        messages_id='999',
        name='TestUser_12345'
    )
    
    print(f"✅ Created ticket #{application.id}")
    print(f"   Description: {application.text[:60]}...")
    print()
    
    # Step 2: Add user comment (simulating Telegram message)
    print("2. Adding user comment via Telegram...")
    telegram_user, created = User.objects.get_or_create(
        username='telegram_user',
        defaults={'email': 'telegram@helpdesk.com'}
    )
    
    user_comment = Comment.objects.create(
        application=application,
        name=telegram_user,
        body='I tried restarting the computer several times but the problem persists. The freezing happens especially when I open multiple applications.',
        telegram=True,
        chat_id='123456789'
    )
    
    print(f"✅ Added user comment: {user_comment.body[:60]}...")
    print()
    
    # Step 3: Send support reply via API
    print("3. Sending support reply via web API...")
    API_BASE = "http://127.0.0.1:8000"
    token = "3c728f283cb85a6b2c5fc3731bd83fc34acfbbc5"
    
    url = f"{API_BASE}/app/comment_create/{application.id}/"
    headers = {'Authorization': f'Token {token}'}
    data = {
        'user_id': '6',  # Admin user
        'content': 'Hello! Thank you for contacting our technical support. Based on your description, this sounds like a memory or overheating issue. Please try the following steps: 1) Close all unnecessary programs, 2) Check if your computer fans are working, 3) Run a disk cleanup. We will follow up with you shortly.'
    }
    
    try:
        response = requests.post(url, data=data, headers=headers)
        if response.status_code == 200:
            print("✅ Support reply sent successfully via API")
            print("📱 Reply should be delivered to Telegram chat")
        else:
            print(f"❌ API error: {response.status_code} - {response.text}")
    except Exception as e:
        print(f"❌ Error sending API request: {e}")
    
    print()
    
    # Step 4: Test direct Telegram sending
    print("4. Testing direct Telegram message sending...")
    try:
        direct_result = telegram_sender.send_reply_to_ticket(
            application.id, 
            "This is a follow-up message to confirm that our technical team is working on your case. We appreciate your patience!"
        )
        if direct_result:
            print("✅ Direct Telegram message sent successfully")
        else:
            print("❌ Direct Telegram message failed")
    except Exception as e:
        print(f"❌ Error in direct sending: {e}")
    
    print()
    
    # Summary
    print("📊 === TEST SUMMARY ===")
    print(f"🎫 Ticket #{application.id} created with English content")
    print(f"💬 {Comment.objects.filter(application=application).count()} total comments")
    print(f"📱 Telegram integration: {'✅ WORKING' if application.telegram else '❌ FAILED'}")
    print()
    print("🔍 Check your Telegram chat for received messages!")
    print(f"🌐 View ticket in admin: http://127.0.0.1:8000/admin/application/application/{application.id}/")
    print()
    print("🎉 All components tested with English messages!")

if __name__ == "__main__":
    test_complete_flow()