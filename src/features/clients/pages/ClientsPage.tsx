import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, Building2, Phone, Mail, MoreHorizontal, X, AlertCircle } from 'lucide-react';
import { Button, Input, Spinner } from '@shared/components/ui';
import apiClient from '@shared/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@shared/hooks/useDebounce';

interface Client {
    id: number;
    company_name: string;
    inn: string;
    fio: string;
    phone: string;
    email: string;
    status: string;
}

export const ClientsPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const debouncedSearch = useDebounce(searchTerm, 300);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

    // Fetch clients
    const { data: clients = [], isLoading, error } = useQuery({
        queryKey: ['agent', 'clients'],
        queryFn: async () => {
            const res = await apiClient.get<Client[]>('/agent/clients');
            return res.data;
        },
    });

    // Add client mutation
    const addClientMutation = useMutation({
        mutationFn: async (data: any) => {
            return apiClient.post('/agent/clients', data);
        },
        onSuccess: () => {
            alert('Клиент добавлен!');
            setIsModalOpen(false);
            reset();
            queryClient.invalidateQueries({ queryKey: ['agent', 'clients'] });
        },
        onError: (e: any) => {
            alert('Ошибка: ' + (e.response?.data?.error || e.message));
        },
    });

    const onAddClient = (data: any) => {
        addClientMutation.mutate(data);
    };

    // Filter clients
    const filteredClients = clients.filter(
        (client) =>
            (client.company_name || '').toLowerCase().includes(debouncedSearch.toLowerCase()) ||
            (client.inn || '').includes(debouncedSearch) ||
            (client.fio || '').toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;

    return (
        <div>
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Мои клиенты</h1>
                    <p className="text-gray-500 text-sm">Компании под вашим управлением</p>
                </div>
                <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} /> Добавить клиента
                </Button>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg flex items-center gap-2">
                    <AlertCircle size={18} />
                    Ошибка загрузки клиентов
                </div>
            )}

            {/* Панель фильтров */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                    <input
                        placeholder="Поиск по названию, ИНН или ФИО..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3CE8D1] outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="secondary" className="gap-2 bg-gray-100 text-gray-600 border-transparent">
                    <Filter size={16} /> Фильтр
                </Button>
            </div>

            {/* Таблица */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-4">Компания / ИНН</th>
                            <th className="px-6 py-4">Контактное лицо</th>
                            <th className="px-6 py-4">Контакты</th>
                            <th className="px-6 py-4">Статус</th>
                            <th className="px-6 py-4"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <Building2 size={32} />
                                    </div>
                                    <p className="text-gray-500 font-medium">Список пуст или ничего не найдено</p>
                                </td>
                            </tr>
                        ) : (
                            filteredClients.map((client) => (
                                <tr
                                    key={client.id}
                                    onClick={() => navigate(`/clients/${client.id}`)}
                                    className="hover:bg-gray-50 transition-colors group cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 text-[#1D194C] rounded-lg flex items-center justify-center">
                                                <Building2 size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-800">{client.company_name}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-0.5">
                                                    ИНН: {client.inn}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-700">{client.fio}</div>
                                        <div className="text-xs text-gray-400">Клиент</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col gap-1 text-xs text-gray-600">
                                            <div className="flex items-center gap-2">
                                                <Phone size={12} /> {client.phone || '-'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Mail size={12} /> {client.email}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`px-2.5 py-1 rounded-full text-xs font-bold
                                    ${client.status === 'active'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                }
                                `}
                                        >
                                            {client.status === 'active' ? 'Активен' : 'Приглашен'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* МОДАЛЬНОЕ ОКНО */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-xl font-bold text-gray-800 mb-4">Новый клиент</h2>
                        <p className="text-gray-500 text-sm mb-6">
                            Введите данные клиента. Ему будет отправлено приглашение на почту.
                        </p>

                        <form onSubmit={handleSubmit(onAddClient)} className="space-y-4">
                            <Input label="ФИО" {...register('fio', { required: true })} placeholder="Иванов Иван" />
                            <Input
                                label="Email"
                                type="email"
                                {...register('email', { required: true })}
                                placeholder="client@company.ru"
                            />
                            <Input label="Телефон" {...register('phone')} placeholder="+7..." />
                            <Input
                                label="ИНН Компании (если есть)"
                                {...register('inn')}
                                placeholder="1234567890"
                            />

                            <Button type="submit" className="w-full mt-4" disabled={addClientMutation.isPending}>
                                {addClientMutation.isPending ? <Spinner size="sm" /> : 'Добавить'}
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
