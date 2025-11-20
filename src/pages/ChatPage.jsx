// src/pages/ChatPage.jsx
import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ChatPage() {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');
    const [appId, setAppId] = useState(null);

    useEffect(() => {
        // 1. Сначала создаем (или ищем) заявку, чтобы было где чатиться
        const initChat = async () => {
            try {
                // Создаем "техническую" заявку для чата
                const res = await api.post('/applications', {
                    // Минимум данных для CreateApplicationDTO
                    client_user_id: 1, // Тут надо брать ID из токена по-хорошему, но пока так
                    product_type: 'bank_guarantee',
                    amount: 1000,
                    term_days: 30,
                    bank_ids: [1], // ID банка из Fixtures
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
        loadMessages(appId); // Обновляем список
    };

    if (!appId) return <div className="p-8">Инициализация чата...</div>;

    return (
        <div className="p-8 max-w-2xl mx-auto h-screen flex flex-col">
            <h1 className="text-2xl font-bold mb-4">Чат с менеджером (Заявка #{appId})</h1>
            
            <div className="flex-1 border rounded p-4 overflow-y-auto mb-4 bg-gray-50">
                {messages.length === 0 && <p className="text-gray-400 text-center">Нет сообщений</p>}
                {messages.map((msg) => (
                    <div key={msg.id} className={`mb-2 p-3 rounded max-w-[80%] ${
                        msg.sender_user.role === 'admin' 
                            ? 'bg-blue-100 ml-auto' // Сообщения админа справа (условно)
                            : 'bg-white border'     // Твои слева
                    }`}>
                        <p className="font-bold text-xs text-gray-500">{msg.sender_user.fio}</p>
                        <p>{msg.body}</p>
                        <span className="text-xs text-gray-400">
                            {msg.moderation_status === 'pending' ? '⏳ На проверке' : '✅'}
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