import { apiClient } from '@shared/api/client';
import { Instruction } from '../types';

export const instructionsApi = {
    getAll: async (): Promise<{ data: Instruction[] }> => {
        const response = await apiClient.get<{ data: Instruction[] }>('/instructions');
        return response.data;
    },

    getBySlug: async (slug: string): Promise<Instruction> => {
        const response = await apiClient.get<Instruction>(`/instructions/${slug}`);
        return response.data;
    },
};
