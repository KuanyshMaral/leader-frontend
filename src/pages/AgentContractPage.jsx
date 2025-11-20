import { useState } from 'react';
import Layout from '../components/Layout';
import { Download, FileText, Clock } from 'lucide-react';

export default function AgentContractPage() {
  const [activeTab, setActiveTab] = useState('rewards'); // rewards, docs

  // Заглушка данных для таблицы вознаграждений (как на скриншоте)
  const rewards = [
    { bank: 'АК Барс', service: 'Получение Банковской гарантии', reward: '15% от комиссии, уплаченной на банк при сумме продукта до 50 000 000 р.', dateStart: '-', dateEnd: '-' },
    { bank: 'Абсолют', service: 'Получение Банковской гарантии', reward: '20% от комиссии, уплаченной на банк, +50% от превышения тарифа', dateStart: '27.07.2025', dateEnd: '-' },
    { bank: 'Альфа-Банк', service: 'Получение Банковской гарантии', reward: '25% от комиссии, уплаченной на банк', dateStart: '-', dateEnd: '-' },
    { bank: 'Сбербанк', service: 'Получение Банковской гарантии', reward: '10% от комиссии (фиксировано)', dateStart: '15.02.2024', dateEnd: '-' },
  ];

  // Заглушка для документов
  const documents = [
    { title: 'Заявление о присоединении к регламенту', file: 'statement.pdf', date: '21.03.2025' },
    { title: 'Согласие на обработку персональных данных', file: 'consent.pdf', date: '21.03.2025' },
    { title: 'Лист записи / Скан свидетельства ОГРНИП', file: 'ogrn.pdf', date: '21.03.2025' },
    { title: 'Агентский договор', file: 'contract.pdf', date: '07.03.2025' },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Мой договор:</h1>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* Табы */}
        <div className="flex border-b">
            <button 
                onClick={() => setActiveTab('rewards')}
                className={`px-8 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors 
                    ${activeTab === 'rewards' ? 'border-leader-tiffany text-gray-800 bg-gray-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                АГЕНТСКОЕ ВОЗНАГРАЖДЕНИЕ
            </button>
            <button 
                onClick={() => setActiveTab('docs')}
                className={`px-8 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors 
                    ${activeTab === 'docs' ? 'border-leader-tiffany text-gray-800 bg-gray-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
                МОИ ДОКУМЕНТЫ
            </button>
        </div>

        {/* Контент: Вознаграждение */}
        {activeTab === 'rewards' && (
            <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-700">Текущие условия:</h3>
                    <button className="text-gray-500 text-sm flex items-center gap-1 hover:text-leader-cyan">
                        <Clock size={16} /> ИСТОРИЯ
                    </button>
                </div>

                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                            <tr>
                                <th className="px-4 py-3 w-1/4">Поручение</th>
                                <th className="px-4 py-3 w-1/6">Партнёр сервиса</th>
                                <th className="px-4 py-3">Вознаграждение Агента</th>
                                <th className="px-4 py-3 text-xs">Дата начала</th>
                                <th className="px-4 py-3 text-xs">Дата окончания</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {rewards.map((row, idx) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 text-gray-500">{row.service}</td>
                                    <td className="px-4 py-3 font-medium text-leader-blue">{row.bank}</td>
                                    <td className="px-4 py-3">{row.reward}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{row.dateStart}</td>
                                    <td className="px-4 py-3 text-gray-400 text-xs">{row.dateEnd}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* Контент: Документы */}
        {activeTab === 'docs' && (
            <div className="p-8 bg-gray-50/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {documents.map((doc, idx) => (
                        <div key={idx} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">
                            <h4 className="font-bold text-gray-700 mb-4 text-sm min-h-[40px]">{doc.title}</h4>
                            
                            <div className="flex-1 flex items-center justify-center mb-4">
                                <div className="w-16 h-20 bg-gray-100 border-2 border-gray-200 rounded flex items-center justify-center group-hover:border-leader-tiffany transition-colors">
                                    <FileText size={32} className="text-gray-400 group-hover:text-leader-tiffany" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-dashed">
                                <span>{doc.date}</span>
                                <button className="p-2 bg-gray-100 rounded-full hover:bg-leader-tiffany hover:text-white transition-colors">
                                    <Download size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </div>
    </Layout>
  );
}