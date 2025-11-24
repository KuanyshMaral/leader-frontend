import { useState, useEffect } from 'react';
import apiClient from '@shared/api/client';
import { useAuthStore } from '@features/auth';
import { Edit2, Trash2, Check, X } from 'lucide-react';

interface Message {
    id: number;
    body: string;
    created_at: string;
    sender_user?: {
        id: number;
        fio: string;
        role: string;
    };
    moderation_status?: string;
}

interface ChatWidgetProps {
    applicationId: string | number;
}

export const ChatWidget = ({ applicationId }: ChatWidgetProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const { user } = useAuthStore();

    const load = async () => {
        try {
            const res = await apiClient.get(`/applications/${applicationId}/messages`);
            setMessages(res.data);
        } catch (e) {
            console.error('Ошибка загрузки сообщений', e);
        }
    };

    useEffect(() => {
        load();
        const interval = setInterval(load, 30000); // 30 seconds
        return () => clearInterval(interval);
    }, [applicationId]);

    const send = async () => {
        if (!text.trim()) return;

        try {
            await apiClient.post('/messages', {
                application_id: parseInt(String(applicationId)),
                body: text,
            });
            setText('');
            load();
        } catch (e) {
            console.error('Ошибка отправки:', e);
            alert('Не удалось отправить сообщение');
        }
    };

    const handleStartEdit = (msg: Message) => {
        setEditingId(msg.id);
        setEditText(msg.body);
    };

    const handleSaveEdit = async (msgId: number) => {
        if (!editText.trim()) return;
        try {
            await apiClient.patch(`/messages/${msgId}`, { body: editText });
            setEditingId(null);
            setEditText('');
            load();
        } catch (e: any) {
            alert(e.response?.data?.error || 'Ошибка редактирования');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    const handleDelete = async (msgId: number) => {
        try {
            await apiClient.delete(`/messages/${msgId}`);
            setDeleteConfirmId(null);
            load();
        } catch (e: any) {
            alert(e.response?.data?.error || 'Ошибка удаления');
        }
    };

    return (
        <>
            <div className="flex-1 p-4 overflow-y-auto bg-white space-y-3">
                {messages.length === 0 && (
                    <p className="text-gray-400 text-center text-xs mt-10">Напишите сообщение...</p>
                )}
                {messages.map((m) => {
                    const isOwn = user?.id === m.sender_user?.id;
                    const isPending = m.moderation_status === 'pending';
                    const isRejected = m.moderation_status === 'rejected';
                    const isEditing = editingId === m.id;

                    return (
                        <div
                            key={m.id}
                            className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                        >
                            <div
                                className={`
                                    p-3 rounded-lg max-w-[85%] text-sm relative
                                    ${isOwn
                                        ? 'bg-[#3CE8D1] text-[#1D194C] rounded-br-sm'
                                        : 'bg-white border border-gray-200 rounded-bl-sm'
                                    }
                                    ${isPending ? 'opacity-70 border-2 border-dashed border-yellow-400' : ''}
                                    ${isRejected ? 'bg-red-50 border-red-200' : ''}
                                `}
                            >
                                {/* Action buttons - only for own messages */}
                                {isOwn && !isEditing && (
                                    <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                        <button
                                            onClick={() => handleStartEdit(m)}
                                            className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-700"
                                            title="Редактировать"
                                        >
                                            <Edit2 size={12} />
                                        </button>
                                        <button
                                            onClick={() => setDeleteConfirmId(m.id)}
                                            className="p-1 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600"
                                            title="Удалить"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                )}

                                <div className="flex justify-between items-baseline mb-1">
                                    <span className={`font-bold text-[10px] uppercase tracking-wider ${isOwn ? 'text-[#1D194C]/70' : 'opacity-70'}`}>
                                        {m.sender_user?.fio || 'Неизвестный'}
                                    </span>
                                    <span className={`text-[10px] ml-2 ${isOwn ? 'text-[#1D194C]/50' : 'text-gray-400'}`}>
                                        {new Date(m.created_at).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                </div>

                                {/* Message body or edit textarea */}
                                {isEditing ? (
                                    <div className="space-y-2">
                                        <textarea
                                            value={editText}
                                            onChange={(e) => setEditText(e.target.value)}
                                            className="w-full p-2 border rounded resize-none text-sm"
                                            rows={2}
                                            autoFocus
                                        />
                                        <div className="flex gap-1 justify-end">
                                            <button
                                                onClick={() => handleSaveEdit(m.id)}
                                                className="px-2 py-1 bg-green-500 text-white rounded text-[10px] hover:bg-green-600 flex items-center gap-1"
                                            >
                                                <Check size={10} /> Сохранить
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-[10px] hover:bg-gray-400 flex items-center gap-1"
                                            >
                                                <X size={10} /> Отмена
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className={isRejected ? 'line-through' : ''}>{m.body}</div>
                                )}

                                {/* Moderation indicators */}
                                {isPending && (
                                    <div className="mt-2">
                                        <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full border border-yellow-300">
                                            ⏳ На модерации
                                        </span>
                                    </div>
                                )}

                                {isRejected && (
                                    <div className="mt-2">
                                        <span className="text-[10px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full border border-red-300">
                                            ❌ Отклонено
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="p-3 border-t bg-gray-50">
                <div className="flex gap-2">
                    <input
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#3CE8D1]"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Сообщение..."
                        onKeyDown={(e) => e.key === 'Enter' && send()}
                    />
                    <button
                        onClick={send}
                        className="bg-[#3CE8D1] text-white p-2 rounded-lg hover:bg-[#2DD1B8] transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="22" y1="2" x2="11" y2="13"></line>
                            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Delete confirmation modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirmId(null)}>
                    <div className="bg-white p-4 rounded-xl shadow-xl max-w-sm" onClick={(e) => e.stopPropagation()}>
                        <h3 className="font-bold mb-2">Удалить сообщение?</h3>
                        <p className="text-gray-600 text-sm mb-4">Это действие нельзя отменить.</p>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={() => handleDelete(deleteConfirmId)}
                                className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
