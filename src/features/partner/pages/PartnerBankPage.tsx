import { apiClient } from '@shared/api/client';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@shared/components/ui';

export const PartnerBankPage = () => {
    const { data: bank, isLoading, error } = useQuery({
        queryKey: ['partner', 'bank'],
        queryFn: async () => {
            const res = await apiClient.get('/partner/bank');
            return res.data;
        },
    });

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;

    if (error || !bank) {
        return (
            <div className="p-8 text-center text-red-500">
                Ошибка загрузки данных банка
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Мой Банк</h1>
            <div className="bg-white p-8 rounded-xl border border-gray-200 max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-3xl font-bold text-green-600">
                        {bank.name[0]}
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-800">{bank.name}</h2>
                        <p className="text-gray-500">Партнёр платформы</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between border-b py-2">
                        <span className="text-gray-500">Статус партнера</span>
                        <span className="text-green-600 font-bold bg-green-50 px-2 py-1 rounded">
                            {bank.status === 'active' ? 'Активен' : bank.status}
                        </span>
                    </div>
                    <div className="flex justify-between border-b py-2">
                        <span className="text-gray-500">ID Банка</span>
                        <span className="text-gray-800">#{bank.id}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
