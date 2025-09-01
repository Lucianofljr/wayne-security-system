export interface User {
  id: number;
  name: string;
  cpf: string;
  email: string;
  cargo: 'admin' | 'gerente' | 'usuario';
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface RegisterData {
  name: string;
  cpf: string;
  email: string;
  senha: string;
  cargo: 'admin' | 'gerente' | 'usuario';
}

export interface AuthResponse {
  message: string;
  success: boolean;
  user: User;
  token: string;
  refreshtoken: string;
}

class AuthService {
  getToken() {
      throw new Error('Method not implemented.');
  }
  private baseURL = 'http://localhost:5000/api'; // Ajuste conforme sua configuração
  
  // Salva o token no localStorage
  private setAuthToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Remove o token do localStorage
  private removeAuthToken(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  // Recupera o token do localStorage
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Headers para requisições autenticadas
  private getAuthHeaders(): HeadersInit {
    const token = this.getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Login do usuário
  async login(loginData: LoginData): Promise<User> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro no login');
      }

      // Salvar tokens e dados do usuário
      this.setAuthToken(data.token);
      localStorage.setItem('refreshToken', data.refreshtoken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  // Registro de usuário
  async register(registerData: RegisterData): Promise<User> {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro no registro');
      }

      // Salvar tokens e dados do usuário
      this.setAuthToken(data.token);
      localStorage.setItem('refreshToken', data.refreshtoken);
      localStorage.setItem('user', JSON.stringify(data.user));

      return data.user;
    } catch (error) {
      console.error('Erro no registro:', error);
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      const token = this.getAuthToken();
      if (token) {
        await fetch(`${this.baseURL}/auth/logout`, {
          method: 'POST',
          headers: this.getAuthHeaders(),
        });
      }
    } catch (error) {
      console.error('Erro no logout:', error);
    } finally {
      this.removeAuthToken();
    }
  }

  // Recuperar usuário atual
  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Erro ao recuperar usuário:', error);
      return null;
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    const token = this.getAuthToken();
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Validar token
  async validateToken(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/auth/validate`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      const data = await response.json();
      return data.valid === true;
    } catch (error) {
      console.error('Erro na validação do token:', error);
      return false;
    }
  }

  // Refresh token
  async refreshToken(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return null;

      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${refreshToken}`
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao renovar token');
      }

      this.setAuthToken(data.token);
      return data.token;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      this.removeAuthToken();
      return null;
    }
  }

  // Obter dados do dashboard
  async getDashboardData(): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/dashboard/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      console.log(this.getAuthHeaders())
      console.log('Dashboard response status:', response.status);
      if (!response.ok) {
        throw new Error('Erro ao carregar dados do dashboard');
      }

      const data = await response.json();
      
      // Simular dados de dashboard se não existirem no backend
      return {
        data: {
          stats: {
            total_usuarios: data.length || 0,
            total_recursos: 0,
            recursos_criticos: 0,
            alertas_pendentes: 3
          },
          recent_activity: [
            'Novo usuário cadastrado',
            'Recurso adicionado ao sistema',
            'Alerta de estoque baixo',
            'Backup realizado com sucesso'
          ],
          permissions: ['read', 'create', 'update']
        }
      };
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
      // Retornar dados simulados em caso de erro
      return {
        data: {
          stats: {
            total_usuarios: 1,
            total_recursos: 0,
            recursos_criticos: 0,
            alertas_pendentes: 3
          },
          recent_activity: [
            'Login realizado com sucesso',
            'Sistema inicializado'
          ],
          permissions: ['read']
        }
      };
    }
  }

  // Obter estatísticas do dashboard
  async getDashboardStats(): Promise<any> {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('Usuário não encontrado');

      // Simular estatísticas baseadas no cargo do usuário
      let stats = {};

      switch (user.cargo) {
        case 'admin':
          stats = {
            total_usuarios: 5,
            total_recursos: 25,
            recursos_criticos: 3,
            alertas_pendentes: 7
          };
          break;
        case 'gerente':
          stats = {
            total_recursos: 25,
            recursos_criticos: 3,
            tarefas_pendentes: 12,
            relatorios_pendentes: 2
          };
          break;
        default:
          stats = {
            meus_recursos: 5,
            tarefas_pendentes: 3,
            notificacoes: 8,
            recursos_disponiveis: 25
          };
      }

      return {
        stats,
        user_role: user.cargo
      };
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      return {
        stats: {
          total_recursos: 0,
          recursos_criticos: 0,
          alertas_pendentes: 0
        },
        user_role: 'usuario'
      };
    }
  }

  // Obter recursos
  async getRecursos(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseURL}/recurso/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar recursos');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao carregar recursos:', error);
      return [];
    }
  }

  // Criar recurso
  async createRecurso(recursoData: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}/recurso/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(recursoData),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar recurso');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar recurso:', error);
      throw error;
    }
  }
}

export const authService = new AuthService();