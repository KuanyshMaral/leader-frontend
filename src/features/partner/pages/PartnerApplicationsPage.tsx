import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, FileText, AlertCircle } from 'lucide-react';
import apiClient from '@shared/api/client';
import { StatusBadge } from '@shared/components/ui/StatusBadge';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@shared/components/ui';
import { useDebounce } from '@shared/hooks/useDebounce';

export const PartnerApplicationsPage = () => {
    const [activeTab, setActiveTab] = useState('all');
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 300);
    const navigate = useNavigate();

    const { data: applications = [], isLoading } = useQuery({
        queryKey: ['partner', 'applications'],
        queryFn: async () => {
            const res = await apiClient.get('/partner/applications', { params: { limit: 100 } });
            return res.data.data;
        },
    });

    const filteredApps = applications.filter((app: any) => {
        // Filter by tab
        if (activeTab === 'bg' && app.product_type !== 'bank_guarantee') return false;
        if (activeTab === 'credit' && app.product_type !== 'credit') return false;

        // Filter by search
        if (debouncedSearch) {
            const searchLower = debouncedSearch.toLowerCase();
            const matchesId = app.id.toString().includes(searchLower);
            const matchesInn = app.user?.company?.inn?.includes(searchLower);
            const matchesName = (app.user?.company?.name || app.user?.fio || '').toLowerCase().includes(searchLower);
            const matchesNumber = app.product_data?.procurement_number?.includes(searchLower);

            return matchesId || matchesInn || matchesName || matchesNumber;
        }

        return true;
    });

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Входящие заявки</h1>
                <p className="text-gray-500 text-sm">Управление потоком сделок</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="flex border-b bg-gray-50">
                    <button
                        onClick={() => setActiveTab('all')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'all'
                            ? 'border-[#3CE8D1] text-[#1D194C] bg-white'
                            : 'border-transparent text-gray-500'
                            }`}
                    >
                        ВСЕ
                    </button>
                    <button
                        onClick={() => setActiveTab('bg')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'bg'
                            ? 'border-[#3CE8D1] text-[#1D194C] bg-white'
                            : 'border-transparent text-gray-500'
                            }`}
                    >
                        БАНКОВСКИЕ ГАРАНТИИ
                    </button>
                    <button
                        onClick={() => setActiveTab('credit')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'credit'
                            ? 'border-[#3CE8D1] text-[#1D194C] bg-white'
                            : 'border-transparent text-gray-500'
                            }`}
                    >
                        КРЕДИТЫ
                    </button>
                </div>

                <div className="p-4 flex gap-4 items-center border-b border-gray-100">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                        <input
                            placeholder="Поиск по ИНН, названию или номеру..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#3CE8D1] outline-none text-sm"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 text-sm font-medium">
                        <Filter size={16} /> Расширенный фильтр
                    </button>
                </div>

                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-3">№ Заявки</th>
                            <th className="px-6 py-3">Дата</th>
                            <th className="px-6 py-3">Клиент / Агент</th>
                            <th className="px-6 py-3">Продукт</th>
                            <th className="px-6 py-3 text-right">Сумма</th>
                            <th className="px-6 py-3">Статус</th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredApps.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="p-12 text-center text-gray-400">
                                    <FileText className="mx-auto mb-2 opacity-50" size={32} />
                                    Нет активных заявок
                                </td>
                            </tr>
                        ) : (
                            filteredApps.map((app: any) => (
                                <tr
                                    key={app.id}
                                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                                    onClick={() => navigate(`/applications/${app.id}`)}
                                >
                                    <td className="px-6 py-4 font-bold text-blue-600">
                                        #{app.id}
                                        {app.product_data?.procurement_number && (
                                            <div className="text-xs text-gray-400 mt-0.5">
                                                {app.product_data.procurement_number}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {new Date(app.created_at).toLocaleDateString()}
                                        <div className="text-xs text-gray-400">
                                            {new Date(app.created_at).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-800">
                                            {app.user?.company?.name || app.user?.fio || 'Н/Д'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            ИНН: {app.user?.company?.inn || '-'}
                                        </div>
                                        {app.agent_user && (
                                            <div className="text-xs text-[#3CE8D1] mt-1 flex items-center gap-1">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#3CE8D1]"></span>
                                                Агент: {app.agent_user.fio}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                            {app.product_type === 'bank_guarantee'
                                                ? 'Банковская гарантия'
                                                : app.product_type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-bold text-gray-700">
                                        {new Intl.NumberFormat('ru-RU').format(app.amount)} ₽
                                    </td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={app.status} />
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {app.status === 'submitted' || app.status === 'draft' ? (
                                            <span className="text-[#3CE8D1] font-bold text-xs bg-[#3CE8D1]/10 px-3 py-1.5 rounded-full flex items-center gap-1 w-fit ml-auto">
                                                <AlertCircle size={12} /> ТРЕБУЕТ РЕШЕНИЯ
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">В работе</span>
                                        )}
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
