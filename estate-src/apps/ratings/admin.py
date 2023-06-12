from django.contrib import admin
from .models import Rating

class RatingAdmin(admin.ModelAdmin):
    list_display = ['rater', 'agent', 'rating', 'comment']

admin.site.register(Rating, RatingAdmin)
