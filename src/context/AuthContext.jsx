// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Функция загрузки пользователя
  const fetchUser = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await api.get('/profile/me');
      setUser(res.data);
      return res.data; // Возвращаем данные, чтобы их можно было использовать
    } catch (error) {
      console.error("Ошибка авторизации", error);
      localStorage.removeItem('token');
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // Обновленная функция входа
  const login = async (token) => {
    localStorage.setItem('token', token); // 1. Сохраняем токен
    const userData = await fetchUser();   // 2. Ждем загрузки профиля
    return userData;                      // 3. Возвращаем юзера
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, fetchUser }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);