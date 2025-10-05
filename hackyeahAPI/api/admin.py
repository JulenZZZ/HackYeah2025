# hackyeahAPI/api/admin.py

from django.contrib import admin
from .models import (
  Attribute,
  LifeStage,
  Question,
  Answer,
  Condition,
  Impact,
  Challenge, # NOWOŚĆ
  EducationalContent # NOWOŚĆ
)


# --- Definicje Inline ---

class EducationalContentInline(admin.StackedInline):
  """Pozwala dodawać treść edukacyjną bezpośrednio na stronie Pytania."""
  model = EducationalContent
  can_delete = False # Zazwyczaj pytanie ma jedną treść, więc wyłączamy usuwanie
  verbose_name_plural = 'Treść Edukacyjna'

class ConditionInline(admin.TabularInline):
  model = Condition
  extra = 1

  def get_exclude(self, request, obj=None):
    if isinstance(obj, Question):
      return ['answer']
    if isinstance(obj, Answer):
      return ['question']
    return []


class ImpactInline(admin.TabularInline):
  model = Impact
  extra = 1


class AnswerInline(admin.TabularInline):
  model = Answer
  extra = 1
  show_change_link = True


# --- Główne konfiguracje paneli Admina ---

@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
  list_display = ('name',)
  search_fields = ('name',)

@admin.register(LifeStage)
class LifeStageAdmin(admin.ModelAdmin):
  list_display = ('name', 'order')
  list_editable = ('order',)

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    """Panel administracyjny dla Wyzwań."""
    list_display = ('name', 'attribute_to_check', 'target_value')
    list_filter = ('attribute_to_check',)
    search_fields = ('name', 'description')

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
  list_display = ('text', 'life_stage', 'order')
  list_filter = ('life_stage',)
  search_fields = ('text',)
  list_editable = ('order',)

  # Dodajemy EducationalContentInline na górze
  inlines = [EducationalContentInline, ConditionInline, AnswerInline]


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
  list_display = ('text', 'question')
  search_fields = ('text', 'question__text')
  inlines = [ConditionInline, ImpactInline]