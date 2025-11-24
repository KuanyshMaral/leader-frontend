import { Link, useNavigate } from 'react-router-dom';
import { Building2, FileText, Plus, ArrowRight, Clock } from 'lucide-react';
import apiClient from '@shared/api/client';
import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '@features/applications/api/applicationsApi';
import { Spinner } from '@shared/components/ui';

export const DashboardPage = () => {
    const navigate = useNavigate();

    // Fetch user profile
    const { data: user, isLoading: isUserLoading } = useQuery({
        queryKey: ['profile', 'me'],
        queryFn: async () => {
            const res = await apiClient.get('/profile/me');
            return res.data;
        },
    });

    // Fetch recent applications
    const { data: applicationsData, isLoading: isAppsLoading } = useQuery({
        queryKey: ['applications', 'recent'],
        queryFn: () => applicationsApi.getAll({ limit: 5 }),
    });

    const createApplication = () => {
        navigate('/applications/create');
    };

    if (isUserLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) return null;

    const recentApps = applicationsData?.items || [];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#1D194C] mb-2">
                    Добрый день, {user.fio ? user.fio.split(' ')[1] : 'Пользователь'}!
                </h1>
                <p className="text-gray-500">Вот что происходит в вашем кабинете сегодня.</p>
            </div>

            {/* Виджеты действий */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Создать заявку */}
                <div
                    onClick={createApplication}
                    className="bg-[#3CE8D1] rounded-xl p-6 shadow-lg shadow-[#3CE8D1]/20 cursor-pointer transform hover:-translate-y-1 transition-all text-[#1D194C] group"
                >
                    <div className="flex justify-between items-start mb-8">
                        <div className="p-3 bg-white/30 rounded-lg">
                            <Plus size={24} />
                        </div>
                        <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-xl font-bold">Новая заявка</h3>
                    <p className="text-sm opacity-80 mt-1">Банковская гарантия или кредит</p>
                </div>

                {/* Моя компания */}
                <Link
                    to="/company"
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#3CE8D1] transition-colors group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-50 text-[#1D194C] rounded-lg">
                            <Building2 size={24} />
                        </div>
                        <span
                            className={`text-xs font-bold px-2 py-1 rounded ${user.company_inn
                                ? 'bg-green-100 text-green-700'
                                : 'bg-orange-100 text-orange-700'
                                }`}
                        >
                            {user.company_inn ? 'Заполнено' : 'Не заполнено'}
                        </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#3CE8D1]">
                        Моя компания
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        {user.company_name || 'Заполните реквизиты'}
                    </p>
                </Link>

                {/* Документы */}
                <Link
                    to="/documents"
                    className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-[#3CE8D1] transition-colors group"
                >
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-purple-50 text-purple-700 rounded-lg">
                            <FileText size={24} />
                        </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 group-hover:text-[#3CE8D1]">
                        Документы
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">Загрузить уставные документы</p>
                </Link>
            </div>

            {/* Блок "Последние действия" */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Последние заявки</h3>
                    <Link to="/applications" className="text-sm text-[#3CE8D1] hover:underline">
                        Все заявки
                    </Link>
                </div>

                {isAppsLoading ? (
                    <div className="p-8 flex justify-center">
                        <Spinner />
                    </div>
                ) : recentApps.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">У вас пока нет активных заявок.</div>
                ) : (
                    <div className="divide-y">
                        {recentApps.map((app: any) => (
                            <Link
                                key={app.id}
                                to={`/applications/${app.id}`}
                                className="block p-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-[#1D194C]">Заявка #{app.id}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-[#3CE8D1]">
                                            {new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(app.amount)}
                                        </div>
                                        <div className="text-xs px-2 py-1 rounded bg-gray-100 inline-block mt-1">
                                            {app.status}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
