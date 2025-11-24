import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/authApi';
import { useAuthStore } from '../store/authStore';

export const useRegister = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { setToken, setUser } = useAuthStore();
    const navigate = useNavigate();

    const register = async (data: {
        email: string;
        password: string;
        fio: string;
        phone: string;
        role: 'client' | 'agent';
    }) => {
        setIsLoading(true);
        setError(null);

        try {
            const { token } = await authApi.register(data);
            setToken(token);

            const user = await authApi.getProfile();
            setUser(user);

            navigate('/applications');
        } catch (err: any) {
            const message = err.response?.data?.message || 'Ошибка регистрации';
            setError(message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    return { register, isLoading, error };
};
