import { Building2 } from 'lucide-react';

interface ClientInfoProps {
    client: any;
}

export const ClientInfo = ({ client }: ClientInfoProps) => {
    if (!client) return null;

    return (
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
    );
};
