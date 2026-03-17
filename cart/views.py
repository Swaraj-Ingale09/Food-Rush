from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from .models import Cart, CartItem
from .serializers import CartSerializer, AddToCartSerializer
from menu.models import MenuItem


class CartView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def _get_cart(self, user):
        cart, _ = Cart.objects.get_or_create(user=user)
        return cart

    def get(self, request):
        cart = self._get_cart(request.user)
        return Response(CartSerializer(cart).data)

    def post(self, request):
        """Add item to cart"""
        serializer = AddToCartSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        menu_item_id = serializer.validated_data['menu_item_id']
        quantity     = serializer.validated_data['quantity']
        instructions = serializer.validated_data.get('special_instructions', '')

        try:
            menu_item = MenuItem.objects.get(pk=menu_item_id, is_available=True)
        except MenuItem.DoesNotExist:
            return Response({'error': 'Menu item not found or unavailable.'}, status=404)

        cart = self._get_cart(request.user)

        # If cart has items from different restaurant, clear it
        if cart.restaurant and cart.restaurant != menu_item.restaurant:
            cart.items.all().delete()

        cart.restaurant = menu_item.restaurant
        cart.save()

        # Update or create cart item
        cart_item, created = CartItem.objects.get_or_create(
            cart=cart, menu_item=menu_item,
            defaults={'quantity': quantity, 'special_instructions': instructions}
        )
        if not created:
            cart_item.quantity += quantity
            cart_item.save()

        return Response(CartSerializer(cart).data, status=201)

    def delete(self, request):
        """Clear the cart"""
        cart = self._get_cart(request.user)
        cart.items.all().delete()
        cart.restaurant = None
        cart.save()
        return Response({'message': 'Cart cleared.'})


class CartItemView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        """Update item quantity"""
        try:
            item = CartItem.objects.get(pk=pk, cart__user=request.user)
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=404)

        quantity = request.data.get('quantity', 1)
        if int(quantity) <= 0:
            item.delete()
        else:
            item.quantity = quantity
            item.save()

        cart = Cart.objects.get(user=request.user)
        return Response(CartSerializer(cart).data)

    def delete(self, request, pk):
        """Remove single item"""
        try:
            item = CartItem.objects.get(pk=pk, cart__user=request.user)
            item.delete()
        except CartItem.DoesNotExist:
            return Response({'error': 'Item not found.'}, status=404)

        cart = Cart.objects.get(user=request.user)
        if not cart.items.exists():
            cart.restaurant = None
            cart.save()
        return Response(CartSerializer(cart).data)
