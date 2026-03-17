from rest_framework import serializers
from .models import Restaurant, Category, Review
from accounts.serializers import UserSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model  = Category
        fields = '__all__'


class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model  = Review
        fields = ['id', 'user', 'rating', 'comment', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']


class RestaurantSerializer(serializers.ModelSerializer):
    category     = CategorySerializer(read_only=True)
    category_id  = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )
    reviews      = ReviewSerializer(many=True, read_only=True)
    owner_name   = serializers.CharField(source='owner.username', read_only=True)

    class Meta:
        model  = Restaurant
        fields = [
            'id', 'name', 'description', 'category', 'category_id',
            'image', 'address', 'city', 'phone', 'email',
            'rating', 'total_reviews', 'delivery_time', 'delivery_fee',
            'min_order', 'is_open', 'is_featured', 'owner_name',
            'reviews', 'created_at',
        ]
        read_only_fields = ['id', 'rating', 'total_reviews', 'created_at']


class RestaurantListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    category_icon = serializers.CharField(source='category.icon', read_only=True)

    class Meta:
        model  = Restaurant
        fields = [
            'id', 'name', 'description', 'category_name', 'category_icon',
            'image', 'city', 'rating', 'total_reviews', 'delivery_time',
            'delivery_fee', 'min_order', 'is_open', 'is_featured',
        ]
