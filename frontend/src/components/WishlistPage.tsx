import { useState } from 'react';
import type { WishlistItem } from '../types';
import { LoadingSpinner } from './LoadingSpinner';
import './WishlistPage.css';

interface WishlistPageProps {
  items: WishlistItem[];
  loading: boolean;
  error: string | null;
  onUpdate: (id: number, data: { notes?: string; priority?: string }) => Promise<void>;
  onRemove: (id: number) => Promise<void>;
}

export function WishlistPage({
  items,
  loading,
  error,
  onUpdate,
  onRemove,
}: WishlistPageProps) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editPriority, setEditPriority] = useState('medium');

  const startEdit = (item: WishlistItem) => {
    setEditingId(item.id);
    setEditNotes(item.notes || '');
    setEditPriority(item.priority);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditNotes('');
    setEditPriority('medium');
  };

  const saveEdit = async (id: number) => {
    await onUpdate(id, { notes: editNotes, priority: editPriority });
    setEditingId(null);
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-message">
        <span className="error-message__icon">⚠️</span>
        <h3>Erro ao carregar wishlist</h3>
        <p>{error}</p>
      </div>
    );
  }

  const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="wishlist-page">
      <div className="wishlist-page__header">
        <div>
          <h1 className="wishlist-page__title">Minha Wishlist</h1>
          <p className="wishlist-page__subtitle">
            {items.length === 0
              ? 'Sua lista está vazia. Adicione produtos!'
              : `${items.length} ${items.length === 1 ? 'item' : 'itens'} — Total: $${totalPrice.toFixed(2)}`}
          </p>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="wishlist-page__empty">
          <span className="wishlist-page__empty-icon">💫</span>
          <h3>Nenhum item na wishlist</h3>
          <p>Explore os produtos e adicione seus favoritos aqui!</p>
        </div>
      ) : (
        <div className="wishlist-page__list">
          {items.map((item) => (
            <div
              key={item.id}
              className={`wishlist-item ${editingId === item.id ? 'wishlist-item--editing' : ''}`}
              id={`wishlist-item-${item.id}`}
            >
              <div className="wishlist-item__image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="wishlist-item__image"
                />
              </div>
              <div className="wishlist-item__content">
                <div className="wishlist-item__top">
                  <h3 className="wishlist-item__title">{item.title}</h3>
                  <span className="wishlist-item__price">
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {editingId === item.id ? (
                  <div className="wishlist-item__edit-form">
                    <div className="wishlist-item__field">
                      <label htmlFor={`notes-${item.id}`}>Notas</label>
                      <textarea
                        id={`notes-${item.id}`}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Adicione suas notas..."
                        rows={2}
                      />
                    </div>
                    <div className="wishlist-item__field">
                      <label htmlFor={`priority-${item.id}`}>Prioridade</label>
                      <select
                        id={`priority-${item.id}`}
                        value={editPriority}
                        onChange={(e) => setEditPriority(e.target.value)}
                      >
                        <option value="low">🟢 Baixa</option>
                        <option value="medium">🟡 Média</option>
                        <option value="high">🔴 Alta</option>
                      </select>
                    </div>
                    <div className="wishlist-item__edit-actions">
                      <button
                        className="btn btn--primary"
                        onClick={() => saveEdit(item.id)}
                      >
                        Salvar
                      </button>
                      <button
                        className="btn btn--secondary"
                        onClick={cancelEdit}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="wishlist-item__info">
                      <span
                        className={`wishlist-item__priority wishlist-item__priority--${item.priority}`}
                      >
                        {item.priority === 'high' && '🔴 Alta'}
                        {item.priority === 'medium' && '🟡 Média'}
                        {item.priority === 'low' && '🟢 Baixa'}
                      </span>
                      {item.notes && (
                        <p className="wishlist-item__notes">{item.notes}</p>
                      )}
                    </div>
                    <div className="wishlist-item__actions">
                      <button
                        className="btn btn--ghost"
                        onClick={() => startEdit(item)}
                        id={`edit-btn-${item.id}`}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className="btn btn--danger"
                        onClick={() => onRemove(item.id)}
                        id={`remove-btn-${item.id}`}
                      >
                        🗑️ Remover
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
