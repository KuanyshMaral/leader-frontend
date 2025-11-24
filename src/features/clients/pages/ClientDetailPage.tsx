import { useState } from 'react';
import { useParams } from 'react-router-dom';
import apiClient from '@shared/api/client';
import { Spinner } from '@shared/components/ui';
import { useQuery } from '@tanstack/react-query';
import { ClientInfo } from '../components/ClientInfo';
import { ClientDocuments } from '../components/ClientDocuments';
import { ClientApplications } from '../components/ClientApplications';
import { Building2 } from 'lucide-react';

export const ClientDetailPage = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('applications'); // Default to applications as it's the main feature

    // Fetch client info
    const { data: client, isLoading } = useQuery({
        queryKey: ['client', id],
        queryFn: async () => {
            const res = await apiClient.get(`/agent/clients/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center p-8">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!client) return <div>Клиент не найден</div>;

    return (
        <div>
            {/* ШАПКА КЛИЕНТА */}
            <ClientInfo client={client} />

            {/* ТАБЫ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                <div className="flex border-b bg-gray-50">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-6 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeTab === 'applications'
                            ? 'border-[#3CE8D1] bg-white text-gray-800'
                            : 'border-transparent text-gray-500'
                            }`}
                    >
                        ЗАЯВКИ
                    </button>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-6 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeTab === 'info'
                            ? 'border-[#3CE8D1] bg-white text-gray-800'
                            : 'border-transparent text-gray-500'
                            }`}
                    >
                        ИНФОРМАЦИЯ О КОМПАНИИ
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`px-6 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeTab === 'documents'
                            ? 'border-[#3CE8D1] bg-white text-gray-800'
                            : 'border-transparent text-gray-500'
                            }`}
                    >
                        ДОКУМЕНТЫ
                    </button>
                </div>

                <div className="p-8">
                    {/* --- ВКЛАДКА: ЗАЯВКИ --- */}
                    {activeTab === 'applications' && (
                        <ClientApplications clientId={Number(id)} />
                    )}

                    {/* --- ВКЛАДКА: ИНФОРМАЦИЯ (СКЕЛЕТ) --- */}
                    {activeTab === 'info' && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Building2 size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700">Анкета компании</h3>
                            <p className="text-gray-500 text-sm">
                                Здесь будет форма с реквизитами (как в разделе "Моя компания")
                            </p>
                        </div>
                    )}

                    {/* --- ВКЛАДКА: ДОКУМЕНТЫ --- */}
                    {activeTab === 'documents' && (
                        <ClientDocuments clientId={id!} />
                    )}
                </div>
            </div>
        </div>
    );
};
