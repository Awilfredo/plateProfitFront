import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Pencil, Trash2, Plus, X, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useIngredients } from '@/hooks/useIngredients';
import { useUnits } from '@/hooks/useIngredients';
import { useUnitConversions } from '@/hooks/useUnitConversions';
import {
    useRecipe,
    useRecipeCost,
    useAttachIngredient,
    useDetachIngredient,
    useUpdateRecipeIngredient,
    useAttachComponent,
    useDetachComponent,
    useUpdateComponent,
    useRecipes
} from '@/hooks/useRecipes';

export default function RecipeDetailPage() {
    const { id } = useParams();
    const recipeId = parseInt(id);

    const { data: recipe, isLoading, error } = useRecipe(recipeId);
    const { data: cost, error: costError } = useRecipeCost(recipeId);
    const { data: allIngredients } = useIngredients();
    const { data: units } = useUnits();
    const { data: conversions } = useUnitConversions();
    const { data: allRecipes } = useRecipes();
    const attachMutation = useAttachIngredient();
    const detachMutation = useDetachIngredient();
    const updateIngredientMutation = useUpdateRecipeIngredient();
    const attachComponentMutation = useAttachComponent();
    const detachComponentMutation = useDetachComponent();
    const updateComponentMutation = useUpdateComponent();

    const [showAddIngredient, setShowAddIngredient] = useState(false);
    const [showAddComponent, setShowAddComponent] = useState(false);
    const [ingredientForm, setIngredientForm] = useState({
        ingredient_id: '',
        quantity: '',
        unit_id: '',
    });
    const [componentForm, setComponentForm] = useState({
        recipe_id: '',
        quantity: '',
        unit_id: '',
    });
    const [editingIngredientId, setEditingIngredientId] = useState(null);
    const [editingComponentId, setEditingComponentId] = useState(null);
    const [editForm, setEditForm] = useState({
        quantity: '',
        unit_id: '',
    });

    const handleAddIngredient = async (e) => {
        e.preventDefault();
        await attachMutation.mutateAsync({
            recipeId,
            ingredientId: parseInt(ingredientForm.ingredient_id),
            quantity: parseFloat(ingredientForm.quantity),
            unitId: parseInt(ingredientForm.unit_id),
        });
        setIngredientForm({ ingredient_id: '', quantity: '', unit_id: '' });
        setShowAddIngredient(false);
    };

    const startEditIngredient = (ir) => {
        setEditingIngredientId(ir.ingredient_id);
        setEditForm({
            quantity: ir.quantity.toString(),
            unit_id: ir.unit_id.toString(),
        });
    };

    const cancelEditIngredient = () => {
        setEditingIngredientId(null);
        setEditForm({ quantity: '', unit_id: '' });
    };

    const handleUpdateIngredient = async (e) => {
        e.preventDefault();

        if (editingIngredientId === null) {
            return;
        }

        await updateIngredientMutation.mutateAsync({
            recipeId,
            ingredientId: editingIngredientId,
            quantity: parseFloat(editForm.quantity),
            unitId: parseInt(editForm.unit_id),
        });
        setEditingIngredientId(null);
        setEditForm({ quantity: '', unit_id: '' });
    };

    const handleAddComponent = async (e) => {
        e.preventDefault();
        await attachComponentMutation.mutateAsync({
            recipeId,
            componentRecipeId: parseInt(componentForm.recipe_id),
            quantity: parseFloat(componentForm.quantity),
            unitId: parseInt(componentForm.unit_id),
        });
        setComponentForm({ recipe_id: '', quantity: '', unit_id: '' });
        setShowAddComponent(false);
    };

    const startEditComponent = (rc) => {
        setEditingComponentId(rc.component_recipe_id);
        setEditForm({
            quantity: rc.quantity.toString(),
            unit_id: rc.unit_id.toString(),
        });
    };

    const cancelEditComponent = () => {
        setEditingComponentId(null);
        setEditForm({ quantity: '', unit_id: '' });
    };

    const handleUpdateComponent = async (e) => {
        e.preventDefault();

        if (editingComponentId === null) {
            return;
        }

        await updateComponentMutation.mutateAsync({
            recipeId,
            componentRecipeId: editingComponentId,
            quantity: parseFloat(editForm.quantity),
            unitId: parseInt(editForm.unit_id),
        });
        setEditingComponentId(null);
        setEditForm({ quantity: '', unit_id: '' });
    };

    const availableRecipesForComponent = allRecipes?.filter(r => r.id !== recipeId) || [];
    const porcionUnit = units?.find(u => u.symbol === 'por');

    const selectedIngredient = allIngredients?.find(ing => ing.id === parseInt(ingredientForm.ingredient_id));
    const filteredUnits = selectedIngredient && conversions
        ? (() => {
            const purchaseUnitId = selectedIngredient.purchase_unit_id;
            const relatedUnitIds = new Set([purchaseUnitId]);

            conversions.forEach(conv => {
                if (conv.from_unit?.id === purchaseUnitId) {
                    relatedUnitIds.add(conv.to_unit?.id);
                }
                if (conv.to_unit?.id === purchaseUnitId) {
                    relatedUnitIds.add(conv.from_unit?.id);
                }
            });

            return units?.filter(u => relatedUnitIds.has(u.id)) || [];
        })()
        : [];

    const getFilteredUnitsForIngredient = (ingredientId) => {
        const ingredient = allIngredients?.find(ing => ing.id === ingredientId);
        if (!ingredient || !conversions) return [];

        const purchaseUnitId = ingredient.purchase_unit_id;
        const relatedUnitIds = new Set([purchaseUnitId]);

        conversions.forEach(conv => {
            if (conv.from_unit?.id === purchaseUnitId) {
                relatedUnitIds.add(conv.to_unit?.id);
            }
            if (conv.to_unit?.id === purchaseUnitId) {
                relatedUnitIds.add(conv.from_unit?.id);
            }
        });

        return units?.filter(u => relatedUnitIds.has(u.id)) || [];
    };

    if (porcionUnit && componentForm.unit_id === '' && showAddComponent) {
        setComponentForm(prev => ({ ...prev, unit_id: porcionUnit.id.toString() }));
    }

    if (isLoading) {
        return <div>Cargando...</div>;
    }

    if (error || !recipe) {
        return <div>Error al cargar la receta</div>;
    }

    return (
        <Tooltip>
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 pb-24">
            <Card>
                <CardHeader>
                    <CardTitle>{recipe.name}</CardTitle>
                    {recipe.description && <p className="text-muted-foreground">{recipe.description}</p>}
                    <p className="text-sm text-muted-foreground">Porciones: {recipe.servings}</p>
                </CardHeader>
            </Card>

            {cost && !costError && (
                <Card>
                    <CardHeader>
                        <CardTitle>Costos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-4 grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold">${cost.total_cost.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Costo Total</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">${cost.cost_per_serving.toFixed(2)}</p>
                                <p className="text-sm text-muted-foreground">Por Porción</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{recipe.servings}</p>
                                <p className="text-sm text-muted-foreground">Porciones</p>
                            </div>
                        </div>

                        <div className="mt-4">
                            <h4 className="font-semibold">Desglose de Ingredientes</h4>
                            <div className="mt-2 border rounded-lg overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead className="bg-muted">
                                        <tr>
                                            <th className="text-left px-3 py-2 font-medium">Ingrediente</th>
                                            <th className="text-right px-3 py-2 font-medium">Cantidad</th>
                                            <th className="text-right px-3 py-2 font-medium">Unidad</th>
                                            <th className="text-right px-3 py-2 font-medium">Costo</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {cost.ingredients_cost.map((ic) => (
                                            <tr key={ic.ingredient_id} className={ic.is_recipe ? 'bg-muted/50' : ''}>
                                                <td className="px-3 py-2">
                                                    <span className="font-medium">{ic.name}</span>
                                                    {ic.is_recipe && <span className="ml-2 text-xs text-muted-foreground">(receta)</span>}
                                                </td>
                                                <td className="text-right px-3 py-2">{ic.quantity_used}</td>
                                                <td className="text-right px-3 py-2">{ic.unit === 'por' ? 'porciones' : ic.unit}</td>
                                                <td className="text-right px-3 py-2 font-medium">${ic.cost_per_recipe.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {costError && (
                <Card className="border-destructive">
                    <CardHeader>
                        <CardTitle className="text-destructive">Error al Calcular Costos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-destructive">{costError.message}</p>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Ingredientes</CardTitle>
                    <Button size="sm" onClick={() => setShowAddIngredient(!showAddIngredient)}>
                        {showAddIngredient ? 'Cancelar' : 'Agregar'}
                    </Button>
                </CardHeader>
                <CardContent>
                    {showAddIngredient && (
                        <form onSubmit={handleAddIngredient} className="mb-4 flex flex-col gap-4 md:flex-row">
                            <select
                                className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm disabled:opacity-50"
                                value={ingredientForm.ingredient_id}
                                onChange={(e) => setIngredientForm({ ...ingredientForm, ingredient_id: e.target.value, unit_id: '' })}
                                required
                            >
                                <option value="">Seleccionar ingrediente</option>
                                {allIngredients?.map((ing) => (
                                    <option key={ing.id} value={ing.id}>
                                        {ing.name} ({ing.purchase_unit?.symbol})
                                    </option>
                                ))}
                            </select>
                            <Input
                                type="number"
                                step="0.0001"
                                placeholder="Cantidad"
                                value={ingredientForm.quantity}
                                onChange={(e) => setIngredientForm({ ...ingredientForm, quantity: e.target.value })}
                                required
                            />
                            <select
                                className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm disabled:opacity-50"
                                value={ingredientForm.unit_id}
                                onChange={(e) => setIngredientForm({ ...ingredientForm, unit_id: e.target.value })}
                                disabled={!ingredientForm.ingredient_id}
                                required
                            >
                                <option value="">Seleccionar unidad</option>
                                {filteredUnits.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name} ({unit.symbol})
                                    </option>
                                ))}
                            </select>
                            <Button type="submit" disabled={attachMutation.isPending}>
                                {attachMutation.isPending ? '...' : 'Agregar'}
                            </Button>
                        </form>
                    )}

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-start">
                        {recipe.ingredients?.length === 0 && (
                            <p className="text-sm text-muted-foreground py-4 text-center col-span-full">No hay ingredientes agregados</p>
                        )}
                        {recipe.ingredients?.map((ir) => (
                            <div key={ir.id} className="flex items-center justify-between rounded-lg border p-3">
                                {editingIngredientId === ir.ingredient_id ? (
                                    <form onSubmit={handleUpdateIngredient} className="flex flex-1 items-center gap-2">
                                        <span className="flex-1 font-medium">{ir.ingredient?.name}</span>
                                        <Input
                                            type="number"
                                            step="0.0001"
                                            className="w-24"
                                            value={editForm.quantity}
                                            onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="border-input flex h-9 rounded-md border bg-transparent px-2 text-sm"
                                            value={editForm.unit_id}
                                            onChange={(e) => setEditForm({ ...editForm, unit_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Uni.</option>
                                            {getFilteredUnitsForIngredient(editingIngredientId).map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.symbol}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-0.5">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30" disabled={updateIngredientMutation.isPending}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Guardar</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={cancelEditIngredient}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Cancelar</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <p className="font-medium">{ir.ingredient?.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {ir.quantity} {ir.unit?.symbol}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                                                        onClick={() => startEditIngredient(ir)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Editar</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                        onClick={() => detachMutation.mutate({ recipeId, ingredientId: ir.ingredient_id })}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Eliminar</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Sub-Recetas</CardTitle>
                    <Button size="sm" onClick={() => setShowAddComponent(!showAddComponent)}>
                        {showAddComponent ? 'Cancelar' : 'Agregar'}
                    </Button>
                </CardHeader>
                <CardContent>
                    {showAddComponent && (
                        <form onSubmit={handleAddComponent} className="mb-4 flex flex-col gap-4 md:flex-row">
                            <select
                                className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
                                value={componentForm.recipe_id}
                                onChange={(e) => setComponentForm({ ...componentForm, recipe_id: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar receta</option>
                                {availableRecipesForComponent.map((r) => (
                                    <option key={r.id} value={r.id}>
                                        {r.name} ({r.servings} porciones)
                                    </option>
                                ))}
                            </select>
                            <Input
                                type="number"
                                step="0.0001"
                                placeholder="Cantidad"
                                value={componentForm.quantity}
                                onChange={(e) => setComponentForm({ ...componentForm, quantity: e.target.value })}
                                required
                            />
                            <select
                                className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
                                value={componentForm.unit_id}
                                onChange={(e) => setComponentForm({ ...componentForm, unit_id: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar unidad</option>
                                {porcionUnit && (
                                    <option value={porcionUnit.id}>Porción ({porcionUnit.symbol})</option>
                                )}
                                {units?.filter(u => u.symbol !== 'por').map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name} ({unit.symbol})
                                    </option>
                                ))}
                            </select>
                            <Button type="submit" disabled={attachComponentMutation.isPending}>
                                {attachComponentMutation.isPending ? '...' : 'Agregar'}
                            </Button>
                        </form>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 items-start">
                        {recipe.components?.length === 0 && (
                            <p className="text-sm text-muted-foreground py-4 text-center col-span-full">No hay sub-recetas agregadas</p>
                        )}
                        {recipe.components?.map((rc) => (
                            <div key={rc.id} className="flex items-center justify-between rounded-lg border p-3">
                                {editingComponentId === rc.component_recipe_id ? (
                                    <form onSubmit={handleUpdateComponent} className="flex flex-1 items-center gap-2">
                                        <span className="flex-1 font-medium">{rc.recipe?.name}</span>
                                        <Input
                                            type="number"
                                            step="0.0001"
                                            className="w-24"
                                            value={editForm.quantity}
                                            onChange={(e) => setEditForm({ ...editForm, quantity: e.target.value })}
                                            required
                                        />
                                        <select
                                            className="border-input flex h-9 rounded-md border bg-transparent px-2 text-sm"
                                            value={editForm.unit_id}
                                            onChange={(e) => setEditForm({ ...editForm, unit_id: e.target.value })}
                                            required
                                        >
                                            <option value="">Uni.</option>
                                            {units?.map((unit) => (
                                                <option key={unit.id} value={unit.id}>
                                                    {unit.symbol}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="flex items-center gap-0.5">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button type="submit" size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30" disabled={updateComponentMutation.isPending}>
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Guardar</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button type="button" size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={cancelEditComponent}>
                                                        <X className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Cancelar</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </form>
                                ) : (
                                    <>
                                        <div className="flex-1">
                                            <Link to={`/recipes/${rc.component_recipe_id}`} className="font-medium hover:text-primary">
                                                {rc.recipe?.name}
                                            </Link>
                                            <p className="text-sm text-muted-foreground">
                                                {rc.quantity} {rc.unit?.symbol === 'por' ? 'porciones' : rc.unit?.symbol}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-0.5">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link to={`/recipes/${rc.component_recipe_id}`}>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ver receta</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30"
                                                        onClick={() => startEditComponent(rc)}
                                                    >
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Editar</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30"
                                                        onClick={() => detachComponentMutation.mutate({ recipeId, componentRecipeId: rc.component_recipe_id })}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Eliminar</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
        </Tooltip>
    );
}