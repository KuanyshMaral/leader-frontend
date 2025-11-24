import { useState } from 'react';
import { Search, Building2 } from 'lucide-react';
import apiClient from '@shared/api/client';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@shared/components/ui';
import { useDebounce } from '@shared/hooks/useDebounce';

export const PartnerClientsPage = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);

    const { data: clients = [], isLoading } = useQuery({
        queryKey: ['partner', 'clients'],
        queryFn: async () => {
            const res = await apiClient.get('/partner/clients');
            return res.data;
        },
    });

    const filteredClients = clients.filter((c: any) =>
        c.company_name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (c.inn && c.inn.includes(debouncedSearch))
    );

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Клиенты банка</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            placeholder="Поиск клиента..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3CE8D1] outline-none"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-3">Наименование</th>
                            <th className="px-6 py-3">ИНН</th>
                            <th className="px-6 py-3 text-center">Заявок</th>
                            <th className="px-6 py-3 text-right">Одобренный лимит</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredClients.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400">
                                    Нет клиентов
                                </td>
                            </tr>
                        ) : (
                            filteredClients.map((c: any) => (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-2">
                                        <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center text-blue-600">
                                            <Building2 size={16} />
                                        </div>
                                        {c.company_name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{c.inn || 'Н/Д'}</td>
                                    <td className="px-6 py-4 text-center font-medium">{c.applications_count}</td>
                                    <td className="px-6 py-4 text-right text-gray-800">
                                        {new Intl.NumberFormat('ru-RU').format(c.total_approved_sum)} ₽
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
