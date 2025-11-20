import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Building2, FileText, MessageSquare, Plus, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ apps: 0, docs: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/profile/me').then(res => setUser(res.data));
    // В будущем тут можно запросить статистику
  }, []);

  const createApplication = async () => {
      try {
          const res = await api.post('/applications', {
              client_user_id: 1, // MVP
              product_type: 'bank_guarantee',
              amount: 0,
              term_days: 0,
              bank_ids: [1],
              product_data: { client_inn: '0000000000' }
          });
          navigate(`/applications/${res.data.created_ids[0]}`);
      } catch (e) {
          alert('Ошибка создания');
      }
  };

  if (!user) return <Layout><div className="p-8">Загрузка...</div></Layout>;

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-leader-dark mb-2">
            Добрый день, {user.fio.split(' ')[1]}!
        </h1>
        <p className="text-gray-500">Вот что происходит в вашем кабинете сегодня.</p>
      </div>

      {/* Виджеты действий */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          {/* Создать заявку */}
          <div onClick={createApplication} className="bg-leader-tiffany rounded-xl p-6 shadow-lg shadow-leader-tiffany/20 cursor-pointer transform hover:-translate-y-1 transition-all text-leader-dark group">
              <div className="flex justify-between items-start mb-8">
                  <div className="p-3 bg-white/30 rounded-lg">
                    <Plus size={24} />
                  </div>
                  <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold">Новая заявка</h3>
              <p className="text-sm opacity-80 mt-1">Банковская гарантия или кредит</p>
          </div>

          {/* Моя компания */}
          <Link to="/company" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-leader-cyan transition-colors group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-leader-blue rounded-lg">
                    <Building2 size={24} />
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${user.company_inn ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {user.company_inn ? 'Заполнено' : 'Не заполнено'}
                  </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-leader-cyan">Моя компания</h3>
              <p className="text-sm text-gray-500 mt-1">
                  {user.company_name || 'Заполните реквизиты'}
              </p>
          </Link>

          {/* Документы */}
          <Link to="/documents" className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-leader-cyan transition-colors group">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-50 text-purple-700 rounded-lg">
                    <FileText size={24} />
                  </div>
              </div>
              <h3 className="text-lg font-bold text-gray-800 group-hover:text-leader-cyan">Документы</h3>
              <p className="text-sm text-gray-500 mt-1">Загрузить уставные документы</p>
          </Link>
      </div>

      {/* Блок "Последние действия" (Заглушка) */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Последние заявки</h3>
              <Link to="/" className="text-sm text-leader-cyan hover:underline">Все заявки</Link>
          </div>
          <div className="p-8 text-center text-gray-400">
              У вас пока нет активных заявок.
          </div>
      </div>

    </Layout>
  );
}