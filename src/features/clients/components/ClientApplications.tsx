import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Briefcase, Plus, Clock, AlertCircle } from 'lucide-react';
import { Button, Spinner } from '@shared/components/ui';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '@features/applications/api/applicationsApi';

interface ClientApplicationsProps {
    clientId: number;
}

export const ClientApplications = ({ clientId }: ClientApplicationsProps) => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);

    const { data, isLoading, error } = useQuery({
        queryKey: ['applications', { client_id: clientId, page }],
        queryFn: () => applicationsApi.getAll({ client_id: clientId, page, limit: 10 }),
    });

    const applications = data?.items || [];
    const total = data?.total || 0;

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner /></div>;

    if (error) return (
        <div className="p-8 text-center text-red-500">
            <AlertCircle className="mx-auto mb-2" />
            Ошибка загрузки заявок
        </div>
    );

    return (
        <div>
            {/* Панель действий */}
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Заявки клиента ({total})</h3>
                <Button onClick={() => navigate('/applications/create')}>
                    <Plus size={16} className="mr-2" />
                    Создать заявку
                </Button>
            </div>

            {applications.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400 shadow-sm">
                        <Briefcase size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-700">Заявок пока нет</h3>
                    <p className="text-gray-500 text-sm mb-6">Создайте первую заявку для этого клиента</p>
                    <Button variant="secondary" onClick={() => navigate('/applications/create')}>
                        Создать заявку
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {applications.map((app) => (
                        <Link
                            key={app.id}
                            to={`/applications/${app.id}`}
                            className="block bg-white border border-gray-100 rounded-xl p-4 hover:border-[#3CE8D1] transition-colors shadow-sm group"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-[#1D194C] text-lg">
                                            {app.product_type === 'bank_guarantee' ? 'Банковская гарантия' :
                                                app.product_type === 'credit' ? 'Кредит' : 'Заявка'}
                                        </span>
                                        <span className={`text-xs px-2 py-0.5 rounded font-medium
                                            ${app.status === 'approved' ? 'bg-green-100 text-green-700' :
                                                app.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                                    'bg-blue-100 text-blue-700'}`}>
                                            {app.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-4">
                                        <span className="flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </span>
                                        <span>ID: {app.id}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-xl text-[#3CE8D1]">
                                        {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(app.amount)}
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        {app.term_days} дней
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}

                    {/* Пагинация (простая) */}
                    {total > 10 && (
                        <div className="flex justify-center gap-2 mt-6">
                            <Button
                                variant="secondary"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                            >
                                Назад
                            </Button>
                            <span className="flex items-center px-4 font-bold text-gray-600">{page}</span>
                            <Button
                                variant="secondary"
                                disabled={applications.length < 10} // Simple check, ideally check total pages
                                onClick={() => setPage(p => p + 1)}
                            >
                                Вперед
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
