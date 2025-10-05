# hackyeahAPI/api/models.py

from django.db import models
from django.contrib.auth.models import User


class Attribute(models.Model):
  """Model definiujący dostępne atrybuty postaci, np. wiedza, zdrowie."""
  name = models.CharField(max_length=100, unique=True,
                          verbose_name="Nazwa atrybutu")

  def __str__(self):
    return self.name

class LifeStage(models.Model):
  """Model reprezentujący etap życia w grze, np. Młodość."""
  name = models.CharField(max_length=100, verbose_name="Nazwa etapu")
  order = models.PositiveIntegerField(unique=True,
                                      help_text="Kolejność wyświetlania etapów w grze.")

  class Meta:
    ordering = ['order']

  def __str__(self):
    return self.name


class Question(models.Model):
  """Model dla pytania, które jest zadawane graczowi."""
  life_stage = models.ForeignKey(LifeStage, on_delete=models.CASCADE,
                                 related_name='questions',
                                 verbose_name="Etap życia")
  text = models.TextField(verbose_name="Treść pytania")
  order = models.PositiveIntegerField(
    help_text="Kolejność pytania w ramach danego etapu życia.")

  class Meta:
    ordering = ['life_stage', 'order']

  def __str__(self):
    return f"({self.life_stage.name}) {self.text}"


class Answer(models.Model):
  """Model dla możliwej odpowiedzi na pytanie."""
  question = models.ForeignKey(Question, on_delete=models.CASCADE,
                               related_name='answers', verbose_name="Pytanie")
  text = models.CharField(max_length=255, verbose_name="Treść odpowiedzi")

  def __str__(self):
    return self.text


class Condition(models.Model):
  """Model warunku, który musi być spełniony, aby pytanie lub odpowiedź były dostępne."""
  OPERATOR_CHOICES = [
    ('>=', 'Większy lub równy'),
    ('<=', 'Mniejszy lub równy'),
    ('>', 'Większy'),
    ('<', 'Mniejszy'),
    ('==', 'Równy'),
  ]

  # Warunek może być przypisany do pytania (aby je wyświetlić) lub do odpowiedzi (aby była klikalna)
  question = models.ForeignKey(Question, on_delete=models.CASCADE,
                               related_name='conditions', null=True, blank=True)
  answer = models.ForeignKey(Answer, on_delete=models.CASCADE,
                             related_name='conditions', null=True, blank=True)

  attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE,
                                verbose_name="Atrybut do sprawdzenia")
  operator = models.CharField(max_length=2, choices=OPERATOR_CHOICES,
                              verbose_name="Operator porównania")
  value = models.IntegerField(verbose_name="Wartość do porównania")

  def __str__(self):
    target = self.question if self.question else self.answer
    return f"Warunek dla '{target}': {self.attribute.name} {self.operator} {self.value}"


class Impact(models.Model):
  """Model definiujący wpływ odpowiedzi na atrybuty postaci."""
  OPERATION_CHOICES = [
    ('+', 'Dodaj do wartości'),
    ('-', 'Odejmij od wartości'),
    ('*%', 'Modyfikuj procentowo'),
  ]

  answer = models.ForeignKey(Answer, on_delete=models.CASCADE,
                             related_name='impacts', verbose_name="Odpowiedź")
  attribute = models.ForeignKey(Attribute, on_delete=models.CASCADE,
                                verbose_name="Atrybut do zmiany")
  operation = models.CharField(max_length=2, choices=OPERATION_CHOICES,
                               verbose_name="Operacja")
  value = models.IntegerField(
    verbose_name="Wartość zmiany (dla % podaj np. -10 dla -10%)")

  def __str__(self):
    return f"Wpływ: {self.attribute.name} {self.operation} {self.value}"

# NOWY MODEL
class Challenge(models.Model):
    """Model definiujący wyzwanie."""
    name = models.CharField(max_length=100, verbose_name="Nazwa wyzwania")
    description = models.TextField(verbose_name="Opis wyzwania")
    attribute_to_check = models.ForeignKey(Attribute, on_delete=models.CASCADE, verbose_name="Atrybut do sprawdzenia")
    target_value = models.IntegerField(verbose_name="Wartość docelowa")

    def __str__(self):
        return self.name

# NOWY MODEL
class EducationalContent(models.Model):
    """Model dla treści edukacyjnych."""
    question = models.OneToOneField(Question, on_delete=models.CASCADE, related_name='educational_content', verbose_name="Pytanie")
    content = models.TextField(verbose_name="Treść edukacyjna")

    def __str__(self):
        return f"Treść edukacyjna dla pytania: {self.question.text[:30]}..."