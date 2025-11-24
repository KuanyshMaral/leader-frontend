import apiClient from '@shared/api/client';
import { User } from '@shared/types/models';

export const clientsApi = {
    /**
     * Get all clients (for agents)
     */
    getAll: async (): Promise<User[]> => {
        const response = await apiClient.get<User[]>('/agent/clients');
        return response.data;
    },

    /**
     * Get client by ID
     */
    getById: async (id: number): Promise<User> => {
        const response = await apiClient.get<User>(`/users/${id}`);
        return response.data;
    },
};
