#!/usr/bin/env python3
"""
Быстрая проверка Telegram бота
"""

import sys
import os

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

# Тестируем подключение к Telegram
try:
    from telegram import Bot
    import asyncio
    
    async def test_bot():
        bot = Bot(token=bot_token)
        me = await bot.get_me()
        return me
    
    # Запускаем тест
    me = asyncio.run(test_bot())
    
    print(f"✅ Bot connection successful!")
    print(f"🤖 Bot name: {me.first_name}")
    print(f"📛 Username: @{me.username}")
    print(f"🆔 Bot ID: {me.id}")
    
except Exception as e:
    print(f"❌ Bot connection failed: {e}")
    sys.exit(1)

# Запускаем простой polling
print("\n🚀 Starting bot...")
print("📱 Send a message to your bot to test!")
print("⌨️  Press Ctrl+C to stop")

try:
    from telegram.ext import Application, MessageHandler, filters, CommandHandler
    
    async def start(update, context):
        """Команда /start"""
        await update.message.reply_text(
            "🎫 HelpDesk Bot is working!\n\n"
            "Send me any message to create a test ticket."
        )
    
    async def handle_message(update, context):
        """Обработка сообщений"""
        try:
            from application.models import Application as HelpDeskApp
            
            chat_id = update.effective_chat.id
            user = update.effective_user
            text = update.message.text
            message_id = update.message.message_id
            
            # Создаем тестовую заявку
            application = HelpDeskApp.objects.create(
                groups='telegram',
                team='Test Ticket',
                text=text,
                created_by_id=1,  # Нужен существующий пользователь
                telegram=True,
                chat_id=str(chat_id),
                messages_id=str(message_id),
                name=user.first_name or 'Anonymous'
            )
            
            reply = f"""
✅ Ticket created successfully!

🆔 Ticket #: {application.id}
📝 Message: {text}
👤 From: {user.first_name}
💬 Chat ID: {chat_id}
            """
            
            await update.message.reply_text(reply)
            print(f"✅ Created ticket #{application.id}")
            
        except Exception as e:
            print(f"❌ Error creating ticket: {e}")
            await update.message.reply_text(f"❌ Error: {e}")
    
    # Настраиваем бота
    application = Application.builder().token(bot_token).build()
    
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Запускаем
    print("✅ Bot is running!")
    application.run_polling()
    
except KeyboardInterrupt:
    print("\n🛑 Bot stopped by user")
except Exception as e:
    print(f"❌ Bot error: {e}")
    sys.exit(1)