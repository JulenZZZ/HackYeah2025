from rest_framework import viewsets
from .models import GameSession, CharacterState
from .serializers import GameSessionSerializer, CharacterStateSerializer

class GameSessionViewSet(viewsets.ModelViewSet):
    """
    API endpoint, który pozwala na przeglądanie i edytowanie sesji gier.
    Zwraca tylko obiekty należące do aktualnie zalogowanego użytkownika.
    """
    serializer_class = GameSessionSerializer
    

    def get_queryset(self):
        # Filtruj sesje gier, aby zwrócić tylko te należące do bieżącego użytkownika
        return GameSession.objects.filter(user=self.request.user)

class CharacterStateViewSet(viewsets.ModelViewSet):
    """
    API endpoint do zarządzania stanem postaci.
    """
    serializer_class = CharacterStateSerializer
    

    def get_queryset(self):
        # Filtruj stany postaci, aby pasowały do sesji gier bieżącego użytkownika
        return CharacterState.objects.filter(game_session__user=self.request.user)
