import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart]         = useState(null);
  const [isOpen, setIsOpen]     = useState(false);
  const [loading, setLoading]   = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) return;
    try {
      const { data } = await cartAPI.get();
      setCart(data);
    } catch {}
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (menuItemId, quantity = 1, instructions = '') => {
    if (!user) { toast.error('Please login to add items.'); return; }
    setLoading(true);
    try {
      const { data } = await cartAPI.add({ menu_item_id: menuItemId, quantity, special_instructions: instructions });
      setCart(data);
      toast.success('Added to cart! 🛒');
      setIsOpen(true);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to add item.');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.updateItem(itemId, { quantity });
      setCart(data);
    } catch {}
  };

  const removeItem = async (itemId) => {
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data);
      toast.success('Item removed.');
    } catch {}
  };

  const clearCart = async () => {
    try {
      await cartAPI.clear();
      setCart(prev => prev ? { ...prev, items: [], total: '0.00', item_count: 0, restaurant: null } : null);
    } catch {}
  };

  const itemCount = cart?.item_count || 0;
  const total     = parseFloat(cart?.total || 0);

  return (
    <CartContext.Provider value={{
      cart, itemCount, total, isOpen, loading,
      setIsOpen, addToCart, updateItem, removeItem, clearCart, fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
