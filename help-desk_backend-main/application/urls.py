from django.urls import path
from . import views
from django.urls import path, include
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import Applicationst, CommentsView

router = DefaultRouter()
router.register(r'applications_list', Applicationst, basename='application')
urlpatterns = [
    path('application_details/<int:id>/', views.application_details_api),
    path('create_application/', views.ApplicationView.as_view(), name='create_application'),
    path('comment_create/<int:id>/', views.create_comment_api, name='create_comment'),
    path('delete/<int:id>/', views.status_close_view, name='close'),
    path('comment_list/<int:id>/', CommentsView.as_view(), name='comments_list'),
    path('', include(router.urls)),

]