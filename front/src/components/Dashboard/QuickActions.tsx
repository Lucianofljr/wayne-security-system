// front/src/components/Dashboard/QuickActions.tsx
import { useState } from 'react';
import { 
    Plus, 
    Users, 
    Package, 
    Settings, 
    FileText, 
    Bell, 
    Download,
    Upload,
    Search,
    Filter
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import { User } from '../../services/authService';
import styles from './QuickActions.module.css';

interface QuickActionsProps {
    user: User;
    permissions: string[];
    onAction: () => void;
}

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    permission: string;
    action: () => void;
}

export function QuickActions({ user, permissions, onAction }: QuickActionsProps) {
    const { theme } = useTheme();
    const { showSuccess, showInfo, showWarning } = useAlert();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleAction = async (actionId: string, actionFn: () => void) => {
        setIsLoading(actionId);
        try {
            await actionFn();
            onAction(); // Refresh dashboard data
        } catch (error) {
            console.error('Erro na ação:', error);
        } finally {
            setIsLoading(null);
        }
    };

    const actions: QuickAction[] = [
        {
            id: 'add-resource',
            title: 'Adicionar Recurso',
            description: 'Cadastrar novo item no sistema',
            icon: <Plus size={20} />,
            color: 'success',
            permission: 'create',
            action: () => {
                showInfo('Redirecionando para cadastro de recursos...', 'Novo Recurso');
                // Aqui você navegaria para a página de cadastro
                setTimeout(() => {
                    showSuccess('Funcionalidade em desenvolvimento', 'Em Breve');
                }, 1000);
            }
        },
        {
            id: 'manage-users',
            title: 'Gerenciar Usuários',
            description: 'Administrar contas de usuário',
            icon: <Users size={20} />,
            color: 'primary',
            permission: 'admin',
            action: () => {
                showInfo('Abrindo painel de usuários...', 'Gerenciamento');
                setTimeout(() => {
                    showSuccess('Funcionalidade em desenvolvimento', 'Em Breve');
                }, 1000);
            }
        },
        {
            id: 'inventory',
            title: 'Inventário',
            description: 'Visualizar estoque completo',
            icon: <Package size={20} />,
            color: 'info',
            permission: 'read',
            action: () => {
                showInfo('Carregando inventário...', 'Estoque');
                setTimeout(() => {
                    showSuccess('Funcionalidade em desenvolvimento', 'Em Breve');
                }, 1000);
            }
        },
        {
            id: 'reports',
            title: 'Relatórios',
            description: 'Gerar relatórios do sistema',
            icon: <FileText size={20} />,
            color: 'warning',
            permission: 'read',
            action: () => {
                showInfo('Preparando relatórios...', 'Relatórios');
                setTimeout(() => {
                    showSuccess('Funcionalidade em desenvolvimento', 'Em Breve');
                }, 1000);
            }
        },
        {
            id: 'notifications',
            title: 'Notificações',
            description: 'Ver alertas e notificações',
            icon: <Bell size={20} />,
            color: 'info',
            permission: 'read',
            action: () => {
                showWarning('Você tem 3 notificações não lidas', 'Notificações');
            }
        },
        {
            id: 'export',
            title: 'Exportar Dados',
            description: 'Download de relatórios',
            icon: <Download size={20} />,
            color: 'success',
            permission: 'read',
            action: () => {
                showInfo('Preparando arquivo para download...', 'Exportar');
                setTimeout(() => {
                    showSuccess('Funcionalidade em desenvolvimento', 'Em Breve');
                }, 1000);
            }
        },
        {
            id: 'import',
            title: 'Importar Dados',
            description: 'Upload de arquivos CSV/Excel',
            icon: <Upload size={20} />,
            color: 'primary',
            permission: 'create',
            action: () => {
                showInfo('Abrindo importador de dados...', 'Importar');
                setTimeout(() => {
                    showSuccess('Funcionalidade em desenvolvimento', 'Em Breve');
                }, 1000);
            }
        },
        {
            id: 'search',
            title: 'Busca Avançada',
            description: 'Pesquisar recursos específicos',
            icon: <Search size={20} />,
            color: 'info',
            permission: 'read',
            action: () => {
                showInfo('Abrindo busca avançada...', 'Pesquisar');
                setTimeout(() => {
                    showSuccess('Funcionalidade em desenvolvimento', 'Em Breve');
                }, 1000);
            }
        },
        {
            id: 'settings',
            title: 'Configurações',
            description: 'Configurações do sistema',
            icon: <Settings size={20} />,
            color: 'secondary',
            permission: 'admin',
            action: () => {
                showInfo('Abrindo configurações...', 'Sistema');
                setTimeout(() => {
                    showSuccess('Funcionalidade em desenvolvimento', 'Em Breve');
                }, 1000);
            }
        }
    ];

    // Filtrar ações baseado nas permissões do usuário
    const availableActions = actions.filter(action => {
        if (action.permission === 'admin') {
            return user.cargo === 'admin';
        }
        if (action.permission === 'create') {
            return user.cargo === 'admin' || user.cargo === 'gerente';
        }
        return true; // 'read' permission - todos podem ver
    });

    return (
        <div className={`${styles.quickActions} ${styles[theme]}`}>
            <div className={styles.header}>
                <h2>Ações Rápidas</h2>
                <div className={styles.filter}>
                    <Filter size={16} />
                </div>
            </div>

            <div className={styles.actionsGrid}>
                {availableActions.map(action => (
                    <button
                        key={action.id}
                        className={`${styles.actionCard} ${styles[action.color]}`}
                        onClick={() => handleAction(action.id, action.action)}
                        disabled={isLoading === action.id}
                    >
                        <div className={styles.actionIcon}>
                            {action.icon}
                        </div>
                        <div className={styles.actionContent}>
                            <h3>{action.title}</h3>
                            <p>{action.description}</p>
                        </div>
                        {isLoading === action.id && (
                            <div className={styles.loadingSpinner}>
                                <div className={styles.spinner}></div>
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className={styles.footer}>
                <p>
                    Mostrando {availableActions.length} de {actions.length} ações disponíveis para <strong>{user.cargo}</strong>
                </p>
            </div>
        </div>
    );
}