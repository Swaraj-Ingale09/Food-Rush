from django.db import models
from restaurant.models import Restaurant


class MenuCategory(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_categories')
    name       = models.CharField(max_length=100)
    order      = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.restaurant.name} – {self.name}"

    class Meta:
        ordering = ['order']


class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='menu_items')
    category   = models.ForeignKey(MenuCategory, on_delete=models.SET_NULL, null=True, blank=True, related_name='items')
    name        = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price       = models.DecimalField(max_digits=8, decimal_places=2)
    image       = models.ImageField(upload_to='menu_items/', blank=True, null=True)
    is_available  = models.BooleanField(default=True)
    is_veg        = models.BooleanField(default=False)
    is_featured   = models.BooleanField(default=False)
    spice_level   = models.IntegerField(
        choices=[(0, 'None'), (1, 'Mild'), (2, 'Medium'), (3, 'Hot'), (4, 'Extra Hot')],
        default=0
    )
    prep_time    = models.IntegerField(default=15, help_text='Minutes')
    calories     = models.IntegerField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} (${self.price})"

    class Meta:
        ordering = ['category__order', 'name']
