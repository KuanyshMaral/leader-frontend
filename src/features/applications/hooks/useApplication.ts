import { useQuery } from '@tanstack/react-query';
import { applicationsApi, ApplicationFilters } from '../api/applicationsApi';

/**
 * Hook to fetch paginated applications with filters
 */
export const useApplications = (filters: ApplicationFilters = {}) => {
    return useQuery({
        queryKey: ['applications', filters],
        queryFn: async () => {
            const result = await applicationsApi.getAll(filters);
            console.log('=== APPLICATIONS API RESPONSE ===');
            console.log('Full result:', result);
            console.log('Data array:', result.data);
            if (result.data?.length > 0) {
                console.log('First application:', result.data[0]);
                console.log('First app keys:', Object.keys(result.data[0]));
            }
            return result;
        },
        staleTime: 5 * 60 * 1000, // 5 minutes cache
    });
};
