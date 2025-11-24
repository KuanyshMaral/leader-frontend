import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';

export default function PartnerBankPage() {
    const [bank, setBank] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/partner/bank')
            .then(res => setBank(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="p-8 text-center text-gray-500">Загрузка...</div>
            </Layout>
        );
    }

    if (!bank) {
        return (
            <Layout>
                <div className="p-8 text-center text-red-500">Ошибка загрузки данных банка</div>
            </Layout>
        );
    }

    return (
        <Layout>
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
        </Layout>
    );
}