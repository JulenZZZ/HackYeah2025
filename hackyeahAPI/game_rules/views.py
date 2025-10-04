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
