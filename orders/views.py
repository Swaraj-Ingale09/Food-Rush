from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions, status
from django.shortcuts import get_object_or_404
from .models import Order, OrderItem
from .serializers import OrderSerializer, PlaceOrderSerializer, UpdateOrderStatusSerializer
from cart.models import Cart


class PlaceOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = PlaceOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        try:
            cart = Cart.objects.prefetch_related('items__menu_item').get(user=request.user)
        except Cart.DoesNotExist:
            return Response({'error': 'Cart is empty.'}, status=400)

        if not cart.items.exists():
            return Response({'error': 'Cart is empty.'}, status=400)

        data = serializer.validated_data
        subtotal     = cart.total
        delivery_fee = cart.restaurant.delivery_fee
        total        = subtotal + delivery_fee

        order = Order.objects.create(
            user=request.user,
            restaurant=cart.restaurant,
            delivery_address=data['delivery_address'],
            delivery_city=data['delivery_city'],
            delivery_phone=data['delivery_phone'],
            payment_method=data['payment_method'],
            special_instructions=data.get('special_instructions', ''),
            subtotal=subtotal,
            delivery_fee=delivery_fee,
            total=total,
            estimated_delivery=cart.restaurant.delivery_time + 15,
        )

        # Snapshot cart items
        for cart_item in cart.items.all():
            OrderItem.objects.create(
                order=order,
                menu_item=cart_item.menu_item,
                name=cart_item.menu_item.name,
                price=cart_item.menu_item.price,
                quantity=cart_item.quantity,
                subtotal=cart_item.subtotal,
                special_instructions=cart_item.special_instructions,
            )

        # Clear cart
        cart.items.all().delete()
        cart.restaurant = None
        cart.save()

        return Response(OrderSerializer(order).data, status=201)


class OrderListView(generics.ListAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items')


class UpdateOrderStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        order = get_object_or_404(Order, pk=pk, restaurant__owner=request.user)
        serializer = UpdateOrderStatusSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)
        order.status = serializer.validated_data['status']
        order.save()
        return Response(OrderSerializer(order).data)


class RestaurantOrdersView(generics.ListAPIView):
    serializer_class   = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            restaurant__owner=self.request.user
        ).prefetch_related('items').select_related('user', 'restaurant')


class CancelOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk, user=request.user)
        if order.status not in ['pending', 'confirmed']:
            return Response({'error': 'Cannot cancel this order.'}, status=400)
        order.status = 'cancelled'
        order.save()
        return Response(OrderSerializer(order).data)
