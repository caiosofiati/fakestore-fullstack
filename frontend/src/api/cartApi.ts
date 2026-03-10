import type { CartItem, ApiResponse } from '../types';

const API_BASE = 'http://localhost:3000/api';

export const cartApi = {
  getAll: async (): Promise<CartItem[]> => {
    console.log('🛒 [Frontend/Cart] Puxando carrinho protegido... Enviando JWT Bearer para validação');
    const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
    const res = await fetch(`${API_BASE}/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Falha ao carregar o carrinho');
    
    const json: ApiResponse<CartItem[]> = await res.json();
    
    if (Array.isArray(json.data)) {
      console.log(`📦 [Frontend/Cart] Itens do carrinho Locais lidos: ${json.data.length} encontrados na Base.`);
      return json.data;
    }
    
    return [];
  },

  add: async (item: {
    productId: number;
    title: string;
    price: number;
    image: string;
    quantity?: number;
  }): Promise<CartItem> => {
    const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(item),
    });
    if (!res.ok) throw new Error('Falha ao adicionar ao carrinho');
    const json: ApiResponse<CartItem> = await res.json();
    console.log(`➕ [Frontend/Cart] Produto adicionado com sucesso! (ID Local: ${json.data.id})`);
    return json.data;
  },

  updateQuantity: async (id: number, quantity: number): Promise<CartItem> => {
    const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
    const res = await fetch(`${API_BASE}/cart/${id}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error('Falha ao atualizar a quantidade');
    const json: ApiResponse<CartItem> = await res.json();
    return json.data;
  },

  remove: async (id: number): Promise<void> => {
    const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
    const res = await fetch(`${API_BASE}/cart/${id}`, { 
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Falha ao remover do carrinho');
  },

  clear: async (): Promise<void> => {
    const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
    const res = await fetch(`${API_BASE}/cart/clear`, { 
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error('Falha ao limpar o carrinho');
  },
};
