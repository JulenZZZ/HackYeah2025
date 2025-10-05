# hackyeahAPI/api/serializers.py

from rest_framework import serializers
from .models import Attribute, LifeStage, Question, Answer, Condition, Impact, EducationalContent

class AttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attribute
        fields = ['name']

class ImpactSerializer(serializers.ModelSerializer):
    attribute = serializers.StringRelatedField()

    class Meta:
        model = Impact
        fields = ['attribute', 'operation', 'value']

class ConditionSerializer(serializers.ModelSerializer):
    attribute = serializers.StringRelatedField()

    class Meta:
        model = Condition
        fields = ['attribute', 'operator', 'value']

# NOWY SERIALIZATOR
class EducationalContentSerializer(serializers.ModelSerializer):
    """Serializator dla treści edukacyjnej."""
    class Meta:
        model = EducationalContent
        fields = ['content']

class AnswerSerializer(serializers.ModelSerializer):
    conditions = ConditionSerializer(many=True, read_only=True)
    impacts = ImpactSerializer(many=True, read_only=True)

    class Meta:
        model = Answer
        fields = ['id', 'text', 'conditions', 'impacts']

class QuestionSerializer(serializers.ModelSerializer):
    conditions = ConditionSerializer(many=True, read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)
    # Dodajemy zagnieżdżoną treść edukacyjną
    educational_content = EducationalContentSerializer(read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'conditions', 'answers', 'educational_content']

class LifeStageSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = LifeStage
        fields = ['id', 'name', 'order', 'questions']