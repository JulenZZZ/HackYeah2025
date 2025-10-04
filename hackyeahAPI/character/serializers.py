from rest_framework import serializers
from .models import CharacterAsset, CharacterHistory, FamilyMember, EventLog


class CharacterAssetSerializer(serializers.ModelSerializer):
  class Meta:
    model = CharacterAsset
    fields = '__all__'


class CharacterHistorySerializer(serializers.ModelSerializer):
  # Zagnieżdżamy dane, aby widzieć nazwy, a nie tylko ID
  job_title = serializers.CharField(source='job.job_title', read_only=True)
  education_level = serializers.CharField(source='education.level_name',
                                          read_only=True)

  class Meta:
    model = CharacterHistory
    fields = ['id', 'game_session', 'job', 'education', 'start_age', 'end_age',
              'job_title', 'education_level']


class FamilyMemberSerializer(serializers.ModelSerializer):
  class Meta:
    model = FamilyMember
    fields = '__all__'


class EventLogSerializer(serializers.ModelSerializer):
  # Zagnieżdżamy nazwę wydarzenia
  event_name = serializers.CharField(source='event.name', read_only=True)

  class Meta:
    model = EventLog
    fields = ['id', 'game_session', 'event', 'occurred_at_age', 'event_name']
