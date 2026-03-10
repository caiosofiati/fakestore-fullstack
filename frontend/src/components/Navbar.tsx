import { NavLink } from 'react-router-dom';
import type { AuthUser } from '../api/authApi';
import { useTheme } from '../hooks/useTheme';
import './Navbar.css';

interface NavbarProps {
  wishlistCount: number;
  cartCount: number;
  user: AuthUser | null;
  onLogout: () => void;
}

export function Navbar({ wishlistCount, cartCount, user, onLogout }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="navbar">
      <div className="navbar__container">
        <NavLink to="/" className="navbar__logo">
          <span className="navbar__logo-icon">🛍️</span>
          <span className="navbar__logo-text">FakeStore</span>
        </NavLink>
        <div className="navbar__links">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            Produtos
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            🛒 Carrinho
            {cartCount > 0 && (
              <span className="navbar__badge navbar__badge--cart">{cartCount}</span>
            )}
          </NavLink>
          <NavLink
            to="/wishlist"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            Wishlist
            {wishlistCount > 0 && (
              <span className="navbar__badge">{wishlistCount}</span>
            )}
          </NavLink>
          <NavLink
            to="/orders"
            className={({ isActive }) =>
              `navbar__link ${isActive ? 'navbar__link--active' : ''}`
            }
          >
            📋 Pedidos
          </NavLink>
          {user?.role === 'ADMIN' && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `navbar__link ${isActive ? 'navbar__link--active' : ''}`
              }
            >
              ⚙️ Admin
            </NavLink>
          )}
        </div>
        <div className="navbar__actions">
          <button
            className="navbar__theme-toggle"
            onClick={toggleTheme}
            title={theme === 'dark' ? "Modo Claro" : "Modo Escuro"}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          <div className="navbar__auth">
            {user ? (
              <div className="navbar__user">
                <div className="navbar__avatar">
                  {user.firstname?.charAt(0).toUpperCase()}
                </div>
                <span className="navbar__username">
                  {user.firstname}
                </span>
                <button className="navbar__logout" onClick={onLogout} title="Sair">
                  ↪
                </button>
              </div>
            ) : (
              <NavLink to="/login" className="navbar__login-btn">
                🔐 Entrar
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
