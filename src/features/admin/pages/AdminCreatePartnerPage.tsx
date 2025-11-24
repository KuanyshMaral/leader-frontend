import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import apiClient from '@shared/api/client';
import { Button, Input } from '@shared/components/ui';

export const AdminCreatePartnerPage = () => {
    const { register, handleSubmit } = useForm();
    const [banks, setBanks] = useState<any[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiClient.get('/admin/banks').then((res) => setBanks(res.data));
    }, []);

    const onSubmit = async (data: any) => {
        try {
            await apiClient.post('/admin/users/create-partner', {
                ...data,
                bank_id: parseInt(data.bank_id),
            });
            alert('Партнер создан!');
            navigate('/admin/users');
        } catch (e: any) {
            alert('Ошибка: ' + (e.response?.data?.error || e.message));
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Регистрация сотрудника банка</h1>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 max-w-md">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Банк</label>
                        <select
                            {...register('bank_id', { required: true })}
                            className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-[#3CE8D1] outline-none"
                        >
                            <option value="">Выберите банк...</option>
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <Input label="ФИО Сотрудника" {...register('fio', { required: true })} />
                    <Input label="Email (Логин)" type="email" {...register('email', { required: true })} />
                    <Input label="Телефон" {...register('phone', { required: true })} />
                    <Input label="Пароль" type="password" {...register('password', { required: true })} />

                    <Button type="submit" className="w-full mt-4">
                        Создать партнера
                    </Button>
                </form>
            </div>
        </div>
    );
};
