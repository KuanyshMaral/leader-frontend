import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import apiClient from '@shared/api/client';
import { Button, Spinner } from '@shared/components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useDebounce } from '@shared/hooks/useDebounce';

interface User {
    id: number;
    fio: string;
    email: string;
    role: string;
    company_name?: string;
    inn?: string;
}

export const AdminUsersPage = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const pageSize = 10;

    const debouncedSearch = useDebounce(search, 300);

    // Fetch users
    const { data: users = [], isLoading } = useQuery({
        queryKey: ['admin', 'users', 'pending'],
        queryFn: async () => {
            const res = await apiClient.get<User[]>('/admin/users/accreditation/pending');
            return res.data;
        },
    });

    // Mutations
    const approveMutation = useMutation({
        mutationFn: async (id: number) => {
            return apiClient.post(`/admin/users/${id}/approve-accreditation`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'pending'] });
            alert('Пользователь одобрен!');
        },
        onError: () => alert('Ошибка'),
    });

    const rejectMutation = useMutation({
        mutationFn: async ({ id, reason }: { id: number; reason: string }) => {
            return apiClient.post(`/admin/users/${id}/reject-accreditation`, { reason });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin', 'users', 'pending'] });
            alert('Пользователь отклонен');
        },
        onError: () => alert('Ошибка'),
    });

    const handleApprove = (id: number) => {
        if (confirm('Одобрить аккредитацию?')) {
            approveMutation.mutate(id);
        }
    };

    const handleReject = (id: number) => {
        const reason = prompt('Укажите причину отказа:');
        if (reason) {
            rejectMutation.mutate({ id, reason });
        }
    };

    // Document modal state
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [showDocumentsModal, setShowDocumentsModal] = useState(false);

    // Fetch user documents
    const { data: userDocuments = [], isLoading: docsLoading } = useQuery({
        queryKey: ['admin', 'user', selectedUserId, 'documents'],
        queryFn: async () => {
            if (!selectedUserId) return [];
            const res = await apiClient.get(`/admin/users/${selectedUserId}/documents`);
            return res.data;
        },
        enabled: !!selectedUserId && showDocumentsModal,
    });

    const handleViewDocuments = (userId: number) => {
        setSelectedUserId(userId);
        setShowDocumentsModal(true);
    };

    // Filter and Paginate
    const filteredUsers = useMemo(() => {
        if (!debouncedSearch) return users;
        const lowerSearch = debouncedSearch.toLowerCase();
        return users.filter(
            (u) =>
                u.fio.toLowerCase().includes(lowerSearch) ||
                u.email.toLowerCase().includes(lowerSearch) ||
                u.inn?.includes(lowerSearch) ||
                u.company_name?.toLowerCase().includes(lowerSearch)
        );
    }, [users, debouncedSearch]);

    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

    if (isLoading) return <div className="p-12 flex justify-center"><Spinner /></div>;

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Очередь на аккредитацию</h1>

            {/* Search */}
            <div className="mb-6 relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Поиск по ФИО, Email, ИНН..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1); // Reset page on search
                    }}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#3CE8D1]"
                />
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                        <tr>
                            <th className="px-6 py-3">Пользователь</th>
                            <th className="px-6 py-3">Роль</th>
                            <th className="px-6 py-3">Компания (ИНН)</th>
                            <th className="px-6 py-3 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-400">
                                    {debouncedSearch ? 'Ничего не найдено' : 'Нет заявок на проверку'}
                                </td>
                            </tr>
                        ) : (
                            paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-bold">{user.fio}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 uppercase text-xs font-bold text-gray-500">
                                        {user.role}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.company_name ? (
                                            <>
                                                <div>{user.company_name}</div>
                                                <div className="text-xs text-gray-400">{user.inn}</div>
                                            </>
                                        ) : (
                                            <span className="text-red-400">Профиль не заполнен</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleViewDocuments(user.id)}
                                            className="p-2 text-gray-400 hover:text-blue-600"
                                            title="Просмотр документов"
                                        >
                                            <Eye size={20} />
                                        </button>

                                        <button
                                            onClick={() => handleApprove(user.id)}
                                            className="p-2 text-green-500 hover:bg-green-50 rounded-full"
                                            title="Одобрить"
                                        >
                                            <CheckCircle size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleReject(user.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-full"
                                            title="Отклонить"
                                        >
                                            <XCircle size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <div className="text-sm text-gray-500">
                            Страница {page} из {totalPages}
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Documents Modal */}
            {showDocumentsModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDocumentsModal(false)}>
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full m-4 max-h-[80vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Документы пользователя</h2>
                            <button
                                onClick={() => setShowDocumentsModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-6">
                            {docsLoading ? (
                                <div className="flex justify-center py-8">
                                    <Spinner />
                                </div>
                            ) : userDocuments.length === 0 ? (
                                <p className="text-gray-400 text-center py-8">Документы не загружены</p>
                            ) : (
                                <div className="space-y-3">
                                    {userDocuments.map((doc: any) => (
                                        <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                                            <div>
                                                <p className="font-medium">{doc.file_name}</p>
                                                <p className="text-xs text-gray-500">
                                                    {doc.doc_type} • {new Date(doc.uploaded_at).toLocaleDateString('ru-RU')}
                                                </p>
                                            </div>
                                            <a
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 bg-[#3CE8D1] text-white rounded-lg hover:bg-[#2DD1B8]"
                                            >
                                                Открыть
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Пользователи</h1>
                <Button onClick={() => navigate('/admin/users/create-partner')}>+ Добавить партнера</Button>
            </div>
        </div>
    );
};
