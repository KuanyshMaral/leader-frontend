import { useState } from 'react';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { Phone, MessageCircle, Copy, Search, Filter, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function CallBasePage() {
  // Имитация базы данных (Mock Data)
  const [leads, setLeads] = useState([
    { id: 1, name: 'ООО "СТРОЙ-ВЕСТ"', inn: '7705923378', contact: 'Алексей Петрович (Ген.дир)', phone: '+7 (926) 555-01-01', status: 'new', comment: '' },
    { id: 2, name: 'АО "ТЕХНОПРОМ"', inn: '5029177289', contact: 'Ольга (Бухгалтер)', phone: '+7 (495) 123-45-67', status: 'process', comment: 'Попросила перезвонить во вторник' },
    { id: 3, name: 'ИП Сидоров В.Г.', inn: '7727474581', contact: 'Валерий', phone: '+7 (903) 999-88-77', status: 'rejected', comment: 'Уже работают с другим банком' },
    { id: 4, name: 'ООО "ГЛОБАЛ ТРЕЙД"', inn: '5904285581', contact: 'Секретарь', phone: '+7 (800) 200-00-00', status: 'new', comment: '' },
    { id: 5, name: 'ЗАО "МЕГАСТРОЙ"', inn: '4027132717', contact: 'Дмитрий Иванович', phone: '+7 (916) 111-22-33', status: 'success', comment: 'Согласились на расчет БГ!' },
  ]);

  const [showScript, setShowScript] = useState(false);

  // Функция смены статуса
  const changeStatus = (id, newStatus) => {
    setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead));
  };

  // Цвета для статусов
  const statusConfig = {
    new: { label: 'Новый', bg: 'bg-blue-50', text: 'text-blue-600', icon: Clock },
    process: { label: 'В работе', bg: 'bg-yellow-50', text: 'text-yellow-600', icon: Clock },
    success: { label: 'Лид (Успех)', bg: 'bg-green-50', text: 'text-green-600', icon: CheckCircle },
    rejected: { label: 'Отказ', bg: 'bg-red-50', text: 'text-red-600', icon: XCircle },
  };

  return (
    <Layout>
      <div className="flex justify-between items-end mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">База для прозвона</h1>
            <p className="text-gray-500 text-sm">Ваши потенциальные клиенты из ЕИС</p>
        </div>
        <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowScript(!showScript)} className="flex items-center gap-2">
                <FileText size={18} />
                {showScript ? 'Скрыть скрипт' : 'Скрипт разговора'}
            </Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
                Загрузить базу (Excel)
            </Button>
        </div>
      </div>

      {/* Шпаргалка (Скрипт) */}
      {showScript && (
          <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl mb-6 animate-fade-in">
              <h3 className="font-bold text-blue-800 mb-2">📞 Скрипт первого звонка:</h3>
              <p className="text-blue-900 text-sm mb-2">
                  "Добрый день, [Имя]! Меня зовут [Ваше Имя], компания Лидер-Гарант. Мы финансовый маркетплейс, аккредитованный партнер 50 банков."
              </p>
              <p className="text-blue-900 text-sm">
                  "Вижу, вы выиграли тендер [Номер]. Скажите, вопрос с банковской гарантией уже решили или актуально предложение с тарифом от 1.5%?"
              </p>
          </div>
      )}

      {/* Фильтры */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex gap-4 items-center">
          <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
              <input placeholder="Поиск по ИНН, названию или телефону..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-leader-cyan outline-none" />
          </div>
          <div className="flex gap-2">
              {['Все', 'Новые', 'В работе', 'Отказ'].map(f => (
                  <button key={f} className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      {f}
                  </button>
              ))}
          </div>
      </div>

      {/* Таблица */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                  <tr>
                      <th className="px-6 py-4">Компания</th>
                      <th className="px-6 py-4">Контакт</th>
                      <th className="px-6 py-4">Связь</th>
                      <th className="px-6 py-4">Статус</th>
                      <th className="px-6 py-4">Комментарий</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {leads.map((lead) => {
                      const StatusIcon = statusConfig[lead.status].icon;
                      return (
                        <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="font-bold text-gray-800">{lead.name}</div>
                                <div className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                    ИНН: {lead.inn} 
                                    <Copy size={12} className="cursor-pointer hover:text-leader-cyan" onClick={() => alert('ИНН скопирован')} />
                                </div>
                            </td>
                            <td className="px-6 py-4 text-gray-700">
                                {lead.contact}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <a href={`tel:${lead.phone}`} className="font-medium text-gray-800 hover:text-leader-cyan whitespace-nowrap">
                                        {lead.phone}
                                    </a>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 bg-green-100 text-green-600 rounded hover:bg-green-200" title="WhatsApp">
                                            <MessageCircle size={16} />
                                        </button>
                                        <button className="p-1.5 bg-blue-100 text-blue-600 rounded hover:bg-blue-200" title="Позвонить">
                                            <Phone size={16} />
                                        </button>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <select 
                                    value={lead.status}
                                    onChange={(e) => changeStatus(lead.id, e.target.value)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border-none focus:ring-2 focus:ring-leader-cyan cursor-pointer ${statusConfig[lead.status].bg} ${statusConfig[lead.status].text}`}
                                >
                                    <option value="new">Новый</option>
                                    <option value="process">В работе</option>
                                    <option value="success">Лид (Успех)</option>
                                    <option value="rejected">Отказ</option>
                                </select>
                            </td>
                            <td className="px-6 py-4">
                                <input 
                                    defaultValue={lead.comment} 
                                    placeholder="Заметка..." 
                                    className="w-full bg-transparent border-b border-transparent focus:border-gray-300 outline-none text-gray-600 placeholder-gray-300 text-xs"
                                />
                            </td>
                        </tr>
                      );
                  })}
              </tbody>
          </table>
      </div>
    </Layout>
  );
}