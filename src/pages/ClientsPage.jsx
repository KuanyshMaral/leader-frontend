import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; // <-- Добавили для формы
import api from '../api/axios';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input'; // <-- Наш компонент инпута
import { Search, Filter, Plus, Building2, Phone, Mail, MoreHorizontal, X } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние модалки

  const navigate = useNavigate();
  // Хук формы
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  // Функция загрузки списка
  const fetchClients = async () => {
    setLoading(true);
    try {
      const res = await api.get('/agent/clients');
      setClients(res.data);
    } catch (e) {
      console.error("Ошибка загрузки клиентов", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Обработчик добавления клиента
  const onAddClient = async (data) => {
      try {
          await api.post('/agent/clients', data);
          alert('Клиент добавлен!');
          setIsModalOpen(false); // Закрываем окно
          reset(); // Чистим форму
          fetchClients(); // Обновляем список
      } catch (e) {
          alert('Ошибка: ' + (e.response?.data?.error || e.message));
      }
  };

  // Фильтрация на клиенте
  const filteredClients = clients.filter(client => 
    (client.company_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.inn || '').includes(searchTerm) ||
    (client.fio || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Мои клиенты</h1>
            <p className="text-gray-500 text-sm">Компании под вашим управлением</p>
        </div>
        <Button className="gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus size={20} /> Добавить клиента
        </Button>
      </div>

      {/* Панель фильтров */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex gap-4">
        <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input 
                placeholder="Поиск по названию, ИНН или ФИО..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-leader-cyan outline-none" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
        <Button variant="secondary" className="gap-2 bg-gray-100 text-gray-600 border-transparent">
            <Filter size={16} /> Фильтр
        </Button>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                    <th className="px-6 py-4">Компания / ИНН</th>
                    <th className="px-6 py-4">Контактное лицо</th>
                    <th className="px-6 py-4">Контакты</th>
                    <th className="px-6 py-4">Статус</th>
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {loading ? (
                    <tr><td colSpan="5" className="p-8 text-center text-gray-500">Загрузка базы клиентов...</td></tr>
                ) : filteredClients.length === 0 ? (
                    <tr>
                        <td colSpan="5" className="p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Building2 size={32} />
                            </div>
                            <p className="text-gray-500 font-medium">Список пуст или ничего не найдено</p>
                        </td>
                    </tr>
                ) : (
                    filteredClients.map((client) => (
                        <tr 
                            key={client.id} 
                            // ПЕРЕХОД ПРИ КЛИКЕ
                            onClick={() => navigate(`/clients/${client.id}`)}
                            className="hover:bg-gray-50 transition-colors group cursor-pointer"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-50 text-leader-blue rounded-lg flex items-center justify-center">
                                        <Building2 size={20} />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-800">{client.company_name}</div>
                                        <div className="text-xs text-gray-500 font-mono mt-0.5">ИНН: {client.inn}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="font-medium text-gray-700">{client.fio}</div>
                                <div className="text-xs text-gray-400">Клиент</div>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex flex-col gap-1 text-xs text-gray-600">
                                    <div className="flex items-center gap-2"><Phone size={12} /> {client.phone || '-'}</div>
                                    <div className="flex items-center gap-2"><Mail size={12} /> {client.email}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold
                                    ${client.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}
                                `}>
                                    {client.status === 'active' ? 'Активен' : 'Приглашен'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600">
                                    <MoreHorizontal size={20} />
                                </button>
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
      </div>

      {/* МОДАЛЬНОЕ ОКНО "ДОБАВИТЬ КЛИЕНТА" */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
                <button 
                    onClick={() => setIsModalOpen(false)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>
                
                <h2 className="text-xl font-bold text-gray-800 mb-4">Новый клиент</h2>
                <p className="text-gray-500 text-sm mb-6">
                    Введите данные клиента. Ему будет отправлено приглашение на почту.
                </p>

                <form onSubmit={handleSubmit(onAddClient)} className="space-y-4">
                    <Input label="ФИО" {...register("fio", {required: true})} placeholder="Иванов Иван" />
                    <Input label="Email" type="email" {...register("email", {required: true})} placeholder="client@company.ru" />
                    <Input label="Телефон" {...register("phone")} placeholder="+7..." />
                    <Input label="ИНН Компании (если есть)" {...register("inn")} placeholder="1234567890" />

                    <Button type="submit" className="w-full mt-4" disabled={isSubmitting}>
                        {isSubmitting ? 'Создание...' : 'Добавить'}
                    </Button>
                </form>
            </div>
        </div>
      )}

    </Layout>
  );
}