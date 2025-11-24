import { useQuery } from '@tanstack/react-query';
import { newsApi } from '../api/newsApi';

export const useNews = (limit: number = 10) => {
    return useQuery({
        queryKey: ['news', limit],
        queryFn: () => newsApi.getLatest(limit),
    });
};
