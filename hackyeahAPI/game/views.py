# hackyeahAPI/game/views.py

from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, View


# Twój istniejący widok gry (pozostaje bez zmian)
def game_view(request):
    """
    Widok renderujący główny szablon gry.
    """
    # Usunięcie danych z sesji po dotarciu do gry, aby uniknąć
    # ponownego wykorzystania starych danych przy nowej rozgrywce.
    request.session.pop('character', None)
    request.session.pop('challenge', None)
    return render(request, 'game/play.html')


# --- NOWE WIDOKI ---

class LandingPageView(TemplateView):
    """
    Widok strony powitalnej.
    """
    template_name = 'game/landing_page.html'


class CharacterSelectView(View):
    """
    Widok wyboru postaci. Obsługuje GET do wyświetlenia formularza
    i POST do zapisania wyboru w sesji.
    """
    template_name = 'game/character_select.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)

    def post(self, request, *args, **kwargs):
        character = request.POST.get('character')
        if character in ['Mężczyzna', 'Kobieta']:
            request.session['character'] = character
            # Przekierowanie do następnego kroku: wybór wyzwania
            return redirect('challenge_select')

        # Jeśli dane są nieprawidłowe, wyświetl formularz ponownie z błędem
        return render(request, self.template_name, {'error': 'Proszę wybrać postać.'})


class ChallengeSelectView(View):
    """
    Widok wyboru wyzwania. Obsługuje GET do wyświetlenia formularza
    i POST do zapisania wyboru i rozpoczęcia gry.
    """
    template_name = 'game/challenge_select.html'

    def get(self, request, *args, **kwargs):
        # Sprawdzamy, czy postać została wybrana w poprzednim kroku
        if 'character' not in request.session:
            # Jeśli nie, przekieruj z powrotem do wyboru postaci
            return redirect('character_select')

        return render(request, self.template_name)

    def post(self, request, *args, **kwargs):
        challenge = request.POST.get('challenge')
        if challenge in ['Szybka misja', 'Długa kampania']:
            request.session['challenge'] = challenge
            # Przekierowanie do właściwej gry
            return redirect('play_game')

        # Jeśli dane są nieprawidłowe, wyświetl formularz ponownie z błędem
        return render(request, self.template_name, {'error': 'Proszę wybrać wyzwanie.'})