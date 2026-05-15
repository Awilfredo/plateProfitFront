import { useState } from 'react';
import { Pencil, Trash2, X, Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { useUnits } from '@/hooks/useIngredients';
import { api } from '@/lib/api';
import { useQueryClient } from '@tanstack/react-query';

export default function UnitsPage() {
    const { data: units, isLoading, error } = useUnits();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        name: '',
        symbol: '',
        type: 'weight',
    });

    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', symbol: '', type: '' });
    const [search, setSearch] = useState('');

    const filteredUnits = units?.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.symbol.toLowerCase().includes(search.toLowerCase())
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.createUnit({
            name: form.name,
            symbol: form.symbol,
            type: form.type,
        });
        setForm({ name: '', symbol: '', type: 'weight' });
        queryClient.invalidateQueries({ queryKey: ['units'] });
    };

    const startEditing = (unit) => {
        setEditingId(unit.id);
        setEditForm({ name: unit.name, symbol: unit.symbol, type: unit.type });
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditForm({ name: '', symbol: '', type: '' });
    };

    const saveEditing = async (id) => {
        await api.updateUnit(id, {
            name: editForm.name,
            symbol: editForm.symbol,
            type: editForm.type,
        });
        setEditingId(null);
        queryClient.invalidateQueries({ queryKey: ['units'] });
    };

    const deleteUnit = async (id) => {
        await api.deleteUnit(id);
        queryClient.invalidateQueries({ queryKey: ['units'] });
    };

    return (
        <Tooltip>
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4 pb-24">
            <Card>
                <CardHeader>
                    <CardTitle>Unidades</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-4 md:flex-row">
                        <Input
                            placeholder="Nombre (ej. kilogram)"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <Input
                            placeholder="Símbolo (ej. kg)"
                            value={form.symbol}
                            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
                            required
                        />
                        <select
                            className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm"
                            value={form.type}
                            onChange={(e) => setForm({ ...form, type: e.target.value })}
                        >
                            <option value="weight">Peso</option>
                            <option value="volume">Volumen</option>
                            <option value="count">Cantidad</option>
                        </select>
                        <Button type="submit">Agregar</Button>
                    </form>

                </CardContent>
            </Card>

            <div className="relative max-w-xs">
                <Input
                    placeholder="Buscar unidad..."
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
                    {error && <p className="text-destructive">Error al cargar unidades</p>}

                    {filteredUnits?.length === 0 && search && (
                        <p className="text-sm text-muted-foreground">No se encontraron unidades para "{search}"</p>
                    )}

                    {filteredUnits?.length === 0 && !search && (
                        <p className="text-sm text-muted-foreground">No hay unidades agregadas</p>
                    )}

                    <div className="rounded-md border hidden md:block">
                        <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                            <table className="w-full text-sm dark:bg-gray-900">
                                <thead className="sticky top-0 z-10 bg-muted border-b">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Nombre</th>
                                        <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Símbolo</th>
                                        <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Tipo</th>
                                        <th className="px-3 py-2 text-center font-medium whitespace-nowrap">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUnits?.map((unit) => (
                                        <tr key={unit.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {editingId === unit.id ? (
                                                    <Input
                                                        value={editForm.name}
                                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="h-7 w-full"
                                                    />
                                                ) : (
                                                    <span className="font-medium">{unit.name}</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                {editingId === unit.id ? (
                                                    <Input
                                                        value={editForm.symbol}
                                                        onChange={(e) => setEditForm({ ...editForm, symbol: e.target.value })}
                                                        className="h-7 w-16"
                                                    />
                                                ) : (
                                                    <span className="font-bold">{unit.symbol}</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap capitalize">
                                                {editingId === unit.id ? (
                                                    <select
                                                        className="border-input flex h-7 rounded-md border bg-transparent px-2 py-0.5 text-sm"
                                                        value={editForm.type}
                                                        onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                                    >
                                                        <option value="weight">Peso</option>
                                                        <option value="volume">Volumen</option>
                                                        <option value="count">Cantidad</option>
                                                    </select>
                                                ) : (
                                                    <span className="text-muted-foreground text-xs">{unit.type}</span>
                                                )}
                                            </td>
                                            <td className="px-3 py-2 whitespace-nowrap">
                                                <div className="flex items-center justify-center gap-0.5">
                                                    {editingId === unit.id ? (
                                                        <>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-green-100 hover:text-green-600 dark:hover:bg-green-900/30" onClick={() => saveEditing(unit.id)}>
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
                                                                    <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900/30" onClick={() => startEditing(unit)}>
                                                                        <Pencil className="h-4 w-4" />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent>Editar</TooltipContent>
                                                            </Tooltip>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/30" onClick={() => deleteUnit(unit.id)}>
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
                    </div>

                    <div className="mt-4 md:hidden space-y-2">
                        {units?.map((unit) => (
                            <div key={unit.id} className="p-3 rounded-lg border bg-card">
                                {editingId === unit.id ? (
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <label className="text-xs text-muted-foreground">Nombre</label>
                                                <Input
                                                    value={editForm.name}
                                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="w-20">
                                                <label className="text-xs text-muted-foreground">Símbolo</label>
                                                <Input
                                                    value={editForm.symbol}
                                                    onChange={(e) => setEditForm({ ...editForm, symbol: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <select
                                                className="border-input flex h-9 w-full rounded-md border bg-transparent px-2 text-sm"
                                                value={editForm.type}
                                                onChange={(e) => setEditForm({ ...editForm, type: e.target.value })}
                                            >
                                                <option value="weight">Peso</option>
                                                <option value="volume">Volumen</option>
                                                <option value="count">Cantidad</option>
                                            </select>
                                            <div className="flex gap-0.5">
                                                <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-green-100 hover:text-green-600" onClick={() => saveEditing(unit.id)}>
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-red-100 hover:text-red-600" onClick={cancelEditing}>
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-lg">{unit.name}</p>
                                            <p className="text-sm text-muted-foreground">{unit.symbol} · {unit.type}</p>
                                        </div>
                                        <div className="flex gap-0.5">
                                            <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-blue-100 hover:text-blue-600" onClick={() => startEditing(unit)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-9 w-9 hover:bg-red-100 hover:text-red-600" onClick={() => deleteUnit(unit.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
        </div>
        </Tooltip>
    );
}