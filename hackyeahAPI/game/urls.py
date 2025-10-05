# hackyeahAPI/game/urls.py

from django.urls import path
from .views import (
    game_view,
    summary_view, # Import nowego widoku
    LandingPageView,
    CharacterSelectView,
    ChallengeSelectView,
)

urlpatterns = [
    path('play/', game_view, name='play_game'),
    path('summary/', summary_view, name='summary'), # Nowa ścieżka dla podsumowania

    path('', LandingPageView.as_view(), name='landing_page'),
    path('character-select/', CharacterSelectView.as_view(), name='character_select'),
    path('challenge-select/', ChallengeSelectView.as_view(), name='challenge_select'),
]