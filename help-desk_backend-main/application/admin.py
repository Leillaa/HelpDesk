from django.contrib import admin
from .models import Comment, Attachment_comment, Attachment, Application

admin.site.register(Comment)
admin.site.register(Attachment)
admin.site.register(Attachment_comment)
admin.site.register(Application)
