import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Button, Input } from '@shared/components/ui';
import { ApplicationStatus } from '@shared/types/enums';
import { ApplicationFilters } from '../api/applicationsApi';

interface ApplicationFiltersProps {
    filters: ApplicationFilters;
    onFiltersChange: (filters: ApplicationFilters) => void;
}

export const ApplicationFiltersComponent = ({
    filters,
    onFiltersChange,
}: ApplicationFiltersProps) => {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearchChange = (value: string) => {
        setSearch(value);
        onFiltersChange({ ...filters, search: value });
    };

    const toggleFilter = (key: keyof ApplicationFilters, value: any) => {
        const currentValue = filters[key];
        onFiltersChange({
            ...filters,
            [key]: currentValue === value ? undefined : value,
        });
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                    <Input
                        placeholder="Поиск по заявкам..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        icon={<Search size={20} />}
                    />
                </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
                {/* Rejected filter */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <span>Отказные</span>
                    <div
                        onClick={() => toggleFilter('status', ApplicationStatus.REJECTED)}
                        className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${filters.status === ApplicationStatus.REJECTED ? 'bg-[#3CE8D1]' : 'bg-gray-300'
                            }`}
                    >
                        <div
                            className={`w-3 h-3 bg-white rounded-full shadow transition-transform ${filters.status === ApplicationStatus.REJECTED ? 'translate-x-5' : ''
                                }`}
                        />
                    </div>
                </label>

                {/* Archive filter */}
                <label className="flex items-center gap-2 cursor-pointer">
                    <span>Архивные</span>
                    <div
                        onClick={() => toggleFilter('status', ApplicationStatus.CANCELLED)}
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
    );
};
