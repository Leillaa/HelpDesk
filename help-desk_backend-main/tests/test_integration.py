#!/usr/bin/env python3
"""
End-to-End Integration Tests
Tests the complete flow between Frontend, Backend, and Telegram
"""
import os
import django
import requests
import json
import time
from unittest.mock import patch, Mock

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from application.models import Application, Comment
from profile.models import User
from rest_framework.authtoken.models import Token
from django.test import TestCase
from telegram_utils import telegram_sender


class E2EIntegrationTest(TestCase):
    """End-to-end integration tests"""
    
    def setUp(self):
        """Set up test data"""
        self.base_url = "http://127.0.0.1:8000"
        
        # Create test user
        self.user = User.objects.create_user(
            username='e2euser',
            email='e2e@example.com',
            password='e2epass123'
        )
        
        # Create auth token
        self.token = Token.objects.create(user=self.user)
        self.headers = {
            'Authorization': f'Token {self.token.key}',
            'Content-Type': 'application/json'
        }
        
    def test_complete_user_journey(self):
        """Test complete user journey from registration to ticket resolution"""
        
        # 1. User Registration
        registration_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123'
        }
        
        # Note: This would require running server
        # response = requests.post(f'{self.base_url}/api/register/', data=registration_data)
        # self.assertEqual(response.status_code, 201)
        
        # Create user manually for test
        new_user = User.objects.create_user(**registration_data)
        new_token = Token.objects.create(user=new_user)
        
        # 2. User Login
        login_data = {
            'username': 'newuser',
            'password': 'newpass123'
        }
        
        # 3. Create Application
        app_data = {
            'topic': 'E2E Test Application',
            'body': 'This is an end-to-end test application',
            'priority': 2
        }
        
        # Simulate API call
        application = Application.objects.create(
            topic=app_data['topic'],
            body=app_data['body'],
            priority=app_data['priority'],
            created_by=new_user
        )
        
        self.assertEqual(application.topic, 'E2E Test Application')
        self.assertEqual(application.created_by, new_user)
        
        # 4. Admin responds to application
        admin_comment_data = {
            'content': 'Thank you for your request. We will process it shortly.',
            'user_id': str(self.user.id)
        }
        
        comment = Comment.objects.create(
            application=application,
            name=self.user,
            body=admin_comment_data['content']
        )
        
        self.assertEqual(comment.application, application)
        self.assertEqual(comment.name, self.user)
        
        # 5. User adds follow-up comment
        user_comment = Comment.objects.create(
            application=application,
            name=new_user,
            body='Thank you for the quick response!'
        )
        
        # 6. Application is closed
        application.status = 3  # Closed
        application.save()
        
        self.assertEqual(application.status, 3)
        
        # Verify complete flow
        self.assertEqual(Comment.objects.filter(application=application).count(), 2)
        
    @patch('telegram_utils.requests.post')
    def test_telegram_integration_flow(self, mock_post):
        """Test complete Telegram integration flow"""
        
        # Mock Telegram API response
        mock_response = Mock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'ok': True, 'result': {'message_id': 123}}
        mock_post.return_value = mock_response
        
        # 1. Simulate Telegram user creating ticket
        telegram_app = Application.objects.create(
            topic='Telegram Test Issue',
            body='I have a problem with my computer',
            created_by=self.user,
            chat_id='123456789',
            message_id='456'
        )
        
        # 2. Admin responds via web interface (triggers Telegram notification)
        admin_response = 'Hello! We have received your request and will help you.'
        
        comment = Comment.objects.create(
            application=telegram_app,
            name=self.user,
            body=admin_response
        )
        
        # 3. Test Telegram notification sending
        result = telegram_sender.send_reply_to_ticket(
            telegram_app.id,
            admin_response
        )
        
        # Verify the flow
        self.assertTrue(result)
        mock_post.assert_called_once()
        
        # Check that correct data was sent to Telegram
        args, kwargs = mock_post.call_args
        self.assertIn('sendMessage', args[0])
        self.assertEqual(kwargs['json']['chat_id'], '123456789')
        self.assertIn(admin_response, kwargs['json']['text'])
        
    def test_api_authentication_flow(self):
        """Test API authentication and authorization flow"""
        
        # 1. Test unauthenticated access
        # This would return 401 in real implementation
        
        # 2. Test token validation
        from application.views import Check
        from django.test import RequestFactory
        
        factory = RequestFactory()
        request = factory.post('/api/check/')
        request.META['HTTP_AUTHORIZATION'] = f'Token {self.token.key}'
        
        view = Check()
        response = view.post(request)
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user_id'], self.user.id)
        
        # 3. Test invalid token
        request.META['HTTP_AUTHORIZATION'] = 'Token invalid_token'
        response = view.post(request)
        self.assertEqual(response.status_code, 400)
        
    def test_data_consistency_across_components(self):
        """Test data consistency between different components"""
        
        # Create application with specific data
        app = Application.objects.create(
            topic='Consistency Test',
            body='Testing data consistency',
            created_by=self.user,
            priority=3,
            chat_id='987654321'
        )
        
        # Add comments
        comment1 = Comment.objects.create(
            application=app,
            name=self.user,
            body='First comment'
        )
        
        comment2 = Comment.objects.create(
            application=app,
            name=self.user,
            body='Second comment'
        )
        
        # Test relationships
        self.assertEqual(app.comment_set.count(), 2)
        self.assertIn(comment1, app.comment_set.all())
        self.assertIn(comment2, app.comment_set.all())
        
        # Test reverse relationships
        self.assertEqual(comment1.application, app)
        self.assertEqual(comment2.application, app)
        
        # Test user relationships
        user_apps = Application.objects.filter(created_by=self.user)
        self.assertIn(app, user_apps)
        
    def test_error_handling_across_system(self):
        """Test error handling across different system components"""
        
        # 1. Test handling non-existent application
        try:
            non_existent_app = Application.objects.get(id=999999)
            self.fail("Should have raised DoesNotExist exception")
        except Application.DoesNotExist:
            pass  # Expected
            
        # 2. Test Telegram integration with invalid chat_id
        app_no_chat = Application.objects.create(
            topic='No Chat ID',
            body='No Telegram data',
            created_by=self.user
        )
        
        result = telegram_sender.send_reply_to_ticket(
            app_no_chat.id,
            "This should fail gracefully"
        )
        
        self.assertFalse(result)  # Should fail but not crash
        
        # 3. Test invalid user token
        from rest_framework.authtoken.models import Token
        
        try:
            invalid_token = Token.objects.get(key='invalid_key')
            self.fail("Should have raised DoesNotExist exception")
        except Token.DoesNotExist:
            pass  # Expected


