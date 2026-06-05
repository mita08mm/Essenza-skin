'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/shared/layout/PageHeader';
import { alertError, Overline, Button, Modal, LinkButton } from '@/shared/ui';
import { api, ApiError } from '@/shared/api';
import { formatFecha } from '@/shared/utils/date';
import { Pencil, Trash2 } from 'lucide-react';

interface Prescripcion {
  id: string;
  fecha: string;
  nombre: string;
  paciente: { id: string; nombre: string; apellido: string };
  items: Array<{ id: string; nombre: string; indicaciones: string }>;
}

function normalize(entry: unknown): Prescripcion {
  const raw = entry as {
    id?: string;
    fecha?: string;
    nombre?: string;
    paciente?: { id?: string; nombre?: string; apellido?: string };
    items?: Array<{
      id?: string;
      nombre?: string;
      indicaciones?: string;
      aplicacion?: string;
      frecuencia?: string;
    }>;
  };
  return {
    id: raw.id ?? '',
    fecha: raw.fecha ?? new Date().toISOString(),
    nombre: raw.nombre ?? 'Prescripción',
    paciente: {
      id: raw.paciente?.id ?? '',
      nombre: raw.paciente?.nombre ?? 'Paciente',
      apellido: raw.paciente?.apellido ?? '',
    },
    items: (raw.items ?? []).map((item, idx) => ({
      id: item.id ?? `item-${idx}`,
      nombre: item.nombre ?? 'Item',
      indicaciones: item.indicaciones ?? item.aplicacion ?? item.frecuencia ?? '',
    })),
  };
}

export function RecetaDetailView({ recetaId }: { recetaId: string }) {
  const router = useRouter();
  const [prescripcion, setPrescripcion] = useState<Prescripcion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const loadPrescripcion = useCallback(async () => {
    try {
      const data = await api.get(`/prescripciones/${recetaId}`);
      setPrescripcion(normalize(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [recetaId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPrescripcion();
  }, [loadPrescripcion]);

  const handleDeletePrescripcion = async () => {
    try {
      setIsDeleting(true);
      setDeleteError('');
      await api.delete(`/prescripciones/${recetaId}`);
      router.push('/prescripciones');
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Error al eliminar prescripción');
      setIsDeleting(false);
    }
  };

  const handleDeleteItem = async () => {
    if (!deleteItemId) return;
    try {
      setIsDeleting(true);
      setDeleteError('');
      await api.delete(`/prescripciones/${recetaId}/items/${deleteItemId}`);
      setDeleteItemId(null);
      // Recargar la prescripción
      await loadPrescripcion();
    } catch (err) {
      setDeleteError(err instanceof ApiError ? err.message : 'Error al eliminar item');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="subtitle flex min-h-[400px] items-center justify-center">
        Cargando prescripción...
      </div>
    );
  }

  if (error || !prescripcion) {
    return <div className={alertError}>{error || 'Prescripción no encontrada'}</div>;
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        overline="Recetas"
        title="Prescripción"
        subtitle={prescripcion.nombre}
        backHref="/prescripciones"
        actions={
          <div className="flex items-center gap-2">
            <LinkButton
              href={`/prescripciones/${recetaId}/editar`}
              variant="secondary"
              size="sm"
              className="gap-1.5"
            >
              <Pencil className="h-3.5 w-3.5" />
              Editar
            </LinkButton>
            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={() => setDeleteModalOpen(true)}
              className="gap-1.5"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => window.print()}>
              Imprimir
            </Button>
          </div>
        }
      />

      <div className="space-y-5">
        <section className="surface p-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Overline>Paciente</Overline>
              <p className="mt-0.5 text-base font-medium text-neutral-900">
                {prescripcion.paciente.nombre} {prescripcion.paciente.apellido}
              </p>
            </div>
            <div>
              <Overline>Fecha</Overline>
              <p className="mt-0.5 text-base font-medium text-neutral-900">
                {formatFecha(prescripcion.fecha)}
              </p>
            </div>
          </div>
        </section>

        <section className="surface overflow-hidden">
          <div className="border-b border-neutral-100 px-6 py-4">
            <Overline>Items prescritos</Overline>
          </div>
          <table className="w-full">
            <thead className="border-b border-neutral-100 bg-neutral-50">
              <tr>
                <Overline as="th" className="w-[260px] px-6 py-2.5 text-left">
                  Producto
                </Overline>
                <Overline as="th" className="px-6 py-2.5 text-left">
                  Indicaciones
                </Overline>
                <th className="px-6 py-2.5"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {prescripcion.items.map((item) => (
                <tr key={item.id} className="group hover:bg-neutral-25">
                  <td className="body-strong px-6 py-3 text-neutral-900">{item.nombre}</td>
                  <td className="body px-6 py-3">
                    {item.indicaciones || (
                      <span className="text-neutral-400 italic">Sin indicaciones</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => setDeleteItemId(item.id)}
                      className="inline-flex h-7 items-center gap-1 rounded-md px-2.5 text-xs font-medium text-danger opacity-100 transition-all hover:bg-danger/10 lg:opacity-0 lg:group-hover:opacity-100"
                    >
                      <Trash2 className="h-3 w-3" />
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* Modal para eliminar prescripción completa */}
      <Modal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setDeleteError('');
        }}
        title="Eliminar prescripción"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            ¿Estás seguro de que deseas eliminar esta prescripción completa? Esta acción no se puede deshacer.
          </p>
          {deleteError && <div className={alertError}>{deleteError}</div>}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setDeleteError('');
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeletePrescripcion}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar prescripción'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal para eliminar item individual */}
      <Modal
        open={deleteItemId !== null}
        onClose={() => {
          setDeleteItemId(null);
          setDeleteError('');
        }}
        title="Eliminar item"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            ¿Estás seguro de que deseas eliminar este item de la prescripción?
          </p>
          {deleteError && <div className={alertError}>{deleteError}</div>}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDeleteItemId(null);
                setDeleteError('');
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDeleteItem}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar item'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
