from django.urls import path
from .views import (
    PlaceOrderView, OrderListView, OrderDetailView,
    UpdateOrderStatusView, RestaurantOrdersView, CancelOrderView,
)

urlpatterns = [
    path('',                    OrderListView.as_view(),         name='order-list'),
    path('place/',              PlaceOrderView.as_view(),        name='place-order'),
    path('restaurant/',         RestaurantOrdersView.as_view(),  name='restaurant-orders'),
    path('<int:pk>/',           OrderDetailView.as_view(),       name='order-detail'),
    path('<int:pk>/status/',    UpdateOrderStatusView.as_view(), name='order-status'),
    path('<int:pk>/cancel/',    CancelOrderView.as_view(),       name='cancel-order'),
]
