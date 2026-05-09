from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

class SEOMetadata(models.Model):
    # Link to any model (Product, Category, etc.)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    title = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    canonical_url = models.URLField(blank=True, null=True)
    og_title = models.CharField(max_length=255, blank=True, null=True)
    og_description = models.TextField(blank=True, null=True)
    og_image = models.URLField(blank=True, null=True)
    index = models.BooleanField(default=True)
    follow = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "SEO Metadata"
        verbose_name_plural = "SEO Metadata"
        unique_together = ('content_type', 'object_id')

    def __str__(self):
        return f"SEO for {self.content_object}"

class Redirect(models.Model):
    REDIRECT_TYPES = (
        (301, 'Permanent (301)'),
        (302, 'Temporary (302)'),
    )

    source_path = models.CharField(max_length=255, unique=True)
    destination_path = models.CharField(max_length=255)
    type = models.IntegerField(choices=REDIRECT_TYPES, default=301)
    is_active = models.BooleanField(default=True)
    hit_count = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.source_path} -> {self.destination_path}"
