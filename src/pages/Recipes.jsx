import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Eye, Copy, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useRecipes, useCreateRecipe, useDeleteRecipe, useCloneRecipe } from '@/hooks/useRecipes';

export default function RecipesPage() {
    const { data: recipes, isLoading, error } = useRecipes();
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
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Recetas</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4 md:flex-row">
                        <Input
                            placeholder="Nombre de la receta"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Descripción (opcional)"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                        />
                        <Input
                            type="number"
                            min="1"
                            placeholder="Porciones"
                            value={form.servings}
                            onChange={(e) => setForm({ ...form, servings: e.target.value })}
                            required
                        />
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? 'Guardando...' : 'Crear Receta'}
                        </Button>
                    </form>

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

                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredRecipes?.map((recipe) => (
                            <RecipeCard
                                key={recipe.id}
                                recipe={recipe}
                                onDelete={() => deleteMutation.mutate(recipe.id)}
                                onClone={() => cloneMutation.mutate(recipe.id)}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function RecipeCard({ recipe, onDelete, onClone }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">{recipe.name}</CardTitle>
            </CardHeader>
            <CardContent>
                {recipe.description && (
                    <p className="mb-2 text-sm text-muted-foreground">{recipe.description}</p>
                )}
                <p className="text-sm text-muted-foreground">Porciones: {recipe.servings}</p>
                {recipe.cost && (
                    <p className="text-sm font-medium">
                        Costo total: ${recipe.cost.total_cost.toFixed(2)} | Por persona: ${recipe.cost.cost_per_serving.toFixed(2)}
                    </p>
                )}
            </CardContent>
            <CardFooter className="flex gap-2">
                <Link to={`/recipes/${recipe.id}`}>
                    <Button size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
                    </Button>
                </Link>
                <Button size="icon" variant="outline" onClick={onClone}>
                    <Copy className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="icon" onClick={onDelete}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </CardFooter>
        </Card>
    );
}