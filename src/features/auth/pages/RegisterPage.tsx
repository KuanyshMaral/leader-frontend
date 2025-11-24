import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '@shared/api/client';
import { Button, Input, Spinner } from '@shared/components/ui';
import { useMutation } from '@tanstack/react-query';

export const RegisterPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const navigate = useNavigate();

    const registerMutation = useMutation({
        mutationFn: async (data: any) => {
            return apiClient.post('/register', data);
        },
        onSuccess: () => {
            alert('Регистрация успешна! Теперь войдите в систему.');
            navigate('/login');
        },
        onError: (error: any) => {
            const msg = error.response?.data?.error || 'Ошибка регистрации';
            alert(msg);
        },
    });

    const onSubmit = (data: any) => {
        registerMutation.mutate(data);
    };

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Левая часть (Брендинг) */}
            <div className="hidden md:flex w-1/2 bg-[#1D194C] items-center justify-center relative overflow-hidden">
                <div className="absolute w-96 h-96 bg-[#3CE8D1] rounded-full opacity-20 blur-3xl -top-10 -left-10"></div>
                <div className="z-10 text-center">
                    <h1 className="text-5xl font-bold text-white mb-4">
                        ЛИДЕР<span className="text-[#3CE8D1]">ГАРАНТ</span>
                    </h1>
                    <p className="text-gray-300 text-lg">Финансовый маркетплейс</p>
                    <p className="text-[#3CE8D1] mt-4">Регистрация нового партнера</p>
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
                                    {...register('role')}
                                    className="peer sr-only"
                                    defaultChecked
                                />
                                <div className="text-center py-2 rounded-md text-gray-500 peer-checked:bg-white peer-checked:text-[#1D194C] peer-checked:shadow-sm transition-all font-medium">
                                    Я Клиент
                                </div>
                            </label>
                            <label className="flex-1 cursor-pointer">
                                <input
                                    type="radio"
                                    value="agent"
                                    {...register('role')}
                                    className="peer sr-only"
                                />
                                <div className="text-center py-2 rounded-md text-gray-500 peer-checked:bg-white peer-checked:text-[#1D194C] peer-checked:shadow-sm transition-all font-medium">
                                    Я Агент
                                </div>
                            </label>
                        </div>

                        <Input
                            label="ФИО"
                            placeholder="Иванов Иван Иванович"
                            {...register('fio', { required: 'Укажите ФИО' })}
                            error={errors.fio?.message as string}
                        />

                        <Input
                            label="Телефон"
                            placeholder="+7 (999) 000-00-00"
                            {...register('phone', { required: 'Укажите телефон' })}
                            error={errors.phone?.message as string}
                        />

                        <Input
                            label="Email"
                            type="email"
                            placeholder="info@example.com"
                            {...register('email', { required: 'Email обязателен' })}
                            error={errors.email?.message as string}
                        />

                        <Input
                            label="Пароль"
                            type="password"
                            placeholder="Минимум 8 символов"
                            {...register('password', {
                                required: 'Пароль обязателен',
                                minLength: { value: 8, message: 'Минимум 8 символов' },
                            })}
                            error={errors.password?.message as string}
                        />

                        <div className="flex items-start gap-2 mt-4">
                            <input
                                type="checkbox"
                                id="agree"
                                className="mt-1 rounded border-gray-300 text-[#3CE8D1] focus:ring-[#3CE8D1]"
                                required
                            />
                            <label htmlFor="agree" className="text-sm text-gray-500">
                                Я согласен с{' '}
                                <a href="#" className="text-[#3CE8D1] hover:underline">
                                    политикой обработки персональных данных
                                </a>{' '}
                                и регламентом сервиса.
                            </label>
                        </div>

                        <Button type="submit" className="w-full py-3 mt-6" disabled={registerMutation.isPending}>
                            {registerMutation.isPending ? <Spinner size="sm" /> : 'Зарегистрироваться'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        Уже есть аккаунт?{' '}
                        <Link to="/login" className="text-[#3CE8D1] font-bold hover:underline">
                            Войти
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
