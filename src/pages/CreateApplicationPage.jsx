import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import { 
    FileText, CreditCard, TrendingUp, Building2, Shield, 
    Briefcase, Wallet, Globe, Percent 
} from 'lucide-react';

export default function CreateApplicationPage() {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState(null); // Какой продукт выбрали
  const [loading, setLoading] = useState(false);

  // Список продуктов из ТЗ
  const products = [
    { id: 'bank_guarantee', title: 'Банковские гарантии', icon: FileText, desc: '44-ФЗ, 223-ФЗ, 185-ФЗ' },
    { id: 'credit', title: 'Кредитование', icon: CreditCard, desc: 'На исполнение контракта' },
    { id: 'tender_loan', title: 'Тендерные займы', icon: Wallet, desc: 'На обеспечение заявки' },
    { id: 'factoring', title: 'Факторинг', icon: TrendingUp, desc: 'Финансирование под уступку' },
    { id: 'leasing', title: 'Лизинг', icon: Building2, desc: 'Транспорт и оборудование' },
    { id: 'insurance', title: 'Страхование', icon: Shield, desc: 'СМР, Ответственность' },
    { id: 'rko', title: 'РКО и Спецсчета', icon: Percent, desc: 'Открытие счетов' },
    { id: 'ved', title: 'ВЭД', icon: Globe, desc: 'Валютные контракты' },
    { id: 'tender_support', title: 'Сопровождение', icon: Briefcase, desc: 'Помощь в торгах' },
  ];

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const amount = formData.get('amount');
    const inn = formData.get('inn');

    try {
        // Создаем черновик заявки
        const res = await api.post('/applications', {
            client_user_id: 1, // MVP хак (в реале берем из токена или селекта клиентов)
            product_type: selectedProduct.id,
            amount: parseFloat(amount) || 0,
            term_days: 0, // Пока 0, заполним внутри
            bank_ids: [1], // Заглушка
            product_data: { 
                client_inn: inn || '0000000000' 
            }
        });
        
        // Переходим внутрь созданной заявки
        navigate(`/applications/${res.data.created_ids[0]}`);
    } catch (err) {
        alert('Ошибка создания заявки');
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Создать новую заявку</h1>
      <p className="text-gray-500 mb-8">Выберите продукт, чтобы начать оформление.</p>

      {/* Сетка продуктов */}
      {!selectedProduct ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(product => (
                <div 
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-leader-tiffany cursor-pointer transition-all group"
                >
                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center text-leader-dark group-hover:bg-leader-tiffany group-hover:text-white transition-colors mb-4">
                        <product.icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-500">{product.desc}</p>
                </div>
            ))}
          </div>
      ) : (
          // Форма быстрого старта (появляется после выбора)
          <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-100 animate-fade-in">
              <button 
                onClick={() => setSelectedProduct(null)}
                className="text-sm text-gray-400 hover:text-gray-600 mb-6 flex items-center gap-1"
              >
                ← Назад к выбору
              </button>

              <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-leader-tiffany/20 rounded-lg flex items-center justify-center text-leader-dark">
                      <selectedProduct.icon size={24} />
                  </div>
                  <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedProduct.title}</h2>
                      <p className="text-sm text-gray-500">Быстрое оформление</p>
                  </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                  <Input 
                    name="inn" 
                    label="ИНН Клиента" 
                    placeholder="Введите ИНН" 
                    required 
                  />
                  
                  {/* Показываем сумму только для финансовых продуктов */}
                  {!['rko', 'tender_support', 'insurance'].includes(selectedProduct.id) && (
                      <Input 
                        name="amount" 
                        label="Желаемая сумма (₽)" 
                        type="number" 
                        placeholder="0.00" 
                      />
                  )}

                  <Button type="submit" className="w-full py-3 text-lg" disabled={loading}>
                      {loading ? 'Создание...' : 'Перейти к оформлению →'}
                  </Button>
              </form>
          </div>
      )}
    </Layout>
  );
}