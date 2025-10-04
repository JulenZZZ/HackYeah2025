from rest_framework import viewsets
from .models import GameScenario, EducationLevel, Job, Hobby, Event
from .serializers import GameScenarioSerializer, EducationLevelSerializer, JobSerializer, HobbySerializer, EventSerializer

class GameScenarioViewSet(viewsets.ModelViewSet):
    queryset = GameScenario.objects.all()
    serializer_class = GameScenarioSerializer

class EducationLevelViewSet(viewsets.ModelViewSet):
    queryset = EducationLevel.objects.all()
    serializer_class = EducationLevelSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer

class HobbyViewSet(viewsets.ModelViewSet):
    queryset = Hobby.objects.all()
    serializer_class = HobbySerializer

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
