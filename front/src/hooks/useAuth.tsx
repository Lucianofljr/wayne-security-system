import { useState, useEffect } from 'react';
import { authService, type User } from '../services/authService';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        let token: string | null = null;
        try {
            token = authService.getToken();
        } catch (error) {
            console.error('Failed to get token:', error);
        }
        if (token) {
            authService.getCurrentUser().then(setUser);
        }
    }, []);

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return { user, logout };
}