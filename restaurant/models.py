from django.db import models
from accounts.models import User


class Category(models.Model):
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, default='🍽️')

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Categories'


class Restaurant(models.Model):
    owner       = models.ForeignKey(User, on_delete=models.CASCADE, related_name='restaurants')
    name        = models.CharField(max_length=200)
    description = models.TextField()
    category    = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name='restaurants')
    image       = models.ImageField(upload_to='restaurants/', blank=True, null=True)
    address     = models.TextField()
    city        = models.CharField(max_length=100)
    phone       = models.CharField(max_length=20)
    email       = models.EmailField(blank=True)
    rating      = models.DecimalField(max_digits=3, decimal_places=1, default=0.0)
    total_reviews = models.IntegerField(default=0)
    delivery_time = models.IntegerField(default=30, help_text='Minutes')
    delivery_fee  = models.DecimalField(max_digits=6, decimal_places=2, default=2.99)
    min_order     = models.DecimalField(max_digits=6, decimal_places=2, default=10.00)
    is_open       = models.BooleanField(default=True)
    is_featured   = models.BooleanField(default=False)
    created_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Review(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='reviews')
    user       = models.ForeignKey(User, on_delete=models.CASCADE)
    rating     = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment    = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} → {self.restaurant.name} ({self.rating}★)"
