from rest_framework import generics, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Q
from .models import Restaurant, Category, Review
from .serializers import (
    RestaurantSerializer, RestaurantListSerializer,
    CategorySerializer, ReviewSerializer,
)


class CategoryListView(generics.ListAPIView):
    queryset         = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class RestaurantListView(generics.ListAPIView):
    serializer_class   = RestaurantListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = Restaurant.objects.select_related('category').all()
        search   = self.request.query_params.get('search', '')
        city     = self.request.query_params.get('city', '')
        category = self.request.query_params.get('category', '')
        featured = self.request.query_params.get('featured', '')
        sort     = self.request.query_params.get('sort', '')

        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if city:
            qs = qs.filter(city__icontains=city)
        if category:
            qs = qs.filter(category__name__icontains=category)
        if featured == 'true':
            qs = qs.filter(is_featured=True)
        if sort == 'rating':
            qs = qs.order_by('-rating')
        elif sort == 'delivery':
            qs = qs.order_by('delivery_time')
        elif sort == 'fee':
            qs = qs.order_by('delivery_fee')
        return qs


class RestaurantDetailView(generics.RetrieveAPIView):
    queryset           = Restaurant.objects.prefetch_related('reviews__user', 'menu_items').all()
    serializer_class   = RestaurantSerializer
    permission_classes = [permissions.AllowAny]


class RestaurantCreateView(generics.CreateAPIView):
    serializer_class   = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class RestaurantUpdateView(generics.UpdateAPIView):
    serializer_class   = RestaurantSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Restaurant.objects.filter(owner=self.request.user)


class ReviewCreateView(generics.CreateAPIView):
    serializer_class   = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = Restaurant.objects.get(pk=self.kwargs['restaurant_id'])
        review = serializer.save(user=self.request.user, restaurant=restaurant)
        # Recalculate rating
        reviews = restaurant.reviews.all()
        restaurant.rating = round(sum(r.rating for r in reviews) / reviews.count(), 1)
        restaurant.total_reviews = reviews.count()
        restaurant.save()


class MyRestaurantsView(generics.ListAPIView):
    serializer_class   = RestaurantListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Restaurant.objects.filter(owner=self.request.user)
