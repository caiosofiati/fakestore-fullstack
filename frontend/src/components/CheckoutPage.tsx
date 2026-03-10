import { useState } from 'react';
import type { CartItem } from '../types';

interface CheckoutPageProps {
  items: CartItem[];
  totalPrice: number;
  onConfirmOrder: () => Promise<void>;
  onCancel: () => void;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function CheckoutPage({
  items,
  totalPrice,
  onConfirmOrder,
  onCancel,
  showToast,
}: CheckoutPageProps) {
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  };

  const formatExpiry = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length > 2) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return digits;
  };

  const isFormValid =
    cardNumber.replace(/\s/g, '').length === 16 &&
    cardName.length > 2 &&
    expiry.length === 5 &&
    cvv.length >= 3;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || processing) return;

    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await onConfirmOrder();
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Erro ao processar pagamento',
        'error',
      );
      setProcessing(false);
    }
  };

  return (
    <div className="page-container">
      <h1>💳 Checkout</h1>
      <p className="page-subtitle">Revise seu pedido e finalize a compra</p>

      <div className="checkout-layout">
        {/* Order Summary */}
        <div className="checkout-summary">
          <h2>📦 Resumo do Pedido</h2>
          <div className="checkout-items">
            {items.map((item) => (
              <div key={item.id} className="checkout-item">
                <img src={item.image} alt={item.title} />
                <div className="checkout-item-info">
                  <span className="checkout-item-title">{item.title}</span>
                  <span className="checkout-item-qty">
                    Qtd: {item.quantity}
                  </span>
                </div>
                <span className="checkout-item-price">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="checkout-totals">
            <div className="checkout-row">
              <span>Subtotal</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="checkout-row">
              <span>Frete</span>
              <span className="free-shipping">Grátis</span>
            </div>
            <div className="checkout-row checkout-total">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Form */}
        <div className="checkout-payment">
          <h2>💳 Dados de Pagamento</h2>
          <p className="demo-badge">🔒 Demo — Nenhum pagamento real</p>

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="form-group">
              <label htmlFor="card-number">Número do Cartão</label>
              <input
                id="card-number"
                type="text"
                placeholder="0000 0000 0000 0000"
                value={cardNumber}
                onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
                disabled={processing}
              />
            </div>

            <div className="form-group">
              <label htmlFor="card-name">Nome no Cartão</label>
              <input
                id="card-name"
                type="text"
                placeholder="Nome completo"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                disabled={processing}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="card-expiry">Validade</label>
                <input
                  id="card-expiry"
                  type="text"
                  placeholder="MM/AA"
                  value={expiry}
                  onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                  disabled={processing}
                />
              </div>
              <div className="form-group">
                <label htmlFor="card-cvv">CVV</label>
                <input
                  id="card-cvv"
                  type="text"
                  placeholder="000"
                  value={cvv}
                  onChange={(e) =>
                    setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))
                  }
                  maxLength={4}
                  disabled={processing}
                />
              </div>
            </div>

            <div className="checkout-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={onCancel}
                disabled={processing}
              >
                ← Voltar
              </button>
              <button
                type="submit"
                className="btn-pay"
                disabled={!isFormValid || processing}
              >
                {processing ? (
                  <span className="btn-processing">
                    <span className="mini-spinner"></span>
                    Processando...
                  </span>
                ) : (
                  `Pagar $${totalPrice.toFixed(2)}`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
