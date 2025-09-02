import { useState } from 'react';
import { Edit, Trash2, Eye, AlertTriangle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import type { Recurso } from '../../services/resourceService';
import styles from './ResourceTable.module.css';

interface ResourceTableProps {
  recursos: Recurso[];
  onEdit: (recurso: Recurso) => void;
  onDelete: (id: number) => void;
  onView: (recurso: Recurso) => void;
  userRole: string;
  isLoading?: boolean;
}

export function ResourceTable({ 
  recursos, 
  onEdit, 
  onDelete, 
  onView, 
  userRole,
  isLoading = false 
}: ResourceTableProps) {
  const { theme } = useTheme();
  const { showWarning } = useAlert();
  const [sortField, setSortField] = useState<keyof Recurso>('nome');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const canEdit = userRole === 'admin' || userRole === 'gerente';
  const canDelete = userRole === 'admin';

  const handleSort = (field: keyof Recurso) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleDeleteClick = (recurso: Recurso) => {
    if (recurso.quantidade > 0) {
      showWarning(
        `O recurso "${recurso.nome}" ainda possui ${recurso.quantidade} unidades em estoque.`,
        'Confirmar Exclusão'
      );
    }
    onDelete(recurso.id);
  };

  const sortedRecursos = [...recursos].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getQuantidadeStatus = (quantidade: number) => {
    if (quantidade === 0) return 'esgotado';
    if (quantidade < 5) return 'critico';
    if (quantidade < 10) return 'baixo';
    return 'normal';
  };

  if (isLoading) {
    return (
      <div className={`${styles.loadingContainer} ${styles[theme]}`}>
        <div className={styles.spinner}></div>
        <p>Carregando recursos...</p>
      </div>
    );
  }

  if (recursos.length === 0) {
    return (
      <div className={`${styles.emptyContainer} ${styles[theme]}`}>
        <div className={styles.emptyIcon}>📦</div>
        <h3>Nenhum recurso encontrado</h3>
        <p>Comece adicionando seu primeiro recurso ao sistema.</p>
      </div>
    );
  }

  return (
    <div className={`${styles.tableContainer} ${styles[theme]}`}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('nome')} className={styles.sortable}>
                Nome {sortField === 'nome' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('tipo')} className={styles.sortable}>
                Tipo {sortField === 'tipo' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('quantidade')} className={styles.sortable}>
                Quantidade {sortField === 'quantidade' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('valor_unit')} className={styles.sortable}>
                Valor Unitário {sortField === 'valor_unit' && (sortDirection === 'asc' ? '↑' : '↓')}
              </th>
              <th>Valor Total</th>
              <th>Criado em</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {sortedRecursos.map((recurso) => (
              <tr key={recurso.id} className={styles.tableRow}>
                <td className={styles.nomeCell}>
                  <div className={styles.nomeContainer}>
                    <span className={styles.nome}>{recurso.nome}</span>
                    {getQuantidadeStatus(recurso.quantidade) !== 'normal' && (
                      <AlertTriangle 
                        size={16} 
                        className={`${styles.alertIcon} ${styles[getQuantidadeStatus(recurso.quantidade)]}`}
                        title={`Estoque ${getQuantidadeStatus(recurso.quantidade)}`}
                      />
                    )}
                  </div>
                </td>
                <td>
                  <span className={styles.tipoTag}>
                    {recurso.tipo}
                  </span>
                </td>
                <td>
                  <span className={`${styles.quantidade} ${styles[getQuantidadeStatus(recurso.quantidade)]}`}>
                    {recurso.quantidade}
                  </span>
                </td>
                <td>{formatCurrency(recurso.valor_unit)}</td>
                <td className={styles.valorTotal}>
                  {formatCurrency(recurso.quantidade * recurso.valor_unit)}
                </td>
                <td className={styles.data}>
                  {formatDate(recurso.created_at)}
                </td>
                <td>
                  <div className={styles.actions}>
                    <button
                      onClick={() => onView(recurso)}
                      className={`${styles.actionButton} ${styles.view}`}
                      title="Visualizar"
                    >
                      <Eye size={16} />
                    </button>
                    
                    {canEdit && (
                      <button
                        onClick={() => onEdit(recurso)}
                        className={`${styles.actionButton} ${styles.edit}`}
                        title="Editar"
                      >
                        <Edit size={16} />
                      </button>
                    )}
                    
                    {canDelete && (
                      <button
                        onClick={() => handleDeleteClick(recurso)}
                        className={`${styles.actionButton} ${styles.delete}`}
                        title="Deletar"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}