# hackyeahAPI/game/views.py
import json
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from django.views.decorators.http import require_http_methods
from django.urls import reverse


def game_view(request):
    character = request.session.get('character')
    if not character:
        return redirect('landing_page')
    context = {'character': character, 'challenge': request.session.get('challenge')}
    return render(request, 'game/play.html', context)


@require_http_methods(["POST"])
def summary_view(request):
    try:
        final_state_json = request.POST.get('final_state')
        if not final_state_json:
            return redirect('landing_page')

        final_attributes = json.loads(final_state_json)

        attribute_colors = {
            'Zdrowie': '#2ecc71', 'Oszczędności': '#f1c40f', 'Spełnienie': '#3498db',
            'Wiedza': '#9b59b6', 'Ryzyko/Stres': '#e74c3c', 'społeczeństwo': '#e67e22',
        }

        attributes_with_meta = {name: {'value': value, 'color': attribute_colors.get(name)} for name, value in
                                final_attributes.items()}

        left_keys = ['Zdrowie', 'Oszczędności', 'Spełnienie']

        context = {
            'life_stages': ['Młodość', 'Młody dorosły', 'Dorosłość', 'Emerytura'],
            'attributes': {
                'left': {k: attributes_with_meta[k] for k in left_keys if k in attributes_with_meta},
                'right': {k: attributes_with_meta[k] for k in attributes_with_meta if k not in left_keys}
            },
            'summary': {
                'income': f"{final_attributes.get('Wiedza', 0) * 120:,}".replace(',', ' '),
                'after_costs_value': (final_attributes.get('Spełnienie', 0) + final_attributes.get('Zdrowie', 0)) / 2,
                'savings': f"{final_attributes.get('Oszczędności', 0) * 10212.87:,.2f}".replace(',', ' ').replace('.',
                                                                                                                  ','),
                'savings_value': final_attributes.get('Oszczędności', 0)
            }
        }
        return render(request, 'game/summary.html', context)

    except (json.JSONDecodeError, KeyError):
        return redirect('landing_page')


class LandingPageView(TemplateView):
    template_name = 'game/landing_page.html'


class CharacterSelectView(View):
    template_name = 'game/character_select.html'

    def get(self, request, *args, **kwargs): return render(request, self.template_name)

    def post(self, request, *args, **kwargs):
        character = request.POST.get('character')
        if character in ['Mężczyzna', 'Kobieta']:
            request.session['character'] = character
            return redirect('challenge_select')
        return render(request, self.template_name, {'error': 'Proszę wybrać postać.'})


class ChallengeSelectView(View):
    template_name = 'game/challenge_select.html'

    def get(self, request, *args, **kwargs):
        if 'character' not in request.session: return redirect('character_select')
        return render(request, self.template_name)

    def post(self, request, *args, **kwargs):
        challenge = request.POST.get('challenge')
        if challenge in ['Swobodny', 'Wyzwanie', 'Edukacja']:
            request.session['challenge'] = challenge
            return redirect('play_game')
        return render(request, self.template_name, {'error': 'Proszę wybrać tryb gry.'})