from django.contrib import admin
from .models import HeroBanner, AnnouncementBar, ContentBlock

@admin.register(HeroBanner)
class HeroBannerAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order', 'start_date', 'end_date')
    list_filter = ('is_active',)
    search_fields = ('title', 'subtitle')
    ordering = ('order', '-created_at')

@admin.register(AnnouncementBar)
class AnnouncementBarAdmin(admin.ModelAdmin):
    list_display = ('text', 'is_active', 'start_date', 'end_date')
    list_filter = ('is_active',)
    search_fields = ('text',)

@admin.register(ContentBlock)
class ContentBlockAdmin(admin.ModelAdmin):
    list_display = ('name', 'block_type', 'is_active', 'order', 'start_date', 'end_date')
    list_filter = ('block_type', 'is_active')
    search_fields = ('name', 'title')
    ordering = ('order', '-created_at')
    filter_horizontal = ('products', 'categories')
