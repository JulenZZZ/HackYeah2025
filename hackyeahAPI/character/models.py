from django.db import models
from game_sessions.models import GameSession
from game_rules.models import Job, EducationLevel, Event

# Model dla prywatnych aktywów finansowych (oszczędności, inwestycje) [cite: 130]
class CharacterAsset(models.Model):
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name="assets", verbose_name="Sesja gry")
    asset_type = models.CharField(max_length=50, verbose_name="Typ aktywa") # np. 'Lokata', 'Akcje'
    current_value = models.DecimalField(max_digits=18, decimal_places=2, verbose_name="Aktualna wartość")
    acquired_at_age = models.PositiveSmallIntegerField(verbose_name="Wiek nabycia")
    interest_or_growth_rate = models.DecimalField(max_digits=5, decimal_places=4, null=True, blank=True, verbose_name="Oprocentowanie/Wzrost (%)")

    def __str__(self):
        return f"{self.asset_type} ({self.current_value} PLN) dla {self.game_session.character_name}"

# Model historii zawodowej i edukacyjnej postaci [cite: 87, 95]
class CharacterHistory(models.Model):
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name="history", verbose_name="Sesja gry")
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Stanowisko")
    education = models.ForeignKey(EducationLevel, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Edukacja")
    start_age = models.PositiveSmallIntegerField(verbose_name="Wiek rozpoczęcia")
    end_age = models.PositiveSmallIntegerField(null=True, blank=True, verbose_name="Wiek zakończenia")

    def __str__(self):
        entry = self.job.job_title if self.job else self.education.level_name
        return f"{entry} ({self.start_age}-{self.end_age or 'obecnie'})"

# Model członków rodziny postaci [cite: 108]
class FamilyMember(models.Model):
    class RelationshipType(models.TextChoices):
        SPOUSE = 'SPOUSE', 'Partner/Partnerka'
        CHILD = 'CHILD', 'Dziecko'

    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name="family", verbose_name="Sesja gry")
    relationship_type = models.CharField(max_length=20, choices=RelationshipType.choices, verbose_name="Typ relacji")
    name = models.CharField(max_length=100, verbose_name="Imię")
    birth_age = models.PositiveSmallIntegerField(verbose_name="Wiek postaci w momencie pojawienia się członka rodziny")

    def __str__(self):
        return f"{self.get_relationship_type_display()}: {self.name}"

# Dziennik zdarzeń, które przytrafiły się postaci
class EventLog(models.Model):
    game_session = models.ForeignKey(GameSession, on_delete=models.CASCADE, related_name="event_logs", verbose_name="Sesja gry")
    event = models.ForeignKey(Event, on_delete=models.PROTECT, verbose_name="Zdarzenie")
    occurred_at_age = models.PositiveSmallIntegerField(verbose_name="Wiek wystąpienia zdarzenia")

    def __str__(self):
        return f"W wieku {self.occurred_at_age}: {self.event.name}"
