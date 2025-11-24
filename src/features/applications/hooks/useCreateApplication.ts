import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { applicationsApi, CreateApplicationRequest } from '../api/applicationsApi';

/**
 * Hook to create new application
 */
export const useCreateApplication = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: CreateApplicationRequest) => applicationsApi.create(data),
        onSuccess: (response) => {
            // Invalidate applications list
            queryClient.invalidateQueries({ queryKey: ['applications'] });

            // Navigate to created application
            if (response.created_ids.length > 0) {
                navigate(`/applications/${response.created_ids[0]}`);
            }
        },
    });
};
