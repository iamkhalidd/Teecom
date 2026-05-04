from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Product, ProductVariant, InventoryMovement
from django.db import transaction

@receiver(pre_save, sender=Product)
def track_product_stock_change(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = Product.objects.get(pk=instance.pk)
            if old_instance.stock_quantity != instance.stock_quantity:
                quantity_change = instance.stock_quantity - old_instance.stock_quantity

                # We skip creating movement here if it's handled by a service
                # that explicitly sets the 'type' and 'user'.
                # But for general safety (e.g. Django Admin), we can log as 'manual'
                # if no current transaction context specifies otherwise.
                # Actually, a better pattern might be a service method.
                # However, the user asked for "automation".

                # Check if we are already handling this in a specific way
                if not hasattr(instance, '_inventory_movement_handled'):
                    InventoryMovement.objects.create(
                        product=instance,
                        type='manual',
                        quantity_change=quantity_change,
                        previous_quantity=old_instance.stock_quantity,
                        new_quantity=instance.stock_quantity,
                        reason="Automatic log from stock update"
                    )
        except Product.DoesNotExist:
            pass

@receiver(pre_save, sender=ProductVariant)
def track_variant_stock_change(sender, instance, **kwargs):
    if instance.pk:
        try:
            old_instance = ProductVariant.objects.get(pk=instance.pk)
            if old_instance.stock_quantity != instance.stock_quantity:
                quantity_change = instance.stock_quantity - old_instance.stock_quantity

                if not hasattr(instance, '_inventory_movement_handled'):
                    InventoryMovement.objects.create(
                        product=instance.product,
                        variant=instance,
                        type='manual',
                        quantity_change=quantity_change,
                        previous_quantity=old_instance.stock_quantity,
                        new_quantity=instance.stock_quantity,
                        reason="Automatic log from stock update"
                    )
        except ProductVariant.DoesNotExist:
            pass
