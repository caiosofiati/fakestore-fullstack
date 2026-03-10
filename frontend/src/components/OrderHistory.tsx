import { useEffect } from 'react';
import type { Order } from '../types';

interface OrderHistoryProps {
  orders: Order[];
  loading: boolean;
  error: string | null;
  onFetch: () => void;
}

export default function OrderHistory({
  orders,
  loading,
  error,
  onFetch,
}: OrderHistoryProps) {
  useEffect(() => {
    onFetch();
  }, [onFetch]);

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-state">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1>📋 Meus Pedidos</h1>
      <p className="page-subtitle">
        {orders.length === 0
          ? 'Você ainda não fez nenhum pedido.'
          : `${orders.length} pedido(s) realizados`}
      </p>

      {orders.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">📦</span>
          <h2>Nenhum pedido</h2>
          <p>Faça sua primeira compra!</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <div className="order-meta">
                  <span className="order-id">Pedido #{order.id}</span>
                  <span className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <div className="order-status-badge">
                  <span className="status-dot"></span>
                  {order.status === 'completed' ? 'Concluído' : order.status}
                </div>
              </div>

              <div className="order-items-preview">
                {order.items.map((item) => (
                  <div key={item.id} className="order-item-row">
                    <img src={item.image} alt={item.title} />
                    <div className="order-item-info">
                      <span className="order-item-title">{item.title}</span>
                      <span className="order-item-qty">
                        Qtd: {item.quantity}
                      </span>
                    </div>
                    <span className="order-item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <span className="order-total">
                  Total: <strong>${order.total.toFixed(2)}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
