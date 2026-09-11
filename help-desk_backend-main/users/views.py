from django.contrib.auth.models import User
from django.db import IntegrityError
from django.shortcuts import render, redirect
from django.urls import reverse
from django.contrib.auth import authenticate, login
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.views import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView

from .forms import SignUpForm, LoginForm, UserSerializer
from profile.models import Profile
from rest_framework import status
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer, TemplateHTMLRenderer
from rest_framework.authtoken.models import Token

def home(request):
    return render(request, "home.html")


#class SignUp(CreateView):
#    form_class = SignUpForm
#    success_url = reverse_lazy("login")
#    template_name = "signup.html"


@api_view(['POST'])
def registrations(request):
   username = request.data.get('name')
   first_name = request.data.get('first_name')
   email = request.data.get('email')
   password = request.data.get('password')
   if username and first_name and email and password:
       new_user = User.objects.create_user(username=username, password=password)
       Profile.objects.create(user=new_user, first_name=first_name, email=email)
       user = authenticate(username=username, password=password)
       login(request, user)
       return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)
   else:
       return Response({"error": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def login_view(request):
   if request.method == 'POST':
       username = request.POST['name']
       password = request.POST['password']
       user = authenticate(request, username=username, password=password)
       if user is not None:
           login(request, user)
           return HttpResponseRedirect(reverse('aplications_list'))
       else:
           return HttpResponseRedirect(reverse('login'))
   else:
       return render(request, 'login.html')


class LoginView(View):
   def post(self, request, *args, **kwargs):
       name = request.POST.get('name')
       password = request.POST.get('password')
       user = authenticate(request, username=name, password=password)
       if user is not None:
           login(request, user)
           return HttpResponseRedirect(reverse('app/aplications_list'))
       else:
           return HttpResponseRedirect(reverse('login'))
       return render(request, 'login.html')




class LoginView(APIView):
   def post(self, request, *args, **kwargs):
       name = request.data.get('name')
       password = request.data.get('password')
       user = authenticate(request, username=name, password=password)
       if user is not None:
           login(request, user)
           return Response({'message': 'Logged in successfully'}, status=200)
       else:
           return Response({'error': 'Invalid credentials'}, status=400)


@api_view(['POST'])
@renderer_classes((JSONRenderer,))
def registrations(request):
  username = request.data.get('name')
  first_name = request.data.get('first_name')
  email = request.data.get('email')
  password = request.data.get('password')
  if username and first_name and email and password:
      new_user = User.objects.create_user(username=username, password=password)
      Profile.objects.create(user=new_user, first_name=first_name, email=email)
      user = authenticate(username=username, password=password)
      login(request, user)
      return Response({"message": "Registration successful"}, status=status.HTTP_201_CREATED)
  else:
      return Response({"error": "Missing data"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def register(request):
   username = request.POST.get('name')
   first_name = request.POST.get('first_name')
   email = request.POST.get('email')
   password = request.POST.get('password')
   if username and first_name and email and password:
       new_user = User.objects.create_user(username=username, password=password)
       Profile.objects.create(user=new_user, first_name=first_name, email=email)
       user = authenticate(username=username, password=password)
       token, created = Token.objects.get_or_create(user=user)
       return Response({'token': token.key})