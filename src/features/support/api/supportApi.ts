import { apiClient } from '@shared/api/client';
import { SupportTicket, CreateSupportTicketRequest } from '../types';

export const supportApi = {
    createTicket: async (data: CreateSupportTicketRequest): Promise<SupportTicket> => {
        const response = await apiClient.post<SupportTicket>('/support/tickets', data);
        return response.data;
    },

    getMyTickets: async (): Promise<{ data: SupportTicket[] }> => {
        const response = await apiClient.get<{ data: SupportTicket[] }>('/support/tickets');
        return response.data;
    },

    getTicket: async (id: number): Promise<SupportTicket> => {
        const response = await apiClient.get<SupportTicket>(`/support/tickets/${id}`);
        return response.data;
    },
};
