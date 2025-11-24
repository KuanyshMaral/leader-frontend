import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import { FileText, Download, Eye, Briefcase, Building2, RefreshCw, Upload, Trash2 } from 'lucide-react';
import UploadDocModal from '../components/modals/UploadDocModal';
import ReplaceDocModal from '../components/modals/ReplaceDocModal';
import { DOC_TYPES } from '../constants/docTypes';
import Button from '../components/Button';

export default function ClientDetailPage() {
    const { id } = useParams();
    const [client, setClient] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [activeTab, setActiveTab] = useState('documents'); // applications, info, documents
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadDocType, setUploadDocType] = useState(''); // Тип документа для загрузки
    const [replaceDoc, setReplaceDoc] = useState(null); // Если не null - открыто окно замены

    // Загрузка данных
    useEffect(() => {
        // 1. Шапка (Инфо)
        api.get(`/agent/clients/${id}`).then(res => setClient(res.data));

        // 2. Документы (если активен таб)
        if (activeTab === 'documents') {
            loadDocs();
        }
    }, [id, activeTab]);

    // Функция обновления списка
    const loadDocs = () => {
        api.get(`/agent/clients/${id}/documents`).then(res => setDocuments(res.data));
    };

    // 1. Загрузка
    const handleUpload = async (data) => {
        const formData = new FormData();
        formData.append('file', data.file[0]);
        formData.append('docType', data.docType);

        try {
            // ИСПРАВЛЕНО: Используем эндпоинт агента для привязки к клиенту
            // Убрали Content-Type, axios сам выставит boundary
            await api.post(`/agent/clients/${id}/documents`, formData);
            alert('Загружено!');
            setIsUploadOpen(false);
            setUploadDocType('');
            loadDocs();
        } catch (e) { alert('Ошибка: ' + (e.response?.data?.error || e.message)); }
    };

    // 2. Замена
    const handleReplace = async (data) => {
        const formData = new FormData();
        formData.append('file', data.file[0]);
        formData.append('reason', data.reason || '');

        try {
            await api.post(`/documents/${replaceDoc.id}/replace`, formData);
            alert('Документ заменен!');
            setReplaceDoc(null);
            loadDocs();
        } catch (e) { alert('Ошибка: ' + (e.response?.data?.error || e.message)); }
    };

    // 3. Удаление
    const handleDelete = async (docId) => {
        if (!window.confirm('Вы уверены, что хотите удалить этот документ?')) return;
        try {
            await api.delete(`/documents/${docId}`);
            alert('Документ удален');
            loadDocs();
        } catch (e) { alert('Ошибка: ' + (e.response?.data?.error || e.message)); }
    };

    // 4. Скачивание
    const handleDownload = async (docId, fileName) => {
        try {
            const response = await api.get(`/documents/${docId}/download`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName || 'document');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            alert('Ошибка скачивания: ' + (e.response?.data?.error || e.message));
        }
    };

    // Объединяем ожидаемые типы с загруженными документами
    const mergedDocuments = DOC_TYPES.map(typeDef => {
        // Check both camelCase (backend) and snake_case (just in case)
        const existingDoc = documents.find(d => (d.docType || d.doc_type) === typeDef.value);
        return {
            ...typeDef,
            ...existingDoc, // Если есть, свойства (id, created_at...) перезапишут дефолтные
            isUploaded: !!existingDoc
        };
    });

    // Добавляем документы, типы которых не в DOC_TYPES (если вдруг есть)
    documents.forEach(doc => {
        const type = doc.docType || doc.doc_type;
        if (!DOC_TYPES.find(t => t.value === type)) {
            mergedDocuments.push({
                ...doc,
                label: type,
                isUploaded: true
            });
        }
    });

    if (!client) return <Layout><div className="p-8">Загрузка...</div></Layout>;

    return (
        <Layout>
            {/* ШАПКА КЛИЕНТА (как на скрине) */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">
                    {client.company_name || client.fio}
                </h1>
                <div className="flex gap-4 text-sm text-gray-500">
                    <span>ИНН: {client.inn || '-'}</span>
                    <span className="text-green-600 font-bold flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Закреплен
                    </span>
                </div>
            </div>

            {/* ТАБЫ */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                <div className="flex border-b bg-gray-50">
                    <button
                        onClick={() => setActiveTab('applications')}
                        className={`px-6 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeTab === 'applications' ? 'border-leader-tiffany bg-white text-gray-800' : 'border-transparent text-gray-500'}`}
                    >
                        ЗАЯВКИ
                    </button>
                    <button
                        onClick={() => setActiveTab('info')}
                        className={`px-6 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeTab === 'info' ? 'border-leader-tiffany bg-white text-gray-800' : 'border-transparent text-gray-500'}`}
                    >
                        ИНФОРМАЦИЯ О КОМПАНИИ
                    </button>
                    <button
                        onClick={() => setActiveTab('documents')}
                        className={`px-6 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors ${activeTab === 'documents' ? 'border-leader-tiffany bg-white text-gray-800' : 'border-transparent text-gray-500'}`}
                    >
                        ДОКУМЕНТЫ
                    </button>
                </div>

                <div className="p-8">

                    {/* --- ВКЛАДКА: ЗАЯВКИ (СКЕЛЕТ) --- */}
                    {activeTab === 'applications' && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Briefcase size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700">Заявок пока нет</h3>
                            <p className="text-gray-500 text-sm">Здесь будет список всех продуктов клиента</p>
                        </div>
                    )}

                    {/* --- ВКЛАДКА: ИНФОРМАЦИЯ (СКЕЛЕТ) --- */}
                    {activeTab === 'info' && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <Building2 size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-gray-700">Анкета компании</h3>
                            <p className="text-gray-500 text-sm">Здесь будет форма с реквизитами (как в разделе "Моя компания")</p>
                        </div>
                    )}

                    {/* --- ВКЛАДКА: ДОКУМЕНТЫ (РЕАЛИЗОВАНО) --- */}
                    {activeTab === 'documents' && (
                        <div>
                            {/* Панель */}
                            <div className="flex justify-between items-center mb-4 bg-gray-100 p-2 rounded-lg">
                                <div className="flex items-center gap-2 px-2">
                                    <button
                                        onClick={() => { setUploadDocType(''); setIsUploadOpen(true); }}
                                        className="w-8 h-8 bg-white rounded border border-gray-300 flex items-center justify-center text-gray-500 shadow-sm hover:text-leader-cyan transition-colors"
                                        title="Загрузить документ"
                                    >
                                        +
                                    </button>
                                    <input placeholder="поиск" className="bg-transparent outline-none text-sm min-w-[200px]" />
                                </div>
                                <div className="text-xs text-gray-500 mr-4">Всего документов: {mergedDocuments.length}</div>
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
                                            <tr key={doc.id || `missing-${index}`} className="hover:bg-blue-50/50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className={`w-4 h-4 border rounded ${doc.isUploaded ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}></div>
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-800">
                                                    {doc.label}
                                                </td>
                                                <td className="px-6 py-4 text-gray-500 text-xs">
                                                    {doc.isUploaded ? new Date(doc.createdAt || doc.created_at).toLocaleString() : '-'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {doc.isUploaded ? (
                                                        <span className="flex items-center gap-1.5 text-green-600 font-bold text-xs">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Допущен
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1.5 text-gray-400 font-bold text-xs">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span> Не загружен
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {doc.isUploaded ? (
                                                        <>
                                                            <button
                                                                onClick={() => setReplaceDoc(doc)}
                                                                className="text-gray-400 hover:text-leader-cyan"
                                                                title="Заменить"
                                                            >
                                                                <RefreshCw size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDownload(doc.id, doc.label)}
                                                                className="text-gray-400 hover:text-leader-cyan"
                                                                title="Скачать"
                                                            >
                                                                <Download size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(doc.id)}
                                                                className="text-gray-400 hover:text-red-500"
                                                                title="Удалить"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button
                                                            onClick={() => { setUploadDocType(doc.value); setIsUploadOpen(true); }}
                                                            className="text-leader-cyan hover:text-leader-dark-cyan flex items-center gap-1 font-bold text-xs"
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
                                        <Button onClick={() => setIsUploadOpen(true)}>+ Загрузить первый документ</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>

            {/* Модалки */}
            {isUploadOpen && (
                <UploadDocModal
                    onClose={() => setIsUploadOpen(false)}
                    onUpload={handleUpload}
                    defaultDocType={uploadDocType}
                />
            )}
            {replaceDoc && <ReplaceDocModal doc={replaceDoc} onClose={() => setReplaceDoc(null)} onReplace={handleReplace} />}
        </Layout>
    );
}