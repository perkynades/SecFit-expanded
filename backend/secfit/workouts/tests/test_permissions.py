from itertools import permutations
from django.test import TestCase, RequestFactory, Client
from workouts.permissions import IsOwner, IsOwnerOfWorkout, IsCoachAndVisibleToCoach, IsCoachOfWorkoutAndVisibleToCoach, IsPublic, IsWorkoutPublic, IsReadOnly
from workouts.models import Workout, Exercise, ExerciseInstance
from users.models import User
import json


class IsOwnerTestSuite(TestCase):
    def setUp(self):
        self.user1 = User.objects.create(username="ultimate_br0")
        self.user2 = User.objects.create(username="gigachad40", coach=self.user1)
    
    def test_user_should_be_owner(self):
        request = RequestFactory().get('/')
        request.user = self.user1

        workout = Workout.objects.create(
            name="biceps-blaster", 
            date="2022-03-07T00:00:00Z", 
            notes="Cruched it brah",
            owner=self.user1,
            visibility="PU"
        )

        self.assertTrue(IsOwner().has_object_permission(request, None, workout))