import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, X, Clock } from 'lucide-react';
import apiClient from '@shared/api/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner, Button } from '@shared/components/ui';
import { useEffect, useRef } from 'react';

export const AdminChatModerationPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const applicationId = parseInt(id || '0');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Fetch messages for specific application using dedicated endpoint
    const { data: allMessages = [], isLoading, error } = useQuery({
        queryKey: ['admin', 'chat', 'messages', applicationId],
        queryFn: async () => {
            const res = await apiClient.get<any[]>(`/admin/chat/applications/${applicationId}/messages`);
            return res.data.map((m: any) => ({
                id: m.id,
                content: m.body,
                sender_name: m.sender_user?.fio || 'Unknown',
                sender_role: m.sender_user?.role || 'user',
                status: m.moderation_status?.toLowerCase() || 'pending',
                created_at: m.created_at,
                application_id: m.application?.id || applicationId
            }));
        },
        enabled: !!applicationId,
        refetchInterval: 10000,
    });

    // Scroll to bottom on load
    useEffect(() => {
        if (allMessages.length > 0) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [allMessages.length]);

    // Approve message mutation
    const approveMutation = useMutation({
        mutationFn: (messageId: number) =>
            apiClient.post(`/admin/chat/messages/${messageId}/approve`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'chat'] });
        },
    });

    // Reject message mutation
    const rejectMutation = useMutation({
        mutationFn: (messageId: number) =>
            apiClient.post(`/admin/chat/messages/${messageId}/reject`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'chat'] });
        },
    });

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner /></div>;

    if (error) return (
        <div className="p-8 text-center text-red-500">
            Ошибка загрузки сообщений
            <button onClick={() => navigate('/admin/chat')} className="block mx-auto mt-4 text-blue-600 underline">
                Вернуться назад
            </button>
        </div>
    );

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-4 mb-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <button
                    onClick={() => navigate('/admin/chat')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-xl font-bold text-gray-800">
                        Модерация чата - Заявка #{applicationId}
                    </h1>
                    <p className="text-xs text-gray-500">
                        Всего сообщений на модерацию: {allMessages.filter((m: any) => m.status === 'pending').length}
                    </p>
                </div>
            </div>

            {/* Messages List */}
            <div className="flex-1 bg-white rounded-xl shadow-sm p-6 overflow-y-auto border border-gray-100">
                {allMessages.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <Clock className="mx-auto mb-2" size={48} />
                        <p>Нет сообщений</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {allMessages.map((message: any) => {
                            // Admin sees all messages. 
                            // We can align admin's own messages to right? 
                            // But here "admin" is the viewer. 
                            // Let's align "admin" role messages to right, others to left.
                            const isOwn = message.sender_role === 'admin';
                            const isPending = message.status === 'pending';
                            const isRejected = message.status === 'rejected';

                            return (
                                <div
                                    key={message.id}
                                    className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`
                                            p-4 rounded-2xl max-w-[75%] shadow-sm relative
                                            ${isOwn
                                                ? 'bg-blue-100 text-blue-900 rounded-br-sm' // Admin messages distinct
                                                : 'bg-white border border-gray-200 rounded-bl-sm'
                                            }
                                            ${isPending ? 'border-2 border-dashed border-yellow-400 bg-yellow-50' : ''}
                                            ${isRejected ? 'bg-red-50 border-red-200' : ''}
                                        `}
                                    >
                                        <div className="flex justify-between items-baseline mb-1 gap-4">
                                            <span className={`font-bold text-xs ${isOwn ? 'text-blue-800' : 'text-gray-600'}`}>
                                                {message.sender_name}
                                                <span className="ml-1 font-normal opacity-70">({message.sender_role})</span>
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>

                                        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isRejected ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                            {message.content}
                                        </p>

                                        {/* Status Indicators & Actions */}
                                        {isPending && (
                                            <div className="mt-3 pt-2 border-t border-yellow-200">
                                                <div className="flex items-center justify-between gap-2">
                                                    <span className="text-[10px] font-bold text-yellow-700 flex items-center gap-1">
                                                        <Clock size={12} /> На модерации
                                                    </span>
                                                    <div className="flex gap-2">
                                                        <Button
                                                            size="sm"
                                                            onClick={() => approveMutation.mutate(message.id)}
                                                            disabled={approveMutation.isPending || rejectMutation.isPending}
                                                            className="h-7 px-2 text-xs bg-green-600 hover:bg-green-700"
                                                        >
                                                            <Check size={12} className="mr-1" /> Одобрить
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            onClick={() => rejectMutation.mutate(message.id)}
                                                            disabled={approveMutation.isPending || rejectMutation.isPending}
                                                            variant="secondary"
                                                            className="h-7 px-2 text-xs bg-red-100 text-red-700 hover:bg-red-200"
                                                        >
                                                            <X size={12} className="mr-1" /> Отклонить
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {isRejected && (
                                            <div className="mt-2">
                                                <span className="text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-full border border-red-300 font-medium">
                                                    ❌ Отклонено
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>
        </div>
    );
};
