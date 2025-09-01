// front/src/components/Dashboard/StatsCard.tsx
import { TrendingUp, TrendingDown, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import styles from './StatsCard.module.css';

interface StatsCardProps {
    title: string;
    value: number;
    type: 'success' | 'warning' | 'danger' | 'info';
    userRole: string;
    previousValue?: number;
}

export function StatsCard({ title, value, type, userRole, previousValue }: StatsCardProps) {
    const { theme } = useTheme();

    const getIcon = () => {
        switch (type) {
            case 'success':
                return <CheckCircle className={styles.icon} />;
            case 'warning':
                return <AlertTriangle className={styles.icon} />;
            case 'danger':
                return <AlertTriangle className={styles.icon} />;
            case 'info':
            default:
                return <Info className={styles.icon} />;
        }
    };

    const getTrendIcon = () => {
        if (previousValue === undefined) return null;
        
        if (value > previousValue) {
            return <TrendingUp className={styles.trendIcon} />;
        } else if (value < previousValue) {
            return <TrendingDown className={styles.trendIcon} />;
        }
        return null;
    };

    const getTrendPercentage = () => {
        if (previousValue === undefined || previousValue === 0) return null;
        
        const percentage = ((value - previousValue) / previousValue) * 100;
        return percentage.toFixed(1);
    };

    const getCardMessage = () => {
        if (type === 'danger' && value > 0) {
            return `⚠️ ${value} ${title.toLowerCase()} precisam de atenção`;
        }
        
        if (type === 'warning' && value > 0) {
            return `📋 ${value} ${title.toLowerCase()} aguardando ação`;
        }
        
        if (type === 'success') {
            return `✅ Sistema funcionando normalmente`;
        }
        
        return null;
    };

    return (
        <div className={`${styles.statsCard} ${styles[type]} ${styles[theme]}`}>
            <div className={styles.cardHeader}>
                <div className={styles.iconContainer}>
                    {getIcon()}
                </div>
                <div className={styles.cardTitle}>
                    <h3>{title}</h3>
                    {previousValue !== undefined && (
                        <div className={styles.trend}>
                            {getTrendIcon()}
                            <span className={styles.trendPercentage}>
                                {getTrendPercentage()}%
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.cardContent}>
                <div className={styles.value}>
                    {value.toLocaleString('pt-BR')}
                </div>
                
                {getCardMessage() && (
                    <div className={styles.message}>
                        {getCardMessage()}
                    </div>
                )}
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.lastUpdate}>
                    Atualizado agora
                </div>
                
                {/* Indicador de prioridade baseado no tipo */}
                {type === 'danger' && value > 0 && (
                    <div className={styles.priority}>
                        <span className={styles.priorityDot}></span>
                        Alta Prioridade
                    </div>
                )}
                
                {type === 'warning' && value > 0 && (
                    <div className={styles.priority}>
                        <span className={styles.priorityDot}></span>
                        Média Prioridade
                    </div>
                )}
            </div>

            {/* Efeito visual de fundo */}
            <div className={styles.backgroundEffect}></div>
        </div>
    );
}