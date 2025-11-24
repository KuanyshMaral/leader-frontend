import { useState } from 'react';
import apiClient from '@shared/api/client';

export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false);

    const upload = async (file: File, context: string) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('context', context);

            const res = await apiClient.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            return res.data; // { id, url, file_name, size, context, is_temporary, expires_at }
        } finally {
            setUploading(false);
        }
    };

    const replace = async (fileId: number, file: File) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            await apiClient.post(`/uploads/${fileId}/replace`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } finally {
            setUploading(false);
        }
    };

    const remove = async (fileId: number) => {
        await apiClient.delete(`/uploads/${fileId}`);
    };

    const download = async (fileId: number, fileName: string) => {
        const res = await apiClient.get(`/uploads/${fileId}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const list = async (context: string | null = null) => {
        const params = context ? { context } : {};
        const res = await apiClient.get('/uploads', { params });
        return res.data; // Array of files
    };

    const confirm = async (fileId: number) => {
        await apiClient.post(`/uploads/${fileId}/confirm`);
    };

    return { upload, replace, remove, download, list, confirm, uploading };
};
