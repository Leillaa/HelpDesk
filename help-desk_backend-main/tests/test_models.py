#!/usr/bin/env python3
"""
Comprehensive Model Tests for HelpDesk Backend
"""
import os
import django
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

# Django setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from application.models import Application, Comment, Attachment, Attachment_comment
from profile.models import User


class ApplicationModelTest(TestCase):
    """Test Application model functionality"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
    def test_application_creation(self):
        """Test creating an application"""
        app = Application.objects.create(
            topic='Test Issue',
            body='This is a test issue description',
            created_by=self.user,
            chat_id='123456789'
        )
        
        self.assertEqual(app.topic, 'Test Issue')
        self.assertEqual(app.body, 'This is a test issue description')
        self.assertEqual(app.created_by, self.user)
        self.assertEqual(app.chat_id, '123456789')
        self.assertEqual(app.priority, 1)  # Default priority
        self.assertIsNotNone(app.created_at)
        
    def test_application_str_method(self):
        """Test application string representation"""
        app = Application.objects.create(
            topic='Test Issue',
            body='Test description',
            created_by=self.user
        )
        
        self.assertEqual(str(app), 'Test Issue')
        
    def test_application_telegram_fields(self):
        """Test Telegram-specific fields"""
        app = Application.objects.create(
            topic='Telegram Issue',
            body='Issue from Telegram',
            created_by=self.user,
            chat_id='987654321',
            message_id='12345'
        )
        
        self.assertEqual(app.chat_id, '987654321')
        self.assertEqual(app.message_id, '12345')
        
    def test_application_priority_choices(self):
        """Test priority choices validation"""
        # Valid priorities: 1, 2, 3
        for priority in [1, 2, 3]:
            app = Application.objects.create(
                topic=f'Priority {priority} Issue',
                body='Test description',
                created_by=self.user,
                priority=priority
            )
            self.assertEqual(app.priority, priority)


class CommentModelTest(TestCase):
    """Test Comment model functionality"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.application = Application.objects.create(
            topic='Test Application',
            body='Test description',
            created_by=self.user
        )
        
    def test_comment_creation(self):
        """Test creating a comment"""
        comment = Comment.objects.create(
            application=self.application,
            name=self.user,
            body='This is a test comment'
        )
        
        self.assertEqual(comment.application, self.application)
        self.assertEqual(comment.name, self.user)
        self.assertEqual(comment.body, 'This is a test comment')
        self.assertIsNotNone(comment.created_at)
        
    def test_comment_str_method(self):
        """Test comment string representation"""
        comment = Comment.objects.create(
            application=self.application,
            name=self.user,
            body='Test comment'
        )
        
        expected_str = f"Comment by {self.user.username} on {self.application.topic}"
        self.assertEqual(str(comment), expected_str)
        
    def test_comment_application_relationship(self):
        """Test comment-application relationship"""
        comment1 = Comment.objects.create(
            application=self.application,
            name=self.user,
            body='First comment'
        )
        
        comment2 = Comment.objects.create(
            application=self.application,
            name=self.user,
            body='Second comment'
        )
        
        # Test reverse relationship
        app_comments = self.application.comment_set.all()
        self.assertEqual(app_comments.count(), 2)
        self.assertIn(comment1, app_comments)
        self.assertIn(comment2, app_comments)


class UserModelTest(TestCase):
    """Test User model functionality"""
    
    def test_user_creation(self):
        """Test creating a user"""
        user = User.objects.create_user(
            username='newuser',
            email='newuser@example.com',
            password='newpass123'
        )
        
        self.assertEqual(user.username, 'newuser')
        self.assertEqual(user.email, 'newuser@example.com')
        self.assertTrue(user.check_password('newpass123'))
        self.assertIsNotNone(user.token)  # Check that token is generated
        
    def test_user_str_method(self):
        """Test user string representation"""
        user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertEqual(str(user), 'testuser')
        
    def test_user_token_generation(self):
        """Test that token is automatically generated"""
        user = User.objects.create_user(
            username='tokenuser',
            email='token@example.com',
            password='tokenpass123'
        )
        
        self.assertIsNotNone(user.token)
        self.assertTrue(len(user.token) > 20)  # Token should be a reasonable length


class AttachmentModelTest(TestCase):
    """Test Attachment model functionality"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.application = Application.objects.create(
            topic='Test Application',
            body='Test description',
            created_by=self.user
        )
        
    def test_attachment_creation(self):
        """Test creating an attachment"""
        attachment = Attachment.objects.create(
            application=self.application,
            image='test_image.jpg'
        )
        
        self.assertEqual(attachment.application, self.application)
        self.assertEqual(attachment.image, 'test_image.jpg')
        
    def test_attachment_application_relationship(self):
        """Test attachment-application relationship"""
        attachment = Attachment.objects.create(
            application=self.application,
            image='test_image.jpg'
        )
        
        # Test reverse relationship
        app_attachments = self.application.attachment_set.all()
        self.assertEqual(app_attachments.count(), 1)
        self.assertIn(attachment, app_attachments)


class AttachmentCommentModelTest(TestCase):
    """Test Attachment_comment model functionality"""
    
    def setUp(self):
        """Set up test data"""
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        self.application = Application.objects.create(
            topic='Test Application',
            body='Test description',
            created_by=self.user
        )
        
        self.comment = Comment.objects.create(
            application=self.application,
            name=self.user,
            body='Test comment'
        )
        
    def test_attachment_comment_creation(self):
        """Test creating an attachment for comment"""
        attachment = Attachment_comment.objects.create(
            comment=self.comment,
            image='comment_image.jpg'
        )
        
        self.assertEqual(attachment.comment, self.comment)
        self.assertEqual(attachment.image, 'comment_image.jpg')
        
    def test_attachment_comment_relationship(self):
        """Test attachment-comment relationship"""
        attachment = Attachment_comment.objects.create(
            comment=self.comment,
            image='comment_image.jpg'
        )
        
        # Test reverse relationship
        comment_attachments = self.comment.attachment_comment_set.all()
        self.assertEqual(comment_attachments.count(), 1)
        self.assertIn(attachment, comment_attachments)


if __name__ == '__main__':
    import unittest
    unittest.main()