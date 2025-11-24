import { useState } from 'react';
import { Search, Filter, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@shared/components/ui';
import { useApplications } from '../hooks/useApplications';
import { ApplicationTable } from '../components/ApplicationTable';
import { ApplicationFilters } from '../api/applicationsApi';
import { ApplicationStatus, UserRole } from '@shared/types/enums';
import { useDebounce } from '@shared/hooks/useDebounce';
import { useAuthStore } from '@features/auth';

const TABS = [
    { label: 'ВСЕ', value: undefined },
    { label: 'БАНКОВСКИЕ ГАРАНТИИ', value: 'bank_guarantee' },
    { label: 'КРЕДИТЫ', value: 'credit' },
];

export const ApplicationsListPage = () => {
    const navigate = useNavigate();
    const { user } = useAuthStore();
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);

    const [filters, setFilters] = useState<ApplicationFilters>({
        page: 1,
        limit: 20,
    });

    // Merge search into filters
    const activeFilters = { ...filters, search: debouncedSearch };

    const { data, isLoading } = useApplications(activeFilters);

    const toggleFilter = (status: ApplicationStatus) => {
        setFilters(prev => ({
            ...prev,
            status: prev.status === status ? undefined : status,
            page: 1, // Reset page on filter change
        }));
    };

    const handleTabChange = (productType: string | undefined) => {
        setFilters(prev => ({
            ...prev,
            product: productType,
            page: 1,
        }));
    };

    return (
        <div>
            {/* Header and Tabs */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-4">Мои заявки</h1>
                <div className="flex border-b border-gray-200 overflow-x-auto">
                    {TABS.map((tab) => (
                        <button
                            key={tab.label}
                            onClick={() => handleTabChange(tab.value)}
                            className={`px-6 py-3 text-sm font-bold whitespace-nowrap transition-colors ${filters.product === tab.value
                                ? 'border-b-2 border-[#3CE8D1] text-gray-800'
                                : 'text-gray-500 hover:text-gray-700 border-b-2 border-transparent'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Filters Panel */}
            <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1 min-w-[300px]">
                    {/* Create Button - Only for Agents */}
                    {user?.role === UserRole.AGENT && (
                        <Button
                            onClick={() => navigate('/applications/create')}
                            className="w-10 h-10 !p-0 rounded-full flex items-center justify-center bg-white text-[#3CE8D1] hover:bg-gray-50 border shadow-sm"
                            title="Создать новую заявку"
                        >
                            <Plus size={24} />
                        </Button>
                    )}

                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            placeholder="Поиск по номеру, ИНН, сумме..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-[#3CE8D1] transition-colors"
                        />
                    </div>
                </div>

                {/* Toggle Filters */}
                <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <span>Отказные</span>
                        <div
                            onClick={() => toggleFilter(ApplicationStatus.REJECTED)}
                            className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${filters.status === ApplicationStatus.REJECTED ? 'bg-[#3CE8D1]' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${filters.status === ApplicationStatus.REJECTED ? 'translate-x-5' : ''
                                    }`}
                            />
                        </div>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer select-none">
                        <span>Архивные</span>
                        <div
                            onClick={() => toggleFilter(ApplicationStatus.CANCELLED)}
                            className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${filters.status === ApplicationStatus.CANCELLED ? 'bg-[#3CE8D1]' : 'bg-gray-300'
                                }`}
                        >
                            <div
                                className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${filters.status === ApplicationStatus.CANCELLED ? 'translate-x-5' : ''
                                    }`}
                            />
                        </div>
                    </label>

                    <Button variant="secondary" className="flex gap-2 items-center px-4 py-2">
                        <Filter size={16} /> ФИЛЬТР
                    </Button>
                </div>
            </div>

            {/* Table */}
            <ApplicationTable applications={data?.data || []} isLoading={isLoading} />

            {/* Pagination (Simple) */}
            {data && data.total > filters.limit! && (
                <div className="flex justify-center mt-6 gap-2">
                    <Button
                        variant="secondary"
                        disabled={filters.page === 1}
                        onClick={() => setFilters(p => ({ ...p, page: (p.page || 1) - 1 }))}
                    >
                        Назад
                    </Button>
                    <span className="flex items-center px-4 font-bold text-gray-600">{filters.page}</span>
                    <Button
                        variant="secondary"
                        disabled={data.data.length < filters.limit!}
                        onClick={() => setFilters(p => ({ ...p, page: (p.page || 1) + 1 }))}
                    >
                        Вперед
                    </Button>
                </div>
            )}
        </div>
    );
};
