from django.db import models

class HeroBanner(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.TextField(blank=True, null=True)
    image_url = models.URLField()
    image_alt = models.CharField(max_length=255, blank=True, null=True)
    cta_text = models.CharField(max_length=50, blank=True, null=True)
    cta_link = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return self.title

class AnnouncementBar(models.Model):
    text = models.TextField()
    link = models.CharField(max_length=255, blank=True, null=True)
    background_color = models.CharField(max_length=20, default="#000000")
    text_color = models.CharField(max_length=20, default="#FFFFFF")
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.text[:50]

class ContentBlock(models.Model):
    BLOCK_TYPES = (
        ('featured_products', 'Featured Products'),
        ('categories', 'Categories'),
        ('text', 'Custom Text'),
        ('promotion', 'Promotion'),
    )

    name = models.CharField(max_length=100)
    block_type = models.CharField(max_length=20, choices=BLOCK_TYPES)
    title = models.CharField(max_length=255, blank=True, null=True)
    subtitle = models.TextField(blank=True, null=True)
    content = models.TextField(blank=True, null=True) # For custom text
    image_url = models.URLField(blank=True, null=True)
    image_alt = models.CharField(max_length=255, blank=True, null=True)
    cta_text = models.CharField(max_length=50, blank=True, null=True)
    cta_link = models.CharField(max_length=255, blank=True, null=True)
    products = models.ManyToManyField('products.Product', blank=True)
    categories = models.ManyToManyField('categories.Category', blank=True)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['order', '-created_at']

    def __str__(self):
        return f"{self.get_block_type_display()} - {self.name}"
