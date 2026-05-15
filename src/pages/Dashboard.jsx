import { Link } from 'react-router-dom';
import {
    ChefHat,
    Utensils,
    Scale,
    AlertTriangle,
    Plus,
    Eye,
} from 'lucide-react';
import { FaBalanceScale } from 'react-icons/fa';
import { GiCookingPot } from 'react-icons/gi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboard } from '@/hooks/useRecipes';

export default function Dashboard() {
    const { data, isLoading } = useDashboard();
    const recipes = data?.recipes;
    const units = data?.units;
    const conversions = data?.conversions;
    const ingredients = data?.ingredients;

    if (isLoading) {
        return (
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="text-center py-8 text-muted-foreground">Cargando...</div>
            </div>
        );
    }

    const recipeCount = recipes?.length ?? 0;
    const ingredientCount = ingredients?.length ?? 0;
    const unitCount = conversions?.length ?? 0;

    return (
        <div className="flex h-full flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8 pb-24">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <GiCookingPot className="h-8 w-8 text-primary" />
                    <h1 className="text-2xl font-bold">RecipePro</h1>
                </div>
                <div className="flex gap-2">
                    <Link to="/ingredients">
                        <Button size="sm" variant="outline">
                            <Plus className="mr-1 h-4 w-4" />
                            Ingrediente
                        </Button>
                    </Link>
                    <Link to="/recipes">
                        <Button size="sm">
                            <Plus className="mr-1 h-4 w-4" />
                            Receta
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Recetas"
                    value={recipeCount}
                    icon={<ChefHat className="h-5 w-5" />}
                />
                <StatCard
                    title="Total Ingredientes"
                    value={ingredientCount}
                    icon={<Utensils className="h-5 w-5" />}
                />
                <StatCard
                    title="Conversiones"
                    value={unitCount}
                    icon={<FaBalanceScale className="h-5 w-5" />}
                />
                <StatCard
                    title="Costo Promedio"
                    value={recipes && recipes.length > 0
                        ? `$${recipes.reduce((sum, r) => sum + (r.cost?.total_cost || 0), 0).toFixed(2)}`
                        : '$0.00'}
                    icon={<Scale className="h-5 w-5" />}
                />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <TopRecipesCard recipes={recipes || []} />
                <RecentRecipesCard recipes={recipes || []} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <QuickActionsCard />
                <MissingConversionsCard conversions={conversions || []} ingredients={ingredients || []} />
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }) {
    return (
        <Card className="hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    );
}

function TopRecipesCard({ recipes }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-primary" />
                    Top 5 Recetas por Costo
                </CardTitle>
            </CardHeader>
            <CardContent>
                {recipes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay recetas</p>
                ) : (
                    <div className="space-y-2">
                        {recipes.slice(0, 5).map((recipe) => (
                            <TopRecipeItem key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function TopRecipeItem({ recipe }) {
    return (
        <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors">
            <div className="flex flex-col">
                <span className="font-medium">{recipe.name}</span>
                <span className="text-xs text-muted-foreground">{recipe.servings} porciones</span>
            </div>
            <div className="text-right">
                {recipe.cost ? (
                    <span className="font-medium text-primary">${recipe.cost.total_cost.toFixed(2)}</span>
                ) : (
                    <span className="text-xs text-muted-foreground">-</span>
                )}
            </div>
        </div>
    );
}

function RecentRecipesCard({ recipes }) {
    const sortedRecipes = [...recipes].sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <GiCookingPot className="h-5 w-5 text-primary" />
                    Recetas Recientes
                </CardTitle>
            </CardHeader>
            <CardContent>
                {sortedRecipes.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No hay recetas</p>
                ) : (
                    <div className="space-y-2">
                        {sortedRecipes.slice(0, 5).map((recipe) => (
                            <div key={recipe.id} className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors">
                                <div className="flex flex-col">
                                    <span className="font-medium">{recipe.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(recipe.created_at).toLocaleDateString('es-ES')}
                                    </span>
                                </div>
                                <Link to={`/recipes/${recipe.id}`}>
                                    <Button size="icon" variant="ghost">
                                        <Eye className="h-4 w-4" />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

function QuickActionsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary shrink-0" />
                    Acciones Rápidas
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-2">
                    <Link to="/recipes" className="min-w-0">
                        <Button variant="outline" className="w-full justify-start gap-2 min-w-0">
                            <Plus className="h-4 w-4 shrink-0" />
                            <span className="truncate">Nueva Receta</span>
                        </Button>
                    </Link>
                    <Link to="/ingredients" className="min-w-0">
                        <Button variant="outline" className="w-full justify-start gap-2 min-w-0">
                            <Utensils className="h-4 w-4 shrink-0" />
                            <span className="truncate">Agregar Ing.</span>
                        </Button>
                    </Link>
                    <Link to="/units" className="min-w-0">
                        <Button variant="outline" className="w-full justify-start gap-2 min-w-0">
                            <Scale className="h-4 w-4 shrink-0" />
                            <span className="truncate">Ver Unidades</span>
                        </Button>
                    </Link>
                    <Link to="/ingredients" className="min-w-0">
                        <Button variant="outline" className="w-full justify-start gap-2 min-w-0">
                            <AlertTriangle className="h-4 w-4 shrink-0" />
                            <span className="truncate">Revisar Ing.</span>
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function MissingConversionsCard({ conversions, ingredients }) {
    const unitSymbols = new Set(ingredients.map((u) => u.purchase_unit?.symbol));
    const hasKg = unitSymbols.has('kg');
    const hasOz = unitSymbols.has('oz');
    const hasMl = unitSymbols.has('ml');

    const missingKgOz = hasKg && !conversions.some(
        (c) => (c.from_unit?.symbol === 'kg' && c.to_unit?.symbol === 'oz') ||
                    (c.from_unit?.symbol === 'oz' && c.to_unit?.symbol === 'kg')
    );
    const missingMlOz = hasMl && !conversions.some(
        (c) => (c.from_unit?.symbol === 'ml' && c.to_unit?.symbol === 'oz') ||
                    (c.from_unit?.symbol === 'oz' && c.to_unit?.symbol === 'ml')
    );

    const missingConversions = [];

    if (missingKgOz) {
        missingConversions.push('kg \u2194 oz');
    }

    if (missingMlOz) {
        missingConversions.push('ml \u2194 oz');
    }

    return (
        <Card className={missingConversions.length > 0 ? 'border-primary/50' : ''}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className={`h-5 w-5 ${missingConversions.length > 0 ? 'text-primary' : ''}`} />
                    Ingredientes Sin Conversión
                </CardTitle>
            </CardHeader>
            <CardContent>
                {missingConversions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Todas las conversiones necesarias existen</p>
                ) : (
                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Faltan las siguientes conversiones:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {missingConversions.map((conv) => (
                                <span key={conv} className="rounded-md bg-primary/10 px-2 py-1 text-sm text-primary">
                                    {conv}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Agrega estas conversiones en la pestaña de Unidades para calcular costos correctamente.
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}