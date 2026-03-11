import type { Product } from '../types';
import './ProductCard.css';

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  isInCart: boolean;
  onToggleWishlist: () => void;
  onAddToCart: () => void;
}

export function ProductCard({
  product,
  isInWishlist,
  isInCart,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) {
  const categoryLabels: Record<string, string> = {
    all: 'Todos',
    electronics: 'Eletrônicos',
    jewelery: 'Joias',
    "men's clothing": 'Moda Masculina',
    "women's clothing": 'Moda Feminina',
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    
    // Se a imagem já vier com a URL completa do backend, retorna ela mesma
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    
    // Se for um caminho relativo, anexa o servidor backend
    return url.startsWith('/') 
      ? `http://localhost:3000${url}` 
      : `http://localhost:3000/${url}`;
  };

  return (
    <div className="product-card" id={`product-${product.id}`}>
      <div className="product-card__image-wrapper">
        <img
          src={getImageUrl(product.image)}
          alt={product.title}
          className="product-card__image"
          loading="lazy"
        />
        <span className="product-card__category">
          {categoryLabels[product.category] || product.category}
        </span>
      </div>
      <div className="product-card__content">
        <h3 className="product-card__title" title={product.title}>
          {product.title}
        </h3>
        <div className="product-card__meta">
          <span className="product-card__price">
            ${product.price.toFixed(2)}
          </span>
          <div className="product-card__rating">
            <span className="product-card__star">★</span>
            <span>{product.rating?.rate ?? 0}</span>
            <span className="product-card__count">({product.rating?.count ?? 0})</span>
          </div>
        </div>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__actions">
          <button
            className={`product-card__btn product-card__btn-cart ${isInCart ? 'product-card__btn--in-cart' : ''}`}
            onClick={onAddToCart}
            id={`cart-btn-${product.id}`}
          >
            <span className="product-card__btn-icon">
              {isInCart ? '✅' : '🛒'}
            </span>
            {isInCart ? 'No Carrinho' : 'Adicionar ao Carrinho'}
          </button>
          <button
            className={`product-card__btn product-card__btn-wishlist ${isInWishlist ? 'product-card__btn--active' : ''}`}
            onClick={onToggleWishlist}
            id={`wishlist-btn-${product.id}`}
          >
            <span className="product-card__btn-icon">
              {isInWishlist ? '❤️' : '🤍'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
