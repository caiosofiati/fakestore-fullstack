import { useState, useEffect, useCallback } from 'react';
import type { CartItem } from '../types';
import { cartApi } from '../api/cartApi';
import { useAuth } from './useAuth';

export function useCart() {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    
    try {
      setLoading(true);
      const data = await cartApi.getAll();
      setItems(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar o carrinho');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = useCallback(
    async (product: {
      productId: number;
      title: string;
      price: number;
      image: string;
    }) => {
      if (!user) throw new Error('O usuário precisa estar logado');
      const result = await cartApi.add({ ...product });
      await fetchCart();
      return result;
    },
    [fetchCart, user],
  );

  const updateQuantity = useCallback(
    async (id: number, quantity: number) => {
      if (!user) throw new Error('O usuário precisa estar logado');
      await cartApi.updateQuantity(id, quantity);
      await fetchCart();
    },
    [fetchCart, user],
  );

  const removeFromCart = useCallback(
    async (id: number) => {
      if (!user) throw new Error('O usuário precisa estar logado');
      await cartApi.remove(id);
      await fetchCart();
    },
    [fetchCart, user],
  );

  const clearCart = useCallback(async () => {
    if (!user) throw new Error('O usuário precisa estar logado');
    await cartApi.clear();
    setItems([]);
  }, [user]);

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.productId === productId),
    [items],
  );

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    items,
    loading,
    error,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    totalItems,
    totalPrice,
    refresh: fetchCart,
  };
}
