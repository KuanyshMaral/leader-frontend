// src/pages/DocumentsPage.jsx
import { useState, useEffect } from 'react';
import { useFileUpload } from '../hooks/useFileUpload';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { UploadCloud, FileText, Download, Trash2 } from 'lucide-react';

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(null);
  const { upload, list, download, remove, confirm, uploading } = useFileUpload();

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const files = await list('user_document');
      setDocuments(files);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      const uploaded = await upload(selectedFile, 'user_document');

      // Подтверждаем файл после успешной загрузки
      await confirm(uploaded.id);

      setMessage({ type: 'success', text: 'Документ загружен!' });
      setSelectedFile(null);
      await loadDocuments();
    } catch (err) {
      setMessage({ type: 'error', text: 'Ошибка загрузки' });
      // Файл останется temporary и удалится через 1 час
    }
  };

  const handleDownload = async (doc) => {
    try {
      await download(doc.id, doc.file_name);
    } catch (err) {
      alert('Ошибка скачивания');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Удалить документ?')) return;

    try {
      await remove(id);
      setMessage({ type: 'success', text: 'Документ удалён' });
      await loadDocuments();
    } catch (err) {
      setMessage({ type: 'error', text: 'Ошибка удаления' });
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Мои Документы</h1>

        {message && (
          <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Загрузка */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8">
          <h2 className="text-lg font-semibold mb-4">Загрузить новый документ</h2>

          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative mb-4">
            <input
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center pointer-events-none">
              <div className="w-12 h-12 bg-blue-50 text-leader-cyan rounded-full flex items-center justify-center mb-3">
                <UploadCloud size={24} />
              </div>
              <p className="font-medium text-gray-700">
                {selectedFile ? selectedFile.name : 'Нажмите или перетащите файл сюда'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG до 10 МБ</p>
            </div>
          </div>

          <Button onClick={handleUpload} disabled={uploading || !selectedFile} className="w-full">
            {uploading ? 'Загрузка...' : 'Загрузить документ'}
          </Button>
        </div>

        {/* Список */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Загруженные документы</h3>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {documents.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <FileText className="mx-auto mb-2 opacity-50" size={32} />
                <p>Документы отсутствуют</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Название</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Размер</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Дата</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {documents.map(doc => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-500" />
                          <span className="font-medium text-gray-800">{doc.file_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {(doc.size / 1024).toFixed(0)} KB
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDownload(doc)}
                          className="text-blue-600 hover:text-blue-800 mr-4"
                          title="Скачать"
                        >
                          <Download size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="text-red-600 hover:text-red-800"
                          title="Удалить"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}