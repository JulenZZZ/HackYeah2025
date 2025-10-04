from rest_framework import serializers
from .models import GameScenario, EducationLevel, Job, Hobby, Event

class GameScenarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameScenario
        fields = '__all__'

class EducationLevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = EducationLevel
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    class Meta:
        model = Job
        fields = '__all__'

class HobbySerializer(serializers.ModelSerializer):
    class Meta:
        model = Hobby
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'
