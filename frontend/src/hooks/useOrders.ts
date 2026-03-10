import { useState, useCallback, useEffect } from 'react';
import type { Order } from '../types';
import { ordersApi } from '../api/ordersApi';
import { useAuth } from './useAuth';

export function useOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    
    try {
      setLoading(true);
      const data = await ordersApi.getAll();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao buscar pedidos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Fetch orders when user changes or initially
  useEffect(() => {
    if (user) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [fetchOrders, user]);

  const checkout = useCallback(async (): Promise<Order | undefined> => {
    if (!user) throw new Error('Usuário precisa estar logado para finalizar a compra');
    const order = await ordersApi.checkout();
    await fetchOrders();
    return order;
  }, [user, fetchOrders]);

  return {
    orders,
    loading,
    error,
    fetchOrders,
    checkout,
  };
}
