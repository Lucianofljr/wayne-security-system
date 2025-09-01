// front/src/services/authService.ts
export interface User {
  id: string;
  name: string;
  email: string;
  cargo: string;
}

export interface LoginCredentials {
  email: string;
  senha: string; // Mudança para coincidir com seu backend
}

export interface RegisterData {
  name: string;
  email: string;
  senha: string; // Mudança para coincidir com seu backend
  cargo: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  success: boolean;
  message: string;
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Salvar tokens no localStorage
  private setTokens(token: string, refreshToken?: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    if (refreshToken) {
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  // Obter token do localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Obter refresh token
  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  // Verificar se há token
  hasToken(): boolean {
    return !!this.getToken();
  }

  // Fazer requisição com token
  private async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const token = this.getToken();
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${this.API_BASE_URL}${url}`, {
      ...options,
      headers,
    });

    // Se token expirou, tentar renovar
    if (response.status === 401 && token) {
      const newToken = await this.refreshToken();
      if (newToken) {
        // Repetir a requisição com novo token
        return fetch(`${this.API_BASE_URL}${url}`, {
          ...options,
          headers: {
            ...headers,
            Authorization: `Bearer ${newToken}`,
          },
        });
      } else {
        // Se não conseguiu renovar, fazer logout
        this.logout();
        throw new Error('Sessão expirada. Faça login novamente.');
      }
    }

    return response;
  }

  // Login
  async login(credentials: LoginCredentials): Promise<User> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro no login');
      }

      // Salvar tokens
      this.setTokens(data.token, data.refreshToken);
      
      return data.user;
    } catch (error: any) {
      console.error('Erro no login:', error);
      throw new Error(error.message || 'Erro ao conectar com o servidor');
    }
  }

  // Registro
  async register(userData: RegisterData): Promise<User> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Erro no cadastro');
      }

      // Salvar tokens
      this.setTokens(data.token, data.refreshToken);
      
      return data.user;
    } catch (error: any) {
      console.error('Erro no registro:', error);
      throw new Error(error.message || 'Erro ao conectar com o servidor');
    }
  }

  // Renovar token
  async refreshToken(): Promise<string | null> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      this.logout();
      return null;
    }

    try {
      const response = await fetch(`${this.API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${refreshToken}`,
        },
      });

      if (!response.ok) {
        this.logout();
        return null;
      }

      const data = await response.json();
      this.setTokens(data.token);
      
      return data.token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.logout();
      return null;
    }
  }

  // Obter dados do usuário atual
  async getCurrentUser(): Promise<User | null> {
    try {
      const response = await this.fetchWithAuth('/auth/me');

      if (!response.ok) {
        return null;
      }

      const data = await response.json();
      return data.user;
    } catch (error) {
      console.error('Erro ao obter usuário:', error);
      return null;
    }
  }

  // Validar token no servidor
  async validateToken(): Promise<boolean> {
    try {
      const response = await this.fetchWithAuth('/auth/validate');
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      // Notificar o backend sobre o logout
      await this.fetchWithAuth('/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      // Sempre limpar tokens localmente
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return this.hasToken();
  }

  // Fazer requisições autenticadas para qualquer endpoint
  async apiCall(endpoint: string, options: RequestInit = {}): Promise<Response> {
    return this.fetchWithAuth(endpoint, options);
  }

  // Métodos específicos para recursos
  async getRecursos() {
    const response = await this.fetchWithAuth('/recurso');
    return response.json();
  }

  async createRecurso(recursoData: { nome: string; tipo: string; quantidade: number }) {
    const response = await this.fetchWithAuth('/recurso', {
      method: 'POST',
      body: JSON.stringify(recursoData),
    });
    return response.json();
  }

  async updateRecurso(id: number, recursoData: Partial<{ nome: string; tipo: string; quantidade: number }>) {
    const response = await this.fetchWithAuth(`/recurso/${id}`, {
      method: 'PUT',
      body: JSON.stringify(recursoData),
    });
    return response.json();
  }

  async deleteRecurso(id: number) {
    const response = await this.fetchWithAuth(`/recurso/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Métodos para dashboard
  async getDashboardData() {
    const response = await this.fetchWithAuth('/dashboard');
    return response.json();
  }

  async getDashboardStats() {
    const response = await this.fetchWithAuth('/dashboard/stats');
    return response.json();
  }
}

// Exportar instância singleton
export const authService = new AuthService();
export default authService;