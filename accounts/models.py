from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('customer', 'Customer'),
        ('restaurant_owner', 'Restaurant Owner'),
        ('delivery_agent', 'Delivery Agent'),
    ]
    email      = models.EmailField(unique=True)
    phone      = models.CharField(max_length=20, blank=True)
    role       = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    avatar     = models.ImageField(upload_to='avatars/', blank=True, null=True)
    address    = models.TextField(blank=True)
    city       = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.email} ({self.role})"
