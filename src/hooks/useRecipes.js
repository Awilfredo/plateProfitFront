import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useRecipes() {
    return useQuery({
        queryKey: ['recipes'],
        queryFn: api.getRecipes,
    });
}

export function useRecipe(id) {
    return useQuery({
        queryKey: ['recipes', id],
        queryFn: () => api.getRecipe(id),
        enabled: !!id,
    });
}

export function useCreateRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data) => api.createRecipe(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
}

export function useUpdateRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }) => api.updateRecipe(id, data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
            queryClient.invalidateQueries({ queryKey: ['recipes', id] });
        },
    });
}

export function useDeleteRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.deleteRecipe(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
}

export function useCloneRecipe() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id) => api.cloneRecipe(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['recipes'] });
        },
    });
}

export function useRecipeCost(id) {
    return useQuery({
        queryKey: ['recipes', id, 'cost'],
        queryFn: () => api.getRecipeCost(id),
        enabled: !!id,
    });
}

export function useAttachIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, ingredientId, quantity, unitId }) =>
            api.attachIngredient(recipeId, ingredientId, quantity, unitId),
        onSuccess: (_, { recipeId }) => {
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId, 'cost'] });
        },
    });
}

export function useDetachIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, ingredientId }) =>
            api.detachIngredient(recipeId, ingredientId),
        onSuccess: (_, { recipeId }) => {
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId, 'cost'] });
        },
    });
}

export function useUpdateRecipeIngredient() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, ingredientId, quantity, unitId }) =>
            api.updateRecipeIngredient(recipeId, ingredientId, quantity, unitId),
        onSuccess: (_, { recipeId }) => {
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId, 'cost'] });
        },
    });
}

export function useAttachComponent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, componentRecipeId, quantity, unitId }) =>
            api.attachComponent(recipeId, componentRecipeId, quantity, unitId),
        onSuccess: (_, { recipeId }) => {
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId, 'cost'] });
        },
    });
}

export function useUpdateComponent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, componentRecipeId, quantity, unitId }) =>
            api.updateComponent(recipeId, componentRecipeId, quantity, unitId),
        onSuccess: (_, { recipeId }) => {
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId, 'cost'] });
        },
    });
}

export function useDetachComponent() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ recipeId, componentRecipeId }) =>
            api.detachComponent(recipeId, componentRecipeId),
        onSuccess: (_, { recipeId }) => {
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId] });
            queryClient.invalidateQueries({ queryKey: ['recipes', recipeId, 'cost'] });
        },
    });
}