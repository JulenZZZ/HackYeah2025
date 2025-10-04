from rest_framework.routers import DefaultRouter
from .views import GameSessionViewSet, CharacterStateViewSet

router = DefaultRouter()
router.register(r'sessions', GameSessionViewSet, basename='gamesession')
router.register(r'character-states', CharacterStateViewSet, basename='characterstate')
