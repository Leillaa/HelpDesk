from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from profile.views import RegisterApi
from application.views import Check
from application.telegram_views import telegram_webhook
from rest_framework.authtoken import views

urlpatterns = [
    path("admin/", admin.site.urls),
    path('app/', include('application.urls')),
    path('api/auth/', include('profile.urls')),
    path('webhook/telegram/', telegram_webhook, name='telegram_webhook'),
    #path('api-auth/', include('rest_framework.urls')),
    #path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    #path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterApi.as_view(), name='register'),
    path('api/login/', views.obtain_auth_token, name='login'),
    path('api/check/', Check.as_view(), name='check'),



] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
