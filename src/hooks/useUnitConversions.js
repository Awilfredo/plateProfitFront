import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useUnitConversions() {
    return useQuery({
        queryKey: ['unit-conversions'],
        queryFn: api.getUnitConversions,
    });
}

export function useCreateUnitConversion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.createUnitConversion(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unit-conversions'] });
        },
    });
}

export function useDeleteUnitConversion() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.deleteUnitConversion(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['unit-conversions'] });
        },
    });
}