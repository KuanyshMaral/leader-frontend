import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import ChatWidget from '../components/ChatWidget'; // Вынесем чат в компонент

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const [app, setApp] = useState(null);

  useEffect(() => {
    api.get(`/applications/${id}`).then(res => setApp(res.data));
  }, [id]);

  if (!app) return <Layout>Загрузка...</Layout>;

  return (
    <Layout>
      <div className="flex gap-6 h-[calc(100vh-140px)]">
          {/* Левая колонка: Инфо о заявке и Документы */}
          <div className="flex-1 overflow-y-auto pr-2">
              
              {/* Карточка Заявки (Шапка) */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                  <div className="flex justify-between items-start mb-4">
                      <div>
                          <h1 className="text-2xl font-bold text-gray-800">Заявка: {app.id} | {app.product_data.law || '---'}</h1>
                          <p className="text-gray-500">Банковская гарантия</p>
                      </div>
                      <div className="text-right">
                          <div className="text-sm text-gray-500">Банк</div>
                          <div className="font-bold text-leader-blue">{app.bank.name}</div>
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
                      <div>
                          <span className="block text-gray-400 text-xs">Сумма БГ</span>
                          <span className="font-bold">{new Intl.NumberFormat('ru-RU').format(app.amount)} ₽</span>
                      </div>
                      <div>
                          <span className="block text-gray-400 text-xs">Тариф</span>
                          <span className="font-bold">{app.tariff_rate ? app.tariff_rate + '%' : '-'}</span>
                      </div>
                      <div>
                          <span className="block text-gray-400 text-xs">К оплате</span>
                          <span className="font-bold">{app.commission_amount ? app.commission_amount + ' ₽' : '-'}</span>
                      </div>
                       <div>
                          <span className="block text-gray-400 text-xs">Статус</span>
                          <span className="font-bold text-green-600">{app.status}</span>
                      </div>
                  </div>
              </div>

              {/* Блок "Загрузите документы" (Скелет) */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                  <div className="bg-orange-50 px-6 py-3 border-b border-orange-100 flex justify-between items-center">
                      <h3 className="font-bold text-orange-800 flex items-center gap-2">
                          📂 Загрузите документы
                      </h3>
                      <span className="bg-white px-2 py-1 rounded text-xs font-bold text-orange-600 border border-orange-200">0% Загружено</span>
                  </div>
                  <div className="p-6">
                       {/* Список обязательных документов (Заглушка UI) */}
                       {['Паспорт руководителя', 'Бухгалтерский баланс', 'Анкета'].map(doc => (
                           <div key={doc} className="flex justify-between items-center py-3 border-b last:border-0">
                               <div className="flex items-center gap-2">
                                   <span className="text-red-500">*</span>
                                   <span className="text-gray-700">{doc}</span>
                               </div>
                               <button className="text-leader-cyan text-sm hover:underline font-medium">Загрузить</button>
                           </div>
                       ))}
                  </div>
              </div>

          </div>

          {/* Правая колонка: Чат */}
          <div className="w-1/3 min-w-[350px]">
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">
                    Чат по заявке
                </div>
                {/* Вставляем виджет чата сюда */}
                <ChatWidget applicationId={id} />
             </div>
          </div>
      </div>
    </Layout>
  );
}