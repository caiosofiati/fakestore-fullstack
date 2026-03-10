import { useState } from 'react';
import type { CartItem } from '../types';

interface CartPageProps {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  totalPrice: number;
  onUpdateQuantity: (id: number, quantity: number) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
  onClear: () => Promise<void>;
  onCheckout: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function CartPage({
  items,
  loading,
  error,
  totalPrice,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout,
  showToast,
}: CartPageProps) {
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const handleQuantityChange = async (id: number, newQty: number) => {
    if (newQty < 1) return;
    setUpdatingId(id);
    try {
      await onUpdateQuantity(id, newQty);
    } catch {
      showToast('Erro ao atualizar quantidade', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await onRemove(id);
      showToast('Removido do carrinho', 'info');
    } catch {
      showToast('Erro ao remover item', 'error');
    }
  };

  const handleClear = async () => {
    try {
      await onClear();
      showToast('Carrinho limpo', 'info');
    } catch {
      showToast('Erro ao limpar carrinho', 'error');
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando carrinho...</p>
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
      <div className="page-header">
        <div>
          <h1>🛒 Meu Carrinho</h1>
          <p className="page-subtitle">
            {items.length === 0
              ? 'Seu carrinho está vazio. Adicione produtos!'
              : `${items.length} ${items.length === 1 ? 'item' : 'itens'} — Total: $${totalPrice.toFixed(2)}`}
          </p>
        </div>
        {items.length > 0 && (
          <button className="btn-clear" onClick={handleClear}>
            🗑️ Limpar tudo
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">🛒</span>
          <h2>Carrinho vazio</h2>
          <p>Explore os produtos e adicione ao carrinho!</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.id} className="cart-item-card">
                <img
                  src={item.image}
                  alt={item.title}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3 className="cart-item-title">{item.title}</h3>
                  <span className="cart-item-unit-price">
                    ${item.price.toFixed(2)} cada
                  </span>
                </div>
                <div className="cart-item-quantity">
                  <button
                    className="qty-btn"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity - 1)
                    }
                    disabled={
                      item.quantity <= 1 || updatingId === item.id
                    }
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    className="qty-btn"
                    onClick={() =>
                      handleQuantityChange(item.id, item.quantity + 1)
                    }
                    disabled={updatingId === item.id}
                  >
                    +
                  </button>
                </div>
                <span className="cart-item-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  className="btn-remove-cart"
                  onClick={() => handleRemove(item.id)}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-summary-row">
              <span>Frete</span>
              <span className="free-shipping">Grátis</span>
            </div>
            <div className="cart-summary-row cart-summary-total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <button
              className="btn-checkout"
              onClick={onCheckout}
            >
              💳 Finalizar Compra
            </button>
          </div>
        </>
      )}
    </div>
  );
}
