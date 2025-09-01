// front/src/pages/Dashboard/index.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../components/ProtectedRoute';
import { useTheme } from '../../contexts/ThemeContext';
import { useAlert } from '../../contexts/AlertContext';
import { authService } from '../../services/authService';
import { NavBar } from '../../components/NavBar/NavBar';
import { StatsCard } from '../../components/Dashboard/StatsCard';
import { ActivityFeed } from '../../components/Dashboard/ActivityFeed';
import { QuickActions } from '../../components/Dashboard/QuickActions';
import { ResourcesWidget } from '../../components/ResourcesWidget';
import { WelcomeHeader } from '../../components/Dashboard/WelcomeHeader';
import styles from './Dashboard.module.css';

interface DashboardData {
    stats: Record<string, number>;
    recent_activity: string[];
    permissions: string[];
}

interface DashboardStats {
    stats: Record<string, number>;
    user_role: string;
}

export function DashboardPage() {
    const { user, logout } = useAuth();
    const { theme } = useTheme();
    const { showError } = useAlert();
    
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setIsLoading(true);
            
            // Carregar dados principais do dashboard
            const mainData = await authService.getDashboardData();
            if (mainData && !mainData.message?.includes('Erro')) {
                setDashboardData(mainData.data);
            }

            // Carregar estatísticas específicas
            const statsData = await authService.getDashboardStats();
            if (statsData && !statsData.message?.includes('Erro')) {
                setDashboardStats(statsData);
            }
            
        } catch (error: any) {
            console.error('Erro ao carregar dashboard:', error);
            showError('Erro ao carregar dados do dashboard', 'Erro');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                    <p>Carregando dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className={styles.errorContainer}>
                <p>Erro ao carregar dados do usuário</p>
            </div>
        );
    }

    return (
        <div className={`${styles.dashboardPage} ${styles[theme]}`}>
            <NavBar />
            
            <div className={styles.dashboardContent}>
                {/* Header de boas-vindas */}
                <WelcomeHeader 
                    user={user} 
                    onRefresh={loadDashboardData}
                    isLoading={isLoading}
                />

                {/* Grid principal */}
                <div className={styles.dashboardGrid}>
                    {/* Cards de estatísticas */}
                    <div className={styles.statsSection}>
                        <h2>Estatísticas</h2>
                        <div className={styles.statsGrid}>
                            {dashboardStats?.stats && Object.entries(dashboardStats.stats).map(([key, value]) => (
                                <StatsCard
                                    key={key}
                                    title={formatStatTitle(key)}
                                    value={value}
                                    type={getStatType(key)}
                                    userRole={user.cargo}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Ações rápidas */}
                    <div className={styles.quickActionsSection}>
                        <QuickActions 
                            user={user}
                            permissions={dashboardData?.permissions || []}
                            onAction={loadDashboardData}
                        />
                    </div>

                    {/* Widget de recursos */}
                    {(user.cargo === 'admin' || user.cargo === 'gerente') && (
                        <div className={styles.resourcesSection}>
                            <ResourcesWidget 
                                userRole={user.cargo}
                                onResourceUpdate={loadDashboardData}
                            />
                        </div>
                    )}

                    {/* Feed de atividades */}
                    <div className={styles.activitySection}>
                        <ActivityFeed 
                            activities={dashboardData?.recent_activity || []}
                            userRole={user.cargo}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// Funções auxiliares
function formatStatTitle(key: string): string {
    const titles: Record<string, string> = {
        'total_usuarios': 'Total de Usuários',
        'total_recursos': 'Total de Recursos',
        'recursos_criticos': 'Recursos Críticos',
        'alertas_pendentes': 'Alertas Pendentes',
        'tarefas_pendentes': 'Tarefas Pendentes',
        'relatorios_pendentes': 'Relatórios Pendentes',
        'meus_recursos': 'Meus Recursos',
        'notificacoes': 'Notificações',
        'recursos_disponiveis': 'Recursos Disponíveis'
    };
    
    return titles[key] || key.replace('_', ' ').toUpperCase();
}

function getStatType(key: string): 'success' | 'warning' | 'danger' | 'info' {
    if (key.includes('criticos') || key.includes('alertas')) return 'danger';
    if (key.includes('pendentes')) return 'warning';
    if (key.includes('total') || key.includes('disponiveis')) return 'success';
    return 'info';
}