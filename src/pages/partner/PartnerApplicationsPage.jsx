import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import Layout from '../../components/Layout';
import StatusBadge from '../../components/Table/StatusBadge';
import { Search, Filter, FileText, AlertCircle } from 'lucide-react';

export default function PartnerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all'); // all, bg, credit
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApps = async () => {
      try {
        // Бэкенд автоматически фильтрует заявки для банка этого партнера
        const res = await api.get(`/applications`, { params: { limit: 100 } });
        setApplications(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  // Простая фильтрация на клиенте для MVP
  const filteredApps = applications.filter(app => {
      if (activeTab === 'bg') return app.product_type === 'bank_guarantee';
      if (activeTab === 'credit') return app.product_type === 'credit';
      return true;
  });

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Входящие заявки</h1>
        <p className="text-gray-500 text-sm">Управление потоком сделок</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         {/* Табы продуктов */}
         <div className="flex border-b bg-gray-50">
            <button 
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'all' ? 'border-leader-cyan text-leader-dark bg-white' : 'border-transparent text-gray-500'}`}
            >
                ВСЕ
            </button>
            <button 
                onClick={() => setActiveTab('bg')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'bg' ? 'border-leader-cyan text-leader-dark bg-white' : 'border-transparent text-gray-500'}`}
            >
                БАНКОВСКИЕ ГАРАНТИИ
            </button>
            <button 
                onClick={() => setActiveTab('credit')}
                className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'credit' ? 'border-leader-cyan text-leader-dark bg-white' : 'border-transparent text-gray-500'}`}
            >
                КРЕДИТЫ
            </button>
         </div>

         {/* Панель инструментов */}
         <div className="p-4 flex gap-4 items-center border-b border-gray-100">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                <input 
                    placeholder="Поиск по ИНН, названию или номеру..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-leader-cyan outline-none text-sm"
                />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 text-sm font-medium">
                <Filter size={16} /> Расширенный фильтр
            </button>
         </div>

        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                    <th className="px-6 py-3">№ Заявки</th>
                    <th className="px-6 py-3">Дата</th>
                    <th className="px-6 py-3">Клиент / Агент</th>
                    <th className="px-6 py-3">Продукт</th>
                    <th className="px-6 py-3 text-right">Сумма</th>
                    <th className="px-6 py-3">Статус</th>
                    <th className="px-6 py-3"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr><td colSpan="7" className="p-8 text-center text-gray-500">Загрузка...</td></tr>
                ) : filteredApps.length === 0 ? (
                    <tr>
                        <td colSpan="7" className="p-12 text-center text-gray-400">
                            <FileText className="mx-auto mb-2 opacity-50" size={32} />
                            Нет активных заявок
                        </td>
                    </tr>
                ) : (
                    filteredApps.map((app) => (
                        <tr key={app.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => navigate(`/applications/${app.id}`)}>
                            <td className="px-6 py-4 font-bold text-leader-blue">
                                #{app.id}
                                {app.product_data?.procurement_number && (
                                    <div className="text-xs text-gray-400 mt-0.5">{app.product_data.procurement_number}</div>
                                )}
                            </td>
                            <td className="px-6 py-4 text-gray-600">
                                {new Date(app.created_at).toLocaleDateString()}
                                <div className="text-xs text-gray-400">{new Date(app.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-800">{app.client_user.company_name || app.client_user.fio}</div>
                                <div className="text-xs text-gray-500">ИНН: {app.client_user.company_inn || '-'}</div>
                                {app.agent_user && (
                                    <div className="text-xs text-leader-tiffany mt-1 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-leader-tiffany"></span>
                                        Агент: {app.agent_user.fio}
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4">
                                <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                    {app.product_type === 'bank_guarantee' ? 'Банковская гарантия' : app.product_type}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-gray-700">
                                {new Intl.NumberFormat('ru-RU').format(app.amount)} ₽
                            </td>
                            <td className="px-6 py-4"><StatusBadge status={app.status} /></td>
                            <td className="px-6 py-4 text-right">
                                {app.status === 'submitted' || app.status === 'draft' ? (
                                     <span className="text-leader-cyan font-bold text-xs bg-leader-cyan/10 px-3 py-1.5 rounded-full flex items-center gap-1 w-fit ml-auto">
                                         <AlertCircle size={12} /> ТРЕБУЕТ РЕШЕНИЯ
                                     </span>
                                ) : (
                                    <span className="text-gray-400 text-xs">В работе</span>
                                )}
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