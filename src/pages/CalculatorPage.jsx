import { useState } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { Check, ChevronDown, Loader, AlertCircle } from 'lucide-react';

export default function CalculatorPage() {
    const [activeTab, setActiveTab] = useState('bank_guarantee');
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        law: '44-ФЗ',
        contract_number: '',
        amount: 1000000,
        term_days: 365,
        has_advance: false,
        is_closed_tender: false,
        no_eis: false
    });

    const handleCalculate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const payload = {
                product_type: activeTab,
                amount: parseFloat(formData.amount),
                term_days: parseInt(formData.term_days),
                product_data: {
                    law: formData.law,
                    contract_number: formData.contract_number,
                    has_advance: formData.has_advance,
                    is_closed_tender: formData.is_closed_tender,
                    no_eis: formData.no_eis,
                    client_inn: '' // Опционально - можно брать из профиля
                }
            };

            const res = await api.post('/application/calculate', payload);
            setResults(res.data);
            setShowResults(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Ошибка расчета');
        } finally {
            setLoading(false);
        }
    };

    const approvedCount = results?.approved_banks?.length || 0;
    const rejectedCount = results?.rejected_banks?.length || 0;

    return (
        <Layout>
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
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => { setActiveTab(tab.id); setShowResults(false); }}
                            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors border-b-2 
                ${activeTab === tab.id ? 'border-leader-tiffany text-leader-dark bg-blue-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Форма параметров */}
                <div className="p-8 bg-gray-50/50">
                    <h3 className="text-lg font-bold text-gray-700 mb-6">Заполните поля для расчета:</h3>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleCalculate} className="space-y-6 max-w-4xl">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Федеральный закон */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Федеральный закон</label>
                                <div className="flex gap-6">
                                    {['44-ФЗ', '223-ФЗ', '185-ФЗ', 'КБГ'].map(law => (
                                        <label key={law} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="law"
                                                value={law}
                                                checked={formData.law === law}
                                                onChange={(e) => setFormData({ ...formData, law: e.target.value })}
                                                className="text-leader-cyan focus:ring-leader-cyan"
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
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                />
                                <span className="absolute right-4 top-[38px] text-gray-400 font-bold">₽</span>
                            </div>

                            {/* Срок */}
                            <Input
                                label="Срок (дней)"
                                type="number"
                                value={formData.term_days}
                                onChange={(e) => setFormData({ ...formData, term_days: e.target.value })}
                            />

                            <div className="w-full">
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">До даты</label>
                                <input type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white" />
                            </div>

                            {/* Чекбоксы */}
                            <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={formData.has_advance}
                                        onChange={(e) => setFormData({ ...formData, has_advance: e.target.checked })}
                                        className="rounded text-leader-cyan focus:ring-leader-cyan"
                                    />
                                    Наличие аванса
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_closed_tender}
                                        onChange={(e) => setFormData({ ...formData, is_closed_tender: e.target.checked })}
                                        className="rounded text-leader-cyan focus:ring-leader-cyan"
                                    />
                                    Закрытый конкурс
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={formData.no_eis}
                                        onChange={(e) => setFormData({ ...formData, no_eis: e.target.checked })}
                                        className="rounded text-leader-cyan focus:ring-leader-cyan"
                                    />
                                    Без размещения в ЕИС
                                </label>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button type="submit" disabled={loading} className="px-10">
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader className="animate-spin" size={16} />
                                        Расчет...
                                    </span>
                                ) : 'РАССЧИТАТЬ'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowResults(false);
                                    setResults(null);
                                    setError(null);
                                }}
                            >
                                Очистить
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Результаты расчета */}
                {showResults && results && (
                    <div className="border-t border-gray-200 animate-fade-in">
                        <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center px-8">
                            <h3 className="font-bold text-green-800">РЕЗУЛЬТАТ ОТБОРА:</h3>
                            <div className="flex gap-2">
                                <span className="bg-white px-3 py-1 rounded text-xs font-bold text-green-600 shadow-sm">
                                    Одобрено: {approvedCount}
                                </span>
                                <span className="bg-white px-3 py-1 rounded text-xs font-bold text-red-600 shadow-sm">
                                    Отказ: {rejectedCount}
                                </span>
                            </div>
                        </div>

                        <div className="p-8">
                            {approvedCount > 0 ? (
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-gray-500 border-b">
                                            <th className="text-left py-3 font-medium">Наименование Банка</th>
                                            <th className="text-left py-3 font-medium">Тариф / Ставка</th>
                                            <th className="text-left py-3 font-medium">Скорость</th>
                                            <th className="text-right py-3 font-medium">Действие</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {results.approved_banks.map(bank => (
                                            <tr key={bank.bank_id} className="hover:bg-gray-50">
                                                <td className="py-4 font-bold text-gray-800 flex items-center gap-2">
                                                    {bank.name}
                                                </td>
                                                <td className="py-4 text-gray-600">{bank.tariff}</td>
                                                <td className="py-4">
                                                    <span className={`px-2 py-1 rounded text-xs ${bank.decision_speed === 'Высокая'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-yellow-100 text-yellow-700'
                                                        }`}>
                                                        {bank.decision_speed}
                                                    </span>
                                                </td>
                                                <td className="py-4 text-right">
                                                    <button className="text-leader-cyan font-bold hover:underline">Выбрать</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    Нет одобренных банков по заданным параметрам
                                </div>
                            )}

                            {/* Отказные */}
                            {rejectedCount > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <span className="font-bold">ОТКАЗНЫЕ ({rejectedCount})</span>
                                        <ChevronDown size={16} />
                                    </div>
                                    <div className="space-y-2">
                                        {results.rejected_banks.map((bank, idx) => (
                                            <div key={idx} className="p-4 bg-red-50 rounded-lg text-sm text-red-800 border border-red-100">
                                                <div className="flex justify-between">
                                                    <span className="font-bold">{bank.name}</span>
                                                    <span>Причина: {bank.reason}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <p className="text-xs text-gray-400 mt-8 text-center">
                                Приведенные расчеты стоимости являются предварительными и не являются публичной офертой.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}