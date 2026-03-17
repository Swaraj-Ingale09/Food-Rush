from rest_framework import serializers
from .models import Order, OrderItem


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = OrderItem
        fields = ['id', 'name', 'price', 'quantity', 'subtotal', 'special_instructions']


class OrderSerializer(serializers.ModelSerializer):
    items           = OrderItemSerializer(many=True, read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)
    restaurant_image = serializers.ImageField(source='restaurant.image', read_only=True)
    user_email      = serializers.CharField(source='user.email', read_only=True)
    status_display  = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model  = Order
        fields = [
            'id', 'restaurant', 'restaurant_name', 'restaurant_image',
            'user_email', 'status', 'status_display',
            'payment_method', 'payment_status',
            'delivery_address', 'delivery_city', 'delivery_phone',
            'special_instructions',
            'subtotal', 'delivery_fee', 'total',
            'estimated_delivery', 'items', 'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'status', 'subtotal', 'delivery_fee', 'total', 'created_at', 'updated_at']


class PlaceOrderSerializer(serializers.Serializer):
    delivery_address     = serializers.CharField()
    delivery_city        = serializers.CharField()
    delivery_phone       = serializers.CharField()
    payment_method       = serializers.ChoiceField(choices=['cod', 'card', 'wallet'])
    special_instructions = serializers.CharField(required=False, allow_blank=True)


class UpdateOrderStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=[
        'pending', 'confirmed', 'preparing', 'ready', 'on_the_way', 'delivered', 'cancelled'
    ])
