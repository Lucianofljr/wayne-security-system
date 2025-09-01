import { useState, useEffect } from 'react';
import { X, Save, Package } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import type { Recurso, CreateRecursoData, UpdateRecursoData } from '../../services/resourceService';
import styles from './ResourceForm.module.css';

interface ResourceFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateRecursoData | UpdateRecursoData) => Promise<void>;
  recurso?: Recurso | null;
  isLoading?: boolean;
}

export function ResourceForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  recurso = null,
  isLoading = false 
}: ResourceFormProps) {
  const { theme } = useTheme();
  const { showError } = useAlert();
  
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    quantidade: 0,
    valor_unit: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Tipos comuns de recursos
  const tiposComuns = [
    'Material de Escritório',
    'Equipamento',
    'Ferramenta',
    'Consumível',
    'Software',
    'Hardware',
    'Mobiliário',
    'Outros'
  ];

  useEffect(() => {
    if (recurso) {
      setFormData({
        nome: recurso.nome,
        tipo: recurso.tipo,
        quantidade: recurso.quantidade,
        valor_unit: recurso.valor_unit
      });
    } else {
      setFormData({
        nome: '',
        tipo: '',
        quantidade: 0,
        valor_unit: 0
      });
    }
    setErrors({});
  }, [recurso, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let processedValue: string | number = value;
    
    if (name === 'quantidade') {
      processedValue = parseInt(value) || 0;
    } else if (name === 'valor_unit') {
      processedValue = parseFloat(value) || 0;
    }

    setFormData(prev => ({
      ...prev,
      [name]: processedValue
    }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (formData.nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!formData.tipo.trim()) {
      newErrors.tipo = 'Tipo é obrigatório';
    }

    if (formData.quantidade < 0) {
      newErrors.quantidade = 'Quantidade não pode ser negativa';
    }

    if (formData.valor_unit <= 0) {
      newErrors.valor_unit = 'Valor unitário deve ser maior que zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Por favor, corrija os erros no formulário', 'Validação');
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error: any) {
      console.error('Erro no formulário:', error);
      showError(error.message || 'Erro ao salvar recurso', 'Erro');
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={`${styles.modal} ${styles[theme]}`}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <Package size={24} />
            </div>
            <div>
              <h2>{recurso ? 'Editar Recurso' : 'Novo Recurso'}</h2>
              <p>{recurso ? 'Atualize as informações do recurso' : 'Adicione um novo recurso ao sistema'}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="nome">
                Nome do Recurso <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="nome"
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                className={errors.nome ? styles.error : ''}
                placeholder="Ex: Impressora HP LaserJet"
                disabled={isLoading}
              />
              {errors.nome && <span className={styles.errorMessage}>{errors.nome}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="tipo">
                Tipo <span className={styles.required}>*</span>
              </label>
              <select
                id="tipo"
                name="tipo"
                value={formData.tipo}
                onChange={handleInputChange}
                className={errors.tipo ? styles.error : ''}
                disabled={isLoading}
              >
                <option value="">Selecione um tipo</option>
                {tiposComuns.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              {errors.tipo && <span className={styles.errorMessage}>{errors.tipo}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="quantidade">
                Quantidade <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="quantidade"
                name="quantidade"
                value={formData.quantidade}
                onChange={handleInputChange}
                min="0"
                className={errors.quantidade ? styles.error : ''}
                placeholder="0"
                disabled={isLoading}
              />
              {errors.quantidade && <span className={styles.errorMessage}>{errors.quantidade}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="valor_unit">
                Valor Unitário (R$) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="valor_unit"
                name="valor_unit"
                value={formData.valor_unit}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={errors.valor_unit ? styles.error : ''}
                placeholder="0,00"
                disabled={isLoading}
              />
              {errors.valor_unit && <span className={styles.errorMessage}>{errors.valor_unit}</span>}
            </div>
          </div>

          {formData.quantidade > 0 && formData.valor_unit > 0 && (
            <div className={styles.summary}>
              <div className={styles.summaryItem}>
                <span>Valor Total do Estoque:</span>
                <strong>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  }).format(formData.quantidade * formData.valor_unit)}
                </strong>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className={styles.spinner}></div>
                  {recurso ? 'Atualizando...' : 'Salvando...'}
                </>
              ) : (
                <>
                  <Save size={16} />
                  {recurso ? 'Atualizar' : 'Salvar'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}