import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ChatWidget({ applicationId }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState('');

    const load = async () => {
        const res = await api.get(`/applications/${applicationId}/messages`);
        setMessages(res.data);
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, 5000);
        return () => clearInterval(interval);
    }, [applicationId]);

    const send = async () => {
        if (!text.trim()) return;

        try {
            await api.post('/messages', {
                application_id: parseInt(applicationId),
                body: text
            });
            setText('');
            load();
        } catch (e) {
            console.error("Ошибка отправки:", e);
            alert("Не удалось отправить сообщение");
        }
    };

    return (
        <>
            <div className="flex-1 p-4 overflow-y-auto bg-white space-y-3">
                {messages.length === 0 && <p className="text-gray-400 text-center text-xs mt-10">Напишите менеджеру...</p>}
                {messages.map(m => (
                    <div key={m.id} className={`p-3 rounded-lg max-w-[85%] text-sm ${m.sender_user?.role === 'admin'
                            ? 'bg-gray-100 ml-auto rounded-br-none'
                            : 'bg-leader-tiffany/10 border border-leader-tiffany/20 text-gray-800 rounded-bl-none'
                        }`}>
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="font-bold text-[10px] uppercase tracking-wider opacity-70">{m.sender_user?.fio || 'Неизвестный'}</span>
                            <span className="text-[10px] text-gray-400 ml-2">
                                {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <div>{m.body}</div>

                        {/* Индикатор pending */}
                        {m.moderation_status === 'pending' && (
                            <div className="mt-2">
                                <span className="text-[10px] bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-200">
                                    ⏳ На модерации
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="p-3 border-t bg-gray-50">
                <div className="flex gap-2">
                    <input
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-leader-cyan"
                        value={text}
                        onChange={e => setText(e.target.value)}
                        placeholder="Сообщение..."
                        onKeyDown={e => e.key === 'Enter' && send()}
                    />
                    <button onClick={send} className="bg-leader-cyan text-white p-2 rounded-lg hover:bg-leader-blue transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                    </button>
                </div>
            </div>
        </>
    );
}