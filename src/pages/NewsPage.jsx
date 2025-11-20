import { useEffect, useState } from 'react';
import api from '../api/axios';
import Layout from '../components/Layout';
import { Newspaper, Calendar } from 'lucide-react';

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await api.get('/news');
        setNews(res.data);
      } catch (e) {
        console.error("Ошибка загрузки новостей", e);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  return (
    <Layout>
      <div className="mb-6 flex items-center gap-3">
        <div className="p-2 bg-leader-tiffany/20 rounded-lg text-leader-dark">
            <Newspaper size={24} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Новости сервиса</h1>
      </div>

      {loading ? (
        <div className="text-gray-500">Загрузка новостей...</div>
      ) : news.length === 0 ? (
        // Заглушка, если новостей нет
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Newspaper size={32} />
            </div>
            <h3 className="text-lg font-bold text-gray-700">Пока нет новостей</h3>
            <p className="text-gray-500">Мы обязательно сообщим вам о важных изменениях.</p>
        </div>
      ) : (
        // Список новостей
        <div className="grid gap-6 max-w-4xl">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-leader-cyan transition-colors">
                <div className="flex justify-between items-start mb-3">
                    <h2 className="text-xl font-bold text-leader-blue">{item.title}</h2>
                    <span className="flex items-center gap-1 text-xs font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded">
                        <Calendar size={12} />
                        {new Date(item.createdAt).toLocaleDateString('ru-RU')}
                    </span>
                </div>
                <div className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {item.content}
                </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}