from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from rest_framework import serializers


class SignUpForm(UserCreationForm):
    email = forms.CharField(max_length=15, required=True)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'email', 'password')


class UserSerializer(serializers.ModelSerializer):
   class Meta:
       model = User
       fields = ('username', 'first_name', 'email', 'password')


class LoginForm(forms.Form):
    username = forms.CharField(widget=forms.TextInput)
    password = forms.CharField(widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username', 'password')