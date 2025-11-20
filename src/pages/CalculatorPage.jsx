import { useState } from 'react';
import Layout from '../components/Layout';
import Input from '../components/Input';
import Button from '../components/Button';
import { Check, ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('bg'); // bg, credit, factoring...
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  // Имитация расчета (чтобы не зависеть от пустой базы данных)
  const handleCalculate = (e) => {
    e.preventDefault();
    setLoading(true);
    // Имитируем задержку сети
    setTimeout(() => {
        setLoading(false);
        setShowResults(true);
    }, 1000);
  };

  // Заглушка данных для результатов (как в ТЗ)
  const mockResults = [
    { id: 1, name: 'Сбербанк', rate: '2.5%', commission: '15 000 ₽', speed: 'Высокая', status: 'approved' },
    { id: 2, name: 'Альфа-Банк', rate: '2.8%', commission: '18 500 ₽', speed: 'Высокая', status: 'approved' },
    { id: 3, name: 'Совкомбанк', rate: '3.1%', commission: '21 000 ₽', speed: 'Средняя', status: 'approved' },
    { id: 99, name: 'Лидер-Гарант', rate: 'Индивидуально', commission: '—', speed: 'Высокая', isSpecial: true, status: 'approved' },
    { id: 4, name: 'ВТБ', reason: 'Превышен лимит на клиента', status: 'rejected' },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Калькулятор продуктов</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Табы продуктов */}
        <div className="flex border-b overflow-x-auto">
            {[
                {id: 'bg', label: 'БАНКОВСКИЕ ГАРАНТИИ'},
                {id: 'credit', label: 'КРЕДИТЫ'},
                {id: 'factoring', label: 'ФАКТОРИНГ'},
                {id: 'rko', label: 'РКО'},
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

        {/* Форма параметров (для БГ) */}
        <div className="p-8 bg-gray-50/50">
            <h3 className="text-lg font-bold text-gray-700 mb-6">Заполните поля для расчета:</h3>
            
            <form onSubmit={handleCalculate} className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Федеральный закон (Radio) */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-gray-700 mb-2">Федеральный закон</label>
                        <div className="flex gap-6">
                            {['44-ФЗ', '223-ФЗ', '185-ФЗ', 'КБГ'].map(law => (
                                <label key={law} className="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="law" defaultChecked={law==='44-ФЗ'} className="text-leader-cyan focus:ring-leader-cyan" />
                                    <span className="text-gray-700">{law}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Input label="№ Закупки / Извещения" placeholder="0000000000000000000" />
                    
                    {/* Сумма и Срок */}
                    <div className="relative">
                        <Input label="Сумма гарантии" placeholder="0.00" defaultValue="1000000" />
                        <span className="absolute right-4 top-[38px] text-gray-400 font-bold">₽</span>
                    </div>

                    <div className="flex gap-2">
                         <Input label="Срок (дней)" type="number" defaultValue="365" />
                         <div className="w-full">
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">До даты</label>
                            <input type="date" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white" />
                         </div>
                    </div>

                    {/* Чекбоксы */}
                    <div className="md:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
                        {['Наличие аванса', 'Закрытый конкурс', 'Без размещения в ЕИС'].map(opt => (
                            <label key={opt} className="flex items-center gap-2 cursor-pointer text-sm text-gray-600">
                                <input type="checkbox" className="rounded text-leader-cyan focus:ring-leader-cyan" />
                                {opt}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={loading} className="px-10">
                        {loading ? 'Расчет...' : 'РАССЧИТАТЬ'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setShowResults(false)}>
                        Очистить
                    </Button>
                </div>
            </form>
        </div>

        {/* Результаты расчета (Появляются после нажатия) */}
        {showResults && (
            <div className="border-t border-gray-200 animate-fade-in">
                <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center px-8">
                    <h3 className="font-bold text-green-800">РЕЗУЛЬТАТ ОТБОРА:</h3>
                    <div className="flex gap-2">
                         <span className="bg-white px-3 py-1 rounded text-xs font-bold text-green-600 shadow-sm">Одобрено: 4</span>
                         <span className="bg-white px-3 py-1 rounded text-xs font-bold text-red-600 shadow-sm">Отказ: 1</span>
                    </div>
                </div>

                <div className="p-8">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-gray-500 border-b">
                                <th className="text-left py-3 font-medium">Наименование Банка</th>
                                <th className="text-left py-3 font-medium">Тариф / Ставка</th>
                                <th className="text-left py-3 font-medium">Комиссия</th>
                                <th className="text-left py-3 font-medium">Скорость</th>
                                <th className="text-right py-3 font-medium">Действие</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {mockResults.filter(r => r.status === 'approved').map(bank => (
                                <tr key={bank.id} className={`hover:bg-gray-50 ${bank.isSpecial ? 'bg-leader-tiffany/10' : ''}`}>
                                    <td className="py-4 font-bold text-gray-800 flex items-center gap-2">
                                        {bank.isSpecial && <Check size={16} className="text-leader-cyan" />}
                                        {bank.name}
                                    </td>
                                    <td className="py-4 text-gray-600">{bank.rate}</td>
                                    <td className="py-4 font-bold">{bank.commission}</td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${bank.speed === 'Высокая' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {bank.speed}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button className="text-leader-cyan font-bold hover:underline">Выбрать</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Свернутые отказы */}
                    <div className="mt-6">
                        <div className="flex items-center gap-2 text-gray-500 cursor-pointer hover:text-gray-700">
                            <span className="font-bold">ОТКАЗНЫЕ (1)</span>
                            <ChevronDown size={16} />
                        </div>
                        <div className="mt-2 p-4 bg-red-50 rounded-lg text-sm text-red-800 border border-red-100">
                            <div className="flex justify-between">
                                <span className="font-bold">ВТБ</span>
                                <span>Причина: Превышен лимит на клиента</span>
                            </div>
                        </div>
                    </div>
                    
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