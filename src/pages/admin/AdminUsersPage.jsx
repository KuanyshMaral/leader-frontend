import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import { CheckCircle, XCircle, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const loadUsers = () => {
    // Используем наш готовый эндпоинт
    api.get('/admin/users/accreditation/pending').then(res => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleApprove = async (id) => {
    if(!confirm('Одобрить аккредитацию?')) return;
    try {
        await api.post(`/admin/users/${id}/approve-accreditation`);
        alert('Пользователь одобрен!');
        loadUsers();
    } catch(e) { alert('Ошибка'); }
  };

  const handleReject = async (id) => {
    const reason = prompt('Укажите причину отказа:');
    if(!reason) return;
    try {
        await api.post(`/admin/users/${id}/reject-accreditation`, { reason });
        alert('Пользователь отклонен');
        loadUsers();
    } catch(e) { alert('Ошибка'); }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Очередь на аккредитацию</h1>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                    <th className="px-6 py-3">Пользователь</th>
                    <th className="px-6 py-3">Роль</th>
                    <th className="px-6 py-3">Компания (ИНН)</th>
                    <th className="px-6 py-3 text-right">Действия</th>
                </tr>
            </thead>
            <tbody className="divide-y">
                {users.length === 0 ? (
                    <tr><td colSpan="4" className="p-8 text-center text-gray-400">Нет заявок на проверку</td></tr>
                ) : users.map(user => (
                    <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="font-bold">{user.fio}</div>
                            <div className="text-xs text-gray-400">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 uppercase text-xs font-bold text-gray-500">
                            {user.role}
                        </td>
                        <td className="px-6 py-4">
                            {user.company_name ? (
                                <>
                                    <div>{user.company_name}</div>
                                    <div className="text-xs text-gray-400">{user.inn}</div>
                                </>
                            ) : <span className="text-red-400">Профиль не заполнен</span>}
                        </td>
                        <td className="px-6 py-4 flex justify-end gap-2">
                             {/* В будущем: Кнопка просмотра документов */}
                             <button className="p-2 text-gray-400 hover:text-blue-600" title="Просмотр документов"><Eye size={20} /></button>
                             
                             <button onClick={() => handleApprove(user.id)} className="p-2 text-green-500 hover:bg-green-50 rounded-full" title="Одобрить">
                                <CheckCircle size={20} />
                             </button>
                             <button onClick={() => handleReject(user.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Отклонить">
                                <XCircle size={20} />
                             </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Пользователи</h1>
          <Button onClick={() => navigate('/admin/users/create-partner')}>
              + Добавить партнера
          </Button>
      </div>
    </Layout>
  );
}