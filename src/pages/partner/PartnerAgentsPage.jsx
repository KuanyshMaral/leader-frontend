import Layout from '../../components/Layout';
import { UserCheck, Award } from 'lucide-react';

export default function PartnerAgentsPage() {
  const agents = [
    { id: 1, fio: 'Иванов Иван Иванович', email: 'agent1@test.com', deals: 5, volume: '45 000 000', rating: 4.8 },
    { id: 2, fio: 'Петров Петр Сергеевич', email: 'petrov@agent.ru', deals: 12, volume: '120 500 000', rating: 5.0 },
  ];

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Аккредитованные агенты</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
            <div key={agent.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-leader-gray rounded-full flex items-center justify-center text-leader-dark font-bold text-lg">
                            {agent.fio[0]}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-800 text-sm">{agent.fio}</h3>
                            <p className="text-xs text-gray-500">{agent.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded text-xs font-bold">
                        <Award size={14} /> {agent.rating}
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                    <div>
                        <p className="text-gray-400 text-xs">Сделок</p>
                        <p className="font-bold text-gray-800">{agent.deals}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-gray-400 text-xs">Объем (₽)</p>
                        <p className="font-bold text-leader-cyan">{agent.volume}</p>
                    </div>
                </div>
            </div>
        ))}
      </div>
    </Layout>
  );
}