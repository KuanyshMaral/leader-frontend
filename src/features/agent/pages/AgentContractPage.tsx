import { useState } from 'react';
import { Download, FileText, Clock, Loader, Upload, Trash2, Plus, AlertCircle } from 'lucide-react';
import apiClient from '@shared/api/client';
import { useFileUpload } from '@shared/hooks/useFileUpload';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spinner } from '@shared/components/ui';

export const AgentContractPage = () => {
    const [activeTab, setActiveTab] = useState('rewards');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { upload, remove, confirm, uploading } = useFileUpload();
    const queryClient = useQueryClient();

    // Fetch rewards
    const { data: rewards = [], isLoading: loadingRewards } = useQuery({
        queryKey: ['agent', 'rewards'],
        queryFn: async () => {
            const res = await apiClient.get('/agent/contract/rewards');
            return res.data;
        },
        enabled: activeTab === 'rewards',
    });

    // Fetch documents
    const { data: documents = [], isLoading: loadingDocs } = useQuery({
        queryKey: ['agent', 'documents'],
        queryFn: async () => {
            const res = await apiClient.get('/agent/contract/documents');
            return res.data;
        },
        enabled: activeTab === 'docs',
    });

    const isLoading = activeTab === 'rewards' ? loadingRewards : loadingDocs;

    // Upload mutation
    const uploadMutation = useMutation({
        mutationFn: async (file: File) => {
            const uploaded = await upload(file, 'agent_contract');
            await confirm(uploaded.id);
            return uploaded;
        },
        onSuccess: () => {
            alert('Документ загружен!');
            setSelectedFile(null);
            queryClient.invalidateQueries({ queryKey: ['agent', 'documents'] });
        },
        onError: () => alert('Ошибка загрузки документа'),
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (docId: number) => {
            await remove(docId);
        },
        onSuccess: () => {
            alert('Документ удалён');
            queryClient.invalidateQueries({ queryKey: ['agent', 'documents'] });
        },
        onError: () => alert('Ошибка удаления документа'),
    });

    const handleUpload = () => {
        if (selectedFile) uploadMutation.mutate(selectedFile);
    };

    const handleDownload = async (doc: any) => {
        if (!doc.url) {
            alert('Файл недоступен для скачивания');
            return;
        }

        try {
            const res = await apiClient.get(doc.url, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', doc.file_name);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Ошибка скачивания файла');
        }
    };

    const handleDelete = (docId: number) => {
        if (!docId) {
            alert('Невозможно удалить шаблонный документ');
            return;
        }
        if (window.confirm('Удалить этот документ?')) {
            deleteMutation.mutate(docId);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Мой договор</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Табы */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('rewards')}
                        className={`px-8 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors 
              ${activeTab === 'rewards'
                                ? 'border-[#3CE8D1] text-gray-800 bg-gray-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        АГЕНТСКОЕ ВОЗНАГРАЖДЕНИЕ
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-8 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors 
              ${activeTab === 'docs'
                                ? 'border-[#3CE8D1] text-gray-800 bg-gray-50'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        МОИ ДОКУМЕНТЫ
                    </button>
                </div>

                {isLoading ? (
                    <div className="p-12 flex justify-center items-center">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <>
                        {/* Контент: Вознаграждение */}
                        {activeTab === 'rewards' && (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Текущие условия:</h3>
                                    <button className="text-gray-500 text-sm flex items-center gap-1 hover:text-[#3CE8D1]">
                                        <Clock size={16} /> ИСТОРИЯ
                                    </button>
                                </div>

                                <div className="overflow-x-auto border rounded-lg">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-100 text-gray-600 font-medium border-b">
                                            <tr>
                                                <th className="px-4 py-3 w-1/4">Поручение</th>
                                                <th className="px-4 py-3 w-1/6">Партнёр сервиса</th>
                                                <th className="px-4 py-3">Вознаграждение Агента</th>
                                                <th className="px-4 py-3 text-xs">Дата начала</th>
                                                <th className="px-4 py-3 text-xs">Дата окончания</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y">
                                            {rewards.length === 0 ? (
                                                <tr>
                                                    <td colSpan={5} className="p-6 text-center text-gray-400">
                                                        Нет данных о вознаграждениях
                                                    </td>
                                                </tr>
                                            ) : (
                                                rewards.map((row: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-gray-50">
                                                        <td className="px-4 py-3 text-gray-500">{row.service}</td>
                                                        <td className="px-4 py-3 font-medium text-[#1D194C]">{row.bank}</td>
                                                        <td className="px-4 py-3">{row.reward}</td>
                                                        <td className="px-4 py-3 text-gray-400 text-xs">
                                                            {row.date_start || '-'}
                                                        </td>
                                                        <td className="px-4 py-3 text-gray-400 text-xs">
                                                            {row.date_end || '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Контент: Документы */}
                        {activeTab === 'docs' && (
                            <div className="p-8 bg-gray-50/50">
                                {/* Upload Section */}
                                <div className="mb-6 bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#3CE8D1] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            id="doc-upload"
                                            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="doc-upload"
                                            className="flex-1 cursor-pointer flex items-center gap-3 text-gray-600"
                                        >
                                            <Plus className="text-[#3CE8D1]" size={24} />
                                            <span className="font-medium">
                                                {selectedFile ? selectedFile.name : 'Загрузить новый документ'}
                                            </span>
                                        </label>
                                        {selectedFile && (
                                            <button
                                                onClick={handleUpload}
                                                disabled={uploading || uploadMutation.isPending}
                                                className="bg-[#3CE8D1] text-white px-6 py-2 rounded-lg hover:bg-[#2DD1B8] transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {uploading || uploadMutation.isPending ? (
                                                    <Spinner size="sm" />
                                                ) : (
                                                    <Upload size={16} />
                                                )}
                                                {uploading || uploadMutation.isPending ? 'Загрузка...' : 'Загрузить'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Documents Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {documents.map((doc: any, idx: number) => (
                                        <div
                                            key={idx}
                                            className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group"
                                        >
                                            <h4 className="font-bold text-gray-700 mb-4 text-sm min-h-[40px]">
                                                {doc.title}
                                            </h4>

                                            <div className="flex-1 flex items-center justify-center mb-4">
                                                <div className="w-16 h-20 bg-gray-100 border-2 border-gray-200 rounded flex items-center justify-center group-hover:border-[#3CE8D1] transition-colors">
                                                    <FileText
                                                        size={32}
                                                        className="text-gray-400 group-hover:text-[#3CE8D1]"
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-dashed">
                                                <span>{doc.date}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDownload(doc)}
                                                        disabled={!doc.url}
                                                        className={`p-2 rounded-full transition-colors ${doc.url
                                                            ? 'bg-gray-100 hover:bg-[#3CE8D1] hover:text-white'
                                                            : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                                            }`}
                                                    >
                                                        <Download size={16} />
                                                    </button>
                                                    {doc.id && (
                                                        <button
                                                            onClick={() => handleDelete(doc.id)}
                                                            className="p-2 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};
