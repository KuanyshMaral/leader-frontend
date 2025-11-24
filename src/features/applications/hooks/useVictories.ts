import { useQuery } from '@tanstack/react-query';
import { applicationsApi } from '../api/applicationsApi';

export const useVictories = () => {
    return useQuery({
        queryKey: ['victories'],
        queryFn: () => applicationsApi.getVictories(),
        staleTime: 30000, // 30 seconds
    });
};
