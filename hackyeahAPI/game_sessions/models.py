from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from game_rules.models import GameScenario, Hobby

# Model reprezentujący pojedynczą rozgrywkę gracza [cite: 12]
class GameSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, verbose_name="Gracz")
    scenario = models.ForeignKey(GameScenario, on_delete=models.PROTECT, verbose_name="Scenariusz")
    character_name = models.CharField(max_length=100, verbose_name="Imię postaci")
    is_active = models.BooleanField(default=True, verbose_name="Czy gra jest aktywna?")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data utworzenia")
    last_played_at = models.DateTimeField(auto_now=True, verbose_name="Ostatnio grana")

    def __str__(self):
        return f"Gra: {self.character_name} ({self.user.username})"

# Model przechowujący aktualny stan postaci, kluczowe wskaźniki "kokpitu życia" [cite: 36]
class CharacterState(models.Model):
    game_session = models.OneToOneField(GameSession, on_delete=models.CASCADE, primary_key=True, related_name="state", verbose_name="Sesja gry")
    current_age = models.PositiveSmallIntegerField(verbose_name="Aktualny wiek")
    health = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)], verbose_name="Zdrowie (%)"
    )
    happiness = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)], verbose_name="Szczęście (%)"
    )
    cash_balance = models.DecimalField(max_digits=18, decimal_places=2, verbose_name="Stan gotówki")
    zus_balance = models.DecimalField(max_digits=18, decimal_places=2, default=0, verbose_name="Saldo ZUS")
    hobbies = models.ManyToManyField(Hobby, blank=True, verbose_name="Hobby postaci")

    def __str__(self):
        return f"Stan postaci: {self.game_session.character_name} (Wiek: {self.current_age})"
