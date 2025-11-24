import { useQuery } from '@tanstack/react-query';
import { instructionsApi } from '../api/instructionsApi';

export const useInstructions = () => {
    return useQuery({
        queryKey: ['instructions'],
        queryFn: () => instructionsApi.getAll(),
    });
};

export const useInstruction = (slug: string) => {
    return useQuery({
        queryKey: ['instruction', slug],
        queryFn: () => instructionsApi.getBySlug(slug),
        enabled: !!slug,
    });
};
