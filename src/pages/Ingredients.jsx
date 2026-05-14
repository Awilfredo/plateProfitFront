import { useState } from 'react';
import { Pencil, X, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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

                    {isLoading && <p>Cargando...</p>}
                    {error && <p className="text-destructive">Error al cargar ingredientes</p>}

                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {filteredIngredients?.length === 0 && search && (
                            <p className="text-sm text-muted-foreground">No se encontraron ingredientes para "{search}"</p>
                        )}
                        {filteredIngredients?.map((ing) => (
                            <Card key={ing.id} className="border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    {editingId === ing.id ? (
                                        <Input
                                            value={editForm.name}
                                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                            className="text-lg font-semibold"
                                        />
                                    ) : (
                                        <CardTitle className="text-lg">{ing.name}</CardTitle>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-1">
                                    {editingId === ing.id ? (
                                        <>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    step="0.0001"
                                                    value={editForm.purchase_price}
                                                    onChange={(e) => setEditForm({ ...editForm, purchase_price: e.target.value })}
                                                    className="w-24"
                                                />
                                                <span className="self-center text-sm">/</span>
                                                <Input
                                                    type="number"
                                                    step="0.0001"
                                                    value={editForm.purchase_quantity}
                                                    onChange={(e) => setEditForm({ ...editForm, purchase_quantity: e.target.value })}
                                                    className="w-24"
                                                />
                                                <select
                                                    className="border-input flex h-9 rounded-md border bg-transparent px-2 py-1 text-sm"
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
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-sm text-muted-foreground">
                                                Precio: ${ing.purchase_price.toFixed(2)} / {ing.purchase_quantity} {ing.purchase_unit?.symbol}
                                            </p>
                                            <p className="text-sm font-medium">
                                                Precio por unidad: ${ing.price_per_unit?.toFixed(2)} {ing.purchase_unit?.symbol}
                                            </p>
                                        </>
                                    )}
                                </CardContent>
                                <CardFooter className="flex gap-2">
                                    {editingId === ing.id ? (
                                        <>
                                            <Button size="icon" variant="ghost" onClick={() => saveEditing(ing.id)}>
                                                <Check className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" onClick={cancelEditing}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </>
                                    ) : (
                                        <>
                                            <Button size="icon" variant="ghost" onClick={() => startEditing(ing)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => deleteMutation.mutate(ing.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}