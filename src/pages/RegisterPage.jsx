// src/pages/RegisterPage.jsx
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useState } from 'react';

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Отправляем данные на бэкенд (AuthController::register)
      await api.post('/register', {
        ...data,
        // Если нужно, можно добавить referrer_agent_id: null
      });
      
      alert('Регистрация успешна! Теперь войдите в систему.');
      navigate('/login');
      
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || 'Ошибка регистрации';
      alert(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-leader-gray">
      {/* Левая часть (Брендинг) - идентично логину */}
      <div className="hidden md:flex w-1/2 bg-leader-dark items-center justify-center relative overflow-hidden">
         <div className="absolute w-96 h-96 bg-leader-tiffany rounded-full opacity-20 blur-3xl -top-10 -left-10"></div>
         <div className="z-10 text-center">
             <h1 className="text-5xl font-bold text-white mb-4">ЛИДЕР<span className="text-leader-tiffany">ГАРАНТ</span></h1>
             <p className="text-gray-300 text-lg">Финансовый маркетплейс</p>
             <p className="text-leader-tiffany mt-4">Регистрация нового партнера</p>
         </div>
      </div>

      {/* Правая часть (Форма) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Создание аккаунта</h2>
            <p className="text-gray-500 mb-8">Заполните данные для доступа к личному кабинету</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                
                {/* Выбор Роли */}
                <div className="flex gap-4 mb-6 p-1 bg-gray-200 rounded-lg">
                    <label className="flex-1 cursor-pointer">
                        <input 
                            type="radio" 
                            value="client" 
                            {...register("role")} 
                            className="peer sr-only" 
                            defaultChecked 
                        />
                        <div className="text-center py-2 rounded-md text-gray-500 peer-checked:bg-white peer-checked:text-leader-dark peer-checked:shadow-sm transition-all font-medium">
                            Я Клиент
                        </div>
                    </label>
                    <label className="flex-1 cursor-pointer">
                        <input 
                            type="radio" 
                            value="agent" 
                            {...register("role")} 
                            className="peer sr-only" 
                        />
                        <div className="text-center py-2 rounded-md text-gray-500 peer-checked:bg-white peer-checked:text-leader-dark peer-checked:shadow-sm transition-all font-medium">
                            Я Агент
                        </div>
                    </label>
                </div>

                <Input 
                    label="ФИО" 
                    placeholder="Иванов Иван Иванович" 
                    {...register("fio", { required: "Укажите ФИО" })}
                    error={errors.fio}
                />
                
                <Input 
                    label="Телефон" 
                    placeholder="+7 (999) 000-00-00" 
                    {...register("phone", { required: "Укажите телефон" })}
                    error={errors.phone}
                />

                <Input 
                    label="Email" 
                    type="email"
                    placeholder="info@example.com" 
                    {...register("email", { required: "Email обязателен" })}
                    error={errors.email}
                />

                <Input 
                    label="Пароль" 
                    type="password" 
                    placeholder="Минимум 8 символов" 
                    {...register("password", { 
                        required: "Пароль обязателен",
                        minLength: { value: 8, message: "Минимум 8 символов" }
                    })}
                    error={errors.password}
                />

                <div className="flex items-start gap-2 mt-4">
                    <input 
                        type="checkbox" 
                        id="agree"
                        className="mt-1 rounded border-gray-300 text-leader-cyan focus:ring-leader-cyan" 
                        required
                    />
                    <label htmlFor="agree" className="text-sm text-gray-500">
                        Я согласен с <a href="#" className="text-leader-cyan hover:underline">политикой обработки персональных данных</a> и регламентом сервиса.
                    </label>
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-3 mt-6"
                    disabled={isLoading}
                >
                    {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
                </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-gray-500">
                Уже есть аккаунт? <Link to="/login" className="text-leader-cyan font-bold hover:underline">Войти</Link>
            </div>
        </div>
      </div>
    </div>
  );
}