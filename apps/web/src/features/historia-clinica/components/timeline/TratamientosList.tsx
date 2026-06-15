'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Tratamiento } from '@/features/historia-clinica/types';
import { useEliminarTratamiento } from '@/features/historia-clinica';
import { Overline, SectionTitle, CardTitle, Modal, Button } from '@/shared/ui';
import { TrashIcon, MoreVerticalIcon } from '@/shared/icons';

interface TratamientosListProps {
  tratamientos: Tratamiento[];
  pacienteId: string;
}

export default function TratamientosList({ tratamientos, pacienteId }: TratamientosListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const { eliminar, isLoading: isDeleting, error: deleteError } = useEliminarTratamiento(pacienteId);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [tratamientoToDelete, setTratamientoToDelete] = useState<{ id: string; nombre: string } | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const openDeleteModal = (id: string, nombreTratamiento: string) => {
    setTratamientoToDelete({ id, nombre: nombreTratamiento });
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!tratamientoToDelete) return;

    try {
      await eliminar(tratamientoToDelete.id);
      setShowDeleteModal(false);
      setTratamientoToDelete(null);
    } catch (error) {
      // El error ya está manejado por el hook
    }
  };

  return (
    <section>
      <header className="mb-5 flex items-baseline justify-between">
        <SectionTitle>Historial clínico</SectionTitle>
        <Overline as="span">
          {tratamientos.length} {tratamientos.length === 1 ? 'consulta' : 'consultas'}
        </Overline>
      </header>

      <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-neutral-200">
        {tratamientos.map((t) => {
          const isExpanded = expandedIds.has(t.id);
          const hasDetails = !!(
            t.evaluacionInicial ||
            t.protocolo ||
            t.observaciones ||
            t.proximaSesion
          );
          const isBeingDeleted = isDeleting && tratamientoToDelete?.id === t.id;

          return (
            <li key={t.id} className="relative pl-7">
              <span className="bg-brand-morena absolute top-3.5 left-0 h-[15px] w-[15px] rounded-full border-[3px] border-white shadow-xs" />
              {/* <article className="surface overflow-hidden transition-colors hover:border-neutral-300"> */}
              <article className="surface transition-colors hover:border-neutral-300">
                <div className="bg-neutral-25 flex items-baseline justify-between gap-4 border-b border-neutral-100 px-5 py-3">
                  <button
                    onClick={() => toggleExpanded(t.id)}
                    disabled={isBeingDeleted}
                    className={`flex min-w-0 flex-1 items-center gap-2 text-left ${
                      !isBeingDeleted
                        ? 'cursor-pointer transition-colors hover:opacity-80'
                        : 'cursor-default'
                    }`}
                  >
                    {isExpanded ? (
                      <ChevronDown className="text-brand-morena h-4 w-4 shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-neutral-500" />
                    )}
                    <CardTitle className="truncate">{t.nombreTratamiento}</CardTitle>
                  </button>
                  <div className="flex items-center gap-3">
                    <Overline as="time" className="shrink-0">
                      {formatDate(t.fecha)}
                    </Overline>
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === t.id ? null : t.id)}
                        className="rounded p-1 text-neutral-500 transition-colors hover:bg-neutral-100"
                        title="Más opciones"
                      >
                        <MoreVerticalIcon className="h-4 w-4" color="currentColor" />
                      </button>

                      {openMenuId === t.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          />
                          <div className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg">
                            <button
                              onClick={() => {
                                setOpenMenuId(null);
                                openDeleteModal(t.id, t.nombreTratamiento);
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger transition-colors hover:bg-danger-bg"
                            >
                              <TrashIcon className="h-4 w-4" color="currentColor" />
                              Eliminar
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Información completa (visible al expandir) */}
                {isExpanded && (
                  <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
                    <Field label="Tipo" value={formatTipo(t.tipoTratamiento)} />
                    <Field label="Zona tratada" value={t.zonaTratada} />
                    <Field label="Objetivo" value={t.objetivo} wide />
                    <Field label="Nota clínica" value={t.evaluacionInicial} wide />
                    <Field label="Procedimiento" value={t.protocolo} wide />
                    <Field label="Observaciones" value={t.observaciones} wide />
                    <Field label="Próxima consulta" value={formatOptionalDate(t.proximaSesion)} />
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ol>

      {/* Modal de confirmación de eliminación */}
      <Modal
        open={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        title="Eliminar tratamiento"
        description={tratamientoToDelete ? `¿Estás seguro de eliminar "${tratamientoToDelete.nombre}"?` : ''}
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
              disabled={isDeleting}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="bg-danger hover:bg-danger/90 flex-1 sm:flex-none"
            >
              Eliminar
            </Button>
          </>
        }
      >
        {deleteError && (
          <div className="bg-danger-bg rounded-lg border border-[rgba(181,58,58,0.2)] px-4 py-3 text-sm text-danger">
            {deleteError}
          </div>
        )}
        <div className="text-sm text-neutral-600">
          <p className="mb-2 font-medium text-neutral-900">Esta acción eliminará permanentemente:</p>
          <ul className="ml-5 list-disc space-y-1">
            <li>El registro del tratamiento</li>
            <li>Los protocolos asociados</li>
          </ul>
          <p className="mt-3 text-neutral-500">Esta acción no se puede deshacer.</p>
        </div>
      </Modal>
    </section>
  );
}

function Field({ label, value, wide }: { label: string; value?: string; wide?: boolean }) {
  if (!value) return null;
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <Overline>{label}</Overline>
      <p className="mt-1 text-sm leading-relaxed text-neutral-800">{value}</p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTipo(tipo: Tratamiento['tipoTratamiento']) {
  const labels: Record<Tratamiento['tipoTratamiento'], string> = {
    FACIAL: 'Facial',
    CORPORAL: 'Corporal',
    CAPILAR: 'Capilar',
    COMBINADO: 'Combinado',
  };
  return labels[tipo];
}

function formatOptionalDate(date?: string) {
  if (!date) return undefined;
  return new Date(date).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
