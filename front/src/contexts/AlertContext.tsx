import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type AlertType = 'success' | 'error' | 'warning' | 'info'

export interface Alert {
    id: string
    type: AlertType
    title?: string
    message: string
    duration?: number
    closable?: boolean
}

interface AlertContextType {
    alerts: Alert[]
    showAlert: (alert: Omit<Alert, 'id'>) => void
    showSuccess: (message: string, title?: string) => void
    showError: (message: string, title?: string) => void
    showWarning: (message: string, title?: string) => void
    showInfo: (message: string, title?: string) => void
    removeAlert: (id: string) => void
    clearAlerts: () => void
}

const AlertContext = createContext<AlertContextType | undefined>(undefined)


interface AlertProviderProps {
    children: ReactNode
    maxAlerts?: number
}

export function AlertProvider({ children, maxAlerts = 5 }: AlertProviderProps) {
    const [alerts, setAlerts] = useState<Alert[]>([])

    const generateId = useCallback(() => {
        return Math.random().toString(36).substr(2, 9)
    }, [])

    const removeAlert = useCallback((id: string) => {
        setAlerts(prev => prev.filter(alert => alert.id !== id))
    }, [])

    const showAlert = useCallback((alertData: Omit<Alert, 'id'>) => {
        const id = generateId()
        const newAlert: Alert = {
            id,
            closable: true,
            duration: 5000,
            ...alertData,
        }

        setAlerts(prev => {
            const updated = [...prev, newAlert]
            return updated.slice(-maxAlerts)
        })

        if (newAlert.duration && newAlert.duration > 0) {
            setTimeout(() => {
                removeAlert(id)
            }, newAlert.duration)
        }
    }, [generateId, maxAlerts, removeAlert])

    const showSuccess = useCallback((message: string, title?: string) => {
        showAlert({type: 'success', message, title})
    }, [showAlert])

    const showError = useCallback((message: string, title?: string) => {
        showAlert({type: 'error', message, title, duration: 7000})
    },[showAlert])

    const showWarning = useCallback((message: string, title?: string) => {
        showAlert({ type: 'warning', message, title, duration: 6000 })
    }, [showAlert])

    const showInfo = useCallback((message: string, title?: string) => {
        showAlert({ type: 'info', message, title })
    }, [showAlert])

    const clearAlerts = useCallback(() => {
        setAlerts([])
    }, [])

    const value = {
        alerts,
        showAlert,
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeAlert,
        clearAlerts,
    }

    return (
        <AlertContext.Provider value={value}>
            {children}
        </AlertContext.Provider>
    )
}

export function useAlert() {
    const context = useContext(AlertContext)
    if (context === undefined) {
        throw new Error('useAlert must be used within an AlertProvider')
    }
    return context
}