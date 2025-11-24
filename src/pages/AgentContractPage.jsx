import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../api/axios';
import { useFileUpload } from '../hooks/useFileUpload';
import { Download, FileText, Clock, Loader, Upload, Trash2, Plus } from 'lucide-react';

export default function AgentContractPage() {
    const [activeTab, setActiveTab] = useState('rewards');
    const [rewards, setRewards] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const { upload, remove, confirm } = useFileUpload();

    useEffect(() => {
        loadData();
    }, [activeTab]);

    const loadData = async () => {
        setLoading(true);
        try {
            if (activeTab === 'rewards') {
                const res = await api.get('/agent/contract/rewards');
                setRewards(res.data);
            } else {
                const res = await api.get('/agent/contract/documents');
                setDocuments(res.data);
            }
        } catch (err) {
            console.error('Ошибка загрузки данных:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setUploading(true);
        try {
            const uploaded = await upload(selectedFile, 'agent_contract');
            await confirm(uploaded.id);

            setSelectedFile(null);
            await loadData();
            alert('Документ загружен!');
        } catch (err) {
            alert('Ошибка загрузки документа');
        } finally {
            setUploading(false);
        }
    };

    const handleDownload = async (doc) => {
        if (!doc.url) {
            alert('Файл недоступен для скачивания');
            return;
        }

        try {
            const res = await api.get(doc.url, { responseType: 'blob' });
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

    const handleDelete = async (docId) => {
        if (!docId) {
            alert('Невозможно удалить шаблонный документ');
            return;
        }

        if (!window.confirm('Удалить этот документ?')) return;

        try {
            await remove(docId);
            await loadData();
            alert('Документ удалён');
        } catch (err) {
            alert('Ошибка удаления документа');
        }
    };

    return (
        <Layout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Мой договор</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Табы */}
                <div className="flex border-b">
                    <button
                        onClick={() => setActiveTab('rewards')}
                        className={`px-8 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors 
              ${activeTab === 'rewards' ? 'border-leader-tiffany text-gray-800 bg-gray-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        АГЕНТСКОЕ ВОЗНАГРАЖДЕНИЕ
                    </button>
                    <button
                        onClick={() => setActiveTab('docs')}
                        className={`px-8 py-4 text-sm font-bold tracking-wide border-b-2 transition-colors 
              ${activeTab === 'docs' ? 'border-leader-tiffany text-gray-800 bg-gray-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    >
                        МОИ ДОКУМЕНТЫ
                    </button>
                </div>

                {loading ? (
                    <div className="p-12 flex justify-center items-center">
                        <Loader className="animate-spin text-leader-cyan" size={32} />
                    </div>
                ) : (
                    <>
                        {/* Контент: Вознаграждение */}
                        {activeTab === 'rewards' && (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-700">Текущие условия:</h3>
                                    <button className="text-gray-500 text-sm flex items-center gap-1 hover:text-leader-cyan">
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
                                            {rewards.map((row, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 text-gray-500">{row.service}</td>
                                                    <td className="px-4 py-3 font-medium text-leader-blue">{row.bank}</td>
                                                    <td className="px-4 py-3">{row.reward}</td>
                                                    <td className="px-4 py-3 text-gray-400 text-xs">{row.date_start || '-'}</td>
                                                    <td className="px-4 py-3 text-gray-400 text-xs">{row.date_end || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Контент: Документы */}
                        {activeTab === 'docs' && (
                            <div className="p-8 bg-gray-50/50">
                                {/* Upload Section */}
                                <div className="mb-6 bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-leader-tiffany transition-colors">
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="file"
                                            id="doc-upload"
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="doc-upload"
                                            className="flex-1 cursor-pointer flex items-center gap-3 text-gray-600"
                                        >
                                            <Plus className="text-leader-cyan" size={24} />
                                            <span className="font-medium">
                                                {selectedFile ? selectedFile.name : 'Загрузить новый документ'}
                                            </span>
                                        </label>
                                        {selectedFile && (
                                            <button
                                                onClick={handleUpload}
                                                disabled={uploading}
                                                className="bg-leader-tiffany text-white px-6 py-2 rounded-lg hover:bg-leader-cyan transition-colors disabled:opacity-50 flex items-center gap-2"
                                            >
                                                {uploading ? <Loader className="animate-spin" size={16} /> : <Upload size={16} />}
                                                {uploading ? 'Загрузка...' : 'Загрузить'}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Documents Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {documents.map((doc, idx) => (
                                        <div key={idx} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col h-full relative group">
                                            <h4 className="font-bold text-gray-700 mb-4 text-sm min-h-[40px]">{doc.title}</h4>

                                            <div className="flex-1 flex items-center justify-center mb-4">
                                                <div className="w-16 h-20 bg-gray-100 border-2 border-gray-200 rounded flex items-center justify-center group-hover:border-leader-tiffany transition-colors">
                                                    <FileText size={32} className="text-gray-400 group-hover:text-leader-tiffany" />
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-4 border-t border-dashed">
                                                <span>{doc.date}</span>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleDownload(doc)}
                                                        disabled={!doc.url}
                                                        className={`p-2 rounded-full transition-colors ${doc.url
                                                                ? 'bg-gray-100 hover:bg-leader-tiffany hover:text-white'
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
        </Layout>
    );
}