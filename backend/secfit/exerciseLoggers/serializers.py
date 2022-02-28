from rest_framework import serializers
from rest_framework.serializers import HyperlinkedRelatedField
from exerciseLoggers.models import ExerciseLogger

class ExerciseLoggerSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ExerciseLogger
        fields = [
            "url",
            "id",
            "fitnessCenter",
            "loggedExercise",
            "owner"
        ]
        extra_kwargs = {"owner": {"read_only": True}}
    
    def create(self, validated_data):
        return ExerciseLogger.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.fitnessCenter = validated_data.get("fitnessCenter", instance.fitnessCenter)
        instance.loggedExercise = validated_data.get("loggedExercise", instance.loggedExercise)
        instance.save()

        return instance