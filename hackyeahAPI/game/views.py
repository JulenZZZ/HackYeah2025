# hackyeahAPI/game/views.py
import json
from django.http import JsonResponse, HttpResponseServerError
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from django.views.decorators.http import require_http_methods

# Usunięto widok generate_proxy_view

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

        final_data = json.loads(final_state_json)
        final_attributes = final_data.get('attributes', {})

        attribute_meta = {
            'zdrowie': {'name': 'Zdrowie', 'color': '#2ecc71'},
            'oszczędności': {'name': 'Oszczędności', 'color': '#f1c40f'},
            'spełnienie': {'name': 'Spełnienie', 'color': '#3498db'},
            'wiedza': {'name': 'Wiedza', 'color': '#9b59b6'},
            'ryzyko': {'name': 'Ryzyko/Stres', 'color': '#e74c3c'},
            'umiejętności społeczne': {'name': 'Społeczeństwo', 'color': '#e67e22'},
            'majątek': {'name': 'Majątek', 'color': '#1abc9c'},
            'doświadczenie zawodowe': {'name': 'Doświadczenie', 'color': '#34495e'},
        }

        attributes_with_meta = {
            meta['name']: {'value': final_attributes.get(key, 0), 'color': meta['color']}
            for key, meta in attribute_meta.items() if key in final_attributes
        }

        left_keys = ['Zdrowie', 'Oszczędności', 'Spełnienie']

        income = final_attributes.get('wiedza', 0) * 100 + final_attributes.get('doświadczenie zawodowe', 0) * 150
        savings = final_attributes.get('oszczędności', 0) * 1000 + final_attributes.get('majątek', 0) * 500

        context = {
            'life_stages': ['Młodość', 'Młody dorosły', 'Dorosłość', 'Emerytura'],
            'attributes': {
                'left': {k: attributes_with_meta[k] for k in left_keys if k in attributes_with_meta},
                'right': {k: attributes_with_meta[k] for k in attributes_with_meta if k not in left_keys}
            },
            'summary': {
                'income': f"{income:,.0f}".replace(',', ' '),
                'after_costs_value': (final_attributes.get('spełnienie', 0) + final_attributes.get('zdrowie', 0)) / 2,
                'savings': f"{savings:,.2f}".replace(',', ' ').replace('.',','),
                'savings_value': final_attributes.get('oszczędności', 0)
            }
        }
        return render(request, 'game/summary.html', context)

    except (json.JSONDecodeError, KeyError) as e:
        print(f"Error in summary view: {e}")
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