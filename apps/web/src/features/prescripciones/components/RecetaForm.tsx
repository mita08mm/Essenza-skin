'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/shared/layout/PageHeader';
import { FormSection, FormField } from '@/shared/forms/FormSection';
import { inputBase, textareaBase, alertError, Overline, Button, LinkButton } from '@/shared/ui';
import { api } from '@/shared/api';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
  estado: string;
}

interface Item {
  id: string;
  nombre: string;
  indicaciones: string;
}

function buildName(items: Item[]) {
  if (items.length === 1) return items[0].nombre;
  return `${items[0].nombre} y ${items.length - 1} mas`;
}

export function RecetaForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);
  const [pacienteId, setPacienteId] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [nombreItem, setNombreItem] = useState('');
  const [indicaciones, setIndicaciones] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Paciente[]>('/pacientes');
        setPacientes(data.filter((p) => p.estado === 'ACTIVO'));
      } catch {
        /* noop */
      } finally {
        setLoadingPacientes(false);
      }
    })();
  }, []);

  const agregarItem = () => {
    if (!nombreItem.trim() || !indicaciones.trim()) {
      setError('Complete el nombre y las indicaciones');
      return;
    }
    setItems([
      ...items,
      { id: crypto.randomUUID(), nombre: nombreItem.trim(), indicaciones: indicaciones.trim() },
    ]);
    setNombreItem('');
    setIndicaciones('');
    setError('');
  };

  const eliminarItem = (index: number) => setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (items.length === 0) {
      setError('Debe agregar al menos un item a la prescripción');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/prescripciones', {
        pacienteId,
        nombre: buildName(items),
        items: items.map((i) => ({ nombre: i.nombre, indicaciones: i.indicaciones })),
      });
      router.push('/prescripciones');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <PageHeader
        overline="Recetas"
        title="Nueva prescripción"
        subtitle="Registra los productos indicados al paciente con sus indicaciones"
        backHref="/recetas"
      />

      {error && <div className={`mb-5 ${alertError}`}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSection title="Paciente">
          <FormField label="Paciente" required>
            {loadingPacientes ? (
              <div className="subtitle">Cargando pacientes...</div>
            ) : (
              <select
                value={pacienteId}
                onChange={(e) => setPacienteId(e.target.value)}
                className={inputBase}
                required
                disabled={isLoading}
              >
                <option value="">Seleccione un paciente</option>
                {pacientes.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nombre} {p.apellido} — {p.tipoDocumento}: {p.documento}
                  </option>
                ))}
              </select>
            )}
          </FormField>
        </FormSection>

        <FormSection
          title="Productos prescritos"
          description="Agrega los productos uno por uno con sus indicaciones"
        >
          <div className="space-y-4 rounded-md border border-neutral-100 bg-neutral-50 p-4">
            <FormField label="Nombre del producto">
              <input
                type="text"
                value={nombreItem}
                onChange={(e) => setNombreItem(e.target.value)}
                placeholder="Ej. Protector solar, crema reparadora"
                className={inputBase}
              />
            </FormField>
            <FormField label="Indicaciones">
              <textarea
                value={indicaciones}
                onChange={(e) => setIndicaciones(e.target.value)}
                rows={2}
                placeholder="Ej. Aplicar por la noche durante 30 días"
                className={textareaBase}
              />
            </FormField>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={agregarItem}
                variant="secondary"
                size="sm"
                className="px-4"
              >
                Agregar producto
              </Button>
            </div>
          </div>

          {items.length > 0 ? (
            <div className="overflow-hidden rounded-md border border-neutral-200">
              <table className="min-w-full divide-y divide-neutral-100">
                <thead className="bg-neutral-50">
                  <tr>
                    <Overline as="th" className="px-4 py-2.5 text-left">
                      Nombre
                    </Overline>
                    <Overline as="th" className="px-4 py-2.5 text-left">
                      Indicaciones
                    </Overline>
                    <th className="px-4 py-2.5"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 bg-white">
                  {items.map((item, index) => (
                    <tr key={item.id}>
                      <td className="body-strong px-4 py-3">{item.nombre}</td>
                      <td className="px-4 py-3 text-sm text-neutral-600">{item.indicaciones}</td>
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
            </div>
          ) : (
            <div className="subtitle rounded-md border border-dashed border-neutral-200 py-6 text-center">
              No hay productos agregados. Agrega al menos uno para continuar.
            </div>
          )}
        </FormSection>

        <div className="flex items-center justify-end gap-3">
          <LinkButton href="/prescripciones" variant="secondary" size="sm">
            Cancelar
          </LinkButton>
          <Button
            type="submit"
            disabled={isLoading || items.length === 0}
            variant="primary"
            size="sm"
          >
            {isLoading ? 'Guardando...' : 'Guardar prescripción'}
          </Button>
        </div>
      </form>
    </div>
  );
}
