# TwojaAplikacja/admin.py

from django.contrib import admin
from .models import (
  Attribute,
  LifeStage,
  Question,
  Answer,
  Condition,
  Impact
)


# --- Definicje Inline ---
# Inlines pozwalają na edycję powiązanych modeli na tej samej stronie.

class ConditionInline(admin.TabularInline):
  """Pozwala dodawać warunki bezpośrednio podczas edycji Pytania lub Odpowiedzi."""
  model = Condition
  extra = 1  # Liczba pustych formularzy do dodania nowego warunku.

  # Wykluczamy pola, aby uniknąć redundancji - warunek będzie przypisany
  # albo do pytania, albo do odpowiedzi, w zależności od kontekstu.
  def get_exclude(self, request, obj=None):
    if isinstance(obj, Question):
      return ['answer']
    if isinstance(obj, Answer):
      return ['question']
    return []


class ImpactInline(admin.TabularInline):
  """Pozwala dodawać wpływy bezpośrednio podczas edycji Odpowiedzi."""
  model = Impact
  extra = 1


class AnswerInline(admin.TabularInline):
  """Pozwala dodawać Odpowiedzi bezpośrednio podczas edycji Pytania."""
  model = Answer
  extra = 1
  show_change_link = True  # Dodaje link do edycji odpowiedzi w osobnym oknie


# --- Główne konfiguracje paneli Admina ---

@admin.register(Attribute)
class AttributeAdmin(admin.ModelAdmin):
  """Panel administracyjny dla Atrybutów."""
  list_display = ('name',)
  search_fields = ('name',)

@admin.register(LifeStage)
class LifeStageAdmin(admin.ModelAdmin):
  """Panel administracyjny dla Etapów Życia."""
  list_display = ('name', 'order')
  list_editable = ('order',)


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
  """Panel administracyjny dla Pytań."""
  list_display = ('text', 'life_stage', 'order')
  list_filter = ('life_stage',)
  search_fields = ('text',)
  list_editable = ('order',)

  # Dołączamy możliwość dodawania odpowiedzi i warunków na stronie pytania.
  inlines = [ConditionInline, AnswerInline]


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
  """Panel administracyjny dla Odpowiedzi."""
  list_display = ('text', 'question')
  search_fields = ('text', 'question__text')

  # Dołączamy możliwość dodawania warunków i wpływów na stronie odpowiedzi.
  inlines = [ConditionInline, ImpactInline]

# Rejestracja modeli, dla których nie tworzyliśmy osobnych klas Admin
# Te modele będą miały domyślny interfejs, ale są potrzebne głównie jako inlines.
# admin.site.register(Condition)
# admin.site.register(Impact)
