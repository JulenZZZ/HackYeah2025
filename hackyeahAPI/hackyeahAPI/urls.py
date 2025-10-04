# hackyeahAPI/urls.py
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Importujemy routery z każdej aplikacji
from game_sessions.urls import router as sessions_router
from game_rules.urls import router as rules_router
from character.urls import router as character_router

# Tworzymy jeden główny router, który będzie obsługiwał /api/
router = DefaultRouter()

# Kopiujemy zarejestrowane ścieżki z każdego routera do głównego
router.registry.extend(sessions_router.registry)
router.registry.extend(rules_router.registry)
router.registry.extend(character_router.registry)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),

    # Endpointy do uwierzytelniania JWT
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
