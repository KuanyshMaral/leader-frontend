import { useQuery } from '@tanstack/react-query';
import { applicationsApi, ApplicationFilters } from '../api/applicationsApi';

/**
 * Hook to fetch paginated applications with filters
 */
export const useApplications = (filters: ApplicationFilters = {}) => {
    return useQuery({
        queryKey: ['applications', filters],
        queryFn: () => applicationsApi.getAll(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
};
