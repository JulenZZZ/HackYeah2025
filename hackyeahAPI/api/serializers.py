from rest_framework import serializers
from .models import Attribute, LifeStage, Question, Answer, Condition, Impact

class AttributeSerializer(serializers.ModelSerializer):
    """Prosty serializator do wyświetlania nazwy atrybutu."""
    class Meta:
        model = Attribute
        fields = ['name']

class ImpactSerializer(serializers.ModelSerializer):
    """Serializator dla wpływu odpowiedzi na atrybuty."""
    attribute = serializers.StringRelatedField() # Wyświetli nazwę atrybutu zamiast ID

    class Meta:
        model = Impact
        fields = ['attribute', 'operation', 'value']

class ConditionSerializer(serializers.ModelSerializer):
    """Serializator dla warunków widoczności pytania/odpowiedzi."""
    attribute = serializers.StringRelatedField() # Wyświetli nazwę atrybutu zamiast ID

    class Meta:
        model = Condition
        fields = ['attribute', 'operator', 'value']

class AnswerSerializer(serializers.ModelSerializer):
    """Serializator dla odpowiedzi, zawiera zagnieżdżone warunki i wpływy."""
    conditions = ConditionSerializer(many=True, read_only=True)
    impacts = ImpactSerializer(many=True, read_only=True)

    class Meta:
        model = Answer
        fields = ['id', 'text', 'conditions', 'impacts']

class QuestionSerializer(serializers.ModelSerializer):
    """Serializator dla pytania, zawiera zagnieżdżone warunki i odpowiedzi."""
    conditions = ConditionSerializer(many=True, read_only=True)
    answers = AnswerSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'order', 'conditions', 'answers']

class LifeStageSerializer(serializers.ModelSerializer):
    """Główny serializator, który łączy wszystko w jedną strukturę."""
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = LifeStage
        fields = ['id', 'name', 'order', 'questions']
