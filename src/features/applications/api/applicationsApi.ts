import apiClient from '@shared/api/client';
import { Application, PaginatedResponse } from '@shared/types/models';
import { ApplicationStatus, ProductType } from '@shared/types/enums';

export interface ApplicationFilters {
    status?: ApplicationStatus;
    product?: string;
    product_type?: ProductType;
    bank_id?: number;
    search?: string;
    page?: number;
    limit?: number;
    client_id?: number;
}

export interface CreateApplicationRequest {
    client_user_id: number;
    product_type: ProductType;
    amount: number;
    term_days: number;
    bank_ids: number[];
    product_data: Record<string, any>;
}

export const applicationsApi = {
    /**
     * Get paginated list of applications
     */
    getAll: async (filters: ApplicationFilters = {}): Promise<PaginatedResponse<Application>> => {
        const response = await apiClient.get<PaginatedResponse<Application>>('/applications', {
            params: filters,
        });
        return response.data;
    },

    /**
     * Get single application by ID
     */
    getById: async (id: number): Promise<Application> => {
        const response = await apiClient.get<Application>(`/applications/${id}`);
        return response.data;
    },

    /**
     * Create new application
     */
    create: async (data: CreateApplicationRequest): Promise<{ created_ids: number[] }> => {
        const response = await apiClient.post('/applications', data);
        return response.data;
    },

    /**
     * Update application status
     */
    updateStatus: async (id: number, status: ApplicationStatus): Promise<Application> => {
        const response = await apiClient.patch(`/applications/${id}/status`, { status });
        return response.data;
    },

    /**
     * Get victories (successful/approved applications) for current client
     */
    getVictories: async (): Promise<Application[]> => {
        const response = await apiClient.get<Application[]>('/applications/victories');
        return response.data;
    },

    /**
     * Delete application (soft delete)
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/applications/${id}`);
    },
};
