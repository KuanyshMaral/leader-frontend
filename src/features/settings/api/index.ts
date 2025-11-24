import apiClient from '@shared/api/client';

export const settingsApi = {
    updateProfile: async (data: any) => {
        const payload = {
            ...data,
            gender: data.gender === '' ? null : data.gender,
            timezone: data.timezone === '' ? null : data.timezone,
        };
        return apiClient.patch('/user/profile', payload);
    },

    changePassword: async (data: any) => {
        return apiClient.post('/user/password', data);
    },

    deleteAccount: async () => {
        return apiClient.delete('/user/profile');
    },

    updatePreferences: async (preferences: any) => {
        return apiClient.patch('/user/preferences', preferences);
    },

    uploadAvatar: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('context', 'avatar');
        return apiClient.post('/uploads', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    getAvatar: async (url: string) => {
        const cleanUrl = url.startsWith('/api/api') ? url.replace('/api', '') : url;
        return apiClient.get(cleanUrl, { responseType: 'blob' });
    }
};
