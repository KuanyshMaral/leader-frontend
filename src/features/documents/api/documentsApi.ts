import apiClient from '@shared/api/client';
import { Document, PaginatedResponse } from '@shared/types/models';
import { DocumentStatus } from '@shared/types/enums';

export interface DocumentFilters {
    status?: DocumentStatus;
    doc_type?: string;
    page?: number;
    limit?: number;
}

export const documentsApi = {
    /**
     * Get all documents
     */
    getAll: async (filters: DocumentFilters = {}): Promise<PaginatedResponse<Document>> => {
        const response = await apiClient.get<PaginatedResponse<Document>>('/documents', {
            params: filters,
        });
        return response.data;
    },

    /**
     * Upload document
     */
    upload: async (file: File, data: { doc_type: string; application_id?: number }) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('doc_type', data.doc_type);
        if (data.application_id) {
            formData.append('application_id', data.application_id.toString());
        }

        const response = await apiClient.post('/documents/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    /**
     * Delete document
     */
    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`/documents/${id}/`);
    },
};
