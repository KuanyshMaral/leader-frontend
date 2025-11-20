import { useState, useEffect } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import Button from '../components/Button';
import StatusBadge from '../components/Table/StatusBadge';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active'); // active, rejected, archive
  const navigate = useNavigate();

  // Загрузка данных с бэкенда
  useEffect(() => {
    const fetchApps = async () => {
      setLoading(true);
      try {
        // Используем наш реальный эндпоинт с фильтрацией
        const res = await api.get(`/applications`, {
            params: { 
                status: filter === 'active' ? null : filter, // null = активные
                page: 1, 
                limit: 50 
            }
        });
        setApplications(res.data.data); // Наш бэк возвращает { data: [], total: ... }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [filter]);

  // Функция создания новой (пустой) заявки - MVP Скелет
  const createNewApplication = async () => {
      try {
          // Шлем минимальный набор данных, чтобы создать "болванку"
          const res = await api.post('/applications', {
              client_user_id: 1, // TODO: Брать из контекста/выбора клиента
              product_type: 'bank_guarantee',
              amount: 0,
              term_days: 0,
              bank_ids: [1], // Тестовый банк
              product_data: { client_inn: '0000000000' }
          });
          // Сразу переходим в эту заявку
          navigate(`/applications/${res.data.created_ids[0]}`);
      } catch (e) {
          alert('Ошибка создания заявки');
      }
  };

  return (
    <Layout>
      {/* Заголовок и Табы (как на скриншоте) */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Мои заявки:</h1>
        <div className="flex border-b border-gray-200">
            {/* Заглушки табов - пока все ведут на один список */}
            {['ГОСТОРГИ', 'РАСЧЕТНЫЕ СЧЕТА', 'СПЕЦСЧЕТА', 'ЭКСПРЕСС-КРЕДИТ'].map((tab, i) => (
                <button key={tab} className={`px-6 py-3 text-sm font-bold ${i===0 ? 'border-b-2 border-leader-tiffany text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
                    {tab}
                </button>
            ))}
        </div>
      </div>

      {/* Панель инструментов (Фильтры и Поиск) */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center justify-between">
         <div className="flex items-center gap-4 flex-1">
            <Button onClick={createNewApplication} className="w-10 h-10 !p-0 rounded-full flex items-center justify-center bg-white text-leader-tiffany hover:bg-gray-50 border">
                <Plus size={24} />
            </Button>
            
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
                <input 
                    placeholder="поиск" 
                    className="w-full pl-10 pr-4 py-2 rounded border border-gray-300 focus:outline-none focus:border-leader-tiffany"
                />
            </div>
         </div>

         <div className="flex items-center gap-4 text-sm text-gray-600">
            <label className="flex items-center gap-2 cursor-pointer">
                <span>Отказные</span>
                <div 
                    onClick={() => setFilter(filter === 'rejected' ? 'active' : 'rejected')}
                    className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${filter === 'rejected' ? 'bg-leader-tiffany' : 'bg-gray-300'}`}
                >
                    <div className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${filter === 'rejected' ? 'translate-x-5' : ''}`} />
                </div>
            </label>
            
            <label className="flex items-center gap-2 cursor-pointer">
                <span>Архивные</span>
                <div 
                    onClick={() => setFilter(filter === 'archive' ? 'active' : 'archive')}
                    className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${filter === 'archive' ? 'bg-leader-tiffany' : 'bg-gray-300'}`}
                >
                    <div className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${filter === 'archive' ? 'translate-x-5' : ''}`} />
                </div>
            </label>
            
             <Button variant="secondary" className="flex gap-2 items-center px-4 py-2">
                <Filter size={16} /> ФИЛЬТР
             </Button>
         </div>
      </div>

      {/* Таблица Заявок */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                    <th className="px-6 py-3">№ заявки</th>
                    <th className="px-6 py-3">Дата</th>
                    <th className="px-6 py-3">Банк</th>
                    <th className="px-6 py-3">Клиент</th>
                    <th className="px-6 py-3 text-right">Сумма продукта</th>
                    <th className="px-6 py-3 text-right">Комиссия</th>
                    <th className="px-6 py-3">Статус</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">Загрузка...</td></tr>
                ) : applications.length === 0 ? (
                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">Нет заявок</td></tr>
                ) : (
                    applications.map((app) => (
                        <tr 
                            key={app.id} 
                            onClick={() => navigate(`/applications/${app.id}`)}
                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                            <td className="px-6 py-4 font-medium text-leader-blue">
                                {app.id}
                                <div className="text-xs text-gray-400 mt-1">{app.product_data?.procurement_number || 'Без №'}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                {new Date(app.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 font-medium">
                                {app.bank.name}
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium">{app.client_user.company_name || app.client_user.fio}</div>
                                <div className="text-xs text-gray-400">ИНН: {app.client_user.company_inn || '-'}</div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-gray-700">
                                {new Intl.NumberFormat('ru-RU').format(app.amount)} ₽
                            </td>
                            <td className="px-6 py-4 text-right text-gray-600">
                                {app.commission_amount ? new Intl.NumberFormat('ru-RU').format(app.commission_amount) + ' ₽' : '-'}
                            </td>
                            <td className="px-6 py-4">
                                <StatusBadge status={app.status} />
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>
    </Layout>
  );
}