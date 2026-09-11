from django import forms
from .models import Application, Comment, Attachment


class ApplicationForm(forms.ModelForm):
   class Meta:
       model = Application
       fields = ['team', 'text']


class ApplicationFullForm(ApplicationForm):
    images = forms.FileField(widget=forms.ClearableFileInput(attrs={'multiple': True}))

    class Meta(ApplicationForm.Meta):
        fields = ApplicationForm.Meta.fields + ['images']


class CommentForm(forms.ModelForm):
    class Meta:
        model = Comment
        fields = ['name', 'body']