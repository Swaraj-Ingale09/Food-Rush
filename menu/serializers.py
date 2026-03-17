from rest_framework import serializers
from .models import MenuItem, MenuCategory


class MenuCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = MenuCategory
        fields = ['id', 'name', 'order']


class MenuItemSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model  = MenuItem
        fields = [
            'id', 'restaurant', 'category', 'category_name', 'name',
            'description', 'price', 'image', 'is_available', 'is_veg',
            'is_featured', 'spice_level', 'prep_time', 'calories', 'created_at',
        ]
        read_only_fields = ['id', 'created_at']


class MenuItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model  = MenuItem
        fields = [
            'id', 'restaurant', 'category', 'name', 'description', 'price',
            'image', 'is_available', 'is_veg', 'is_featured',
            'spice_level', 'prep_time', 'calories',
        ]
