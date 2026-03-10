export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating?: {
    rate: number;
    count: number;
  };
}

export interface WishlistItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  image: string;
  notes: string | null;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Order {
  id: number;
  total: number;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
}
