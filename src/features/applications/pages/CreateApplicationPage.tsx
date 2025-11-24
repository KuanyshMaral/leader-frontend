import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FileText,
    CreditCard,
    TrendingUp,
    Building2,
    Shield,
    Briefcase,
    Wallet,
    Globe,
    Percent,
} from 'lucide-react';
import apiClient from '@shared/api/client';
import { Button, Input, Spinner } from '@shared/components/ui';
import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '@features/auth/api/authApi';

export const CreateApplicationPage = () => {
    const navigate = useNavigate();
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Fetch current user profile to get ID
    const { data: user } = useQuery({
        queryKey: ['profile'],
        queryFn: authApi.getProfile,
    });

    // Create mutation
    const createMutation = useMutation({
        mutationFn: async (data: any) => {
            return apiClient.post('/applications', data);
        },
        onSuccess: (res) => {
            navigate(`/applications/${res.data.created_ids[0]}`);
        },
        onError: () => alert('Ошибка создания заявки'),
    });

    const products = [
        { id: 'bank_guarantee', title: 'Банковские гарантии', icon: FileText, desc: '44-ФЗ, 223-ФЗ, 185-ФЗ' },
        { id: 'credit', title: 'Кредитование', icon: CreditCard, desc: 'На исполнение контракта' },
        { id: 'tender_loan', title: 'Тендерные займы', icon: Wallet, desc: 'На обеспечение заявки' },
        { id: 'factoring', title: 'Факторинг', icon: TrendingUp, desc: 'Финансирование под уступку' },
        { id: 'leasing', title: 'Лизинг', icon: Building2, desc: 'Транспорт и оборудование' },
        { id: 'insurance', title: 'Страхование', icon: Shield, desc: 'СМР, Ответственность' },
        { id: 'rko', title: 'РКО и Спецсчета', icon: Percent, desc: 'Открытие счетов' },
        { id: 'ved', title: 'ВЭД', icon: Globe, desc: 'Валютные контракты' },
        { id: 'tender_support', title: 'Сопровождение', icon: Briefcase, desc: 'Помощь в торгах' },
    ];

    const handleCreate = (e: any) => {
        e.preventDefault();
        if (!user) return;

        const formData = new FormData(e.target);
        const amount = formData.get('amount');
        const inn = formData.get('inn');

        createMutation.mutate({
            client_user_id: user.id,
            product_type: selectedProduct.id,
            amount: parseFloat(amount as string) || 0,
            term_days: 0,
            bank_ids: [1], // TODO: Add bank selection
            product_data: {
                client_inn: inn || '0000000000',
            },
        });
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Создать новую заявку</h1>
            <p className="text-gray-500 mb-8">Выберите продукт, чтобы начать оформление.</p>

            {!selectedProduct ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            onClick={() => setSelectedProduct(product)}
                            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#3CE8D1] cursor-pointer transition-all group"
                        >
                            <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-[#1D194C] group-hover:bg-[#3CE8D1] group-hover:text-white transition-colors mb-4">
                                <product.icon size={24} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{product.title}</h3>
                            <p className="text-sm text-gray-500">{product.desc}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
                    <button
                        onClick={() => setSelectedProduct(null)}
                        className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
                    >
                        ← Назад к выбору
                    </button>

                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-[#3CE8D1]/20 rounded-lg flex items-center justify-center text-[#1D194C]">
                            <selectedProduct.icon size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{selectedProduct.title}</h2>
                            <p className="text-sm text-gray-500">Быстрое оформление</p>
                        </div>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-5">
                        <Input name="inn" label="ИНН Клиента" placeholder="Введите ИНН" required />

                        {!['rko', 'tender_support', 'insurance'].includes(selectedProduct.id) && (
                            <Input name="amount" label="Желаемая сумма (₽)" type="number" placeholder="0.00" />
                        )}

                        <Button type="submit" className="w-full py-3 text-lg" disabled={createMutation.isPending}>
                            {createMutation.isPending ? <Spinner size="sm" /> : 'Перейти к оформлению →'}
                        </Button>
                    </form>
                </div>
            )}
        </div>
    );
};
