import { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, TrendingUp } from 'lucide-react';
import { NavBar } from '../../components/NavBar/NavBar';
import { ResourceTable } from '../../components/Resources/ResourceTable';
import { ResourceForm } from '../../components/Resources/ResourceForm';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import { useAuth } from '../../hooks/useAuth';
import { resourceService, type Recurso, type CreateRecursoData, type UpdateRecursoData } from '../../services/resourceService';
import styles from './Resources.module.css';

export function ResourcesPage() {
    const { theme } = useTheme();
    const { user } = useAuth();
    const { showSuccess, showError, showInfo } = useAlert();
    
    const [recursos, setRecursos] = useState<Recurso[]>([]);
    const [filteredRecursos, setFilteredRecursos] = useState<Recurso[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingRecurso, setEditingRecurso] = useState<Recurso | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Filtros e busca
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [statusFilter, setStatusFilter] = useState('todos');
    
    // Estatísticas
    const [stats, setStats] = useState({
        total: 0,
        porTipo: {} as Record<string, number>,
        criticos: 0,
        valorTotal: 0
    });

    useEffect(() => {
        loadRecursos();
    }, []);

    useEffect(() => {
        filterRecursos();
    }, [recursos, searchTerm, selectedTipo, statusFilter]);

    const loadRecursos = async () => {
        try {
            setIsLoading(true);
            const [recursosData, statsData] = await Promise.all([
                resourceService.getRecursos(),
                resourceService.getEstatisticas()
            ]);
            
            setRecursos(recursosData);
            setStats(statsData);
            showInfo(`${recursosData.length} recursos carregados`, 'Sistema');
        } catch (error: any) {
            console.error('Erro ao carregar recursos:', error);
            showError('Erro ao carregar recursos', 'Erro');
        } finally {
            setIsLoading(false);
        }
    };

    const filterRecursos = () => {
        let filtered = [...recursos];

        // Filtro por termo de busca
        if (searchTerm) {
            filtered = filtered.filter(recurso =>
                recurso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                recurso.tipo.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtro por tipo
        if (selectedTipo) {
            filtered = filtered.filter(recurso => recurso.tipo === selectedTipo);
        }

        // Filtro por status
        if (statusFilter !== 'todos') {
            filtered = filtered.filter(recurso => {
                switch (statusFilter) {
                    case 'criticos':
                        return recurso.quantidade < 5;
                    case 'baixo':
                        return recurso.quantidade >= 5 && recurso.quantidade < 10;
                    case 'normal':
                        return recurso.quantidade >= 10;
                    case 'esgotado':
                        return recurso.quantidade === 0;
                    default:
                        return true;
                }
            });
        }

        setFilteredRecursos(filtered);
    };

    const handleCreateRecurso = async (data: CreateRecursoData) => {
        try {
            setIsSubmitting(true);
            await resourceService.createRecurso(data);
            await loadRecursos();
            setIsFormOpen(false);
            showSuccess(`Recurso "${data.nome}" criado com sucesso!`, 'Sucesso');
        } catch (error: any) {
            console.error('Erro ao criar recurso:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateRecurso = async (data: UpdateRecursoData) => {
        if (!editingRecurso) return;

        try {
            setIsSubmitting(true);
            await resourceService.updateRecurso(editingRecurso.id, data);
            await loadRecursos();
            setIsFormOpen(false);
            setEditingRecurso(null);
            showSuccess(`Recurso "${data.nome || editingRecurso.nome}" atualizado!`, 'Sucesso');
        } catch (error: any) {
            console.error('Erro ao atualizar recurso:', error);
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteRecurso = async (id: number) => {
        const recurso = recursos.find(r => r.id === id);
        if (!recurso) return;

        const confirmDelete = window.confirm(
            `Tem certeza que deseja excluir o recurso "${recurso.nome}"?\n\nEsta ação não pode ser desfeita.`
        );

        if (confirmDelete) {
            try {
                await resourceService.deleteRecurso(id);
                await loadRecursos();
                showSuccess(`Recurso "${recurso.nome}" excluído`, 'Sucesso');
            } catch (error: any) {
                console.error('Erro ao excluir recurso:', error);
                showError('Erro ao excluir recurso', 'Erro');
            }
        }
    };

    const handleEditRecurso = (recurso: Recurso) => {
        setEditingRecurso(recurso);
        setIsFormOpen(true);
    };

    const handleViewRecurso = (recurso: Recurso) => {
        showInfo(
            `${recurso.nome} - ${recurso.quantidade} unidades - R$ ${recurso.valor_unit.toFixed(2)}`,
            'Detalhes do Recurso'
        );
    };

    const handleNewRecurso = () => {
        setEditingRecurso(null);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingRecurso(null);
    };

    const handleExportData = () => {
        showInfo('Funcionalidade de exportação em desenvolvimento', 'Em Breve');
    };

    const getTipos = () => {
        return [...new Set(recursos.map(r => r.tipo))].sort();
    };

    const canCreate = user?.cargo === 'admin' || user?.cargo === 'gerente';

    return (
        <div className={`${styles.resourcesPage} ${styles[theme]}`}>
            <NavBar />
            
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerContent}>
                        <h1>Recursos</h1>
                        <p>Gerencie todos os recursos do sistema</p>
                    </div>
                    <div className={styles.headerActions}>
                        <button 
                            onClick={handleExportData}
                            className={styles.exportButton}
                            title="Exportar dados"
                        >
                            <Download size={20} />
                            Exportar
                        </button>
                        {canCreate && (
                            <button 
                                onClick={handleNewRecurso}
                                className={styles.addButton}
                            >
                                <Plus size={20} />
                                Novo Recurso
                            </button>
                        )}
                    </div>
                </div>

                {/* Estatísticas */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📦</div>
                        <div className={styles.statContent}>
                            <h3>Total de Recursos</h3>
                            <div className={styles.statValue}>{stats.total}</div>
                        </div>
                    </div>
                    
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>⚠️</div>
                        <div className={styles.statContent}>
                            <h3>Recursos Críticos</h3>
                            <div className={styles.statValue}>{stats.criticos}</div>
                        </div>
                    </div>
                    
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>💰</div>
                        <div className={styles.statContent}>
                            <h3>Valor Total</h3>
                            <div className={styles.statValue}>
                                {new Intl.NumberFormat('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL',
                                    minimumFractionDigits: 0,
                                    maximumFractionDigits: 0
                                }).format(stats.valorTotal)}
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>📊</div>
                        <div className={styles.statContent}>
                            <h3>Tipos Diferentes</h3>
                            <div className={styles.statValue}>{Object.keys(stats.porTipo).length}</div>
                        </div>
                    </div>
                </div>

                {/* Filtros */}
                <div className={styles.filters}>
                    <div className={styles.searchGroup}>
                        <div className={styles.searchInput}>
                            <Search size={20} />
                            <input
                                type="text"
                                placeholder="Buscar recursos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <select
                            value={selectedTipo}
                            onChange={(e) => setSelectedTipo(e.target.value)}
                        >
                            <option value="">Todos os tipos</option>
                            {getTipos().map(tipo => (
                                <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="todos">Todos os status</option>
                            <option value="normal">Normal (≥10)</option>
                            <option value="baixo">Estoque baixo (5-9)</option>
                            <option value="criticos">Crítico (&lt;5)</option>
                            <option value="esgotado">Esgotado (0)</option>
                        </select>
                    </div>
                </div>

                {/* Resultados */}
                <div className={styles.results}>
                    <div className={styles.resultsHeader}>
                        <span>
                            {searchTerm || selectedTipo || statusFilter !== 'todos' 
                                ? `${filteredRecursos.length} de ${recursos.length} recursos` 
                                : `${recursos.length} recursos`}
                        </span>
                        {(searchTerm || selectedTipo || statusFilter !== 'todos') && (
                            <button 
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedTipo('');
                                    setStatusFilter('todos');
                                }}
                                className={styles.clearFilters}
                            >
                                Limpar filtros
                            </button>
                        )}
                    </div>

                    <ResourceTable
                        recursos={filteredRecursos}
                        onEdit={handleEditRecurso}
                        onDelete={handleDeleteRecurso}
                        onView={handleViewRecurso}
                        userRole={user?.cargo || 'usuario'}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* Modal do formulário */}
            <ResourceForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={editingRecurso ? handleUpdateRecurso : handleCreateRecurso}
                recurso={editingRecurso}
                isLoading={isSubmitting}
            />
        </div>
    );
}