import { useState } from 'react';
import { Pencil, X, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useIngredients, useCreateIngredient, useDeleteIngredient, useUpdateIngredient } from '@/hooks/useIngredients';
import { useUnits } from '@/hooks/useIngredients';

export default function IngredientsPage() {
    const { data: ingredients, isLoading, error } = useIngredients();
    const { data: units } = useUnits();
    const createMutation = useCreateIngredient();
    const deleteMutation = useDeleteIngredient();
    const updateMutation = useUpdateIngredient();

    const [form, setForm] = useState({
        name: '',
        purchase_price: '',
        purchase_quantity: '',
        purchase_unit_id: '',
    });

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        purchase_price: '',
        purchase_quantity: '',
        purchase_unit_id: '',
    });
    const [search, setSearch] = useState('');

    const filteredIngredients = ingredients?.filter((ing) =>
        ing.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createMutation.mutateAsync({
            name: form.name,
            purchase_price: parseFloat(form.purchase_price),
            purchase_quantity: parseFloat(form.purchase_quantity),
            purchase_unit_id: parseInt(form.purchase_unit_id),
        });
        setForm({ name: '', purchase_price: '', purchase_quantity: '', purchase_unit_id: '' });
    };

    const startEditing = (ing) => {
        setEditingId(ing.id);
        setEditForm({
            name: ing.name,
            purchase_price: ing.purchase_price.toString(),
            purchase_quantity: ing.purchase_quantity.toString(),
            purchase_unit_id: ing.purchase_unit_id.toString(),
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ name: '', purchase_price: '', purchase_quantity: '', purchase_unit_id: '' });
    };

    const saveEditing = async (id) => {
        await updateMutation.mutateAsync({
            id,
            data: {
                name: editForm.name,
                purchase_price: parseFloat(editForm.purchase_price),
                purchase_quantity: parseFloat(editForm.purchase_quantity),
                purchase_unit_id: parseInt(editForm.purchase_unit_id),
            },
        });
        setEditingId(null);
    };

    return (
        <Tooltip>
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 pb-24">
            <Card>
                <CardHeader>
                    <CardTitle>Ingredientes</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="mb-4 flex flex-wrap gap-2">
                        <Input
                            placeholder="Nombre"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="flex-1 min-w-[150px]"
                            required
                        />
                        <Input
                            type="number"
                            step="0.0001"
                            placeholder="Precio"
                            value={form.purchase_price}
                            onChange={(e) => setForm({ ...form, purchase_price: e.target.value })}
                            className="w-28"
                            required
                        />
                        <Input
                            type="number"
                            step="0.0001"
                            placeholder="Cantidad"
                            value={form.purchase_quantity}
                            onChange={(e) => setForm({ ...form, purchase_quantity: e.target.value })}
                            className="w-28"
                            required
                        />
                        <select
                            className="border-input flex h-9 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
                            value={form.purchase_unit_id}
                            onChange={(e) => setForm({ ...form, purchase_unit_id: e.target.value })}
                            required
                        >
                            <option value="">Unidad</option>
                            {units?.map((unit) => (
                                <option key={unit.id} value={unit.id}>
                                    {unit.symbol}
                                </option>
                            ))}
                        </select>
                        <Button type="submit" disabled={createMutation.isPending}>
                            {createMutation.isPending ? '...' : 'Agregar'}
                        </Button>
                    </form>

                    <div className="relative mb-4 max-w-xs">
                        <Input
                            placeholder="Buscar ingrediente..."
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

                </CardContent>
            </Card>
                    {isLoading && <p>Cargando...</p>}
                    {error && <p className="text-destructive">Error al cargar ingredientes</p>}

                    {filteredIngredients?.length === 0 && search && (
                        <p className="text-sm text-muted-foreground">No se encontraron ingredientes para "{search}"</p>
                    )}

                    {filteredIngredients?.length === 0 && !search && (
                        <p className="text-sm text-muted-foreground">No hay ingredientes agregados</p>
                    )}

                    <div className="mt-4 rounded-md border">
                        <div className="hidden md:block overflow-x-auto overflow-y-auto max-h-[500px]">
                            <table className="w-full text-sm dark:bg-gray-900">
                                <thead className="sticky top-0 z-10 bg-muted border-b">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Nombre</th>
                                        <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Precio Compra</th>
                                        <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Cantidad</th>
                                        <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Unidad</th>
                                        <th className="px-3 py-2 text-right font-medium whitespace-nowrap">Precio/Unidad</th>
                                        <th className="px-3 py-2 text-center font-medium whitespace-nowrap">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredIngredients?.map((ing) => (
                                        <tr key={ing.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                            <td className="px-3 py-2 font-medium whitespace-nowrap">
                                                {editingId === ing.id ? (
                                                    <Input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="h-7 w-full"
                                                    />
                                                ) : (
                                                    ing.name
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">
                                                {editingId === ing.id ? (
                                                    <Input
                                                        type="number"
                                                        step="0.0001"
                                                        value={editForm.purchase_price}
                                                        onChange={(e) => setEditForm({ ...editForm, purchase_price: e.target.value })}
                                                        className="h-7 w-20"
                                                    />
                                                ) : (
                                                    `$${ing.purchase_price.toFixed(2)}`
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">
                                                {editingId === ing.id ? (
                                                    <Input
                                                        type="number"
                                                        step="0.0001"
                                                        value={editForm.purchase_quantity}
                                                        onChange={(e) => setEditForm({ ...editForm, purchase_quantity: e.target.value })}
                                                        className="h-7 w-20"
                                                    />
                                                ) : (
                                                    ing.purchase_quantity
                                                )}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {editingId === ing.id ? (
                                                    <select
                                                        className="border-input flex h-7 rounded-md border bg-transparent px-2 py-0.5 text-sm"
                                                        value={editForm.purchase_unit_id}
                                                        onChange={(e) => setEditForm({ ...editForm, purchase_unit_id: e.target.value })}
                                                    >
                                                        {units?.map((unit) => (
                                                            <option key={unit.id} value={unit.id}>
                                                                {unit.symbol}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    ing.purchase_unit?.symbol || '-'
                                                )}
                                            </td>
                                            <td className="px-3 py-2 text-right whitespace-nowrap">
                                                {ing.price_per_unit ? `$${ing.price_per_unit.toFixed(2)}` : '-'}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    {editingId === ing.id ? (
                                                        <>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30" onClick={() => saveEditing(ing.id)}>
                                                                        <Check className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Guardar</TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={cancelEditing}>
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Cancelar</TooltipContent>
                                                            </Tooltip>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30" onClick={() => startEditing(ing)}>
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Editar</TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={() => deleteMutation.mutate(ing.id)}>
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Eliminar</TooltipContent>
                                                            </Tooltip>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="md:hidden divide-y">
                            {filteredIngredients?.map((ing) => (
                                <div key={ing.id} className="p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{ing.name}</span>
                                        <div className="flex items-center gap-0.5">
                                            {editingId === ing.id ? (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30" onClick={() => saveEditing(ing.id)}>
                                                                <Check className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Guardar</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={cancelEditing}>
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Cancelar</TooltipContent>
                                                    </Tooltip>
                                                </>
                                            ) : (
                                                <>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30" onClick={() => startEditing(ing)}>
                                                                <Pencil className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Editar</TooltipContent>
                                                    </Tooltip>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={() => deleteMutation.mutate(ing.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>Eliminar</TooltipContent>
                                                    </Tooltip>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {editingId === ing.id ? (
                                        <div className="space-y-2">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <label className="text-xs text-muted-foreground">Precio</label>
                                                    <Input
                                                        type="number"
                                                        step="0.0001"
                                                        value={editForm.purchase_price}
                                                        onChange={(e) => setEditForm({ ...editForm, purchase_price: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-muted-foreground">Cantidad</label>
                                                    <Input
                                                        type="number"
                                                        step="0.0001"
                                                        value={editForm.purchase_quantity}
                                                        onChange={(e) => setEditForm({ ...editForm, purchase_quantity: e.target.value })}
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <label className="text-xs text-muted-foreground">Unidad</label>
                                                    <select
                                                        className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm"
                                                        value={editForm.purchase_unit_id}
                                                        onChange={(e) => setEditForm({ ...editForm, purchase_unit_id: e.target.value })}
                                                    >
                                                        {units?.map((unit) => (
                                                            <option key={unit.id} value={unit.id}>
                                                                {unit.symbol}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-1">
                                            <p className="text-sm text-muted-foreground">
                                                Precio: ${ing.purchase_price.toFixed(2)} / {ing.purchase_quantity} {ing.purchase_unit?.symbol}
                                            </p>
                                            <p className="text-sm font-medium">
                                                Precio por unidad: ${ing.price_per_unit?.toFixed(2)} {ing.purchase_unit?.symbol}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
        </div>
        </Tooltip>
    );
}