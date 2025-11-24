import apiClient from '@shared/api/client';

export interface NewsItem {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

export const newsApi = {
    /**
     * Get latest news
     */
    getLatest: async (limit: number = 10): Promise<NewsItem[]> => {
        const response = await apiClient.get<NewsItem[]>('/news/latest', {
            params: { limit },
        });
        return response.data;
    },
};
