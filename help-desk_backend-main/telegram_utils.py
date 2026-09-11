"""
Утилиты для отправки сообщений в Telegram
"""
import requests
import os
from django.conf import settings
from application.models import Application


class TelegramSender:
    def __init__(self):
        self.bot_token = settings.BOT_TOKEN
        self.api_url = f"https://api.telegram.org/bot{self.bot_token}"
        
    def send_message(self, chat_id, text, parse_mode='HTML'):
        """Отправить текстовое сообщение"""
        url = f"{self.api_url}/sendMessage"
        data = {
            'chat_id': chat_id,
            'text': text,
            'parse_mode': parse_mode
        }
        
        try:
            response = requests.post(url, data=data)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"❌ Error sending message: {response.status_code} - {response.text}")
                return None
        except Exception as e:
            print(f"❌ Exception sending message: {e}")
            return None
    
    def send_photo(self, chat_id, photo_path, caption=None):
        """Отправить фото с подписью"""
        url = f"{self.api_url}/sendPhoto"
        
        try:
            with open(photo_path, 'rb') as photo:
                files = {'photo': photo}
                data = {
                    'chat_id': chat_id,
                    'caption': caption,
                    'parse_mode': 'HTML'
                }
                
                response = requests.post(url, files=files, data=data)
                if response.status_code == 200:
                    return response.json()
                else:
                    print(f"❌ Error sending photo: {response.status_code} - {response.text}")
                    return None
        except Exception as e:
            print(f"❌ Exception sending photo: {e}")
            return None
    
    def send_reply_to_ticket(self, application_id, comment_text, attachments=None):
        """Send reply to ticket in Telegram"""
        try:
            application = Application.objects.get(id=application_id)
            
            # Check if ticket was created via Telegram
            if not application.telegram or not application.chat_id:
                print(f"📝 Application {application_id} was not created via Telegram")
                return False
                
            # Format reply text
            reply_text = f"""
🔔 <b>Reply to ticket #{application.id}</b>

📝 <b>Subject:</b> {application.team}
💬 <b>Support response:</b>
{comment_text}

📅 <b>Response time:</b> {application.updated.strftime('%d.%m.%Y %H:%M')}
            """
            
            # Send text reply
            result = self.send_message(application.chat_id, reply_text)
            
            # If there are attached files, send them
            if attachments:
                for attachment in attachments:
                    if attachment.image and os.path.exists(attachment.image.path):
                        caption = f"📎 Attached file for ticket #{application.id}"
                        self.send_photo(application.chat_id, attachment.image.path, caption)
            
            print(f"✅ Reply sent to Telegram for ticket #{application_id}")
            return True
            
        except Application.DoesNotExist:
            print(f"❌ Application {application_id} not found")
            return False
        except Exception as e:
            print(f"❌ Error sending reply to ticket {application_id}: {e}")
            return False


# Глобальный экземпляр для использования в views
telegram_sender = TelegramSender()