from typing_extensions import Self
from django.test import TestCase, RequestFactory, Client
from backend.secfit.users.serializers import UserPutSerializer
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
    
    def test_users_pasword_should_not_be_valid(self):
        user_serializer = UserSerializer(data = { 
            'password': self.password,
            'password1': 'NotevenremotlyCl0seToOrigPass'
        })

        self.assertRaises(
            serializers.ValidationError, 
            user_serializer.validate_password, 
            self.password
        )
    
    def test_a_user_should_be_able_to_be_created(self):
        user_data = {
            'email': 'chad@progym.se',
            'username': 'gigachad420',
            'password': self.password,
            'phone_number': 123456789,
            'country': 'Sweden',
            'city': 'Stockholm',
            'street_address': 'Arlanda 43'
        }

        user_serializer = UserSerializer(data=user_data)

        user = user_serializer.create(user_data) 
        self.assertEqual(user.username, user_data['username'])
        self.assertEqual(user.email, user_data['email'])
        self.assertEqual(user.phone_number, user_data['phone_number'])
        self.assertEqual(user.country, user_data['country'])
        self.assertEqual(user.city, user_data['city'])
        self.assertEqual(user.street_address, user_data['street_address'])

    def test_a_user_should_be_able_to_be_updated(self):
        user_data = {
            'email': 'chad@progym.se',
            'username': 'gigachad420',
            'password': self.password,
            'phone_number': 123456789,
            'country': 'Sweden',
            'city': 'Stockholm',
            'street_address': 'Arlanda 43'
        }
        
        serializer = UserPutSerializer(data=user_data)

        user = serializer.update(user_data, user_data)
        self.assertEqual(user.username, user_data['username'])
        self.assertEqual(user.email, user_data['email'])
        self.assertEqual(user.phone_number, user_data['phone_number'])
        self.assertEqual(user.country, user_data['country'])
        self.assertEqual(user.city, user_data['city'])
        self.assertEqual(user.street_address, user_data['street_address'])

