// front/src/components/Dashboard/WelcomeHeader.tsx
import { RefreshCw, User, Shield, Crown } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { User as UserType } from '../../services/authService';
import styles from './WelcomeHeader.module.css';

interface WelcomeHeaderProps {
    user: UserType;
    onRefresh: () => void;
    isLoading: boolean;
}

export function WelcomeHeader({ user, onRefresh, isLoading }: WelcomeHeaderProps) {
    const { theme } = useTheme();

    const getRoleIcon = () => {
        switch (user.cargo) {
            case 'admin':
                return <Crown className={styles.roleIcon} />;
            case 'gerente':
                return <Shield className={styles.roleIcon} />;
            default:
                return <User className={styles.roleIcon} />;
        }
    };

    const getRoleName = () => {
        const roles = {
            'admin': 'Administrador',
            'gerente': 'Gerente',
            'usuario': 'Usuário'
        };
        return roles[user.cargo as keyof typeof roles] || 'Usuário';
    };

    const getTimeGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Bom dia';
        if (hour < 18) return 'Boa tarde';
        return 'Boa noite';
    };

    return (
        <div className={`${styles.welcomeHeader} ${styles[theme]}`}>
            <div className={styles.welcomeContent}>
                <div className={styles.userInfo}>
                    <div className={styles.avatar}>
                        {getRoleIcon()}
                    </div>
                    <div className={styles.userDetails}>
                        <h1 className={styles.greeting}>
                            {getTimeGreeting()}, {user.name}! 👋
                        </h1>
                        <p className={styles.userRole}>
                            {getRoleName()} • {user.email}
                        </p>
                        <p className={styles.lastLogin}>
                            Último acesso: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    </div>
                </div>
                
                <div className={styles.headerActions}>
                    <button 
                        className={styles.refreshButton}
                        onClick={onRefresh}
                        disabled={isLoading}
                        title="Atualizar dados"
                    >
                        <RefreshCw 
                            size={20} 
                            className={isLoading ? styles.spinning : ''} 
                        />
                        <span>Atualizar</span>
                    </button>
                </div>
            </div>
            
            <div className={styles.backgroundDecoration}>
                <div className={styles.circle1}></div>
                <div className={styles.circle2}></div>
                <div className={styles.circle3}></div>
            </div>
        </div>
    );
}