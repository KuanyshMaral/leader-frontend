// src/api/axios.js
import axios from 'axios';

const api = axios.create({
    // Мы используем прокси (см. шаг 5), чтобы избежать проблем с CORS
    baseURL: '/api', 
    headers: {
        'Content-Type': 'application/json',
    },
});

// Автоматически добавляем токен, если он есть
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;