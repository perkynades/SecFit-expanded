from itertools import permutations
from django.test import TestCase, RequestFactory, Client
from workouts.permissions import IsOwner, IsOwnerOfWorkout, IsCoachAndVisibleToCoach, IsCoachOfWorkoutAndVisibleToCoach, IsPublic, IsWorkoutPublic, IsReadOnly
from workouts.models import Workout, Exercise, ExerciseInstance
from users.models import User
import json


class IsOwnerTestSuite(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="ultimate_br0")
        self.workout = Workout.objects.create(
            name="biceps-blaster", 
            date="2022-03-07T00:00:00Z", 
            notes="Cruched it brah",
            owner=self.user,
            visibility="PU"
        )

    def test_user_should_be_owner(self):
        request = RequestFactory().get('/')
        request.user = self.user

        self.assertTrue(IsOwner().has_object_permission(request, None, self.workout))

class IsOwnerOfWorkoutTestSuite(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="ultimate_br0")
        self.workout = Workout.objects.create(
            name="biceps-blaster", 
            date="2022-03-07T00:00:00Z", 
            notes="Cruched it brah",
            owner=self.user,
            visibility="PU"
        )
    
    def test_user_should_be_owner_of_workout(self):
        request = RequestFactory().get('/')
        request.user = self.user

        exercise = Exercise.objects.create(
            name="Biceps curl", 
            description="just curl the biceps", 
            unit="reps"
        )
        exercise_instance = ExerciseInstance.objects.create(
            workout=self.workout, 
            exercise=exercise, 
            sets=3,
            number=12
        )
        
        self.assertTrue(IsOwnerOfWorkout().has_object_permission(request, None, exercise_instance))
    
    def test_on_get_user_should_be_owner_of_workout(self):
        request = RequestFactory().get('/')
        request.user = self.user
        request.data = { 'workout' : '/api/workouts/1/' }

        self.assertTrue(IsOwnerOfWorkout().has_permission(request, None))
    
    def test_on_post_user_should_be_owner_of_workout(self):
        request = RequestFactory().post('/')
        request.user = self.user
        request.data = { 'workout': '/api/workouts/1/' }

        self.assertTrue(IsOwnerOfWorkout().has_permission(request, None))
    
    def test_user_should_not_have_permission_to_post_empty_workout(self):
        request = RequestFactory().post('/')
        request.user = self.user
        request.data = { 'workout': None }

        self.assertFalse(IsOwnerOfWorkout().has_permission(request, None))

class IsCoachAndVisibleToCoachTestSuite(TestCase):
    def setUp(self):
        self.coach_user = User.objects.create(username="ultimate_br0")
    
    def test_user_should_be_coach_and_visible_to_a_coach(self):
        request = RequestFactory().get('/')
        request.user = self.coach_user

        user = User.objects.create(username="gigachad420", coach=self.coach_user)

        workout = Workout.objects.create(
            name="biceps-blaster", 
            date="2022-03-07T00:00:00Z", 
            notes="Cruched it brah",
            owner=user,
            visibility="PU"
        )

        self.assertTrue(IsCoachAndVisibleToCoach().has_object_permission(request, None, workout))

class IsCoachOfWorkoutAndVisibleToCoachTestSuite(TestCase):
    def setUp(self):
        self.coach_user = User.objects.create(username="ultimate_br0")

    def test_user_should_be_coach_of_workout_and_visible_to_a_coach(self):
        request = RequestFactory().get('/')
        request.user = self.coach_user

        user = User.objects.create(username="gigachad420", coach=self.coach_user)

        workout = Workout.objects.create(
            name="biceps-blaster", 
            date="2022-03-07T00:00:00Z", 
            notes="Cruched it brah",
            owner=user,
            visibility="PU"
        )

        exercise = Exercise.objects.create(
            name="Biceps curl", 
            description="just curl the biceps", 
            unit="reps"
        )
        exercise_instance = ExerciseInstance.objects.create(
            workout=self.workout, 
            exercise=exercise, 
            sets=3,
            number=12
        )

        self.assertTrue(IsCoachOfWorkoutAndVisibleToCoach().has_object_permission(request, None, exercise_instance))
