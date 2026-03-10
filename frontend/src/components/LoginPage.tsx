import { useState } from 'react';

interface LoginPageProps {
  onLogin: (username: string, password: string) => Promise<void>;
  loginLoading: boolean;
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function LoginPage({
  onLogin,
  loginLoading,
  showToast,
}: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || loginLoading) return;

    try {
      await onLogin(username, password);
      showToast('Login realizado com sucesso!', 'success');
    } catch (err) {
      showToast(
        err instanceof Error ? err.message : 'Erro ao fazer login',
        'error',
      );
    }
  };

  const fillTestCredentials = () => {
    setUsername('mor_2314');
    setPassword('83r5^_');
  };

  const fillAdminCredentials = () => {
    setUsername('johnd');
    setPassword('m38rmF$');
  };

  return (
    <div className="page-container">
      <div className="login-container">
        <div className="login-header">
          <span className="login-icon">🔐</span>
          <h1>Entrar</h1>
          <p>Faça login para acessar sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="login-username">Usuário</label>
            <input
              id="login-username"
              type="text"
              placeholder="Digite seu usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loginLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Senha</label>
            <div className="password-wrapper">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loginLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-login"
            disabled={!username || !password || loginLoading}
          >
            {loginLoading ? (
              <span className="btn-processing">
                <span className="mini-spinner"></span>
                Entrando...
              </span>
            ) : (
              '🚀 Entrar'
            )}
          </button>
        </form>

        <div className="login-divider">
          <span>ou</span>
        </div>

        <div className="login-test-actions">
          <button className="btn-test-credentials" onClick={fillTestCredentials}>
            🧪 Login Padrão (USER)
          </button>
          <button className="btn-test-credentials admin" onClick={fillAdminCredentials}>
            👮 Login Admin (ADMIN)
          </button>
        </div>

        <div className="login-hint">
          <h3>📋 Usuários disponíveis (FakeStore API)</h3>
          <div className="credentials-list">
            <div className="credential-column">
              <h4>Perfil Admin</h4>
              <div className="credential-item">
                <span className="credential-label">Usuário:</span>
                <code>johnd</code>
              </div>
              <div className="credential-item">
                <span className="credential-label">Senha:</span>
                <code>m38rmF$</code>
              </div>
            </div>
            
            <div className="credential-column">
              <h4>Perfil Padrão</h4>
              <div className="credential-item">
                <span className="credential-label">Usuário:</span>
                <code>mor_2314</code>
              </div>
              <div className="credential-item">
                <span className="credential-label">Senha:</span>
                <code>83r5^_</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
