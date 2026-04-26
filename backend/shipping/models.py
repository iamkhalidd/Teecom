from django.db import models

class ShippingMethod(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_delivery = models.CharField(max_length=100) # e.g., "3-5 business days"
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name
