import { useState, useEffect, useCallback } from 'react';
import type { WishlistItem } from '../types';
import {
  fetchWishlist,
  addToWishlist,
  updateWishlistItem,
  removeFromWishlist,
} from '../api/wishlistApi';
import { useAuth } from './useAuth';

export function useWishlist() {
  const { user } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) {
      setItems([]);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWishlist();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const add = useCallback(
    async (item: {
      productId: number;
      title: string;
      price: number;
      image: string;
      notes?: string;
      priority?: string;
    }) => {
      if (!user) throw new Error('O usuário precisa estar logado');
      const newItem = await addToWishlist({ ...item });
      setItems((prev) => [newItem, ...prev]);
      return newItem;
    },
    [user],
  );

  const update = useCallback(
    async (id: number, data: { notes?: string; priority?: string }) => {
      if (!user) throw new Error('O usuário precisa estar logado');
      const updated = await updateWishlistItem(id, data);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      return updated;
    },
    [user],
  );

  const remove = useCallback(async (id: number) => {
    if (!user) throw new Error('O usuário precisa estar logado');
    await removeFromWishlist(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, [user]);

  const isInWishlist = useCallback(
    (productId: number) => items.some((i) => i.productId === productId),
    [items],
  );

  return { items, loading, error, add, update, remove, isInWishlist, refetch: load };
}
