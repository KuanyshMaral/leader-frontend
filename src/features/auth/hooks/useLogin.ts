import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

/**
 * Hook for login functionality
 */
export const useLogin = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setToken, setUser } = useAuthStore();
    const navigate = useNavigate();

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            // 1. Login and get token
            const { token } = await authApi.login({ email, password });
            setToken(token);

            // 2. Fetch user profile
            const user = await authApi.getProfile();
            setUser(user);

            // 3. Redirect based on role
            if (user.role === 'admin') {
                navigate('/admin/users');
            } else if (user.role === 'partner') {
                navigate('/partner/applications');
            } else {
                navigate('/applications');
            }
        } catch (err: any) {
            const message = err.response?.data?.message || 'Ошибка входа';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { login, isLoading, error };
};
