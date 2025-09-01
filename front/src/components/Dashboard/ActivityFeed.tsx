// front/src/components/Dashboard/ActivityFeed.tsx
import { Clock, User, Package, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './ActivityFeed.module.css';

interface ActivityFeedProps {
    activities: string[];
    userRole: string;
}

interface ActivityItem {
    id: string;
    message: string;
    type: 'info' | 'success' | 'warning' | 'system';
    timestamp: Date;
    icon: React.ReactNode;
}

export function ActivityFeed({ activities, userRole }: ActivityFeedProps) {
    const { theme } = useTheme();

    // Simular diferentes tipos de atividades com base no que vem do backend
    const processActivities = (rawActivities: string[]): ActivityItem[] => {
        const activityTypes = [
            { keywords: ['login', 'acesso'], type: 'success' as const, icon: <User size={16} /> },
            { keywords: ['recurso', 'adicionado', 'criado'], type: 'info' as const, icon: <Package size={16} /> },
            { keywords: ['alerta', 'crítico', 'baixo'], type: 'warning' as const, icon: <AlertCircle size={16} /> },
            { keywords: ['backup', 'sistema', 'atualização'], type: 'system' as const, icon: <Shield size={16} /> },
            { keywords: ['sucesso', 'completado'], type: 'success' as const, icon: <CheckCircle size={16} /> }
        ];

        return rawActivities.map((activity, index) => {
            const activityLower = activity.toLowerCase();
            const matchedType = activityTypes.find(type => 
                type.keywords.some(keyword => activityLower.includes(keyword))
            ) || { type: 'info' as const, icon: <Clock size={16} /> };

            return {
                id: `activity-${index}`,
                message: activity,
                type: matchedType.type,
                timestamp: new Date(Date.now() - (index * 60000 * Math.random() * 30)), // Timestamps aleatórios das últimas horas
                icon: matchedType.icon
            };
        });
    };

    const processedActivities = processActivities(activities);

    const formatTime = (date: Date) => {
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Agora mesmo';
        if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
        
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h atrás`;
        
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}d atrás`;
    };

    const getActivityColor = (type: ActivityItem['type']) => {
        switch (type) {
            case 'success': return '#22c55e';
            case 'warning': return '#f59e0b';
            case 'system': return '#3b82f6';
            default: return '#6b7280';
        }
    };

    return (
        <div className={`${styles.activityFeed} ${styles[theme]}`}>
            <div className={styles.header}>
                <h2>Atividades Recentes</h2>
                <div className={styles.badge}>
                    {processedActivities.length} itens
                </div>
            </div>

            <div className={styles.feedContainer}>
                {processedActivities.length > 0 ? (
                    <div className={styles.activityList}>
                        {processedActivities.map((activity, index) => (
                            <div key={activity.id} className={styles.activityItem}>
                                <div className={styles.activityLine}>
                                    {index < processedActivities.length - 1 && (
                                        <div className={styles.connector}></div>
                                    )}
                                </div>
                                
                                <div 
                                    className={`${styles.activityIcon} ${styles[activity.type]}`}
                                    style={{ borderColor: getActivityColor(activity.type) }}
                                >
                                    {activity.icon}
                                </div>
                                
                                <div className={styles.activityContent}>
                                    <div className={styles.activityMessage}>
                                        {activity.message}
                                    </div>
                                    <div className={styles.activityTime}>
                                        <Clock size={12} />
                                        {formatTime(activity.timestamp)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyIcon}>
                            <Clock size={48} />
                        </div>
                        <h3>Nenhuma atividade recente</h3>
                        <p>As atividades do sistema aparecerão aqui</p>
                    </div>
                )}
            </div>

            <div className={styles.footer}>
                <button className={styles.viewAllButton}>
                    Ver todas as atividades
                </button>
            </div>
        </div>
    );
}