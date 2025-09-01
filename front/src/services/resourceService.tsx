export interface Recurso {
  id: number;
  nome: string;
  tipo: string;
  quantidade: number;
  valor_unit: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRecursoData {
  nome: string;
  tipo: string;
  quantidade: number;
  valor_unit: number;
}

export interface UpdateRecursoData {
  nome?: string;
  tipo?: string;
  quantidade?: number;
  valor_unit?: number;
}

class ResourceService {
  private baseURL = 'http://localhost:5000/api';

  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Buscar todos os recursos
  async getRecursos(): Promise<Recurso[]> {
    try {
      const response = await fetch(`${this.baseURL}/recurso/`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar recursos');
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error('Erro ao buscar recursos:', error);
      throw error;
    }
  }

  // Buscar recurso por ID
  async getRecursoById(id: number): Promise<Recurso> {
    try {
      const response = await fetch(`${this.baseURL}/recurso/${id}`, {
        method: 'GET',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Recurso não encontrado');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erro ao buscar recurso:', error);
      throw error;
    }
  }

  // Criar novo recurso
  async createRecurso(recursoData: CreateRecursoData): Promise<Recurso> {
    try {
      const response = await fetch(`${this.baseURL}/recurso/`, {
        method: 'POST',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(recursoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao criar recurso');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erro ao criar recurso:', error);
      throw error;
    }
  }

  // Atualizar recurso
  async updateRecurso(id: number, recursoData: UpdateRecursoData): Promise<Recurso> {
    try {
      const response = await fetch(`${this.baseURL}/recurso/${id}`, {
        method: 'PUT',
        headers: this.getAuthHeaders(),
        body: JSON.stringify(recursoData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao atualizar recurso');
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Erro ao atualizar recurso:', error);
      throw error;
    }
  }

  // Deletar recurso
  async deleteRecurso(id: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/recurso/${id}`, {
        method: 'DELETE',
        headers: this.getAuthHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao deletar recurso');
      }
    } catch (error) {
      console.error('Erro ao deletar recurso:', error);
      throw error;
    }
  }

  // Buscar recursos por tipo
  async getRecursosByTipo(tipo: string): Promise<Recurso[]> {
    try {
      const recursos = await this.getRecursos();
      return recursos.filter(recurso => recurso.tipo.toLowerCase() === tipo.toLowerCase());
    } catch (error) {
      console.error('Erro ao buscar recursos por tipo:', error);
      throw error;
    }
  }

  // Buscar recursos críticos (quantidade baixa)
  async getRecursosCriticos(limite: number = 10): Promise<Recurso[]> {
    try {
      const recursos = await this.getRecursos();
      return recursos.filter(recurso => recurso.quantidade < limite);
    } catch (error) {
      console.error('Erro ao buscar recursos críticos:', error);
      throw error;
    }
  }

  // Calcular valor total do estoque
  async getValorTotalEstoque(): Promise<number> {
    try {
      const recursos = await this.getRecursos();
      return recursos.reduce((total, recurso) => {
        return total + (recurso.quantidade * recurso.valor_unit);
      }, 0);
    } catch (error) {
      console.error('Erro ao calcular valor total:', error);
      return 0;
    }
  }

  // Obter estatísticas dos recursos
  async getEstatisticas(): Promise<{
    total: number;
    porTipo: Record<string, number>;
    criticos: number;
    valorTotal: number;
  }> {
    try {
      const recursos = await this.getRecursos();
      
      const stats = {
        total: recursos.length,
        porTipo: {} as Record<string, number>,
        criticos: 0,
        valorTotal: 0
      };

      recursos.forEach(recurso => {
        // Contar por tipo
        stats.porTipo[recurso.tipo] = (stats.porTipo[recurso.tipo] || 0) + 1;
        
        // Contar críticos
        if (recurso.quantidade < 10) {
          stats.criticos++;
        }
        
        // Somar valor total
        stats.valorTotal += recurso.quantidade * recurso.valor_unit;
      });

      return stats;
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
      throw error;
    }
  }
}

export const resourceService = new ResourceService();