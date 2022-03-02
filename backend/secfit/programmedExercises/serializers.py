from rest_framework import serializers
from rest_framework.serializers import HyperlinkedRelatedField
from programmedExercises.models import ProgrammedExercise

class ProgrammedExerciseSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = ProgrammedExercise
        fields = [
            "url",
            "id",
            "terrain",
            "length",
            "speed",
            "owner"
        ]
        extra_kwargs = {"owner": {"read_only": True}}
    
    def create(self, validated_data):
        return ProgrammedExercise.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        instance.terrain = validated_data.get("terrain", instance.terrain)
        instance.length = validated_data.get("length", instance.length)
        instance.speed = validated_data.get("speed", instance.speed)
        instance.save()

        return instance