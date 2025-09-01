import { useAlert, type Alert as AlertType } from '../../contexts/AlertContext';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import styles from './Alert.module.css';

interface AlertProps {
    alert: AlertType;
}

export function Alert({ alert }: AlertProps) {
    const { removeAlert } = useAlert();

    const getIcon = () => {
        switch (alert.type) {
            case 'success':
                return <CheckCircle className={styles.icon} />;
            case 'error':
                return <XCircle className={styles.icon} />;
            case 'warning':
                return <AlertTriangle className={styles.icon} />;
            case 'info':
                return <Info className={styles.icon} />;
            default:
                return null;
        }
    };

    const handleClose = () => {
        removeAlert(alert.id);
    };

    return (
        <div className={`${styles.alert} ${styles[alert.type]}`}>
            <div className={styles.content}>
                {getIcon()}
                <div className={styles.text}>
                    {alert.title && (
                        <div className={styles.title}>{alert.title}</div>
                    )}
                    <div className={styles.message}>{alert.message}</div>
                </div>
            </div>
            {alert.closable && (
                <button 
                    className={styles.closeButton}
                    onClick={handleClose}
                    aria-label="Fechar alerta"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}