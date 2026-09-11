from django.urls import path
from .views import LoginView, RegisterView, LoginAPIView, RegistrationAPIView

urlpatterns = [
    path('login/', LoginView.as_view(), name='login'),
    path('register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginAPIView.as_view(), name='api_login'),
    path('api/register/', RegistrationAPIView.as_view(), name='api_register'),
]
