from rest_framework import generics, permissions
from rest_framework.response import Response
from django.db.models import Q
from .models import MenuItem, MenuCategory
from .serializers import MenuItemSerializer, MenuItemCreateSerializer, MenuCategorySerializer
from restaurant.models import Restaurant


class MenuItemListView(generics.ListAPIView):
    serializer_class   = MenuItemSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = MenuItem.objects.select_related('category', 'restaurant').filter(is_available=True)
        restaurant_id = self.request.query_params.get('restaurant')
        category      = self.request.query_params.get('category')
        is_veg        = self.request.query_params.get('veg')
        search        = self.request.query_params.get('search')
        featured      = self.request.query_params.get('featured')

        if restaurant_id:
            qs = qs.filter(restaurant_id=restaurant_id)
        if category:
            qs = qs.filter(category__name__icontains=category)
        if is_veg == 'true':
            qs = qs.filter(is_veg=True)
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if featured == 'true':
            qs = qs.filter(is_featured=True)
        return qs


class MenuItemDetailView(generics.RetrieveAPIView):
    queryset           = MenuItem.objects.all()
    serializer_class   = MenuItemSerializer
    permission_classes = [permissions.AllowAny]


class MenuItemCreateView(generics.CreateAPIView):
    serializer_class   = MenuItemCreateSerializer
    permission_classes = [permissions.IsAuthenticated]


class MenuItemUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class   = MenuItemCreateSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MenuItem.objects.filter(restaurant__owner=self.request.user)


class MenuCategoryListView(generics.ListCreateAPIView):
    serializer_class   = MenuCategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        restaurant_id = self.request.query_params.get('restaurant')
        if restaurant_id:
            return MenuCategory.objects.filter(restaurant_id=restaurant_id)
        return MenuCategory.objects.all()
