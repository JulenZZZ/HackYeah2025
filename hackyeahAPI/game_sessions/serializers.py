from rest_framework import serializers
from .models import GameSession, CharacterState
from game_rules.serializers import HobbySerializer # Importujemy, aby zagnieździć dane o hobby

# Serializer dla bieżącego stanu postaci
class CharacterStateSerializer(serializers.ModelSerializer):
    # Używamy zagnieżdżonego serializera, aby wyświetlić pełne dane o hobby, a nie tylko ID
    hobbies = HobbySerializer(many=True, read_only=True)

    class Meta:
        model = CharacterState
        fields = ['current_age', 'health', 'happiness', 'cash_balance', 'zus_balance', 'hobbies']

# Serializer dla sesji gry
class GameSessionSerializer(serializers.ModelSerializer):
    # Zagnieżdżamy serializer stanu postaci. `read_only=True` oznacza,
    # że stan będzie widoczny przy odczycie sesji, ale tworzony oddzielnie.
    state = CharacterStateSerializer(read_only=True)
    user = serializers.ReadOnlyField(source='user.username') # Wyświetlamy nazwę użytkownika zamiast ID

    class Meta:
        model = GameSession
        fields = ['id', 'user', 'scenario', 'character_name', 'is_active', 'created_at', 'last_played_at', 'state']

    # Ta metoda automatycznie przypisze zalogowanego użytkownika do tworzonej sesji gry
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
