import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

export interface Alert {
  id: string;
  type: AlertType;
  title?: string;
  message: string;
  closable?: boolean;
}

interface AlertContextType {
  alerts: Alert[];
  showAlert: (message: string, type: AlertType, title?: string) => void;
  showSuccess: (message: string, title?: string) => void;
  showError: (message: string, title?: string) => void;
  showWarning: (message: string, title?: string) => void;
  showInfo: (message: string, title?: string) => void;
  removeAlert: (id: string) => void;
  clearAlerts: () => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

interface AlertProviderProps {
  children: ReactNode;
  maxAlerts?: number;
}

export function AlertProvider({ children, maxAlerts = 5 }: AlertProviderProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const showAlert = useCallback((message: string, type: AlertType, title?: string) => {
    const id = generateId();
    const alert: Alert = {
      id,
      type,
      message,
      title,
      closable: true
    };

    setAlerts(prev => {
      const newAlerts = [alert, ...prev];
      return newAlerts.slice(0, maxAlerts);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeAlert(id);
    }, 5000);
  }, [maxAlerts]);

  const showSuccess = useCallback((message: string, title?: string) => {
    showAlert(message, 'success', title);
  }, [showAlert]);

  const showError = useCallback((message: string, title?: string) => {
    showAlert(message, 'error', title);
  }, [showAlert]);

  const showWarning = useCallback((message: string, title?: string) => {
    showAlert(message, 'warning', title);
  }, [showAlert]);

  const showInfo = useCallback((message: string, title?: string) => {
    showAlert(message, 'info', title);
  }, [showAlert]);

  const removeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  }, []);

  const clearAlerts = useCallback(() => {
    setAlerts([]);
  }, []);

  return (
    <AlertContext.Provider value={{
      alerts,
      showAlert,
      showSuccess,
      showError,
      showWarning,
      showInfo,
      removeAlert,
      clearAlerts
    }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlert() {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
}
