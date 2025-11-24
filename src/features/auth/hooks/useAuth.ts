import { useEffect } from 'react';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

/**
 * Hook to initialize auth state on app load
 */
export const useAuth = () => {
    const { user, token, isLoading, setUser, setLoading, logout } = useAuthStore();

    useEffect(() => {
        const initAuth = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const userData = await authApi.getProfile();
                setUser(userData);
            } catch (error) {
                console.error('Failed to fetch user profile:', error);
                logout();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, [token]);

    return {
        user,
        isLoading,
        isAuthenticated: !!user,
        logout,
    };
};
