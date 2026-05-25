'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';
import { PageHeader } from '@/shared/layout/PageHeader';
import { FormSection, FormField } from '@/shared/forms/FormSection';
import { api } from '@/shared/api/client';
import { inputBase, textareaBase, alertError, Overline, Button, LinkButton } from '@/shared/ui';
interface Item {
  tipo: 'MEDICAMENTO' | 'INSUMO';
  itemId: string;
  nombre: string;
  cantidad: number;
  dosis?: string;
  frecuencia?: string;
  duracion?: string;
  precio?: number;
}

const EMPTY_ITEM: Item = {
  tipo: 'MEDICAMENTO',
  itemId: '',
  nombre: '',
  cantidad: 1,
  dosis: '',
  frecuencia: '',
  duracion: '',
};

export function RecetaConsultaForm({
  pacienteId,
  consultaId,
}: {
  pacienteId: string;
  consultaId: string;
}) {
  const router = useRouter();
  const { usuario } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [nuevoItem, setNuevoItem] = useState<Item>(EMPTY_ITEM);

  const agregarItem = () => {
    if (!nuevoItem.nombre || nuevoItem.cantidad <= 0) {
      setError('Complete el nombre y cantidad del item');
      return;
    }
    setItems([...items, { ...nuevoItem, itemId: crypto.randomUUID() }]);
    setNuevoItem(EMPTY_ITEM);
    setError('');
  };

  const eliminarItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) return setError('Debe agregar al menos un item a la receta');
    if (!usuario?.id) return setError('Usuario no identificado');
    setIsLoading(true);
    try {
      await api.post('/recetas', {
        pacienteId,
        consultaId,
        usuarioId: usuario.id,
        indicaciones: indicaciones || undefined,
        items,
      });
      router.push(`/pacientes/${pacienteId}/historia`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl">
      <PageHeader
        overline="Historia clínica"
        title="Nueva receta"
        subtitle="Agregar medicamentos e insumos a la consulta"
        backHref={`/pacientes/${pacienteId}/historia`}
      />

      {error && <div className={`mb-5 ${alertError}`}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSection
          title="Agregar item"
          description="Completa los campos y pulsa Agregar para sumar a la lista"
        >
          <div className="grid grid-cols-12 gap-3">
            <div className="col-span-12 md:col-span-2">
              <FormField label="Tipo">
                <select
                  value={nuevoItem.tipo}
                  onChange={(e) =>
                    setNuevoItem({ ...nuevoItem, tipo: e.target.value as Item['tipo'] })
                  }
                  className={inputBase}
                >
                  <option value="MEDICAMENTO">Medicamento</option>
                  <option value="INSUMO">Insumo</option>
                </select>
              </FormField>
            </div>
            <div className="col-span-12 md:col-span-3">
              <FormField label="Nombre">
                <input
                  type="text"
                  value={nuevoItem.nombre}
                  onChange={(e) => setNuevoItem({ ...nuevoItem, nombre: e.target.value })}
                  placeholder="Nombre del item"
                  className={inputBase}
                />
              </FormField>
            </div>
            <div className="col-span-4 md:col-span-1">
              <FormField label="Cant.">
                <input
                  type="number"
                  min={1}
                  value={nuevoItem.cantidad}
                  onChange={(e) =>
                    setNuevoItem({ ...nuevoItem, cantidad: parseInt(e.target.value) || 0 })
                  }
                  className={inputBase}
                />
              </FormField>
            </div>
            <div className="col-span-8 md:col-span-2">
              <FormField label="Dosis">
                <input
                  type="text"
                  value={nuevoItem.dosis}
                  onChange={(e) => setNuevoItem({ ...nuevoItem, dosis: e.target.value })}
                  placeholder="Ej: 500mg"
                  className={inputBase}
                />
              </FormField>
            </div>
            <div className="col-span-7 md:col-span-2">
              <FormField label="Frecuencia">
                <input
                  type="text"
                  value={nuevoItem.frecuencia}
                  onChange={(e) => setNuevoItem({ ...nuevoItem, frecuencia: e.target.value })}
                  placeholder="Cada 8 horas"
                  className={inputBase}
                />
              </FormField>
            </div>
            <div className="col-span-5 md:col-span-2">
              <FormField label="Duración">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={nuevoItem.duracion}
                    onChange={(e) => setNuevoItem({ ...nuevoItem, duracion: e.target.value })}
                    placeholder="7 días"
                    className={inputBase}
                  />
                  <Button
                    type="button"
                    onClick={agregarItem}
                    variant="primary"
                    size="sm"
                    className="h-10 shrink-0 px-3"
                  >
                    Agregar
                  </Button>
                </div>
              </FormField>
            </div>
          </div>
        </FormSection>

        <section className="surface overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
            <Overline>Items de la receta</Overline>
            <span className="muted tabular-nums">
              {items.length} item{items.length === 1 ? '' : 's'}
            </span>
          </div>
          {items.length > 0 ? (
            <table className="w-full">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  {['Tipo', 'Nombre', 'Cant.', 'Dosis', 'Frecuencia', 'Duración', ''].map(
                    (h, i) => (
                      <Overline
                        as="th"
                        key={i}
                        className={`px-4 py-2.5 ${h === 'Cant.' ? 'text-center' : 'text-left'}`}
                      >
                        {h}
                      </Overline>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {items.map((item, index) => (
                  <tr key={item.itemId}>
                    <td className="body px-4 py-3">{item.tipo}</td>
                    <td className="body-strong px-4 py-3 text-neutral-900">{item.nombre}</td>
                    <td className="body px-4 py-3 text-center tabular-nums">{item.cantidad}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{item.dosis || '—'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{item.frecuencia || '—'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{item.duracion || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => eliminarItem(index)}
                        className="text-danger text-xs font-medium hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="subtitle px-6 py-10 text-center">
              No hay items agregados. Agrega al menos uno para continuar.
            </div>
          )}
        </section>

        <FormSection title="Indicaciones generales">
          <FormField label="Instrucciones adicionales para el paciente">
            <textarea
              value={indicaciones}
              onChange={(e) => setIndicaciones(e.target.value)}
              rows={4}
              className={textareaBase}
              placeholder="Información complementaria, recomendaciones..."
            />
          </FormField>
        </FormSection>

        <div className="flex items-center justify-end gap-3 pt-2">
          <LinkButton href={`/pacientes/${pacienteId}/historia`} variant="secondary" size="sm">
            Cancelar
          </LinkButton>
          <Button
            type="submit"
            disabled={isLoading || items.length === 0}
            variant="primary"
            size="sm"
          >
            {isLoading ? 'Guardando...' : 'Guardar receta'}
          </Button>
        </div>
      </form>
    </div>
  );
}
