import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useIngredients() {
    return useQuery({
        queryKey: ['ingredients'],
        queryFn: api.getIngredients,
    });
}

export function useUnits() {
    return useQuery({
        queryKey: ['units'],
        queryFn: api.getUnits,
    });
}

export function useIngredient(id) {
    return useQuery({
        queryKey: ['ingredients', id],
        queryFn: () => api.getIngredient(id),
        enabled: !!id,
    });
}

export function useCreateIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.createIngredient(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        },
    });
}

export function useUpdateIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => api.updateIngredient(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['ingredients'] });
            queryClient.invalidateQueries({ queryKey: ['ingredients', id] });
        },
    });
}

export function useDeleteIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.deleteIngredient(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        },
    });
}