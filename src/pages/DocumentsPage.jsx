// src/pages/DocumentsPage.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import api from '../api/axios';
import Layout from '../components/Layout';
import Button from '../components/Button';
import { UploadCloud, FileText, CheckCircle, AlertCircle } from 'lucide-react';

export default function DocumentsPage() {
  const { register, handleSubmit, reset } = useForm();
  const [uploading, setUploading] = useState(false);
  const [lastUploaded, setLastUploaded] = useState(null);

  // Типы документов (хардкод для MVP, в идеале брать из DictionaryController)
  const docTypes = [
    { value: 'ustav', label: 'Устав' },
    { value: 'inn_cert', label: 'Свидетельство ИНН' },
    { value: 'passport_director', label: 'Паспорт директора' },
    { value: 'balance_f1', label: 'Бухгалтерский баланс' },
    { value: 'chat_file', label: 'Файл для чата' },
  ];

  const onSubmit = async (data) => {
    setUploading(true);
    setLastUploaded(null);
    
    const formData = new FormData();
    formData.append('file', data.file[0]);
    formData.append('docType', data.docType);

    try {
      const res = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Важно для файлов
        },
      });
      
      setLastUploaded({
        name: res.data.file_name,
        status: 'success'
      });
      reset(); // Очистить форму
    } catch (e) {
      console.error(e);
      setLastUploaded({
        name: 'Ошибка загрузки',
        status: 'error'
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Мои Документы</h1>

        {/* Карточка загрузки */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Загрузить новый документ</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* 1. Выбор типа */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Тип документа</label>
              <select 
                {...register("docType", { required: true })}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-leader-cyan outline-none"
              >
                <option value="">Выберите тип...</option>
                {docTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            {/* 2. Файл */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                <input 
                    type="file" 
                    {...register("file", { required: true })}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center pointer-events-none">
                    <div className="w-12 h-12 bg-blue-50 text-leader-cyan rounded-full flex items-center justify-center mb-3">
                        <UploadCloud size={24} />
                    </div>
                    <p className="font-medium text-gray-700">Нажмите или перетащите файл сюда</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG до 10 МБ</p>
                </div>
            </div>

            {/* Кнопка и Статус */}
            <div className="flex items-center justify-between">
                {lastUploaded && (
                    <div className={`flex items-center gap-2 text-sm ${lastUploaded.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                        {lastUploaded.status === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                        <span>{lastUploaded.status === 'success' ? `Загружено: ${lastUploaded.name}` : 'Ошибка при загрузке'}</span>
                    </div>
                )}
                
                <Button type="submit" disabled={uploading} className="ml-auto">
                    {uploading ? 'Загрузка...' : 'Загрузить в систему'}
                </Button>
            </div>

          </form>
        </div>

        {/* Список (Заглушка, т.к. на бэке пока нет GET /api/documents) */}
        <div className="mt-8">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ранее загруженные</h3>
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-8 text-center text-gray-400">
                    <FileText className="mx-auto mb-2 opacity-50" size={32} />
                    <p>История загрузок временно недоступна</p>
                </div>
            </div>
        </div>

      </div>
    </Layout>
  );
}