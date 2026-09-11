from django.db import models
from profile.models import User
from django_currentuser.db.models import CurrentUserField
from django_currentuser.middleware import get_current_user


class Application(models.Model):
   id = models.AutoField(primary_key=True)
   groups = models.CharField(max_length=50, default="Web-request")
   team = models.CharField(max_length=50, default="")
   text = models.CharField(max_length=500)
   created_by = CurrentUserField()
   created = models.DateTimeField(auto_now_add=True)
   updated = models.DateTimeField(auto_now=True)
   status = models.CharField(max_length=50, default="Active")
   messages_id = models.CharField(max_length=50, default="")
   priority = models.CharField(max_length=50, default="")
   chat_id = models.CharField(max_length=50, null=True)
   telegram = models.BooleanField(default=False, null=True)
   mail = models.BooleanField(default=False, null=True)
   name = models.TextField(null=True)

   def __str__(self):
      return self.groups


class Attachment(models.Model):
   id = models.AutoField(primary_key=True)
   name = models.CharField(max_length=255, default=" ")
   application = models.ForeignKey(Application, on_delete=models.DO_NOTHING)
   image = models.ImageField(upload_to='telegram/', null=True, blank=True)


class Comment(models.Model):
   id = models.AutoField(primary_key=True)
   application = models.ForeignKey(Application, on_delete=models.PROTECT)
   name = models.ForeignKey(User, on_delete=models.PROTECT)
   body = models.TextField()
   messages_id = models.TextField(max_length=50, null=True, default='')
   telegram = models.BooleanField(null=True)
   created = models.DateTimeField(auto_now_add=True)
   chat_id = models.CharField(max_length=50, null=True)
   mail = models.BooleanField(default=False, null=True)

   class Meta:
      ordering = ('-id',)

   def __str__(self):
      return 'Comment by {} on {}'.format(self.name, self.application)


class Attachment_comment(models.Model):
   id = models.AutoField(primary_key=True)
   name = models.CharField(max_length=255, default=" ")
   comment = models.ForeignKey(Comment, on_delete=models.DO_NOTHING)
   image = models.ImageField(upload_to='telegram/', null=True, blank=True)