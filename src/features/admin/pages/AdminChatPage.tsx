import { useNavigate } from 'react-router-dom';
import { MessageSquare, Clock, AlertCircle } from 'lucide-react';
import apiClient from '@shared/api/client';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@shared/components/ui';

interface Application {
    id: number;
    client_name: string;
    product_name: string;
    pending_count: number;
    last_pending_at: string;
}

export const AdminChatPage = () => {
    const navigate = useNavigate();

    const { data: applications = [], isLoading, error } = useQuery({
        queryKey: ['admin', 'chat', 'applications'],
        queryFn: async () => {
            const res = await apiClient.get<Application[]>('/admin/chat/applications');
            return res.data;
        },
        refetchInterval: 10000, // Poll every 10 seconds
    });

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner /></div>;

    if (error) return (
        <div className="p-8 text-center text-red-500">
            <AlertCircle className="mx-auto mb-2" />
            Ошибка загрузки чатов
        </div>
    );

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Модерация чатов</h1>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-3">Заявка</th>
                            <th className="px-6 py-3">Клиент</th>
                            <th className="px-6 py-3">Продукт</th>
                            <th className="px-6 py-3">Pending сообщений</th>
                            <th className="px-6 py-3">Последнее</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {applications.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-400">
                                    Нет сообщений на модерацию
                                </td>
                            </tr>
                        ) : (
                            applications.map((app) => (
                                <tr
                                    key={app.id}
                                    onClick={() => navigate(`/admin/chat/${app.id}`)} // Fixed route to match router
                                    className="hover:bg-gray-50 cursor-pointer transition"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <MessageSquare size={18} className="text-blue-600" />
                                            <span className="font-bold text-gray-800">#{app.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{app.client_name}</td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {app.product_name === 'bank_guarantee' ? 'Банковская гарантия' :
                                            app.product_name === 'credit' ? 'Кредит' : app.product_name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 text-yellow-700 rounded-full font-medium">
                                            <Clock size={14} />
                                            {app.pending_count}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        {new Date(app.last_pending_at).toLocaleString('ru-RU')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                💡 Кликните на заявку, чтобы открыть чат и модерировать сообщения
            </div>
        </div>
    );
};
