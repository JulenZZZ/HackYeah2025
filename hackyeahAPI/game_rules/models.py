from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

# Model scenariusza, np. "Bogata emerytura" czy "Pod górkę" [cite: 18]
class GameScenario(models.Model):
    name = models.CharField(max_length=100, unique=True, verbose_name="Nazwa scenariusza")
    description = models.TextField(verbose_name="Opis")
    initial_age = models.PositiveSmallIntegerField(default=18, verbose_name="Wiek początkowy")
    initial_cash = models.DecimalField(max_digits=12, decimal_places=2, default=5000.00, verbose_name="Początkowa gotówka")

    def __str__(self):
        return self.name

# Model definiujący poziomy edukacji [cite: 97]
class EducationLevel(models.Model):
    level_name = models.CharField(max_length=100, verbose_name="Nazwa poziomu edukacji")
    duration_years = models.PositiveSmallIntegerField(verbose_name="Czas trwania (w latach)")
    cost = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Koszt całkowity")

    def __str__(self):
        return self.level_name

# Model definiujący dostępne zawody i ich parametry [cite: 90]
class Job(models.Model):
    job_title = models.CharField(max_length=100, verbose_name="Nazwa stanowiska")
    industry = models.CharField(max_length=100, blank=True, null=True, verbose_name="Branża")
    required_education = models.ForeignKey(EducationLevel, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Wymagana edukacja")
    required_experience_years = models.PositiveSmallIntegerField(default=0, verbose_name="Wymagane lata doświadczenia")
    gross_annual_salary = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Roczne zarobki brutto")
    stress_impact = models.SmallIntegerField(default=0, verbose_name="Wpływ na szczęście")
    health_impact = models.SmallIntegerField(default=0, verbose_name="Wpływ na zdrowie")

    def __str__(self):
        return self.job_title

# Model definiujący pasje i hobby [cite: 114]
class Hobby(models.Model):
    name = models.CharField(max_length=100, verbose_name="Nazwa hobby")
    annual_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0, verbose_name="Roczny koszt")
    happiness_bonus = models.SmallIntegerField(default=0, verbose_name="Bonus do szczęścia")
    health_bonus = models.SmallIntegerField(default=0, verbose_name="Bonus do zdrowia")

    def __str__(self):
        return self.name

# Model zdarzeń losowych (ryzyka życiowe) [cite: 139]
class Event(models.Model):
    class EventType(models.TextChoices):
        HEALTH = 'HEALTH', 'Zdrowotne'
        FINANCIAL = 'FINANCIAL', 'Finansowe'
        FAMILY = 'FAMILY', 'Rodzinne'
        CAREER = 'CAREER', 'Zawodowe'
        OPPORTUNITY = 'OPPORTUNITY', 'Okazja'

    name = models.CharField(max_length=150, verbose_name="Nazwa zdarzenia")
    description = models.TextField(verbose_name="Opis")
    event_type = models.CharField(max_length=20, choices=EventType.choices, verbose_name="Typ zdarzenia")
    health_effect = models.SmallIntegerField(default=0, verbose_name="Efekt na zdrowie")
    happiness_effect = models.SmallIntegerField(default=0, verbose_name="Efekt na szczęście")
    financial_effect = models.DecimalField(max_digits=12, decimal_places=2, default=0.00, verbose_name="Efekt finansowy")

    def __str__(self):
        return f"{self.get_event_type_display()}: {self.name}"
