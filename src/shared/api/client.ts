import axios, { AxiosInstance, AxiosError } from 'axios';
import { ApiError } from '@shared/types/models';

// Get API URL from environment variable
// In development: uses Vite proxy ('/api' -> 'http://localhost:8080')
// In production: uses VITE_API_URL from .env.production
const apiUrl = import.meta.env.VITE_API_URL || '/api';

// Create axios instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiError>) => {
        // Handle 401 - unauthorized
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default apiClient;
