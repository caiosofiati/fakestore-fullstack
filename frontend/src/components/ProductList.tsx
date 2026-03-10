import { useState, useMemo } from 'react';
import type { Product } from '../types';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from './LoadingSpinner';
import './ProductList.css';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  error: string | null;
  isInWishlist: (productId: number) => boolean;
  isInCart: (productId: number) => boolean;
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export function ProductList({
  products,
  loading,
  error,
  isInWishlist,
  isInCart,
  onToggleWishlist,
  onAddToCart,
}: ProductListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category));
    return ['all', ...Array.from(cats)];
  }, [products]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="error-message">
        <span className="error-message__icon">⚠️</span>
        <h3>Erro ao carregar produtos</h3>
        <p>{error}</p>
      </div>
    );
  }

  const categoryLabels: Record<string, string> = {
    all: 'Todos',
    electronics: 'Eletrônicos',
    jewelery: 'Joias',
    "men's clothing": 'Moda Masculina',
    "women's clothing": 'Moda Feminina',
  };

  return (
    <section className="product-list">
      <div className="product-list__header">
        <div>
          <h1 className="product-list__title">Produtos</h1>
          <p className="product-list__subtitle">
            Explore nossa seleção de produtos
          </p>
        </div>
        
        {products.length > 0 && (
          <div className="product-list__controls">
            <div className="product-list__filters">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`filter-btn ${
                    selectedCategory === category ? 'filter-btn--active' : ''
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {categoryLabels[category] || category}
                </button>
              ))}
            </div>
            
            <div className="product-list__sort">
              <select
                className="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="default">Relevância</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhor Avaliação</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <div className="product-list__grid">
        {filteredAndSortedProducts.length > 0 ? (
          filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isInWishlist={isInWishlist(product.id)}
              isInCart={isInCart(product.id)}
              onToggleWishlist={() => onToggleWishlist(product)}
              onAddToCart={() => onAddToCart(product)}
            />
          ))
        ) : (
          <div className="empty-state" style={{ gridColumn: '1 / -1' }}>
            <span className="empty-icon">🔍</span>
            <h2>Nenhum produto encontrado</h2>
            <p>Tente selecionar outra categoria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
