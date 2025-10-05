# hackyeahAPI/game/views.py
import json
from django.http import JsonResponse, HttpResponseServerError
from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from django.views.decorators.http import require_http_methods
from api.models import Challenge


def game_view(request):
    character = request.session.get('character')
    if not character:
        return redirect('landing_page')

    challenge_mode = request.session.get('challenge_mode')
    is_educational_mode = challenge_mode == 'Edukacja'

    context = {
        'character': character,
        'challenge': request.session.get('challenge'),
        'is_educational_mode': is_educational_mode
    }
    return render(request, 'game/play.html', context)


@require_http_methods(["POST"])
def summary_view(request):
    try:
        final_state_json = request.POST.get('final_state')
        if not final_state_json:
            return redirect('landing_page')

        final_data = json.loads(final_state_json)
        final_attributes = final_data.get('attributes', {})
        challenge_id = request.session.get('challenge_id')
        challenge_result = None

        if challenge_id:
            try:
                challenge = Challenge.objects.get(id=challenge_id)
                player_value = final_attributes.get(challenge.attribute_to_check.name.lower(), 0)
                if player_value >= challenge.target_value:
                    challenge_result = {'status': 'success', 'message': f'Gratulacje! Osiągnąłeś cel: {challenge.name}'}
                else:
                    challenge_result = {'status': 'failure',
                                        'message': f'Niestety, nie udało się osiągnąć celu: {challenge.name}'}
            except Challenge.DoesNotExist:
                challenge_result = {'status': 'error', 'message': 'Nie znaleziono definicji wyzwania.'}

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
            'character': request.session.get('character'),
            'life_stages': ['Młodość', 'Wczesna dorosłość', 'Dorosłość', 'Emerytura'],
            'attributes': {
                'left': {k: attributes_with_meta[k] for k in left_keys if k in attributes_with_meta},
                'right': {k: attributes_with_meta[k] for k in attributes_with_meta if k not in left_keys}
            },
            'summary': {
                'income': f"{income:,.0f}".replace(',', ' '),
                'after_costs_value': (final_attributes.get('spełnienie', 0) + final_attributes.get('zdrowie', 0)) / 2,
                'savings': f"{savings:,.2f}".replace(',', ' ').replace('.', ','),
                'savings_value': final_attributes.get('oszczędności', 0)
            },
            'challenge_result': challenge_result
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
        challenge_mode = request.POST.get('challenge')
        request.session['challenge_mode'] = challenge_mode

        if challenge_mode == 'Wyzwanie':
            # Przekieruj do nowego widoku wyboru wyzwania
            return redirect('challenge_list')
        elif challenge_mode in ['Swobodny', 'Edukacja']:
            request.session['challenge'] = challenge_mode
            # Usuń ID wyzwania z sesji, jeśli istniało wcześniej
            request.session.pop('challenge_id', None)
            return redirect('play_game')

        return render(request, self.template_name, {'error': 'Proszę wybrać tryb gry.'})


# NOWY WIDOK
class ChallengeListView(View):
    template_name = 'game/challenge_list.html'

    def get(self, request, *args, **kwargs):
        # Sprawdź, czy użytkownik przeszedł poprzednie kroki
        if 'character' not in request.session or request.session.get('challenge_mode') != 'Wyzwanie':
            return redirect('challenge_select')

        challenges = Challenge.objects.all()
        return render(request, self.template_name, {'challenges': challenges})

    def post(self, request, *args, **kwargs):
        challenge_id = request.POST.get('challenge_id')
        try:
            challenge = Challenge.objects.get(id=challenge_id)
            request.session['challenge_id'] = challenge.id
            request.session['challenge'] = challenge.name  # Opcjonalnie zapisz nazwę
            return redirect('play_game')
        except (Challenge.DoesNotExist, ValueError):
            challenges = Challenge.objects.all()
            return render(request, self.template_name, {
                'challenges': challenges,
                'error': 'Proszę wybrać prawidłowe wyzwanie.'
            })
        
def about_page(request):

    return render(request, 'game/about.html')

def creators_page(request):

    return render(request, 'game/creators.html')