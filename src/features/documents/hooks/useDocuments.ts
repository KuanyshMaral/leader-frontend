import { useQuery } from '@tanstack/react-query';
import { documentsApi, DocumentFilters } from '../api/documentsApi';

export const useDocuments = (filters: DocumentFilters = {}) => {
    return useQuery({
        queryKey: ['documents', filters],
        queryFn: () => documentsApi.getAll(filters),
    });
};
