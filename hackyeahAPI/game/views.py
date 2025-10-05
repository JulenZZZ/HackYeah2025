# hackyeahAPI/game/views.py

from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, View


# ZAKTUALIZOWANY WIDOK GRY
def game_view(request):
    """
    Widok renderujący główny szablon gry.
    Przekazuje dane z sesji (postać, wyzwanie) do szablonu.
    """
    character = request.session.get('character')
    challenge = request.session.get('challenge')

    # Przekieruj na początek, jeśli gracz trafił tu bez wybrania postaci
    if not character:
        return redirect('landing_page')

    context = {
        'character': character,
        'challenge': challenge,
    }
    return render(request, 'game/play.html', context)


# --- WIDOKI PROCESU WYBORU ---

class LandingPageView(TemplateView):
    template_name = 'game/landing_page.html'

class CharacterSelectView(View):
    template_name = 'game/character_select.html'

    def get(self, request, *args, **kwargs):
        return render(request, self.template_name)

    def post(self, request, *args, **kwargs):
        character = request.POST.get('character')
        if character in ['Mężczyzna', 'Kobieta']:
            request.session['character'] = character
            return redirect('challenge_select')
        return render(request, self.template_name, {'error': 'Proszę wybrać postać.'})


class ChallengeSelectView(View):
    template_name = 'game/challenge_select.html'

    def get(self, request, *args, **kwargs):
        if 'character' not in request.session:
            return redirect('character_select')
        return render(request, self.template_name)

    def post(self, request, *args, **kwargs):
        challenge = request.POST.get('challenge')
        if challenge in ['Swobodny', 'Wyzwanie', 'Edukacja']:
            request.session['challenge'] = challenge
            return redirect('play_game')
        return render(request, self.template_name, {'error': 'Proszę wybrać tryb gry.'})