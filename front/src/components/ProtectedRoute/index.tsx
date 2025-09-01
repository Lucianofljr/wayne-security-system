import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
    children: ReactNode
    isAuthenticated?: boolean
}

export function ProtectedRoute({children, isAuthenticated}: ProtectedRouteProps) {
    const token = localStorage.getItem('authToken')
    const userIsAuthenticated = isAuthenticated ?? !!token

    if (!userIsAuthenticated) {
        return <Navigate to="/" replace />
    }

    return <>{children}</>
}

export function WithProtectedRoute<T extends object> (
    Component: React.ComponentType<T>,
    isAuthenticated?: boolean
) {
    return function ProtectedComponent(props: T) {
        return (
            <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Component {...props} />
            </ProtectedRoute>
        )
    }
}