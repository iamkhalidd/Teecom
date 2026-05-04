from django.db import models

class ShippingZone(models.Model):
    name = models.CharField(max_length=100)
    countries = models.JSONField(default=list) # List of country codes
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class ShippingMethod(models.Model):
    zone = models.ForeignKey(ShippingZone, on_delete=models.CASCADE, related_name='methods', null=True, blank=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    free_shipping_threshold = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estimated_delivery = models.CharField(max_length=100) # e.g., "3-5 business days"
    tracking_url_format = models.CharField(max_length=255, blank=True, null=True) # e.g., "https://fedex.com/track/{tracking_number}"
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
