import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Eye, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useRecipes, useCreateRecipe, useDeleteRecipe, useCloneRecipe } from '@/hooks/useRecipes';

export default function RecipesPage() {
    const { data, isLoading, error } = useRecipes();
    const recipes = data?.recipes;
    const createMutation = useCreateRecipe();
    const deleteMutation = useDeleteRecipe();
    const cloneMutation = useCloneRecipe();

    const [form, setForm] = useState({
        name: '',
        description: '',
        servings: '1',
    });

    const [search, setSearch] = useState('');

    const filteredRecipes = recipes?.filter((r) =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createMutation.mutateAsync({
            name: form.name,
            description: form.description || null,
            servings: parseInt(form.servings),
        });
        setForm({ name: '', description: '', servings: '1' });
    };

    return (
        <Tooltip>
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 pb-24">
            <Card>
                <CardHeader>
                    <CardTitle>Recetas</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded-lg bg-muted/30">
                        <div className="grid gap-4 md:grid-cols-4 items-end">
                            <div className="space-y-1.5">
                                <label htmlFor="name" className="text-sm font-medium">Nombre</label>
                                <Input
                                    id="name"
                                    placeholder="Nombre de la receta"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1.5 md:col-span-2">
                                <label htmlFor="description" className="text-sm font-medium">Descripción</label>
                                <textarea
                                    id="description"
                                    placeholder="Descripción (opcional)"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={2}
                                    className="border-input flex min-h-[60px] w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label htmlFor="servings" className="text-sm font-medium">Porciones</label>
                                <Input
                                    id="servings"
                                    type="number"
                                    min="1"
                                    placeholder="1"
                                    value={form.servings}
                                    onChange={(e) => setForm({ ...form, servings: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <Button type="submit" disabled={createMutation.isPending}>
                                {createMutation.isPending ? 'Guardando...' : 'Crear Receta'}
                            </Button>
                        </div>
                    </form>

                </CardContent>
            </Card>
            <div className=''>
                    {isLoading && <p>Cargando...</p>}
                    {error && <p className="text-destructive">Error al cargar recetas</p>}

                    <div className="relative mb-4 max-w-xs">
                        <Input
                            placeholder="Buscar receta..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pr-8"
                        />
                        {search && (
                            <Button
                                size="icon"
                                variant="ghost"
                                className="absolute right-0 top-0 h-full px-2"
                                onClick={() => setSearch('')}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>

                    {filteredRecipes?.length === 0 && search && (
                        <p className="text-sm text-muted-foreground">No se encontraron recetas para "{search}"</p>
                    )}

                    {filteredRecipes?.length === 0 && !search && (
                        <p className="text-sm text-muted-foreground">No hay recetas creadas</p>
                    )}

                    <div className="mt-4 rounded-md border">
                        <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[500px]">
                            <table className="w-full text-sm dark:bg-gray-900">
                                <thead className="sticky top-0 z-10 bg-muted border-b">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Nombre</th>
                                        <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Descripción</th>
                                        <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Porciones</th>
                                        <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Costo Total</th>
                                        <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Costo por Persona</th>
                                        <th className="px-3 py-2 text-center font-medium whitespace-nowrap">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRecipes?.map((recipe) => (
                                        <tr key={recipe.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                            <td className="px-3 py-2 font-medium whitespace-nowrap"><Link to={`/recipes/${recipe.id}`}>{recipe.name}</Link></td>
                                            <td className="px-3 py-2 text-muted-foreground max-w-[150px] truncate">{recipe.description || '-'}</td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">{recipe.servings}</td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">
                                                {recipe.cost ? `$${recipe.cost.total_cost.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">
                                                {recipe.cost ? `$${recipe.cost.cost_per_serving.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Link to={`/recipes/${recipe.id}`}>
                                                                <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Ver receta</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30" onClick={() => cloneMutation.mutate(recipe.id)}>
                                                                <Copy className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Duplicar</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={() => deleteMutation.mutate(recipe.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Eliminar</TooltipContent>
                                                    </Tooltip>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden divide-y">
                            {filteredRecipes?.map((recipe) => (
                                <div key={recipe.id} className="p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{recipe.name}</span>
                                        <div className="flex items-center gap-0.5">
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Link to={`/recipes/${recipe.id}`}>
                                                        <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>Ver receta</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30" onClick={() => cloneMutation.mutate(recipe.id)}>
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Duplicar</TooltipContent>
                                            </Tooltip>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={() => deleteMutation.mutate(recipe.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Eliminar</TooltipContent>
                                            </Tooltip>
                                        </div>
                                    </div>
                                    {recipe.description && (
                                        <p className="text-sm text-muted-foreground">{recipe.description}</p>
                                    )}
                                    <div className="flex gap-4 text-sm text-muted-foreground">
                                        <span>Porciones: {recipe.servings}</span>
                                        {recipe.cost && (
                                            <span>Total: ${recipe.cost.total_cost.toFixed(2)} | Por persona: ${recipe.cost.cost_per_serving.toFixed(2)}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
            </div>

        </div>
        </Tooltip>
    );
}