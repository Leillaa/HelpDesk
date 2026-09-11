"""
Telegram Bot Webhook Handler
"""

import json
import logging
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.utils.decorators import method_decorator
from django.views import View
import pika
from .models import Application, User

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class TelegramWebhookView(View):
    """Handle incoming Telegram webhooks"""
    
    def post(self, request):
        try:
            # Parse incoming webhook data
            data = json.loads(request.body)
            
            # Extract message data
            message = data.get('message', {})
            chat = message.get('chat', {})
            user = message.get('from', {})
            text = message.get('text', '')
            
            # Basic info
            chat_id = chat.get('id')
            user_id = user.get('id')
            username = user.get('username', user.get('first_name', 'Unknown'))
            message_id = message.get('message_id')
            
            if not chat_id or not text:
                return HttpResponse('OK')
            
            # Send to RabbitMQ for processing
            self.send_to_queue({
                'chat_id': chat_id,
                'user_id': user_id, 
                'username': username,
                'message_id': message_id,
                'text': text,
                'type': 'telegram_message'
            })
            
            return HttpResponse('OK')
            
        except Exception as e:
            logger.error(f"Webhook error: {e}")
            return HttpResponse('Error', status=500)
    
    def send_to_queue(self, message_data):
        """Send message to RabbitMQ queue"""
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
            channel = connection.channel()
            channel.queue_declare(queue='telegram_messages')
            
            channel.basic_publish(
                exchange='',
                routing_key='telegram_messages',
                body=json.dumps(message_data)
            )
            connection.close()
            
        except Exception as e:
            logger.error(f"Queue error: {e}")


@csrf_exempt 
@require_POST
def telegram_webhook(request):
    """Simple webhook handler"""
    try:
        data = json.loads(request.body)
        
        # Log incoming message for debugging
        logger.info(f"Telegram webhook: {data}")
        
        # Process the message (simplified)
        message = data.get('message', {})
        if message:
            chat_id = message.get('chat', {}).get('id')
            text = message.get('text', '')
            
            # Here you could create a ticket directly
            # or send to RabbitMQ for processing
            
        return HttpResponse('OK')
        
    except Exception as e:
        logger.error(f"Webhook error: {e}")
        return HttpResponse('Error', status=500)