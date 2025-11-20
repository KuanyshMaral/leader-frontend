import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Layout from '../../components/Layout';
import { Check, X, MessageSquare } from 'lucide-react';

export default function AdminChatPage() {
  const [messages, setMessages] = useState([]);

  const loadMessages = () => {
    // Используем наш эндпоинт для модерации
    api.get('/admin/chat/pending').then(res => setMessages(res.data));
  };

  useEffect(() => { loadMessages(); }, []);

  const moderate = async (id, action) => { // action: 'approve' | 'reject'
    try {
        await api.post(`/admin/chat/messages/${id}/${action}`);
        loadMessages();
    } catch(e) { alert('Ошибка'); }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Модерация сообщений</h1>
      
      <div className="grid gap-4">
         {messages.length === 0 && <p className="text-gray-400">Нет сообщений на проверку</p>}
         
         {messages.map(msg => (
             <div key={msg.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-start">
                 <div className="flex gap-4">
                     <div className="p-3 bg-blue-50 text-blue-600 rounded-full h-fit">
                         <MessageSquare size={24} />
                     </div>
                     <div>
                         <div className="flex items-center gap-2 mb-1">
                             <span className="font-bold text-gray-800">{msg.sender_user.fio}</span>
                             <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase">{msg.sender_user.role}</span>
                             <span className="text-xs text-gray-400 ml-2">Заявка #{msg.application_id}</span>
                         </div>
                         <p className="text-gray-600 bg-gray-50 p-3 rounded-lg mt-2 border border-gray-100">
                             {msg.body}
                         </p>
                         <div className="text-xs text-gray-400 mt-2">
                             {new Date(msg.created_at).toLocaleString()}
                         </div>
                     </div>
                 </div>

                 <div className="flex gap-2">
                     <button 
                        onClick={() => moderate(msg.id, 'approve')}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                     >
                        <Check size={18} /> Одобрить
                     </button>
                     <button 
                        onClick={() => moderate(msg.id, 'reject')}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium"
                     >
                        <X size={18} /> Отклонить
                     </button>
                 </div>
             </div>
         ))}
      </div>
    </Layout>
  );
}