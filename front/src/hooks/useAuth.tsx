import { useState, useEffect } from 'react';
import { authService, type User } from '../services/authService';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    
    useEffect(() => {
        const token = authService.getToken();
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