import { useState } from 'react';
import { ArrowRight, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useUnitConversions, useCreateUnitConversion, useDeleteUnitConversion } from '@/hooks/useUnitConversions';
import { useUnits } from '@/hooks/useIngredients';

export default function ConversionsPage() {
    const { data: units } = useUnits();
    const { data: conversions, isLoading } = useUnitConversions();
    const createMutation = useCreateUnitConversion();
    const deleteMutation = useDeleteUnitConversion();

    const [deleteTarget, setDeleteTarget] = useState(null);

    const [form, setForm] = useState({
        from_unit_id: '',
        to_unit_id: '',
        conversion_factor: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createMutation.mutateAsync({
            from_unit_id: parseInt(form.from_unit_id),
            to_unit_id: parseInt(form.to_unit_id),
            conversion_factor: parseFloat(form.conversion_factor),
        });
        setForm({ from_unit_id: '', to_unit_id: '', conversion_factor: '' });
    };

    const handleSelectFromUnit = (unitId) => {
        setForm({ ...form, from_unit_id: unitId });
        const unit = units?.find((u) => u.id === parseInt(unitId));

        if (unit) {
            const reverseConversion = conversions?.find(
                (c) => c.to_unit_id === unit.id && c.from_unit_id !== unit.id
            );

            if (reverseConversion) {
                setForm((prev) => ({
                    ...prev,
                    from_unit_id: unitId,
                    to_unit_id: reverseConversion.from_unit_id.toString(),
                    conversion_factor: (1 / reverseConversion.conversion_factor).toFixed(6),
                }));
            }
        }
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4">
            <Card>
                <CardHeader>
                    <CardTitle>Agregar Conversión</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[120px]">
                            <label className="text-sm text-muted-foreground mb-1 block">Desde</label>
                            <select
                                className="border-input flex h-10 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
                                value={form.from_unit_id}
                                onChange={(e) => handleSelectFromUnit(e.target.value)}
                                required
                            >
                                <option value="">Seleccionar</option>
                                {units?.map((unit) => (
                                    <option key={unit.id} value={unit.id}>
                                        {unit.name} ({unit.symbol})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex h-10 items-center justify-center">
                            <ArrowRight className="text-muted-foreground" />
                        </div>

                        <div className="flex-1 min-w-[120px]">
                            <label className="text-sm text-muted-foreground mb-1 block">Hacia</label>
                            <select
                                className="border-input flex h-10 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs outline-none md:text-sm"
                                value={form.to_unit_id}
                                onChange={(e) => setForm({ ...form, to_unit_id: e.target.value })}
                                required
                            >
                                <option value="">Seleccionar</option>
                                {units
                                    ?.filter((u) => u.id !== parseInt(form.from_unit_id))
                                    .map((unit) => (
                                        <option key={unit.id} value={unit.id}>
                                            {unit.name} ({unit.symbol})
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="w-40">
                            <label className="text-sm text-muted-foreground mb-1 block">Factor</label>
                            <Input
                                type="number"
                                step="0.000001"
                                placeholder="0.001"
                                value={form.conversion_factor}
                                onChange={(e) => setForm({ ...form, conversion_factor: e.target.value })}
                                required
                            />
                        </div>

                        <Button type="submit" disabled={createMutation.isPending} className="gap-2">
                            <Plus className="h-4 w-4" />
                            {createMutation.isPending ? 'Agregando...' : 'Agregar'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex justify-center p-8">
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {conversions?.map((conv) => (
                        <Card key={conv.id} className="relative overflow-hidden">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col items-center">
                                            <span className="text-lg font-bold">
                                                {conv.from_unit?.symbol}
                                            </span>
                                            <ArrowRight className="h-3 w-3 text-muted-foreground rotate-90" />
                                            <span className="text-lg font-bold">
                                                {conv.to_unit?.symbol}
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-2xl font-bold text-primary">
                                                {conv.conversion_factor}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {conv.from_unit?.name} → {conv.to_unit?.name}
                                            </span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="text-muted-foreground hover:text-destructive"
                                        onClick={() => setDeleteTarget(conv)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {conversions?.length === 0 && !isLoading && (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <p className="text-muted-foreground">No hay conversiones configuradas</p>
                    <p className="text-sm text-muted-foreground">
                        Agrega conversiones para calcular costos correctamente
                    </p>
                </div>
            )}

            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Eliminar Conversión</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de eliminar la conversión de {deleteTarget?.from_unit?.symbol} a {deleteTarget?.to_unit?.symbol}?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
                        <Button
                            variant="destructive"
                            onClick={() => {
                                if (deleteTarget) {
                                    deleteMutation.mutate(deleteTarget.id);
                                    setDeleteTarget(null);
                                }
                            }}
                        >
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}