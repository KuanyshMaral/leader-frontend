import { useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../api/documentsApi';

export const useUploadDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ file, data }: { file: File; data: { doc_type: string; application_id?: number } }) =>
            documentsApi.upload(file, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['documents'] });
        },
    });
};
