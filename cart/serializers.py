from rest_framework import serializers
from .models import Cart, CartItem
from menu.serializers import MenuItemSerializer


class CartItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemSerializer(source='menu_item', read_only=True)
    subtotal         = serializers.DecimalField(max_digits=8, decimal_places=2, read_only=True)

    class Meta:
        model  = CartItem
        fields = ['id', 'menu_item', 'menu_item_detail', 'quantity',
                  'special_instructions', 'subtotal']


class CartSerializer(serializers.ModelSerializer):
    items        = CartItemSerializer(many=True, read_only=True)
    total        = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count   = serializers.IntegerField(read_only=True)
    restaurant_name = serializers.CharField(source='restaurant.name', read_only=True)

    class Meta:
        model  = Cart
        fields = ['id', 'restaurant', 'restaurant_name', 'items', 'total', 'item_count', 'updated_at']


class AddToCartSerializer(serializers.Serializer):
    menu_item_id = serializers.IntegerField()
    quantity     = serializers.IntegerField(min_value=1, default=1)
    special_instructions = serializers.CharField(required=False, allow_blank=True)
