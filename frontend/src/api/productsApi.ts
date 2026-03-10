import type { Product, ApiResponse } from '../types';

const API_BASE = 'http://localhost:3000/api';

export async function fetchProducts(): Promise<Product[]> {
  console.log('📡 [Frontend/Products] Solicitando lista de todos os Produtos ao Backend (Proxy para FakeStore)...');
  const res = await fetch(`${API_BASE}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  const json: ApiResponse<Product[]> = await res.json();
  console.log(`📦 [Frontend/Products] Recebidos ${json.data.length} produtos do Backend!`);
  return json.data;
}

export async function fetchProduct(id: number): Promise<Product> {
  console.log(`📡 [Frontend/Products] Solicitando detalhes do Produto ID ${id}...`);
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch product ${id}`);
  const json: ApiResponse<Product> = await res.json();
  console.log(`📦 [Frontend/Products] Detalhes recebidos para: ${json.data.title}`);
  return json.data;
}
