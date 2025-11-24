import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { Button, Input, Spinner } from '@shared/components/ui';
import { useLogin } from '../hooks/useLogin';

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const { login, isLoading, error } = useLogin();

    const onSubmit = async (data: any) => {
        try {
            await login(data.email, data.password);
        } catch (e) {
            // Error is handled by useLogin and exposed via error prop
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Левая часть (Брендинг) */}
            <div className="hidden md:flex w-1/2 bg-[#1D194C] items-center justify-center relative overflow-hidden">
                <div className="absolute w-96 h-96 bg-[#3CE8D1] rounded-full opacity-20 blur-[100px] top-0 left-0"></div>
                <div className="z-10 text-center">
                    <h1 className="text-5xl font-bold text-white mb-2">
                        ЛИДЕР<span className="text-[#3CE8D1]">ГАРАНТ</span>
                    </h1>
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
                            {...register('email', { required: 'Email обязателен' })}
                            error={errors.email?.message as string}
                        />
                        <Input
                            label="Пароль"
                            type="password"
                            placeholder="••••••••"
                            {...register('password', { required: 'Пароль обязателен' })}
                            error={errors.password?.message as string}
                        />

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-between items-center mb-6">
                            <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-[#3CE8D1] focus:ring-[#3CE8D1]"
                                />
                                Запомнить меня
                            </label>
                            <a href="#" className="text-sm text-[#3CE8D1] hover:underline">
                                Забыли пароль?
                            </a>
                        </div>

                        <Button type="submit" className="w-full py-3 shadow-lg shadow-[#3CE8D1]/20" disabled={isLoading}>
                            {isLoading ? <Spinner size="sm" /> : 'Войти'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center text-sm text-gray-500">
                        Нет аккаунта?{' '}
                        <Link to="/register" className="text-[#3CE8D1] font-bold hover:underline ml-1">
                            Регистрация
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
