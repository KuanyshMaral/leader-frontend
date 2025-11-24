import { useState } from 'react';
import { Search } from 'lucide-react';
import { useApplications } from '../hooks/useApplications';
import { ApplicationTable } from '../components/ApplicationTable';
import { ApplicationFilters } from '../api/applicationsApi';
import { useDebounce } from '@shared/hooks/useDebounce';

const TABS = [
    { label: 'ВСЕ', value: undefined },
    { label: 'БАНКОВСКИЕ ГАРАНТИИ', value: 'bank_guarantee' },
    { label: 'КРЕДИТЫ', value: 'credit' },
];

const STATUS_FILTERS = [
    { label: 'Отклоненные', value: 'rejected' },
    { label: 'Архивные', value: 'archive' },
    { label: 'Активные', value: 'active' },
];

export const ClientApplicationsPage = () => {
    const [search, setSearch] = useState('');
    const debouncedSearch = useDebounce(search, 500);
    const [activeTab, setActiveTab] = useState<string | undefined>(undefined);
    const [activeStatusFilter, setActiveStatusFilter] = useState<string>('active');

    const [filters, setFilters] = useState<ApplicationFilters>({
        page: 1,
        limit: 20,
    });

    // Build active filters
    const activeFilters: ApplicationFilters = {
        ...filters,
        search: debouncedSearch,
        product: activeTab,
        status: activeStatusFilter as any,
    };

    const { data, isLoading } = useApplications(activeFilters);

    const handleTabChange = (value: string | undefined) => {
        setActiveTab(value);
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    const handleStatusFilterChange = (value: string) => {
        setActiveStatusFilter(value);
        setFilters(prev => ({ ...prev, page: 1 }));
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Мои заявки</h1>
            </div>

            {/* Tabs for product type */}
            <div className="bg-white rounded-t-xl border-b border-gray-200 flex gap-8 px-6">
                {TABS.map((tab) => (
                    <button
                        key={tab.label}
                        onClick={() => handleTabChange(tab.value)}
                        className={`py-4 font-medium transition-all border-b-2 ${activeTab === tab.value
                            ? 'text-[#3CE8D1] border-[#3CE8D1]'
                            : 'text-gray-500 border-transparent hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Search and Status Filters */}
            <div className="bg-gray-50 p-4 rounded-b-xl mb-6 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Поиск по номеру, ИНН, сумме..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3CE8D1] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Status Filters */}
                <div className="flex items-center gap-4">
                    {STATUS_FILTERS.map((filter) => (
                        <button
                            key={filter.value}
                            onClick={() => handleStatusFilterChange(filter.value)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeStatusFilter === filter.value
                                ? 'bg-[#3CE8D1] text-white'
                                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white rounded-xl shadow-sm">
                <ApplicationTable
                    applications={data?.data || []}
                    isLoading={isLoading}
                />

                {/* Pagination info */}
                {data && data.data.length > 0 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <p className="text-sm text-gray-600">
                            Показано {data.data.length} из {data.total} заявок
                        </p>
                        {data.total > filters.limit! && (
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }))}
                                    disabled={filters.page === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Назад
                                </button>
                                <button
                                    onClick={() => setFilters(prev => ({ ...prev, page: (prev.page || 1) + 1 }))}
                                    disabled={data.data.length < filters.limit!}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Вперед
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
