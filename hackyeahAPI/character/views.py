from rest_framework import viewsets, permissions
from .models import CharacterAsset, CharacterHistory, FamilyMember, EventLog
from .serializers import CharacterAssetSerializer, CharacterHistorySerializer, FamilyMemberSerializer, EventLogSerializer

# Wspólna klasa bazowa do filtrowania querysetów
class BaseCharacterViewSet(viewsets.ModelViewSet):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """
        Filtruje obiekty, aby zwrócić tylko te, które są powiązane
        z sesjami gier należącymi do bieżącego użytkownika.
        """
        user = self.request.user
        # Zakładamy, że każdy model ma pole 'game_session'
        return self.queryset.filter(game_session__user=user)

class CharacterAssetViewSet(BaseCharacterViewSet):
    queryset = CharacterAsset.objects.all()
    serializer_class = CharacterAssetSerializer

class CharacterHistoryViewSet(BaseCharacterViewSet):
    queryset = CharacterHistory.objects.all()
    serializer_class = CharacterHistorySerializer

class FamilyMemberViewSet(BaseCharacterViewSet):
    queryset = FamilyMember.objects.all()
    serializer_class = FamilyMemberSerializer

class EventLogViewSet(BaseCharacterViewSet):
    queryset = EventLog.objects.all()
    serializer_class = EventLogSerializer
