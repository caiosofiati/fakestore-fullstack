import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProductList } from './components/ProductList';
import { WishlistPage } from './components/WishlistPage';
import CartPage from './components/CartPage';
import CheckoutPage from './components/CheckoutPage';
import OrderConfirmation from './components/OrderConfirmation';
import OrderHistory from './components/OrderHistory';
import LoginPage from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { Toast } from './components/Toast';
import { useProducts } from './hooks/useProducts';
import { useWishlist } from './hooks/useWishlist';
import { useCart } from './hooks/useCart';
import { useOrders } from './hooks/useOrders';
import { useAuth } from './hooks/useAuth';
import type { Product, Order } from './types';

interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
}

function AppContent() {
  const navigate = useNavigate();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const {
    items: wishlistItems,
    loading: wishlistLoading,
    error: wishlistError,
    add,
    update,
    remove,
    isInWishlist,
  } = useWishlist();
  const {
    items: cartItems,
    loading: cartLoading,
    error: cartError,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    isInCart,
    totalItems: cartTotalItems,
    totalPrice: cartTotalPrice,
    refresh: refreshCart,
  } = useCart();
  const { orders, loading: ordersLoading, error: ordersError, fetchOrders, checkout } = useOrders();
  const { user, loginLoading, isAuthenticated, login, logout } = useAuth();

  const [toast, setToast] = useState<ToastState | null>(null);
  const [lastOrder, setLastOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info') => {
      setToast({ message, type });
    },
    [],
  );

  const handleToggleWishlist = useCallback(
    async (product: Product) => {
      try {
        if (isInWishlist(product.id)) {
          const item = wishlistItems.find((i) => i.productId === product.id);
          if (item) {
            await remove(item.id);
            showToast('Removido dos favoritos!', 'info');
          }
        } else {
          await add({
            productId: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
          });
          showToast('Adicionado aos favoritos!', 'success');
        }
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro inesperado', 'error');
      }
    },
    [isInWishlist, wishlistItems, add, remove, showToast],
  );

  const handleAddToCart = useCallback(
    async (product: Product) => {
      try {
        await addToCart({
          productId: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
        });
        showToast('Adicionado ao carrinho!', 'success');
      } catch (err) {
        showToast(err instanceof Error ? err.message : 'Erro ao adicionar', 'error');
      }
    },
    [addToCart, showToast],
  );

  const handleUpdate = useCallback(
    async (id: number, data: { notes?: string; priority?: string }) => {
      try {
        await update(id, data);
        showToast('Item atualizado!', 'success');
      } catch {
        showToast('Erro ao atualizar item', 'error');
      }
    },
    [update, showToast],
  );

  const handleRemove = useCallback(
    async (id: number) => {
      try {
        await remove(id);
        showToast('Removido dos favoritos!', 'info');
      } catch {
        showToast('Erro ao remover item', 'error');
      }
    },
    [remove, showToast],
  );

  const handleGoToCheckout = useCallback(() => {
    navigate('/checkout');
  }, [navigate]);

  const handleConfirmOrder = useCallback(async () => {
    try {
      const order = await checkout();
      if (order) {
        setLastOrder(order);
        await refreshCart();
        navigate('/order-confirmation');
      }
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Erro no checkout', 'error');
    }
  }, [checkout, refreshCart, navigate, showToast]);

  const handleLogin = useCallback(
    async (username: string, password: string) => {
      await login(username, password);
      navigate('/');
    },
    [login, navigate],
  );

  const handleLogout = useCallback(() => {
    logout();
    showToast('Logout realizado!', 'info');
  }, [logout, showToast]);

  return (
    <div className="app">
      <Navbar
        wishlistCount={wishlistItems.length}
        cartCount={cartTotalItems}
        user={user}
        onLogout={handleLogout}
      />
      <main className="app__main">
        <Routes>
          <Route
            path="/"
            element={
              <ProductList
                products={products}
                loading={productsLoading}
                error={productsError}
                isInWishlist={isInWishlist}
                isInCart={isInCart}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={handleAddToCart}
              />
            }
          />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <div className="page-container">
                  <div className="login-container">
                    <div className="login-header">
                      <span className="login-icon">👋</span>
                      <h1>Olá, {user?.firstname}!</h1>
                      <p>Você já está logado.</p>
                    </div>
                    <div className="user-profile-card">
                      <div className="profile-avatar">
                        {user?.firstname?.charAt(0).toUpperCase()}
                        {user?.lastname?.charAt(0).toUpperCase()}
                      </div>
                      <h2>{user?.firstname} {user?.lastname}</h2>
                      <p className="profile-email">{user?.email}</p>
                      <p className="profile-username">@{user?.username}</p>
                      <div className="profile-details">
                        <div className="profile-detail">
                          <span className="profile-label">👤 Cargo</span>
                          <span>{user?.role === 'ADMIN' ? 'Administrador' : 'Usuário'}</span>
                        </div>
                      </div>
                      <button className="btn-logout" onClick={handleLogout}>
                        ↪ Sair da conta
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <LoginPage
                  onLogin={handleLogin}
                  loginLoading={loginLoading}
                  showToast={showToast}
                />
              )
            }
          />
          <Route
            path="/cart"
            element={
              <CartPage
                items={cartItems}
                loading={cartLoading}
                error={cartError}
                totalPrice={cartTotalPrice}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
                onClear={clearCart}
                onCheckout={handleGoToCheckout}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/checkout"
            element={
              <CheckoutPage
                items={cartItems}
                totalPrice={cartTotalPrice}
                onConfirmOrder={handleConfirmOrder}
                onCancel={() => navigate('/cart')}
                showToast={showToast}
              />
            }
          />
          <Route
            path="/order-confirmation"
            element={
              lastOrder ? (
                <OrderConfirmation
                  order={lastOrder}
                  onViewOrders={() => navigate('/orders')}
                  onContinueShopping={() => navigate('/')}
                />
              ) : (
                <div className="page-container">
                  <p>Nenhum pedido recente. Volte à loja!</p>
                </div>
              )
            }
          />
          <Route
            path="/orders"
            element={
              <OrderHistory
                orders={orders}
                loading={ordersLoading}
                error={ordersError}
                onFetch={fetchOrders}
              />
            }
          />
          <Route
            path="/wishlist"
            element={
              <WishlistPage
                items={wishlistItems}
                loading={wishlistLoading}
                error={wishlistError}
                onUpdate={handleUpdate}
                onRemove={handleRemove}
              />
            }
          />
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
        </Routes>
      </main>
      {toast && (
        <Toast
          key={toast.message}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
