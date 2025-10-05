from django.shortcuts import render

def game_view(request):
    """
    Widok renderujący główny szablon gry.
    """
    return render(request, 'game/index.html')
