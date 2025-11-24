import { useQuery } from '@tanstack/react-query';
import { clientsApi } from '../api/clientsApi';

export const useClients = () => {
    return useQuery({
        queryKey: ['clients'],
        queryFn: () => clientsApi.getAll(),
    });
};
