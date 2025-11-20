import Layout from '../../components/Layout';
import { Search, Filter, Building2 } from 'lucide-react';

export default function PartnerClientsPage() {
  // Mock data для MVP
  const clients = [
    { id: 1, name: 'ООО "СТРОЙ-ВЕСТ"', inn: '7705923378', apps_count: 2, approved_sum: '12 000 000', status: 'active' },
    { id: 2, name: 'АО "ТЕХНОПРОМ"', inn: '5029177289', apps_count: 1, approved_sum: '0', status: 'review' },
  ];

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Клиенты банка</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="p-4 border-b flex gap-4">
             <div className="relative flex-1 max-w-md">
                 <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                 <input placeholder="Поиск клиента..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-leader-cyan outline-none" />
             </div>
         </div>
         
         <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                <tr>
                    <th className="px-6 py-3">Наименование</th>
                    <th className="px-6 py-3">ИНН</th>
                    <th className="px-6 py-3 text-center">Заявок</th>
                    <th className="px-6 py-3 text-right">Общий лимит</th>
                    <th className="px-6 py-3">Статус</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {clients.map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 font-bold text-gray-800 flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center text-leader-blue">
                                <Building2 size={16} />
                            </div>
                            {c.name}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{c.inn}</td>
                        <td className="px-6 py-4 text-center font-medium">{c.apps_count}</td>
                        <td className="px-6 py-4 text-right text-gray-800">{c.approved_sum} ₽</td>
                        <td className="px-6 py-4">
                            {c.status === 'active' 
                                ? <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs font-bold">Активен</span>
                                : <span className="text-yellow-600 bg-yellow-50 px-2 py-1 rounded text-xs font-bold">Проверка СБ</span>
                            }
                        </td>
                    </tr>
                ))}
            </tbody>
         </table>
      </div>
    </Layout>
  );
}