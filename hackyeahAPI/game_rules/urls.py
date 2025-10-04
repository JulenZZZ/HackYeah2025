from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameScenarioViewSet, EducationLevelViewSet, JobViewSet, HobbyViewSet, EventViewSet

router = DefaultRouter()
router.register(r'scenarios', GameScenarioViewSet)
router.register(r'education-levels', EducationLevelViewSet)
router.register(r'jobs', JobViewSet)
router.register(r'hobbies', HobbyViewSet)
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
