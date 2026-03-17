from django.urls import path
from .views import (
    MenuItemListView, MenuItemDetailView,
    MenuItemCreateView, MenuItemUpdateView, MenuCategoryListView,
)

urlpatterns = [
    path('',             MenuItemListView.as_view(),   name='menu-list'),
    path('create/',      MenuItemCreateView.as_view(), name='menu-create'),
    path('categories/',  MenuCategoryListView.as_view(), name='menu-categories'),
    path('<int:pk>/',    MenuItemDetailView.as_view(), name='menu-detail'),
    path('<int:pk>/edit/', MenuItemUpdateView.as_view(), name='menu-update'),
]
