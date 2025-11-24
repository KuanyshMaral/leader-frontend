import { useState } from 'react';
import { Download, RefreshCw, Trash2, Upload } from 'lucide-react';
import apiClient from '@shared/api/client';
import { Button, Spinner } from '@shared/components/ui';
import { UploadDocModal } from '@shared/components/modals/UploadDocModal';
import { ReplaceDocModal } from '@shared/components/modals/ReplaceDocModal';
import { DOC_TYPES } from '@shared/constants/docTypes';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ClientDocumentsProps {
    clientId: string;
}

export const ClientDocuments = ({ clientId }: ClientDocumentsProps) => {
    const queryClient = useQueryClient();
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadDocType, setUploadDocType] = useState('');
    const [replaceDoc, setReplaceDoc] = useState<any>(null);

    // Fetch documents
    const { data: documents = [], isLoading } = useQuery({
        queryKey: ['client', clientId, 'documents'],
        queryFn: async () => {
            const res = await apiClient.get(`/agent/clients/${clientId}/documents`);
            return res.data;
        },
    });

    // Mutations
    const uploadMutation = useMutation({
        mutationFn: async (data: any) => {
            const formData = new FormData();
            formData.append('file', data.file[0]);
            formData.append('docType', data.docType);
            return apiClient.post(`/agent/clients/${clientId}/documents`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client', clientId, 'documents'] });
            setIsUploadOpen(false);
            setUploadDocType('');
            alert('Загружено!');
        },
        onError: (e: any) => alert('Ошибка: ' + (e.response?.data?.error || e.message)),
    });

    const replaceMutation = useMutation({
        mutationFn: async (data: any) => {
            const formData = new FormData();
            formData.append('file', data.file[0]);
            formData.append('reason', data.reason || '');
            return apiClient.post(`/documents/${replaceDoc.id}/replace`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client', clientId, 'documents'] });
            setReplaceDoc(null);
            alert('Документ заменен!');
        },
        onError: (e: any) => alert('Ошибка: ' + (e.response?.data?.error || e.message)),
    });

    const deleteMutation = useMutation({
        mutationFn: async (docId: number) => {
            return apiClient.delete(`/documents/${docId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['client', clientId, 'documents'] });
            alert('Документ удален');
        },
        onError: (e: any) => alert('Ошибка: ' + (e.response?.data?.error || e.message)),
    });

    const handleDownload = async (docId: number, fileName: string) => {
        try {
            const response = await apiClient.get(`/documents/${docId}/download`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'document');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e: any) {
            alert('Ошибка скачивания: ' + (e.response?.data?.error || e.message));
        }
    };

    // Merge logic
    const mergedDocuments = DOC_TYPES.map((typeDef) => {
        const existingDoc = documents.find((d: any) => (d.docType || d.doc_type) === typeDef.value);
        return {
            ...typeDef,
            ...existingDoc,
            isUploaded: !!existingDoc,
        };
    });

    documents.forEach((doc: any) => {
        const type = doc.docType || doc.doc_type;
        if (!DOC_TYPES.find((t) => t.value === type)) {
            mergedDocuments.push({
                ...doc,
                label: type,
                isUploaded: true,
            });
        }
    });

    if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;

    return (
        <div>
            {/* Панель */}
            <div className="flex justify-between items-center mb-4 bg-gray-100 p-2 rounded-lg">
                <div className="flex items-center gap-2 px-2">
                    <button
                        onClick={() => {
                            setUploadDocType('');
                            setIsUploadOpen(true);
                        }}
                        className="w-8 h-8 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-500 shadow-sm hover:text-[#3CE8D1] transition-colors"
                        title="Загрузить документ"
                    >
                        +
                    </button>
                    <input
                        placeholder="поиск"
                        className="bg-transparent outline-none text-sm min-w-[200px]"
                    />
                </div>
                <div className="text-xs text-gray-500 mr-4">
                    Всего документов: {mergedDocuments.length}
                </div>
            </div>

            {/* Таблица */}
            <div className="border rounded-lg overflow-hidden bg-white">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-100 text-gray-600 font-bold text-xs uppercase border-b">
                        <tr>
                            <th className="px-6 py-3 w-10"></th>
                            <th className="px-6 py-3">Наименование документа</th>
                            <th className="px-6 py-3">Дата</th>
                            <th className="px-6 py-3">Статус</th>
                            <th className="px-6 py-3 text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {mergedDocuments.map((doc, index) => (
                            <tr
                                key={doc.id || `missing-${index}`}
                                className="hover:bg-blue-50/50 transition-colors group"
                            >
                                <td className="px-6 py-4">
                                    <div
                                        className={`w-4 h-4 border rounded ${doc.isUploaded ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'
                                            }`}
                                    ></div>
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-800">{doc.label}</td>
                                <td className="px-6 py-4 text-gray-500 text-xs">
                                    {doc.isUploaded
                                        ? new Date(doc.createdAt || doc.created_at).toLocaleString()
                                        : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    {doc.isUploaded ? (
                                        <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>{' '}
                                            Допущен
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Не
                                            загружен
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {doc.isUploaded ? (
                                        <>
                                            <button
                                                onClick={() => setReplaceDoc(doc)}
                                                className="text-gray-400 hover:text-[#3CE8D1]"
                                                title="Заменить"
                                            >
                                                <RefreshCw size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDownload(doc.id, doc.label)}
                                                className="text-gray-400 hover:text-[#3CE8D1]"
                                                title="Скачать"
                                            >
                                                <Download size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('Вы уверены?')) {
                                                        deleteMutation.mutate(doc.id);
                                                    }
                                                }}
                                                className="text-gray-400 hover:text-red-500"
                                                title="Удалить"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => {
                                                setUploadDocType(doc.value);
                                                setIsUploadOpen(true);
                                            }}
                                            className="text-[#3CE8D1] hover:text-[#2DD1B8] flex items-center gap-1 font-bold text-xs"
                                        >
                                            <Upload size={14} /> Загрузить
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {mergedDocuments.length === 0 && (
                    <div className="p-12 text-center">
                        <Button onClick={() => setIsUploadOpen(true)}>
                            + Загрузить первый документ
                        </Button>
                    </div>
                )}
            </div>

            {/* Модалки */}
            {isUploadOpen && (
                <UploadDocModal
                    onClose={() => setIsUploadOpen(false)}
                    onUpload={(data) => uploadMutation.mutate(data)}
                    defaultDocType={uploadDocType}
                />
            )}
            {replaceDoc && (
                <ReplaceDocModal
                    doc={replaceDoc}
                    onClose={() => setReplaceDoc(null)}
                    onReplace={(data) => replaceMutation.mutate(data)}
                />
            )}
        </div>
    );
};
