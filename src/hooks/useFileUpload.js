// src/hooks/useFileUpload.js
import { useState } from 'react';
import api from '../api/axios';

export const useFileUpload = () => {
    const [uploading, setUploading] = useState(false);

    const upload = async (file, context) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('context', context);

            const res = await api.post('/uploads', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            return res.data; // { id, url, file_name, size, context, is_temporary, expires_at }
        } finally {
            setUploading(false);
        }
    };

    const replace = async (fileId, file) => {
        setUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);

            await api.post(`/uploads/${fileId}/replace`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
        } finally {
            setUploading(false);
        }
    };

    const remove = async (fileId) => {
        await api.delete(`/uploads/${fileId}`);
    };

    const download = async (fileId, fileName) => {
        const res = await api.get(`/uploads/${fileId}/download`, { responseType: 'blob' });
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const list = async (context = null) => {
        const params = context ? { context } : {};
        const res = await api.get('/uploads', { params });
        return res.data; // Array of files
    };

    const confirm = async (fileId) => {
        await api.post(`/uploads/${fileId}/confirm`);
    };

    return { upload, replace, remove, download, list, confirm, uploading };
};
