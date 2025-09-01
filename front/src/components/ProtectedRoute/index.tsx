import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

interface ProtectedRouteProps {
    children: ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, isLoading } = useAuth()

    // Mostra loading enquanto verifica autenticação
    if (isLoading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                fontSize: '18px' 
            }}>
                Carregando...
            </div>
        )
    }

    // Se não tem usuário, redireciona para login
    if (!user) {
        return <Navigate to="/" replace />
    }

    // Se tem usuário, mostra o conteúdo
    return <>{children}</>
}

export function WithProtectedRoute<T extends object>(
    Component: React.ComponentType<T>
) {
    return function ProtectedComponent(props: T) {
        return (
            <ProtectedRoute>
                <Component {...props} />
            </ProtectedRoute>
        )
    }
}