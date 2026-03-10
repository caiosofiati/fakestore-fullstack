import type { Order, ApiResponse } from '../types';

const API_BASE = 'http://localhost:3000/api';

export const ordersApi = {
  getAll: async (): Promise<Order[]> => {
    const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Falha ao carregar os pedidos');
    const json: ApiResponse<Order[]> = await res.json();
    return json.data;
  },

  getById: async (id: number): Promise<Order> => {
    const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Falha ao carregar o pedido');
    const json: ApiResponse<Order> = await res.json();
    return json.data;
  },

  checkout: async (): Promise<Order> => {
    const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
    const res = await fetch(`${API_BASE}/orders/checkout`, { 
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Falha ao finalizar compra');
    }
    const json: ApiResponse<Order> = await res.json();
    return json.data;
  },
};