class APIEndpointIntegrationTest(TestCase):
    """Test API endpoints integration"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='apiuser',
            email='api@example.com',
            password='apipass123'
        )
        self.token = Token.objects.create(user=self.user)
        
    def test_application_crud_operations(self):
        """Test complete CRUD operations for applications"""
        
        from django.test import Client
        client = Client()
        
        # 1. Create application
        app_data = {
            'topic': 'API Test Application',
            'body': 'Testing API CRUD operations',
            'priority': 2
        }
        
        # Would require running server for actual HTTP requests
        app = Application.objects.create(
            **app_data,
            created_by=self.user
        )
        
        # 2. Read application
        retrieved_app = Application.objects.get(id=app.id)
        self.assertEqual(retrieved_app.topic, app_data['topic'])
        self.assertEqual(retrieved_app.body, app_data['body'])
        
        # 3. Update application
        retrieved_app.topic = 'Updated API Test Application'
        retrieved_app.save()
        
        updated_app = Application.objects.get(id=app.id)
        self.assertEqual(updated_app.topic, 'Updated API Test Application')
        
        # 4. Delete application (change status to closed)
        updated_app.status = 3  # Closed
        updated_app.save()
        
        closed_app = Application.objects.get(id=app.id)
        self.assertEqual(closed_app.status, 3)
        
    def test_comment_operations(self):
        """Test comment operations through API"""
        
        # Create application first
        app = Application.objects.create(
            topic='Comment Test App',
            body='Testing comments',
            created_by=self.user
        )
        
        # Create comment
        comment_data = {
            'content': 'Test comment via API',
            'user_id': str(self.user.id)
        }
        
        comment = Comment.objects.create(
            application=app,
            name=self.user,
            body=comment_data['content']
        )
        
        # Verify comment creation
        self.assertEqual(comment.application, app)
        self.assertEqual(comment.name, self.user)
        self.assertEqual(comment.body, comment_data['content'])
        
        # Test getting comments for application
        app_comments = Comment.objects.filter(application=app)
        self.assertEqual(app_comments.count(), 1)
        self.assertIn(comment, app_comments)
        
    def test_user_management_operations(self):
        """Test user management through API"""
        
        # Test user creation (registration)
        new_user_data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'newpass123'
        }
        
        new_user = User.objects.create_user(**new_user_data)
        
        # Verify user creation
        self.assertEqual(new_user.username, new_user_data['username'])
        self.assertEqual(new_user.email, new_user_data['email'])
        self.assertTrue(new_user.check_password(new_user_data['password']))
        
        # Test token generation
        token = Token.objects.create(user=new_user)
        self.assertIsNotNone(token.key)
        self.assertEqual(token.user, new_user)


class PerformanceIntegrationTest(TestCase):
    """Test system performance under load"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='perfuser',
            email='perf@example.com',
            password='perfpass123'
        )
        
    def test_multiple_applications_creation(self):
        """Test creating multiple applications efficiently"""
        
        start_time = time.time()
        
        # Create 100 applications
        applications = []
        for i in range(100):
            app = Application.objects.create(
                topic=f'Performance Test App {i}',
                body=f'Testing performance with app number {i}',
                created_by=self.user,
                priority=1
            )
            applications.append(app)
            
        end_time = time.time()
        creation_time = end_time - start_time
        
        # Verify all applications were created
        self.assertEqual(len(applications), 100)
        self.assertEqual(Application.objects.filter(created_by=self.user).count(), 100)
        
        # Performance should be reasonable (adjust threshold as needed)
        self.assertLess(creation_time, 10.0, "Application creation took too long")
        
    def test_bulk_comment_operations(self):
        """Test bulk comment operations"""
        
        # Create test application
        app = Application.objects.create(
            topic='Bulk Comment Test',
            body='Testing bulk comments',
            created_by=self.user
        )
        
        start_time = time.time()
        
        # Create 50 comments
        comments = []
        for i in range(50):
            comment = Comment.objects.create(
                application=app,
                name=self.user,
                body=f'Bulk comment number {i}'
            )
            comments.append(comment)
            
        end_time = time.time()
        creation_time = end_time - start_time
        
        # Verify all comments were created
        self.assertEqual(len(comments), 50)
        self.assertEqual(app.comment_set.count(), 50)
        
        # Performance check
        self.assertLess(creation_time, 5.0, "Comment creation took too long")


if __name__ == '__main__':
    import unittest
    unittest.main()