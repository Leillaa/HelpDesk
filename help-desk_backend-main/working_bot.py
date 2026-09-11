#!/usr/bin/env python3
"""
Рабочий Telegram бот для HelpDesk (синхронная версия)
"""

import sys
import os
import time
import requests
import json
from datetime import datetime

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

from decouple import config
from application.models import Application, User

class SimpleTelegramBot:
    def __init__(self):
        self.bot_token = config('BOT_TOKEN', default='')
        if not self.bot_token:
            raise ValueError("BOT_TOKEN not found in .env file")
        
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}"
        self.last_update_id = 0
        
        print(f"🤖 Bot token: {self.bot_token[:10]}...")
    
    def send_message(self, chat_id, text):
        """Отправить сообщение"""
        url = f"{self.api_url}/sendMessage"
        data = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': 'HTML'
        }
        
        try:
            response = requests.post(url, data=data)
            return response.json()
        except Exception as e:
            print(f"❌ Error sending message: {e}")
            return None
    
    def get_updates(self):
        """Получить обновления"""
        url = f"{self.api_url}/getUpdates"
        params = {
            'offset': self.last_update_id + 1,
            'timeout': 5
        }
        
        try:
            response = requests.get(url, params=params)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ HTTP error: {response.status_code}")
                return None
        except Exception as e:
            print(f"❌ Error getting updates: {e}")
            return None
    
    def handle_start(self, chat_id, user):
        """Handle /start command"""
        username = user.get('first_name', 'User')
        welcome_text = f"""
👋 <b>Welcome to HelpDesk Support Bot!</b>

Hello {username}! I'm here to help you with technical support.

🎯 <b>What I can do:</b>
• Create support tickets from your messages
• Add comments to existing tickets
• Show your ticket history
• Provide help and guidance

📝 <b>Getting started:</b>
Just send me a message describing your issue, and I'll create a support ticket for you.

🔗 <b>Need help?</b> Use /help command anytime.
        """
        return self.send_message(chat_id, welcome_text)
    
    def handle_help(self, chat_id):
        """Handle /help command"""
        help_text = """
🆘 <b>HelpDesk Bot Help</b>

<b>Available Commands:</b>
/start - start working with the bot
/help - show this help message
/tickets - view your ticket history

<b>Creating Tickets:</b>
Send any message describing your problem to create a new support ticket

<b>Adding Comments:</b>
If you have an active ticket, new messages will be added as comments

<b>Ticket Status:</b>
• 🟢 Active - ticket is being processed
• 🔴 Close - ticket is closed

<b>Support:</b>
If you have issues with the bot, contact the administrator.
        """
    
    def handle_help(self, chat_id):
        """Обработчик команды /help"""
        help_text = """
🆘 <b>Помощь по боту</b>

<b>Команды:</b>
/start - начать работу
/help - показать эту помощь
/tickets - показать ваши заявки

<b>Создание заявки:</b>
Отправьте сообщение с описанием проблемы

<b>Добавление комментария:</b>
Если у вас есть активная заявка, новое сообщение будет добавлено как комментарий

<b>Статусы заявок:</b>
• 🟢 Active - заявка обрабатывается
• 🔴 Close - заявка закрыта

<b>Поддержка:</b>
Если у вас проблемы с ботом, обратитесь к администратору.
        """
        return self.send_message(chat_id, help_text)
    
    def create_ticket(self, chat_id, user, message_id, text):
        """Create a support ticket"""
        try:
            # Get or create user
            username = user.get('username') or f"{user.get('first_name', 'User')}_{user.get('id')}"
            
            # Create ticket
            application = Application.objects.create(
                groups='telegram',
                team='Telegram Support',
                text=text,
                created_by_id=1,  # System user
                telegram=True,
                chat_id=str(chat_id),
                messages_id=str(message_id),
                name=username
            )
            
            success_text = f"""
✅ <b>Support ticket created!</b>

🆔 <b>Ticket Number:</b> #{application.id}
📝 <b>Description:</b> {text[:100]}{'...' if len(text) > 100 else ''}
⏰ <b>Status:</b> {application.status}
📅 <b>Created:</b> {application.created.strftime('%d.%m.%Y %H:%M')}

💬 Support responses will be sent to this chat.
            """
            
            self.send_message(chat_id, success_text)
            print(f"✅ Created ticket #{application.id} from {username}")
            
        except Exception as e:
            print(f"❌ Error creating ticket: {e}")
            error_text = f"""
❌ <b>Error creating ticket</b>

An error occurred: {str(e)}

Please try again later or contact the administrator.
            """
            self.send_message(chat_id, error_text)
    
    def find_active_ticket(self, chat_id):
        """Найти активную заявку для данного chat_id"""
        try:
            # Ищем последнюю активную заявку от этого чата
            ticket = Application.objects.filter(
                chat_id=str(chat_id),
                telegram=True,
                status='Active'
            ).order_by('-created').first()
            
            return ticket
        except Exception as e:
            print(f"❌ Error finding active ticket: {e}")
            return None
    
    def add_comment_to_ticket(self, ticket, chat_id, user, message_id, text):
        """Add comment to existing ticket"""
        try:
            from application.models import Comment
            from profile.models import User
            
            # Get or create user for Telegram comments
            telegram_user, created = User.objects.get_or_create(
                username='telegram_user',
                defaults={
                    'email': 'telegram@helpdesk.com'
                }
            )
            
            # Create comment
            comment = Comment.objects.create(
                application=ticket,
                name=telegram_user,
                body=text,
                messages_id=str(message_id),
                telegram=True,
                chat_id=str(chat_id)
            )
            
            username = user.get('username') or user.get('first_name', 'User')
            
            # Send confirmation
            confirmation_text = f"""
📝 <b>Comment added to ticket #{ticket.id}</b>

💬 <b>Your comment:</b>
{text}

📅 <b>Time:</b> {comment.created.strftime('%d.%m.%Y %H:%M')}

ℹ️ Support response will be sent to this chat.
            """
            
            self.send_message(chat_id, confirmation_text)
            print(f"✅ Added comment to ticket #{ticket.id} from {username}")
            
        except Exception as e:
            print(f"❌ Error adding comment to ticket: {e}")
            error_text = f"""
❌ <b>Error adding comment</b>

An error occurred: {str(e)}

Please try again later or contact the administrator.
            """
            self.send_message(chat_id, error_text)
    
    def show_user_tickets(self, chat_id):
        """Show user's tickets"""
        try:
            # Find all tickets for this user
            tickets = Application.objects.filter(
                chat_id=str(chat_id),
                telegram=True
            ).order_by('-created')[:5]  # Last 5 tickets
            
            if not tickets:
                no_tickets_text = """
📋 <b>Your Tickets</b>

You don't have any tickets yet.
Send a message to create a new support ticket.
                """
                return self.send_message(chat_id, no_tickets_text)
            
            tickets_text = "📋 <b>Your Tickets</b>\n\n"
            
            for ticket in tickets:
                status_emoji = "🟢" if ticket.status == "Active" else "🔴"
                tickets_text += f"""
{status_emoji} <b>Ticket #{ticket.id}</b>
📝 {ticket.text[:50]}{'...' if len(ticket.text) > 50 else ''}
📅 {ticket.created.strftime('%d.%m.%Y %H:%M')}
⏰ Status: {ticket.status}

"""
            
            tickets_text += """
💡 <b>What's next:</b>
• Send a message to add a comment to your active ticket
• Use /help for assistance
            """
            
            self.send_message(chat_id, tickets_text)
            
        except Exception as e:
            print(f"❌ Error showing tickets: {e}")
            error_text = "❌ Error retrieving ticket list"
            self.send_message(chat_id, error_text)
    
    def handle_message(self, update):
        """Обработать сообщение"""
        message = update.get('message', {})
        if not message:
            return
        
        chat_id = message.get('chat', {}).get('id')
        user = message.get('from', {})
        message_id = message.get('message_id')
        text = message.get('text', '')
        
        if not chat_id or not text:
            return
        
        print(f"📩 Message from {user.get('first_name', 'Unknown')}: {text}")
        
        # Handle commands
        if text.startswith('/start'):
            self.handle_start(chat_id, user)
        elif text.startswith('/help'):
            self.handle_help(chat_id)
        elif text.startswith('/tickets') or text.startswith('/status'):
            self.show_user_tickets(chat_id)
        else:
            # Check if there's an active ticket from this user
            existing_ticket = self.find_active_ticket(chat_id)
            if existing_ticket:
                # Add comment to existing ticket
                self.add_comment_to_ticket(existing_ticket, chat_id, user, message_id, text)
            else:
                # Create new ticket
                self.create_ticket(chat_id, user, message_id, text)
    
    def run(self):
        """Запустить бота"""
        print("🚀 Starting HelpDesk Telegram Bot...")
        
        # Проверяем соединение
        try:
            response = requests.get(f"{self.api_url}/getMe")
            if response.status_code == 200:
                me = response.json()['result']
                print(f"✅ Bot connected: @{me['username']}")
            else:
                print("❌ Failed to connect to Telegram")
                return
        except Exception as e:
            print(f"❌ Connection error: {e}")
            return
        
        print("🎯 Bot is running! Send messages to test.")
        print("⌨️  Press Ctrl+C to stop")
        
        # Основной цикл
        while True:
            try:
                updates = self.get_updates()
                
                if updates and updates.get('ok'):
                    for update in updates.get('result', []):
                        self.last_update_id = update.get('update_id', 0)
                        self.handle_message(update)
                
                time.sleep(1)  # Небольшая пауза
                
            except KeyboardInterrupt:
                print("\n🛑 Bot stopped by user")
                break
            except Exception as e:
                print(f"❌ Bot error: {e}")
                time.sleep(5)  # Пауза при ошибке

if __name__ == "__main__":
    try:
        bot = SimpleTelegramBot()
        bot.run()
    except Exception as e:
        print(f"❌ Failed to start bot: {e}")
        sys.exit(1)