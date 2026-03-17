from django.urls import path
from .views import (
    CategoryListView, RestaurantListView, RestaurantDetailView,
    RestaurantCreateView, RestaurantUpdateView,
    ReviewCreateView, MyRestaurantsView,
)

urlpatterns = [
    path('',              RestaurantListView.as_view(),   name='restaurant-list'),
    path('create/',       RestaurantCreateView.as_view(), name='restaurant-create'),
    path('my/',           MyRestaurantsView.as_view(),    name='my-restaurants'),
    path('<int:pk>/',     RestaurantDetailView.as_view(), name='restaurant-detail'),
    path('<int:pk>/update/', RestaurantUpdateView.as_view(), name='restaurant-update'),
    path('<int:restaurant_id>/reviews/', ReviewCreateView.as_view(), name='review-create'),
    path('categories/',   CategoryListView.as_view(),     name='category-list'),
]
