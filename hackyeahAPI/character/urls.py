from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CharacterAssetViewSet, CharacterHistoryViewSet, FamilyMemberViewSet, EventLogViewSet

router = DefaultRouter()
router.register(r'assets', CharacterAssetViewSet, basename='characterasset')
router.register(r'history', CharacterHistoryViewSet, basename='characterhistory')
router.register(r'family', FamilyMemberViewSet, basename='familymember')
router.register(r'event-log', EventLogViewSet, basename='eventlog')

urlpatterns = [
    path('', include(router.urls)),
]
