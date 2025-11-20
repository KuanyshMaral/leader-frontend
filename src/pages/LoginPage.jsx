// src/pages/LoginPage.jsx
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext'; // Импортируем контекст

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { login } = useAuth(); // Достаем функцию login

  const onSubmit = async (data) => {
    try {
      // 1. Получаем токен от бэкенда
      const res = await api.post('/login', data);
      const token = res.data.token;

      // 2. Передаем токен в контекст и ЖДЕМ, пока загрузится юзер
      // Это решает проблему "нужно обновить страницу"
      const user = await login(token);

      if (!user) {
          alert('Ошибка получения профиля');
          return;
      }

      // 3. Умный редирект в зависимости от роли
      const role = user.role;

      if (role === 'admin') {
          navigate('/admin/users');
      } else if (role === 'partner') {
          navigate('/partner/applications');
      } else {
          navigate('/'); // Для клиента и агента
      }

    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'Неверные данные';
      alert('Ошибка входа: ' + msg);
    }
  };

  return (
    <div className="flex h-screen bg-leader-gray">
      {/* Левая часть (Брендинг) */}
      <div className="hidden md:flex w-1/2 bg-leader-dark items-center justify-center relative overflow-hidden">
         <div className="absolute w-96 h-96 bg-leader-cyan rounded-full opacity-20 blur-[100px] top-0 left-0"></div>
         <div className="z-10 text-center">
             <h1 className="text-5xl font-bold text-white mb-2">ЛИДЕР<span className="text-leader-tiffany">ГАРАНТ</span></h1>
             <p className="text-gray-400 text-lg tracking-widest uppercase">Финансовый сервис</p>
         </div>
      </div>

      {/* Правая часть (Форма) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Вход в систему</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <Input 
                    label="Email" 
                    type="email" 
                    placeholder="email@company.com" 
                    {...register("email", { required: "Email обязателен" })}
                    error={errors.email}
                />
                <Input 
                    label="Пароль" 
                    type="password" 
                    placeholder="••••••••" 
                    {...register("password", { required: "Пароль обязателен" })}
                    error={errors.password}
                />
                
                <div className="flex justify-between items-center mb-6">
                     <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded border-gray-300 text-leader-cyan focus:ring-leader-cyan" />
                        Запомнить меня
                     </label>
                     <a href="#" className="text-sm text-leader-cyan hover:underline">Забыли пароль?</a>
                </div>

                <Button type="submit" variant="primary" className="w-full py-3 shadow-lg shadow-leader-cyan/20">
                    Войти
                </Button>
            </form>
            
            <div className="mt-8 text-center text-sm text-gray-500">
                Нет аккаунта? <Link to="/register" className="text-leader-cyan font-bold hover:underline ml-1">Регистрация</Link>
            </div>
        </div>
      </div>
    </div>
  );
}