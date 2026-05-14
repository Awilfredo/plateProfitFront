import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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

    return (
        <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
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

                    {isLoading && <p>Cargando...</p>}
                    {error && <p className="text-destructive">Error al cargar unidades</p>}

                    <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {units?.map((unit) => (
                            <Card key={unit.id} className="border-l-4 border-l-primary">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{unit.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-2xl font-bold">{unit.symbol}</p>
                                    <p className="text-sm text-muted-foreground capitalize">{unit.type}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}