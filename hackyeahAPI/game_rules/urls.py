from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameRulesViewSet

# Tworzymy router i rejestrujemy nasz viewset
router = DefaultRouter()
router.register(r'game-rules', GameRulesViewSet, basename='gamerules')

# URL-e API są teraz automatycznie generowane przez router
urlpatterns = [
    path('', include(router.urls)),
]
