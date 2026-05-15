//const API_BASE = 'https://rockochitlan.com/api';
const API_BASE = '/api';
export const api = {
    async getUnits() {
        const res = await fetch(`${API_BASE}/units`);
        const json = await res.json();
        return json.data;
    },

    async createUnit(data) {
        const res = await fetch(`${API_BASE}/units`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        return json.data;
    },

    async getUnitConversions() {
        const res = await fetch(`${API_BASE}/unit-conversions`);
        const json = await res.json();
        return json;
    },

    async createUnitConversion(data) {
        const res = await fetch(`${API_BASE}/unit-conversions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        return json.data;
    },

    async deleteUnitConversion(id) {
        await fetch(`${API_BASE}/unit-conversions/${id}`, { method: 'DELETE' });
    },

    async getIngredients() {
        const res = await fetch(`${API_BASE}/ingredients`);
        const json = await res.json();
        return json;
    },

    async getIngredient(id) {
        const res = await fetch(`${API_BASE}/ingredients/${id}`);
        const json = await res.json();
        return json.data;
    },

    async createIngredient(data) {
        const res = await fetch(`${API_BASE}/ingredients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        return json.data;
    },

    async updateIngredient(id, data) {
        const res = await fetch(`${API_BASE}/ingredients/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        return json.data;
    },

    async deleteIngredient(id) {
        await fetch(`${API_BASE}/ingredients/${id}`, { method: 'DELETE' });
    },

    async getRecipes() {
        const res = await fetch(`${API_BASE}/recipes`);
        const json = await res.json();
        return json;
    },

    async getRecipe(id) {
        const res = await fetch(`${API_BASE}/recipes/${id}`);
        const json = await res.json();
        return json;
    },

    async createRecipe(data) {
        const res = await fetch(`${API_BASE}/recipes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        return json.data;
    },

    async updateRecipe(id, data) {
        const res = await fetch(`${API_BASE}/recipes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        const json = await res.json();
        return json.data;
    },

    async deleteRecipe(id) {
        await fetch(`${API_BASE}/recipes/${id}`, { method: 'DELETE' });
    },

    async attachIngredient(recipeId, ingredientId, quantity, unitId) {
        await fetch(`${API_BASE}/recipes/${recipeId}/ingredients`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredient_id: ingredientId, quantity, unit_id: unitId }),
        });
    },

    async detachIngredient(recipeId, ingredientId) {
        await fetch(`${API_BASE}/recipes/${recipeId}/ingredients`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredient_id: ingredientId }),
        });
    },

    async updateRecipeIngredient(recipeId, ingredientId, quantity, unitId) {
        await fetch(`${API_BASE}/recipes/${recipeId}/ingredients`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ingredient_id: ingredientId, quantity, unit_id: unitId }),
        });
    },

    async attachComponent(recipeId, componentRecipeId, quantity, unitId) {
        await fetch(`${API_BASE}/recipes/${recipeId}/components`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ component_recipe_id: componentRecipeId, quantity, unit_id: unitId }),
        });
    },

    async updateComponent(recipeId, componentRecipeId, quantity, unitId) {
        await fetch(`${API_BASE}/recipes/${recipeId}/components`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ component_recipe_id: componentRecipeId, quantity, unit_id: unitId }),
        });
    },

    async detachComponent(recipeId, componentRecipeId) {
        await fetch(`${API_BASE}/recipes/${recipeId}/components`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ component_recipe_id: componentRecipeId }),
        });
    },

    async cloneRecipe(id) {
        const res = await fetch(`${API_BASE}/recipes/${id}/clone`, { method: 'POST' });
        const json = await res.json();
        return json.data;
    },

    async getRecipeCost(id) {
        const res = await fetch(`${API_BASE}/recipes/${id}/cost`);
        const json = await res.json();
        if (!res.ok) {
            throw new Error(json.error || 'Failed to calculate recipe cost');
        }
        return json.data;
    },

    async getDashboard() {
        const res = await fetch(`${API_BASE}/dashboard`);
        const json = await res.json();
        return json;
    },
};