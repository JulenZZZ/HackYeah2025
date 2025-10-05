# hackyeahAPI/game/urls.py

from django.urls import path
from .views import (
    game_view,
    LandingPageView,
    CharacterSelectView,
    ChallengeSelectView,
)

urlpatterns = [
    # Ścieżka do istniejącego widoku gry
    path('play/', game_view, name='play_game'),

    # --- NOWE ŚCIEŻKI ---

    # 1. Landing Page
    path('', LandingPageView.as_view(), name='landing_page'),

    # 2. Wybór Postaci
    path('character-select/', CharacterSelectView.as_view(), name='character_select'),

    # 3. Wybór Wyzwania
    path('challenge-select/', ChallengeSelectView.as_view(), name='challenge_select'),
]