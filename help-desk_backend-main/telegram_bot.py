#!/usr/bin/env python3
"""
Telegram Bot Polling Script
Запускается отдельно от Django и постоянно опрашивает Telegram
"""

import os
import sys
import django
import json
import time
import logging
from telegram import Update
from telegram.ext import Updater, CommandHandler, MessageHandler, Filters, CallbackContext

# Настройка Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from django.conf import settings
from application.models import Application, User, Comment, Attachment_comment
from decouple import config

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

class HelpDeskBot:
    def __init__(self):
        self.bot_token = config('BOT_TOKEN')
        if not self.bot_token:
            raise ValueError("BOT_TOKEN not found in .env file")
        
        self.updater = Updater(token=self.bot_token, use_context=True)
        self.dispatcher = self.updater.dispatcher
        
        # Добавляем обработчики
        self.dispatcher.add_handler(CommandHandler("start", self.start))
        self.dispatcher.add_handler(CommandHandler("help", self.help_command))
        self.dispatcher.add_handler(MessageHandler(Filters.text & ~Filters.command, self.handle_message))
        self.dispatcher.add_handler(MessageHandler(Filters.photo, self.handle_photo))
    
    def start(self, update: Update, context: CallbackContext):
        """Обработчик команды /start"""
        welcome_text = """
🎫 Добро пожаловать в HelpDesk!

Отправьте сообщение с описанием проблемы, и я создам заявку.

Команды:
/help - показать помощь
        """
        update.message.reply_text(welcome_text)
    
    def help_command(self, update: Update, context: CallbackContext):
        """Обработчик команды /help"""
        help_text = """
📋 Как использовать бота:

1. Просто отправьте сообщение с описанием проблемы
2. Можете прикрепить фото или документ
3. Я создам заявку в системе
4. Ответы поддержки придут сюда же

🆔 Ваш Chat ID: {chat_id}
        """.format(chat_id=update.effective_chat.id)
        update.message.reply_text(help_text)
    
    def handle_message(self, update: Update, context: CallbackContext):
        """Обработчик текстовых сообщений"""
        try:
            chat_id = update.effective_chat.id
            user = update.effective_user
            message_id = update.message.message_id
            text = update.message.text
            
            # Получаем или создаем пользователя
            username = user.username or f"{user.first_name}_{user.id}"
            
            # Создаем заявку
            application = Application.objects.create(
                groups='telegram',
                team='Support Request',
                text=text,
                created_by_id=1,  # Системный пользователь
                telegram=True,
                chat_id=str(chat_id),
                messages_id=str(message_id),
                name=username
            )
            
            # Отправляем подтверждение
            confirmation = f"""
✅ Заявка создана!

🆔 Номер заявки: #{application.id}
📝 Описание: {text[:100]}{'...' if len(text) > 100 else ''}
⏰ Статус: {application.status}

Ответ поддержки придет в этот чат.
            """
            
            update.message.reply_text(confirmation)
            logger.info(f"Created ticket #{application.id} from Telegram user {username}")
            
        except Exception as e:
            logger.error(f"Error handling message: {e}")
            update.message.reply_text("❌ Произошла ошибка при создании заявки. Попробуйте позже.")
    
    def handle_photo(self, update: Update, context: CallbackContext):
        """Обработчик фотографий"""
        try:
            # Сначала обрабатываем как обычное сообщение
            self.handle_message(update, context)
            
            # Дополнительно можно сохранить фото
            # photo = update.message.photo[-1]  # Берем фото наибольшего размера
            # file = context.bot.get_file(photo.file_id)
            # ... сохранение фото
            
        except Exception as e:
            logger.error(f"Error handling photo: {e}")
    
    def run(self):
        """Запуск бота"""
        logger.info("Starting HelpDesk Telegram Bot...")
        logger.info(f"Bot token: {self.bot_token[:10]}...")
        
        # Запускаем polling
        self.updater.start_polling()
        logger.info("Bot is running! Press Ctrl+C to stop.")
        
        # Ждем до остановки
        self.updater.idle()

if __name__ == "__main__":
    try:
        bot = HelpDeskBot()
        bot.run()
    except KeyboardInterrupt:
        print("\n🛑 Bot stopped by user")
    except Exception as e:
        print(f"❌ Bot error: {e}")
        sys.exit(1)