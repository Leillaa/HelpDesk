#!/usr/bin/env python3
"""
Telegram Bot Integration Tests
"""
import os
import django
import unittest
from unittest.mock import patch, MagicMock, Mock
import json

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from application.models import Application, Comment
from profile.models import User
from telegram_utils import telegram_sender


class TelegramUtilsTest(unittest.TestCase):
    """Test Telegram utilities"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='telegramuser',
            email='telegram@example.com',
            password='telepass123'
        )
        
        self.application = Application.objects.create(
            topic='Telegram Test',
            body='Test from bot',
            created_by=self.user,
            chat_id='123456789'
        )
        
    @patch('telegram_utils.requests.post')
    def test_send_reply_to_ticket_success(self, mock_post):
        """Test successful reply sending to Telegram"""
        # Mock successful Telegram API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'ok': True, 'result': {'message_id': 123}}
        mock_post.return_value = mock_response
        
        # Test sending reply
        result = telegram_sender.send_reply_to_ticket(
            self.application.id, 
            "Hello! Your ticket has been processed."
        )
        
        self.assertTrue(result)
        mock_post.assert_called_once()
        
        # Check that the call was made with correct parameters
        args, kwargs = mock_post.call_args
        self.assertIn('sendMessage', args[0])  # URL contains sendMessage
        self.assertEqual(kwargs['json']['chat_id'], '123456789')
        self.assertIn('Hello! Your ticket has been processed.', kwargs['json']['text'])
        
    @patch('telegram_utils.requests.post')
    def test_send_reply_to_ticket_failure(self, mock_post):
        """Test failed reply sending to Telegram"""
        # Mock failed Telegram API response
        mock_response = Mock()
        mock_response.status_code = 400
        mock_response.json.return_value = {'ok': False, 'description': 'Bad Request'}
        mock_post.return_value = mock_response
        
        # Test sending reply
        result = telegram_sender.send_reply_to_ticket(
            self.application.id, 
            "This should fail"
        )
        
        self.assertFalse(result)
        
    def test_send_reply_no_chat_id(self):
        """Test sending reply when application has no chat_id"""
        app_without_chat = Application.objects.create(
            topic='No Chat ID',
            body='No Telegram data',
            created_by=self.user
            # no chat_id
        )
        
        result = telegram_sender.send_reply_to_ticket(
            app_without_chat.id, 
            "This should fail - no chat ID"
        )
        
        self.assertFalse(result)
        
    def test_send_reply_nonexistent_application(self):
        """Test sending reply to non-existent application"""
        result = telegram_sender.send_reply_to_ticket(
            999999, 
            "This should fail - no app"
        )
        
        self.assertFalse(result)


class TelegramBotTest(unittest.TestCase):
    """Test Telegram bot functionality"""
    
    def setUp(self):
        """Set up test data"""
        # Import bot functions
        import sys
        sys.path.append('/Users/leilachernova/Desktop/Работа/Програмирование/helpdesk2')
        
        try:
            from working_bot import handle_start, handle_help, create_ticket, add_comment_to_ticket
            self.handle_start = handle_start
            self.handle_help = handle_help
            self.create_ticket = create_ticket
            self.add_comment_to_ticket = add_comment_to_ticket
        except ImportError as e:
            self.skipTest(f"Bot module not available: {e}")
            
    @patch('working_bot.send_message')
    def test_handle_start_command(self, mock_send):
        """Test /start command handling"""
        mock_send.return_value = True
        
        # Mock message object
        message = {
            'chat': {'id': 123456},
            'from': {'first_name': 'Test', 'username': 'testuser'}
        }
        
        result = self.handle_start(message)
        
        # Check that send_message was called
        mock_send.assert_called_once()
        args, kwargs = mock_send.call_args
        
        self.assertEqual(args[0], 123456)  # chat_id
        self.assertIn('Welcome', args[1])  # welcome message
        self.assertIn('English', args[1])  # should be in English
        
    @patch('working_bot.send_message')
    def test_handle_help_command(self, mock_send):
        """Test /help command handling"""
        mock_send.return_value = True
        
        message = {
            'chat': {'id': 123456},
            'from': {'first_name': 'Test', 'username': 'testuser'}
        }
        
        result = self.handle_help(message)
        
        mock_send.assert_called_once()
        args, kwargs = mock_send.call_args
        
        self.assertEqual(args[0], 123456)
        self.assertIn('help', args[1].lower())
        self.assertIn('commands', args[1].lower())
        
    @patch('working_bot.send_message')
    def test_create_ticket_from_telegram(self, mock_send):
        """Test ticket creation from Telegram message"""
        mock_send.return_value = True
        
        message = {
            'chat': {'id': 987654321},
            'from': {'first_name': 'TelegramUser', 'username': 'tguser'},
            'text': 'I have a problem with my computer',
            'message_id': 456
        }
        
        # Count applications before
        initial_count = Application.objects.count()
        
        result = self.create_ticket(message)
        
        # Check that application was created
        final_count = Application.objects.count()
        self.assertEqual(final_count, initial_count + 1)
        
        # Check the created application
        app = Application.objects.latest('created_at')
        self.assertEqual(app.chat_id, '987654321')
        self.assertEqual(app.message_id, '456')
        self.assertIn('computer', app.body)
        
        # Check that confirmation message was sent
        mock_send.assert_called()
        
    def test_user_state_management(self):
        """Test user state management in bot"""
        # This would test the bot's ability to track conversation state
        # For now, this is a placeholder for more complex state tests
        pass


class TelegramIntegrationE2ETest(unittest.TestCase):
    """End-to-end Telegram integration tests"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='e2euser',
            email='e2e@example.com',
            password='e2epass123'
        )
        
    @patch('telegram_utils.requests.post')
    @patch('working_bot.send_message')
    def test_full_ticket_lifecycle(self, mock_bot_send, mock_api_post):
        """Test complete ticket lifecycle with Telegram"""
        # Mock Telegram API responses
        mock_api_response = Mock()
        mock_api_response.status_code = 200
        mock_api_response.json.return_value = {'ok': True, 'result': {'message_id': 123}}
        mock_api_post.return_value = mock_api_response
        
        mock_bot_send.return_value = True
        
        # 1. User sends message to bot (creates ticket)
        message = {
            'chat': {'id': 111222333},
            'from': {'first_name': 'E2EUser', 'username': 'e2euser'},
            'text': 'My laptop is not working properly',
            'message_id': 789
        }
        
        # Import and use bot function
        try:
            import sys
            sys.path.append('/Users/leilachernova/Desktop/Работа/Програмирование/helpdesk2')
            from working_bot import create_ticket
            
            create_ticket(message)
            
            # 2. Verify ticket was created
            app = Application.objects.get(chat_id='111222333')
            self.assertIn('laptop', app.body)
            
            # 3. Admin adds comment (should trigger Telegram notification)
            comment = Comment.objects.create(
                application=app,
                name=self.user,
                body='Hello! We have received your request and will help you soon.'
            )
            
            # 4. Test sending reply via telegram_utils
            result = telegram_sender.send_reply_to_ticket(
                app.id,
                'Hello! We have received your request and will help you soon.'
            )
            
            # 5. Verify the flow worked
            self.assertTrue(result)
            mock_api_post.assert_called()
            
        except ImportError:
            self.skipTest("Bot module not available for E2E test")
            
    def test_multiple_users_isolation(self):
        """Test that multiple Telegram users don't interfere with each other"""
        # Create applications for different users
        app1 = Application.objects.create(
            topic='User 1 Issue',
            body='Issue from user 1',
            created_by=self.user,
            chat_id='111111111'
        )
        
        app2 = Application.objects.create(
            topic='User 2 Issue',
            body='Issue from user 2',
            created_by=self.user,
            chat_id='222222222'
        )
        
        # Test that replies go to correct users
        with patch('telegram_utils.requests.post') as mock_post:
            mock_response = Mock()
            mock_response.status_code = 200
            mock_response.json.return_value = {'ok': True}
            mock_post.return_value = mock_response
            
            # Send reply to user 1
            telegram_sender.send_reply_to_ticket(app1.id, "Reply to user 1")
            
            # Check that the correct chat_id was used
            args, kwargs = mock_post.call_args
            self.assertEqual(kwargs['json']['chat_id'], '111111111')


if __name__ == '__main__':
    unittest.main()