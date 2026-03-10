import type { Order } from '../types';

interface OrderConfirmationProps {
  order: Order;
  onViewOrders: () => void;
  onContinueShopping: () => void;
}

export default function OrderConfirmation({
  order,
  onViewOrders,
  onContinueShopping,
}: OrderConfirmationProps) {
  return (
    <div className="page-container">
      <div className="confirmation-container">
        <div className="confirmation-animation">
          <span className="checkmark">✓</span>
        </div>

        <h1 className="confirmation-title">Compra Realizada! 🎉</h1>
        <p className="confirmation-subtitle">
          Seu pedido #{order.id} foi confirmado com sucesso.
        </p>

        <div className="confirmation-details">
          <div className="confirmation-row">
            <span>Número do Pedido</span>
            <span className="order-number">#{order.id}</span>
          </div>
          <div className="confirmation-row">
            <span>Data</span>
            <span>{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="confirmation-row">
            <span>Itens</span>
            <span>{order.items.length} produto(s)</span>
          </div>
          <div className="confirmation-row confirmation-total">
            <span>Total Pago</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>

        <div className="confirmation-items">
          <h3>Itens do Pedido</h3>
          {order.items.map((item) => (
            <div key={item.id} className="confirmation-item">
              <img src={item.image} alt={item.title} />
              <div>
                <span className="confirmation-item-title">{item.title}</span>
                <span className="confirmation-item-qty">
                  Qtd: {item.quantity} × ${item.price.toFixed(2)}
                </span>
              </div>
              <span className="confirmation-item-price">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="confirmation-actions">
          <button className="btn-secondary" onClick={onViewOrders}>
            📋 Ver Meus Pedidos
          </button>
          <button className="btn-primary" onClick={onContinueShopping}>
            🛍️ Continuar Comprando
          </button>
        </div>
      </div>
    </div>
  );
}
