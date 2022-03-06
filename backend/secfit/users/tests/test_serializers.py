from typing_extensions import Self
from django.test import TestCase, RequestFactory, Client
from users.serializers import UserSerializer
from users.models import User, AthleteFile
from rest_framework import serializers

class UserSerializerTestSuite(TestCase):
    def setUp(self):
        self.password = 'superDuperSecurePassword'
    
    def test_users_password_should_be_valid(self):
        user_serializer = UserSerializer(data = { 
            'password': self.password,
            'password1': self.password
        })

        self.assertEqual(user_serializer.validate_password(self.password), self.password)