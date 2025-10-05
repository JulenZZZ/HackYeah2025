from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GameRulesViewSet

router = DefaultRouter()
router.register(r'game-rules', GameRulesViewSet, basename='gamerules')

urlpatterns = [
    path('', include(router.urls)),
]
