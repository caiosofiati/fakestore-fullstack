export interface AuthUser {
  id: number;
  email: string;
  username: string;
  firstname: string;
  lastname: string;
  role: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

const API_BASE = 'http://localhost:3000/api';

export const authApi = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    console.log(`🔐 [Frontend/Auth] Tentando Login com usuário '${username}'... Repassando as credenciais pro Backend Proxy FakeStore`);
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      console.error(`❌ [Frontend/Auth] Falha no Login! Motivo:`, err.message);
      throw new Error(err.message || 'Credenciais inválidas');
    }
    const json = await res.json();
    console.log(`✅ [Frontend/Auth] Sucesso! JWT Seguro recebido com permissão: ${json.data.user.role}`);
    return json.data;
  },

  getUser: async (id: number): Promise<AuthUser> => {
    const res = await fetch(`${API_BASE}/auth/users/${id}`);
    if (!res.ok) throw new Error('Falha ao carregar usuário');
    const json = await res.json();
    return json.data;
  },
};
