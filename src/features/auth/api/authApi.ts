import apiClient from '@shared/api/client';
import { User } from '@shared/types/models';

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    fio: string;
    phone: string;
    role: 'client' | 'agent';
}

export const authApi = {
    /**
     * Login user
     */
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/login', data);
        return response.data;
    },

    /**
     * Register new user
     */
    register: async (data: RegisterRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/register', data);
        return response.data;
    },

    /**
     * Get current user profile
     */
    getProfile: async (): Promise<User> => {
        const response = await apiClient.get<User>('/profile/me');
        return response.data;
    },

    /**
     * Logout (client-side only)
     */
    logout: () => {
        localStorage.removeItem('token');
    },
};
