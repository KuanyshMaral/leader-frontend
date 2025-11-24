import { useQuery } from '@tanstack/react-query';
import apiClient from '@shared/api/client';

interface UserAvatarProps {
    url?: string | null;
    fallbackLetter?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

export const UserAvatar = ({ url, fallbackLetter = 'U', size = 'md', className = '' }: UserAvatarProps) => {
    const { data: imageSrc } = useQuery({
        queryKey: ['avatar', url],
        queryFn: async () => {
            if (!url) return null;

            // If URL starts with /uploads, use fetch directly to avoid /api prefix from apiClient
            // and to use the /uploads proxy we configured in vite.config.ts
            if (url.startsWith('/uploads')) {
                const token = localStorage.getItem('token');
                const headers: HeadersInit = {};
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const response = await fetch(url, { headers });
                if (!response.ok) throw new Error('Failed to load image');
                const blob = await response.blob();
                return URL.createObjectURL(blob);
            }

            // For other URLs (e.g. /api/...), use apiClient
            let requestUrl = url;
            if (requestUrl.startsWith('/api')) {
                requestUrl = requestUrl.substring(4);
            }

            const response = await apiClient.get(requestUrl, { responseType: 'blob' });
            return URL.createObjectURL(response.data);
        },
        enabled: !!url,
        staleTime: 1000 * 60 * 5, // 5 minutes - allows avatar updates to refresh
    });

    const sizeClasses = {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-16 h-16 text-xl',
        xl: 'w-24 h-24 text-3xl',
    };

    return (
        <div className={`relative ${sizeClasses[size]} bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm overflow-hidden ${className}`}>
            {imageSrc ? (
                <img src={imageSrc} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
                <span>{fallbackLetter}</span>
            )}
        </div>
    );
};
