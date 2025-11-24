import { useState, useRef, useEffect } from 'react';
import { useSearchParams, useParams, Link } from 'react-router-dom';
import apiClient from '@shared/api/client';
import { Button, Spinner } from '@shared/components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Send, AlertCircle, Edit2, Trash2, Check, X } from 'lucide-react';
import { useAuthStore } from '@features/auth';

interface Message {
    id: number;
    body: string;
    created_at: string;
    sender_user: {
        id: number;
        fio: string;
        role: string;
    };
    moderation_status?: string;
}

export const ChatPage = () => {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const appId = id || searchParams.get('application_id');
    const [text, setText] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editText, setEditText] = useState('');
    const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
    const queryClient = useQueryClient();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { user: currentUser } = useAuthStore();

    // Fetch messages with polling
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['chat', appId],
        queryFn: async () => {
            if (!appId) return [];
            const res = await apiClient.get<Message[]>(`/applications/${appId}/messages`);
            return res.data;
        },
        enabled: !!appId,
        refetchInterval: 30000, // Poll every 30 seconds
    });

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: async () => {
            if (!text || !appId) return;
            return apiClient.post('/messages', {
                application_id: Number(appId),
                body: text,
            });
        },
        onSuccess: () => {
            setText('');
            queryClient.invalidateQueries({ queryKey: ['chat', appId] });
        },
        onError: () => alert('Ошибка отправки сообщения'),
    });

    // Edit message mutation
    const editMessageMutation = useMutation({
        mutationFn: async ({ id, body }: { id: number; body: string }) => {
            return apiClient.patch(`/messages/${id}`, { body });
        },
        onSuccess: () => {
            setEditingId(null);
            setEditText('');
            queryClient.invalidateQueries({ queryKey: ['chat', appId] });
        },
        onError: (e: any) => alert(e.response?.data?.error || 'Ошибка редактирования'),
    });

    // Delete message mutation
    const deleteMessageMutation = useMutation({
        mutationFn: async (id: number) => {
            return apiClient.delete(`/messages/${id}`);
        },
        onSuccess: () => {
            setDeleteConfirmId(null);
            queryClient.invalidateQueries({ queryKey: ['chat', appId] });
        },
        onError: (e: any) => alert(e.response?.data?.error || 'Ошибка удаления'),
    });

    // Moderate message mutation
    const moderateMutation = useMutation({
        mutationFn: async ({ id, action }: { id: number; action: string }) => {
            return apiClient.post(`/admin/chat/messages/${id}/${action}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['chat', appId] });
        },
        onError: (e: any) => alert('Ошибка модерации: ' + (e.response?.data?.error || e.message)),
    });

    const handleStartEdit = (msg: Message) => {
        setEditingId(msg.id);
        setEditText(msg.body);
    };

    const handleSaveEdit = (msgId: number) => {
        if (!editText.trim()) return;
        editMessageMutation.mutate({ id: msgId, body: editText });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditText('');
    };

    if (!appId) {
        return (
            <div className="p-8 text-center h-screen flex flex-col items-center justify-center">
                <div className="bg-gray-100 p-8 rounded-full mb-4">
                    <AlertCircle size={48} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Выберите заявку</h2>
                <p className="text-gray-500 mb-6">Чтобы начать чат, выберите заявку из списка.</p>
                <Link to="/applications">
                    <Button>Перейти к заявкам</Button>
                </Link>
            </div>
        );
    }

    if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold text-[#1D194C]">Чат по заявке #{appId}</h1>
                <Link to={`/applications/${appId}`} className="text-sm text-[#3CE8D1] hover:underline">
                    Перейти к заявке
                </Link>
            </div>

            <div className="flex-1 border rounded-xl p-4 overflow-y-auto mb-4 bg-gray-50 shadow-inner">
                {messages.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-400">
                        Нет сообщений. Напишите первое сообщение!
                    </div>
                )}
                <div className="flex flex-col gap-3">
                    {messages.map((msg) => {
                        const isOwn = currentUser?.id === msg.sender_user.id;
                        const isPending = msg.moderation_status === 'pending';
                        const isRejected = msg.moderation_status === 'rejected';
                        const isEditing = editingId === msg.id;

                        return (
                            <div
                                key={msg.id}
                                className={`flex ${isOwn ? 'justify-end' : 'justify-start'} group`}
                            >
                                <div
                                    className={`
                                        p-4 rounded-2xl max-w-[75%] shadow-sm relative
                                        ${isOwn
                                            ? 'bg-[#3CE8D1] text-[#1D194C] rounded-br-sm'
                                            : 'bg-white border border-gray-200 rounded-bl-sm'
                                        }
                                        ${isPending ? 'opacity-70 border-2 border-dashed border-yellow-400' : ''}
                                        ${isRejected ? 'bg-red-50 border-red-200' : ''}
                                    `}
                                >
                                    {/* Action buttons (edit/delete) - only for own messages */}
                                    {isOwn && !isEditing && (
                                        <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                            <button
                                                onClick={() => handleStartEdit(msg)}
                                                className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-700"
                                                title="Редактировать"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteConfirmId(msg.id)}
                                                className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600"
                                                title="Удалить"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}

                                    <div className="flex justify-between items-baseline mb-1 gap-4">
                                        <span className={`font-bold text-xs ${isOwn ? 'text-[#1D194C]/70' : 'text-gray-600'}`}>
                                            {msg.sender_user.fio}
                                        </span>
                                        <span className={`text-[10px] ${isOwn ? 'text-[#1D194C]/50' : 'text-gray-400'}`}>
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* Message body or edit textarea */}
                                    {isEditing ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editText}
                                                onChange={(e) => setEditText(e.target.value)}
                                                className="w-full p-2 border rounded resize-none text-sm"
                                                rows={3}
                                                autoFocus
                                            />
                                            <div className="flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleSaveEdit(msg.id)}
                                                    className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 flex items-center gap-1"
                                                >
                                                    <Check size={12} /> Сохранить
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400 flex items-center gap-1"
                                                >
                                                    <X size={12} /> Отмена
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isRejected ? 'line-through' : ''}`}>
                                            {msg.body}
                                        </p>
                                    )}

                                    {/* Moderation status indicators */}
                                    {isPending && (
                                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full border border-yellow-300 font-medium">
                                                ⏳ На модерации
                                            </span>
                                            {currentUser?.role === 'admin' && (
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => moderateMutation.mutate({ id: msg.id, action: 'approve' })}
                                                        className="text-[10px] px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 font-medium"
                                                        title="Одобрить"
                                                    >
                                                        ✓ Одобрить
                                                    </button>
                                                    <button
                                                        onClick={() => moderateMutation.mutate({ id: msg.id, action: 'reject' })}
                                                        className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-medium"
                                                        title="Отклонить"
                                                    >
                                                        ✗ Отклонить
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {isRejected && (
                                        <div className="mt-2">
                                            <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-300 font-medium">
                                                ❌ Отклонено модератором
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessageMutation.mutate();
                        }
                    }}
                    placeholder="Введите сообщение..."
                    className="flex-1 p-3 bg-transparent outline-none text-gray-700"
                    disabled={sendMessageMutation.isPending}
                />
                <Button
                    onClick={() => sendMessageMutation.mutate()}
                    disabled={!text.trim() || sendMessageMutation.isPending}
                    className="rounded-lg px-6"
                >
                    {sendMessageMutation.isPending ? <Spinner size="sm" /> : <Send size={18} />}
                </Button>
            </div>

            {/* Delete confirmation modal */}
            {deleteConfirmId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setDeleteConfirmId(null)}>
                    <div className="bg-white p-6 rounded-xl shadow-xl max-w-md" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-lg font-bold mb-2">Удалить сообщение?</h3>
                        <p className="text-gray-600 mb-4">Это действие нельзя отменить.</p>
                        <div className="flex gap-2 justify-end">
                            <Button
                                variant="secondary"
                                onClick={() => setDeleteConfirmId(null)}
                            >
                                Отмена
                            </Button>
                            <Button
                                onClick={() => deleteMessageMutation.mutate(deleteConfirmId)}
                                className="bg-red-500 hover:bg-red-600"
                            >
                                {deleteMessageMutation.isPending ? <Spinner size="sm" /> : 'Удалить'}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
