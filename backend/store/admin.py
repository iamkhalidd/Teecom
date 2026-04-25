from django.contrib import admin
from .models import (Category, Product, ProductImage, Cart, CartItem,
                     Order, OrderItem, Address, Coupon, SpecialOffer,
                     Wishlist, NewsletterSubscriber, Review)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'stock_quantity', 'status', 'created_at')
    list_filter = ('status', 'category', 'brand')
    search_fields = ('name', 'description', 'slug')
    prepopulated_fields = {'slug': ('name',)}
    inlines = [ProductImageInline]

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'parent')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'user', 'status', 'total', 'created_at')
    list_filter = ('status', 'payment_status')
    search_fields = ('order_number', 'user__email')

admin.site.register(ProductImage)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(OrderItem)
admin.site.register(Address)
admin.site.register(Coupon)
admin.site.register(SpecialOffer)
admin.site.register(Wishlist)
admin.site.register(NewsletterSubscriber)
admin.site.register(Review)
