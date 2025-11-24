import { useParams } from 'react-router-dom';
import apiClient from '@shared/api/client';
import { ChatWidget } from '@features/chat/components/ChatWidget';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from '@shared/components/ui';
import { Application, Document } from '@shared/types/models';
import { ProductType } from '@shared/types/enums';
import { StatusBadge } from '../components/StatusBadge';
import { Upload, CheckCircle, AlertCircle, FileText, Loader2, Download, RefreshCw, Trash2 } from 'lucide-react';
import { useState } from 'react';

const REQUIRED_DOCS = [
    { type: 'passport', label: 'Паспорт руководителя' },
    { type: 'balance_f1', label: 'Бухгалтерский баланс' },
    { type: 'questionnaire', label: 'Анкета' },
];

export const ApplicationDetailPage = () => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [uploadingType, setUploadingType] = useState<string | null>(null);

    const { data: app, isLoading: isAppLoading } = useQuery({
        queryKey: ['application', id],
        queryFn: async () => {
            const res = await apiClient.get<Application>(`/applications/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const { data: documents, isLoading: isDocsLoading } = useQuery({
        queryKey: ['application', id, 'documents'],
        queryFn: async () => {
            const res = await apiClient.get<Document[]>(`/applications/${id}/documents`);
            return res.data;
        },
        enabled: !!id,
    });

    const uploadMutation = useMutation({
        mutationFn: async ({ file, docType }: { file: File; docType: string }) => {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('docType', docType);
            formData.append('application_id', id!);

            const res = await apiClient.post('/documents/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['application', id, 'documents'] });
            setUploadingType(null);
        },
        onError: (error) => {
            console.error('Upload failed:', error);
            setUploadingType(null);
            alert('Ошибка загрузки файла');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (docId: number) => {
            await apiClient.delete(`/documents/${docId}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['application', id, 'documents'] });
        },
        onError: (error) => {
            console.error('Delete failed:', error);
            alert('Ошибка удаления файла');
        },
    });

    const replaceMutation = useMutation({
        mutationFn: async ({ docId, file, reason }: { docId: number; file: File; reason?: string }) => {
            const formData = new FormData();
            formData.append('file', file);
            if (reason) formData.append('reason', reason);

            await apiClient.post(`/documents/${docId}/replace`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['application', id, 'documents'] });
            setUploadingType(null);
        },
        onError: (error) => {
            console.error('Replace failed:', error);
            setUploadingType(null);
            alert('Ошибка замены файла');
        },
    });

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setUploadingType(docType);

            // Check if document already exists
            const existingDoc = documents?.find(d => d.doc_type === docType);

            if (existingDoc) {
                replaceMutation.mutate({ docId: existingDoc.id, file });
            } else {
                uploadMutation.mutate({ file, docType });
            }
        }
    };

    const handleDownload = async (docId: number, fileName: string) => {
        try {
            const response = await apiClient.get(`/documents/${docId}/download`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode?.removeChild(link);
        } catch (error) {
            console.error('Download failed:', error);
            alert('Ошибка скачивания файла');
        }
    };

    if (isAppLoading || isDocsLoading) return <div className="flex h-full items-center justify-center"><Spinner size="lg" /></div>;
    if (!app) return <div>Заявка не найдена</div>;

    // Calculate progress
    const uploadedTypes = new Set(documents?.map(d => d.doc_type));
    const requiredCount = REQUIRED_DOCS.length;
    const uploadedCount = REQUIRED_DOCS.filter(d => uploadedTypes.has(d.type)).length;
    const progress = Math.round((uploadedCount / requiredCount) * 100);

    return (
        <div className="flex gap-6 h-[calc(100vh-140px)]">
            {/* Левая колонка: Инфо о заявке и Документы */}
            <div className="flex-1 overflow-y-auto pr-2">
                {/* Карточка Заявки (Шапка) */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Заявка: {app.id} | {app.product_data?.law || '---'}
                            </h1>
                            <p className="text-gray-500">
                                {app.product_type === ProductType.BANK_GUARANTEE ? 'Банковская гарантия' :
                                    app.product_type === ProductType.LOAN ? 'Кредит' : app.product_type}
                            </p>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-gray-500">Банк</div>
                            <div className="font-bold text-[#1D194C]">{app.bank?.name || 'Не выбран'}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
                        <div>
                            <span className="block text-gray-400 text-xs">Сумма</span>
                            <span className="font-bold">
                                {new Intl.NumberFormat('ru-RU').format(app.amount)} ₽
                            </span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs">Тариф</span>
                            <span className="font-bold">{app.tariff_rate ? app.tariff_rate + '%' : '-'}</span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs">К оплате</span>
                            <span className="font-bold">
                                {app.commission_amount
                                    ? new Intl.NumberFormat('ru-RU').format(Number(app.commission_amount)) + ' ₽'
                                    : '-'}
                            </span>
                        </div>
                        <div>
                            <span className="block text-gray-400 text-xs">Статус</span>
                            <StatusBadge status={app.status} />
                        </div>
                    </div>
                </div>

                {/* Блок "Загрузите документы" */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-orange-50 px-6 py-3 border-b border-orange-100 flex justify-between items-center">
                        <h3 className="font-bold text-orange-800 flex items-center gap-2">
                            <Upload size={18} /> Загрузите документы
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs font-bold border ${progress === 100 ? 'bg-green-100 text-green-700 border-green-200' : 'bg-white text-orange-600 border-orange-200'}`}>
                            {progress}% Загружено
                        </span>
                    </div>
                    <div className="p-6">
                        {REQUIRED_DOCS.map((doc) => {
                            const uploadedDoc = documents?.find(d => d.doc_type === doc.type);
                            const isUploading = uploadingType === doc.type;

                            return (
                                <div
                                    key={doc.type}
                                    className="flex justify-between items-center py-3 border-b last:border-0"
                                >
                                    <div className="flex items-center gap-3">
                                        {uploadedDoc ? (
                                            <CheckCircle size={18} className="text-green-500" />
                                        ) : (
                                            <AlertCircle size={18} className="text-red-400" />
                                        )}
                                        <div>
                                            <div className="font-medium text-gray-700 flex items-center gap-2">
                                                {doc.label}
                                                {!uploadedDoc && <span className="text-red-500 text-xs">*</span>}
                                            </div>
                                            {uploadedDoc && (
                                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                                    <FileText size={10} />
                                                    {uploadedDoc.file?.original_name || 'Файл загружен'}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        {isUploading ? (
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Loader2 size={14} className="animate-spin" />
                                                Загрузка...
                                            </div>
                                        ) : uploadedDoc ? (
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => handleDownload(uploadedDoc.id, uploadedDoc.file?.original_name || 'document')}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                    title="Скачать"
                                                >
                                                    <Download size={18} />
                                                </button>
                                                <button
                                                    onClick={() => document.getElementById(`file-upload-${doc.type}`)?.click()}
                                                    className="p-2 text-orange-600 hover:bg-orange-50 rounded-full transition-colors"
                                                    title="Заменить"
                                                >
                                                    <RefreshCw size={18} />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm('Вы уверены, что хотите удалить этот документ?')) {
                                                            deleteMutation.mutate(uploadedDoc.id);
                                                        }
                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                                    title="Удалить"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        ) : (
                                            <label className="cursor-pointer text-[#3CE8D1] text-sm hover:underline font-medium">
                                                Загрузить
                                                <input
                                                    type="file"
                                                    id={`file-upload-${doc.type}`}
                                                    className="hidden"
                                                    onChange={(e) => handleFileSelect(e, doc.type)}
                                                />
                                            </label>
                                        )}
                                        {/* Hidden input for replacement (reusing the same input ID) */}
                                        {uploadedDoc && (
                                            <input
                                                type="file"
                                                id={`file-upload-${doc.type}`}
                                                className="hidden"
                                                onChange={(e) => handleFileSelect(e, doc.type)}
                                            />
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Правая колонка: Чат */}
            <div className="w-1/3 min-w-[350px]">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-full flex flex-col">
                    <div className="p-4 border-b bg-gray-50 font-bold text-gray-700">Чат по заявке</div>
                    {/* Вставляем виджет чата сюда */}
                    <ChatWidget applicationId={Number(id)} />
                </div>
            </div>
        </div>
    );
};
