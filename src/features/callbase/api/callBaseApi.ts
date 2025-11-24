import apiClient from '@shared/api/client';

export interface Lead {
    id: number;
    name: string;
    inn: string;
    contact: string;
    phone: string;
    status: 'new' | 'process' | 'success' | 'rejected';
    comment: string;
    converted?: boolean;
    application_id?: number;
}

export const callBaseApi = {
    getLeads: async (): Promise<Lead[]> => {
        const res = await apiClient.get<Lead[]>('/callbase/leads');
        return res.data;
    },

    updateStatus: async (id: number, status: string): Promise<void> => {
        await apiClient.patch(`/callbase/leads/${id}/status`, { status });
    },

    updateComment: async (id: number, comment: string): Promise<void> => {
        await apiClient.patch(`/callbase/leads/${id}/comment`, { comment });
    },

    convertToApplication: async (id: number, appData: any): Promise<number> => {
        const res = await apiClient.post<{ application_id: number }>(
            `/callbase/leads/${id}/convert`,
            appData
        );
        return res.data.application_id;
    }
};
