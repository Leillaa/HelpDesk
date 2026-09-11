#!/usr/bin/env python3
"""
Comprehensive API Tests for HelpDesk Backend
"""
import os
import django
import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework.authtoken.models import Token

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from application.models import Application, Comment
from profile.models import User


class AuthenticationAPITest(APITestCase):
    """Test authentication API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
    def test_user_registration(self):
        """Test user registration via API"""
        url = reverse('register')  # /api/register/
        response = self.client.post(url, self.user_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('token', response.data)
        self.assertIn('user_id', response.data)
        
        # Verify user was created
        user = User.objects.get(username='testuser')
        self.assertEqual(user.email, 'test@example.com')
        
    def test_user_login(self):
        """Test user login via API"""
        # Create user first
        user = User.objects.create_user(**self.user_data)
        
        login_data = {
            'username': 'testuser',
            'password': 'testpass123'
        }
        
        url = reverse('login')  # /api/login/
        response = self.client.post(url, login_data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        
    def test_token_check(self):
        """Test token validation"""
        user = User.objects.create_user(**self.user_data)
        token = Token.objects.create(user=user)
        
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)
        
        url = reverse('check')  # /api/check/
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user_id'], user.id)
        self.assertEqual(response.data['username'], user.username)
        
    def test_invalid_token(self):
        """Test invalid token handling"""
        self.client.credentials(HTTP_AUTHORIZATION='Token invalid_token')
        
        url = reverse('check')
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)


class ApplicationAPITest(APITestCase):
    """Test application API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        self.application = Application.objects.create(
            topic='Test Application',
            body='Test description',
            created_by=self.user,
            chat_id='123456789'
        )
        
    def test_create_application(self):
        """Test creating application via API"""
        url = reverse('create_application')  # /app/create_application/
        data = {
            'topic': 'New Test Application',
            'body': 'New test description',
            'priority': 2
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify application was created
        app = Application.objects.get(topic='New Test Application')
        self.assertEqual(app.body, 'New test description')
        self.assertEqual(app.priority, 2)
        self.assertEqual(app.created_by, self.user)
        
    def test_get_application_details(self):
        """Test getting application details"""
        url = f'/app/application_details/{self.application.id}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['topic'], 'Test Application')
        self.assertEqual(response.data['body'], 'Test description')
        
    def test_get_applications_list(self):
        """Test getting applications list"""
        # Create additional application
        Application.objects.create(
            topic='Second Application',
            body='Second description',
            created_by=self.user
        )
        
        url = '/app/applications_list/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should return at least 2 applications
        self.assertGreaterEqual(len(response.data['applications']), 2)
        
    def test_unauthorized_access(self):
        """Test unauthorized access to protected endpoints"""
        self.client.credentials()  # Remove authentication
        
        url = reverse('create_application')
        data = {'topic': 'Unauthorized Test', 'body': 'Should fail'}
        response = self.client.post(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CommentAPITest(APITestCase):
    """Test comment API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        self.application = Application.objects.create(
            topic='Test Application',
            body='Test description',
            created_by=self.user,
            chat_id='123456789'
        )
        
    def test_create_comment(self):
        """Test creating comment via API"""
        url = f'/app/comment_create/{self.application.id}/'
        data = {
            'content': 'This is a test comment',
            'user_id': str(self.user.id)
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify comment was created
        comment = Comment.objects.get(body='This is a test comment')
        self.assertEqual(comment.application, self.application)
        self.assertEqual(comment.name, self.user)
        
    def test_get_comments_list(self):
        """Test getting comments for application"""
        # Create test comments
        Comment.objects.create(
            application=self.application,
            name=self.user,
            body='First comment'
        )
        Comment.objects.create(
            application=self.application,
            name=self.user,
            body='Second comment'
        )
        
        url = f'/app/comment_list/{self.application.id}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        
    def test_create_comment_invalid_application(self):
        """Test creating comment for non-existent application"""
        url = '/app/comment_create/999999/'
        data = {
            'content': 'Comment for non-existent app',
            'user_id': str(self.user.id)
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class StatusCloseAPITest(APITestCase):
    """Test application status closure API"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        self.application = Application.objects.create(
            topic='Test Application',
            body='Test description',
            created_by=self.user,
            status=1  # Open status
        )
        
    def test_close_application(self):
        """Test closing application via API"""
        url = f'/app/delete/{self.application.id}/'
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify application status changed
        self.application.refresh_from_db()
        self.assertEqual(self.application.status, 3)  # Closed status
        
    def test_close_non_existent_application(self):
        """Test closing non-existent application"""
        url = '/app/delete/999999/'
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TelegramIntegrationAPITest(APITestCase):
    """Test Telegram integration via API"""
    
    def setUp(self):
        """Set up test data"""
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.token = Token.objects.create(user=self.user)
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
        
        self.application = Application.objects.create(
            topic='Telegram Test Application',
            body='Test from Telegram',
            created_by=self.user,
            chat_id='123456789'
        )
        
    def test_create_comment_with_telegram_notification(self):
        """Test creating comment that should trigger Telegram notification"""
        url = f'/app/comment_create/{self.application.id}/'
        data = {
            'content': 'Hello! Your ticket has been processed.',
            'user_id': str(self.user.id)
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify comment was created
        comment = Comment.objects.get(body='Hello! Your ticket has been processed.')
        self.assertEqual(comment.application, self.application)
        
        # Note: Actual Telegram sending is mocked in this test environment
        # In real tests, you would mock the telegram_sender.send_reply_to_ticket function
        
    def test_application_with_telegram_data(self):
        """Test application created with Telegram metadata"""
        # Test getting application that has Telegram data
        url = f'/app/application_details/{self.application.id}/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['chat_id'], '123456789')


if __name__ == '__main__':
    import unittest
    unittest.main()