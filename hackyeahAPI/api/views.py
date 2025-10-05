# hackyeahAPI/game_rules/views.py

from django.shortcuts import render
from rest_framework import viewsets
from .models import LifeStage
from .serializers import LifeStageSerializer


class GameRulesViewSet(viewsets.ReadOnlyModelViewSet):
  """
  ViewSet, który udostępnia całą strukturę gry (Etapy -> Pytania -> Odpowiedzi).
  Jest zoptymalizowany pod kątem minimalizacji zapytań do bazy danych.
  """
  serializer_class = LifeStageSerializer

  def get_queryset(self):
    """
    Pobiera wszystkie etapy życia i z wyprzedzeniem ładuje powiązane obiekty,
    aby uniknąć wielokrotnych zapytań do bazy danych (problem N+1).
    """
    return LifeStage.objects.prefetch_related(
      'questions__conditions__attribute',
      'questions__answers__conditions__attribute',
      'questions__answers__impacts__attribute'
    ).all()


# NOWY WIDOK
def game_rules_view(request):
    """
    Widok renderujący szablon HTML z całą strukturą gry.
    """
    life_stages = LifeStage.objects.prefetch_related(
        'questions__answers'
    ).all()
    return render(request, 'game_rules/index.html', {'life_stages': life_stages})
