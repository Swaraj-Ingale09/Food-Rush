from django.db import models
from accounts.models import User
from menu.models import MenuItem
from restaurant.models import Restaurant


class Order(models.Model):
    STATUS_CHOICES = [
        ('pending',    'Pending'),
        ('confirmed',  'Confirmed'),
        ('preparing',  'Preparing'),
        ('ready',      'Ready for Pickup'),
        ('on_the_way', 'On The Way'),
        ('delivered',  'Delivered'),
        ('cancelled',  'Cancelled'),
    ]
    PAYMENT_CHOICES = [
        ('cod',    'Cash on Delivery'),
        ('card',   'Credit/Debit Card'),
        ('wallet', 'Digital Wallet'),
    ]

    user            = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    restaurant      = models.ForeignKey(Restaurant, on_delete=models.CASCADE, related_name='orders')
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    payment_method  = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='cod')
    payment_status  = models.CharField(max_length=20, default='pending')
    delivery_address = models.TextField()
    delivery_city    = models.CharField(max_length=100)
    delivery_phone   = models.CharField(max_length=20)
    special_instructions = models.TextField(blank=True)
    subtotal        = models.DecimalField(max_digits=10, decimal_places=2)
    delivery_fee    = models.DecimalField(max_digits=6,  decimal_places=2)
    total           = models.DecimalField(max_digits=10, decimal_places=2)
    estimated_delivery = models.IntegerField(default=45, help_text='Minutes')
    created_at      = models.DateTimeField(auto_now_add=True)
    updated_at      = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Order #{self.pk} by {self.user.email} – {self.status}"


class OrderItem(models.Model):
    order     = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.SET_NULL, null=True)
    name      = models.CharField(max_length=200)   # snapshot
    price     = models.DecimalField(max_digits=8, decimal_places=2)  # snapshot
    quantity  = models.IntegerField()
    subtotal  = models.DecimalField(max_digits=10, decimal_places=2)
    special_instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.name}"
