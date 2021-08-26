from django.contrib import admin

# Register your models here.

from .models import UserRead, UserProject
admin.site.register(UserRead)
admin.site.register(UserProject)
