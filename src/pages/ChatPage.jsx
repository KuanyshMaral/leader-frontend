// src/pages/ChatPage.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [appId, setAppId] = useState(null);

    useEffect(() => {
        const initChat = async () => {
            try {
                const res = await api.post('/applications', {
                    client_user_id: 1,
                    product_type: 'bank_guarantee',
                    amount: 1000,
                    term_days: 30,
                    bank_ids: [1],
                    product_data: { client_inn: '0000000000' }
                });

                const id = res.data.created_ids[0];
                setAppId(id);
                loadMessages(id);
            } catch (e) {
                console.error("Ошибка инициализации чата", e);
            }
        };
        initChat();
    }, []);

    const loadMessages = async (id) => {
        const res = await api.get(`/applications/${id}/messages`);
        setMessages(res.data);
    };

    const sendMessage = async () => {
        if (!text) return;
        await api.post('/messages', {
            application_id: appId,
            body: text
        });
        setText('');
        loadMessages(appId);
    };

    const moderateMessage = async (id, action) => {
        try {
            await api.post(`/admin/chat/messages/${id}/${action}`);
            loadMessages(appId);
        } catch (e) {
            alert('Ошибка модерации: ' + (e.response?.data?.error || e.message));
        }
    };

    if (!appId) return <div className="p-8">Инициализация чата...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Чат с менеджером (Заявка #{appId})</h1>

            <div className="flex-1 border rounded p-4 overflow-y-auto mb-4 bg-gray-50">
                {messages.length === 0 && <p className="text-gray-400 text-center">Нет сообщений</p>}
                {messages.map((msg) => (
                    <div key={msg.id} className={`mb-3 p-4 rounded-lg max-w-[80%] ${msg.sender_user.role === 'admin'
                            ? 'bg-blue-100 ml-auto'
                            : 'bg-white border shadow-sm'
                        }`}>
                        <p className="font-bold text-xs text-gray-500 mb-1">{msg.sender_user.fio}</p>
                        <p className="text-gray-800">{msg.body}</p>

                        {/* Индикатор pending */}
                        {msg.moderation_status === 'pending' && (
                            <div className="mt-2">
                                <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full border border-yellow-200">
                                    ⏳ На модерации
                                </span>
                            </div>
                        )}

                        {/* Кнопки модерации для админа */}
                        {msg.moderation_status === 'pending' && (
                            <div className="mt-3 flex gap-2">
                                <button
                                    onClick={() => moderateMessage(msg.id, 'approve')}
                                    className="text-xs flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    ✓ Одобрить
                                </button>
                                <button
                                    onClick={() => moderateMessage(msg.id, 'reject')}
                                    className="text-xs flex items-center gap-1 px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50"
                                >
                                    ✗ Отклонить
                                </button>
                            </div>
                        )}

                        <span className="text-xs text-gray-400 block mt-1">
                            {new Date(msg.created_at).toLocaleTimeString()}
                        </span>
                    </div>
                ))}
            </div>

            <div className="flex gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Введите сообщение..."
                    className="flex-1 p-2 border rounded"
                />
                <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">
                    Отправить
                </button>
            </div>
        </div>
    );
}