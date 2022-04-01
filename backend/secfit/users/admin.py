from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth import get_user_model
from .models import Offer, AthleteFile
from .forms import CustomUserChangeForm, CustomUserCreationForm

class CustomUserAdmin(UserAdmin):
    """
    Class for handling the creation of an admin user
    """
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = get_user_model()
    fieldsets = UserAdmin.fieldsets + ((None, {"fields": ("coach",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {"fields": ("coach",)}),)


admin.site.register(get_user_model(), CustomUserAdmin)
admin.site.register(Offer)
admin.site.register(AthleteFile)
