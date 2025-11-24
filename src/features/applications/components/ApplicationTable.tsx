import { useNavigate } from 'react-router-dom';
import { Application } from '@shared/types/models';
import { StatusBadge } from './StatusBadge';

interface ApplicationTableProps {
    applications: Application[];
    isLoading?: boolean;
}

export const ApplicationTable = ({ applications, isLoading }: ApplicationTableProps) => {
    const navigate = useNavigate();

    console.log('=== APPLICATION TABLE DEBUG ===');
    console.log('Applications received:', applications);
    console.log('Number of apps:', applications?.length || 0);
    if (applications?.length > 0) {
        console.log('First app:', applications[0]);
        console.log('First app ID:', applications[0]?.id);
        console.log('First app keys:', Object.keys(applications[0]));
    }


    return (
        <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                    <tr>
                        <th className="px-6 py-3">№ заявки</th>
                        <th className="px-6 py-3">Дата</th>
                        <th className="px-6 py-3">Банк</th>
                        <th className="px-6 py-3">Клиент</th>
                        <th className="px-6 py-3 text-right">Сумма продукта</th>
                        <th className="px-6 py-3 text-right">Комиссия</th>
                        <th className="px-6 py-3">Статус</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {isLoading ? (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-gray-500">
                                Загрузка...
                            </td>
                        </tr>
                    ) : applications.length === 0 ? (
                        <tr>
                            <td colSpan={7} className="p-8 text-center text-gray-500">
                                Нет заявок
                            </td>
                        </tr>
                    ) : (
                        applications.map((app) => (
                            <tr
                                key={app.id}
                                onClick={() => navigate(`/applications/${app.id}`)}
                                className="hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-[#1D194C]">
                                    {app.id}
                                    <div className="text-xs text-gray-400 mt-1">
                                        {app.product_data?.procurement_number || 'Без №'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                    {new Date(app.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 font-medium">{app.bank?.name}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium">
                                        {app.client_user?.company_name || app.client_user?.fio}
                                    </div>
                                    <div className="text-xs text-gray-400">
                                        ИНН: {app.client_user?.company_inn || '-'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-bold text-gray-700">
                                    {new Intl.NumberFormat('ru-RU').format(app.amount)} ₽
                                </td>
                                <td className="px-6 py-4 text-right text-gray-600">
                                    {app.commission_amount
                                        ? new Intl.NumberFormat('ru-RU').format(app.commission_amount) + ' ₽'
                                        : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={app.status} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
