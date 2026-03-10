import type { WishlistItem, ApiResponse } from '../types';

const API_BASE = 'http://localhost:3000/api';

export async function fetchWishlist(): Promise<WishlistItem[]> {
  const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
  const res = await fetch(`${API_BASE}/wishlist`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Falha ao carregar a lista de desejos');
  const json: ApiResponse<WishlistItem[]> = await res.json();
  return json.data;
}

export async function addToWishlist(item: {
  productId: number;
  title: string;
  price: number;
  image: string;
  notes?: string;
  priority?: string;
}): Promise<WishlistItem> {
  const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
  const res = await fetch(`${API_BASE}/wishlist`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(item),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Falha ao adicionar à lista de desejos');
  }
  const json: ApiResponse<WishlistItem> = await res.json();
  return json.data;
}

export async function updateWishlistItem(
  id: number,
  data: { notes?: string; priority?: string },
): Promise<WishlistItem> {
  const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
  const res = await fetch(`${API_BASE}/wishlist/${id}`, {
    method: 'PATCH',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Falha ao atualizar item da lista de desejos');
  const json: ApiResponse<WishlistItem> = await res.json();
  return json.data;
}

export async function removeFromWishlist(id: number): Promise<void> {
  const token = JSON.parse(localStorage.getItem('fakestore_auth') || '{}')?.token;
  const res = await fetch(`${API_BASE}/wishlist/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Falha ao remover item da lista de desejos');
}
