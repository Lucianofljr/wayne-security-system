import { useAlert } from '../../contexts/AlertContext'
import { Alert } from './Alert'
import styles from './AlertContainer.module.css'

export function AlertContainer() {
    const { alerts } = useAlert()

    if (alerts.length === 0) return null
    
    return (
        <div className={styles.container}>
            {alerts.map(alert => (

                <Alert key={alert.id} alert={alert} />
            ))}
        </div>
    )
}