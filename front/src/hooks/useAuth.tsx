import { useState, useEffect } from 'react';
import { authService, type User } from '../services/authService';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            setIsLoading(true);
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
        } catch (error) {
            console.error('Erro ao verificar autenticação:', error);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (loginData: any) => {
        try {
            const userData = await authService.login(loginData);
            setUser(userData);
            return userData;
        } catch (error) {
            console.error('Erro no login:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
        } catch (error) {
            console.error('Erro no logout:', error);
        }
    };

    const refreshAuth = () => {
        checkAuth();
    };

    return { 
        user, 
        isLoading, 
        login, 
        logout, 
        refreshAuth,
        isAuthenticated: !!user 
    };
}