import { useVictories } from '../hooks/useVictories';
import { Spinner } from '@shared/components/ui';

export const VictoriesPage = () => {
    const { data: victories, isLoading } = useVictories();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!victories || victories.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                <p className="text-gray-500 text-lg">Нет данных для отображения</p>
                <p className="text-gray-400 text-sm mt-2">У вас пока нет одобренных заявок</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Мои победы</h1>

            {/* Stats Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <p className="text-3xl font-bold text-[#3CE8D1]">{victories.length}</p>
                        <p className="text-gray-600 text-sm mt-1">Всего побед</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-green-600">
                            {victories.filter(v => v.status === 'completed').length}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">Завершенные</p>
                    </div>
                    <div className="text-center">
                        <p className="text-3xl font-bold text-blue-600">
                            {new Intl.NumberFormat('ru-RU').format(
                                victories.reduce((sum, v) => sum + (v.amount || 0), 0)
                            )} ₽
                        </p>
                        <p className="text-gray-600 text-sm mt-1">Сумма БГ</p>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Выход протокола
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    НМЦ руб
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Сумма БГ руб
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Обеспечение
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Срок
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                    Предмет закупки
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {victories.map((victory) => (
                                <tr key={victory.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">
                                            {victory.created_at ? new Date(victory.created_at).toLocaleDateString('ru-RU') : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-gray-900">
                                            {victory.product_data?.nmc ?
                                                new Intl.NumberFormat('ru-RU').format(victory.product_data.nmc) :
                                                '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm font-semibold text-[#3CE8D1]">
                                            {new Intl.NumberFormat('ru-RU').format(victory.amount)} ₽
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">
                                            {victory.product_data?.security_type || '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="text-sm text-gray-600">
                                            {victory.term_days ? `${victory.term_days} дней` : '-'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-600">
                                            {victory.product_data?.subject || victory.product_type || '-'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
