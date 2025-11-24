import { Award } from 'lucide-react';
import apiClient from '@shared/api/client';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '@shared/components/ui';

export const PartnerAgentsPage = () => {
    const { data: agents = [], isLoading } = useQuery({
        queryKey: ['partner', 'agents'],
        queryFn: async () => {
            const res = await apiClient.get('/partner/agents');
            return res.data;
        },
    });

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner size="lg" /></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Аккредитованные агенты</h1>

            {agents.length === 0 ? (
                <div className="p-12 text-center text-gray-400 bg-white rounded-xl">
                    Нет агентов с заявками в ваш банк
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent: any) => (
                        <div
                            key={agent.id}
                            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-[#1D194C] font-bold text-lg">
                                        {agent.fio[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-sm">{agent.fio}</h3>
                                        <p className="text-xs text-gray-500">{agent.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                                    <Award size={14} /> {agent.rating}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                                <div>
                                    <p className="text-gray-400 text-xs">Сделок</p>
                                    <p className="font-bold text-gray-800">{agent.deals_count}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs">Объем (₽)</p>
                                    <p className="font-bold text-[#3CE8D1]">
                                        {new Intl.NumberFormat('ru-RU').format(agent.total_volume)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
