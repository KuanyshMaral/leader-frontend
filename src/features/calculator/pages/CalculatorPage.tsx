import { useState } from 'react';
import { Loader, AlertCircle } from 'lucide-react';
import apiClient from '@shared/api/client';
import { Input, Button, Spinner } from '@shared/components/ui';
import { useMutation } from '@tanstack/react-query';

interface CalculatorResult {
    approved_banks: Array<{
        id: number;
        name: string;
        commission: number;
        rate: number;
    }>;
    rejected_banks: Array<any>;
}

export const CalculatorPage = () => {
    const [activeTab, setActiveTab] = useState('bank_guarantee');
    const [formData, setFormData] = useState({
        law: '44-ФЗ',
        contract_number: '',
        amount: 1000000,
        term_days: 365,
        has_advance: false,
        is_closed_tender: false,
        no_eis: false,
    });

    const calculateMutation = useMutation({
        mutationFn: async (data: any) => {
            const payload = {
                product_type: activeTab,
                amount: parseFloat(data.amount.toString()),
                term_days: parseInt(data.term_days.toString()),
                product_data: {
                    law: data.law,
                    contract_number: data.contract_number,
                    has_advance: data.has_advance,
                },
            };
            const res = await apiClient.post<CalculatorResult>('/calculator/calculate', payload);
            return res.data;
        },
    });

    const handleCalculate = (e: React.FormEvent) => {
        e.preventDefault();
        calculateMutation.mutate(formData);
    };

    const results = calculateMutation.data;
    const approvedCount = results?.approved_banks?.length || 0;
    const rejectedCount = results?.rejected_banks?.length || 0;

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Калькулятор продуктов</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Табы продуктов */}
                <div className="flex border-b overflow-x-auto">
                    {[
                        { id: 'bank_guarantee', label: 'БАНКОВСКИЕ ГАРАНТИИ' },
                        { id: 'credit', label: 'КРЕДИТЫ' },
                        { id: 'factoring', label: 'ФАКТОРИНГ' },
                        { id: 'rko', label: 'РКО' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                setActiveTab(tab.id);
                                calculateMutation.reset();
                            }}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 
                ${activeTab === tab.id
                                    ? 'border-[#3CE8D1] text-[#1D194C] bg-blue-50'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Форма параметров */}
                <div className="p-8 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-700 mb-6">Заполните поля для расчета:</h3>

                    {calculateMutation.isError && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span>
                                {(calculateMutation.error as any)?.response?.data?.message || 'Ошибка расчета'}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleCalculate} className="space-y-6 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Федеральный закон */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Федеральный закон
                                </label>
                                <div className="flex gap-6">
                                    {['44-ФЗ', '223-ФЗ', '185-ФЗ', 'КБГ'].map((law) => (
                                        <label key={law} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="law"
                                                value={law}
                                                checked={formData.law === law}
                                                onChange={(e) => setFormData({ ...formData, law: e.target.value })}
                                                className="text-[#3CE8D1] focus:ring-[#3CE8D1]"
                                            />
                                            <span className="text-gray-700">{law}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <Input
                                label="№ Закупки / Извещения"
                                placeholder="0000000000000000000"
                                value={formData.contract_number}
                                onChange={(e) => setFormData({ ...formData, contract_number: e.target.value })}
                            />

                            {/* Сумма */}
                            <div className="relative">
                                <Input
                                    label="Сумма гарантии"
                                    type="number"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                />
                                <span className="absolute right-4 top-[38px] text-gray-400 font-bold">₽</span>
                            </div>

                            {/* Срок */}
                            <Input
                                label="Срок (дней)"
                                type="number"
                                value={formData.term_days}
                                onChange={(e) => setFormData({ ...formData, term_days: parseInt(e.target.value) })}
                            />

                            <div className="w-full">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">До даты</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white"
                                />
                            </div>

                            {/* Чекбоксы */}
                            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={formData.has_advance}
                                        onChange={(e) => setFormData({ ...formData, has_advance: e.target.checked })}
                                        className="rounded text-[#3CE8D1] focus:ring-[#3CE8D1]"
                                    />
                                    Наличие аванса
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_closed_tender}
                                        onChange={(e) =>
                                            setFormData({ ...formData, is_closed_tender: e.target.checked })
                                        }
                                        className="rounded text-[#3CE8D1] focus:ring-[#3CE8D1]"
                                    />
                                    Закрытый конкурс
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={formData.no_eis}
                                        onChange={(e) => setFormData({ ...formData, no_eis: e.target.checked })}
                                        className="rounded text-[#3CE8D1] focus:ring-[#3CE8D1]"
                                    />
                                    Без размещения в ЕИС
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={calculateMutation.isPending} className="px-10">
                                {calculateMutation.isPending ? (
                                    <span className="flex items-center gap-2">
                                        <Spinner size="sm" className="text-white" />
                                        Расчет...
                                    </span>
                                ) : (
                                    'РАССЧИТАТЬ'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    calculateMutation.reset();
                                }}
                            >
                                Очистить
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Результаты расчета */}
                {results && (
                    <div className="border-t border-gray-200 animate-fade-in">
                        <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center px-8">
                            <h3 className="font-bold text-green-800">РЕЗУЛЬТАТ ОТБОРА:</h3>
                            <div className="flex gap-2">
                                <span className="bg-white px-3 py-1 rounded text-xs font-bold text-green-600 shadow-sm">
                                    Одобрено: {approvedCount}
                                </span>
                                <span className="bg-white px-3 py-1 rounded text-xs font-bold text-red-600 shadow-sm">
                                    Отказано: {rejectedCount}
                                </span>
                            </div>
                        </div>

                        {/* Таблица банков */}
                        <div className="p-8">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Банк</th>
                                        <th className="px-4 py-3 text-right">Комиссия</th>
                                        <th className="px-4 py-3 text-right">Ставка</th>
                                        <th className="px-4 py-3 text-center">Статус</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {results.approved_banks?.map((bank) => (
                                        <tr key={bank.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 font-medium">{bank.name}</td>
                                            <td className="px-4 py-3 text-right font-bold text-green-600">
                                                {new Intl.NumberFormat('ru-RU').format(bank.commission)} ₽
                                            </td>
                                            <td className="px-4 py-3 text-right">{bank.rate}%</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded text-xs font-bold">
                                                    Одобрено
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
