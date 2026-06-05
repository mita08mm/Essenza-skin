'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import PanelFrame, { PanelActionButton } from './PanelFrame';
import { Button, Input, Label, Modal, Spinner, BodyStrong } from '@/shared/ui';
import { PlusIcon, CloseIcon } from '@/shared/icons';
import { usePacienteProtocolos, NuevaPrescripcionItem } from '@/features/pacientes';
import { formatFecha } from '@/shared/utils/date';

interface ProtocolosPanelProps {
  pacienteId: string;
}

export default function ProtocolosPanel({ pacienteId }: ProtocolosPanelProps) {
  const {
    prescripciones,
    isLoading,
    error: loadError,
    crearPrescripcion,
  } = usePacienteProtocolos(pacienteId);

  const [showModal, setShowModal] = useState(false);
  const [items, setItems] = useState<NuevaPrescripcionItem[]>([]);
  const [prescripcion, setPrescripcion] = useState('');
  const [indicaciones, setIndicaciones] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [pinnedIds, setPinnedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setPinnedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleMouseEnter = (id: string) => {
    if (!pinnedIds.has(id)) {
      setExpandedIds((prev) => new Set(prev).add(id));
    }
  };

  const handleMouseLeave = (id: string) => {
    if (!pinnedIds.has(id)) {
      setExpandedIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setItems([]);
    setPrescripcion('');
    setIndicaciones('');
    setError('');
  };

  const addItem = () => {
    if (!prescripcion.trim()) {
      setError('Ingresá la prescripción');
      return;
    }
    if (!indicaciones.trim()) {
      setError('Ingresá las indicaciones');
      return;
    }

    setItems([...items, { nombre: prescripcion.trim(), indicaciones: indicaciones.trim() }]);
    setPrescripcion('');
    setIndicaciones('');
    setError('');
  };

  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return setError('Agregue al menos un item');
    try {
      setIsSaving(true);
      setError('');
      await crearPrescripcion(items);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar prescripción');
    } finally {
      setIsSaving(false);
    }
  };

  const visible = prescripciones.slice(0, 3);

  return (
    <PanelFrame
      title="Prescripciones"
      description={
        prescripciones.length === 0
          ? undefined
          : `${prescripciones.length} ${prescripciones.length === 1 ? 'registro' : 'registros'}`
      }
      action={
        <PanelActionButton onClick={() => setShowModal(true)} title="Nueva prescripción">
          <PlusIcon className="h-4 w-4" />
        </PanelActionButton>
      }
      contentClassName="px-0 py-0"
    >
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <Spinner />
        </div>
      ) : loadError ? (
        <div className="text-danger px-5 py-4 text-sm">{loadError}</div>
      ) : prescripciones.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <BodyStrong as="p">Sin prescripciones</BodyStrong>
          <p className="muted mt-1">Usa el botón + para agregar la primera</p>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-100">
          {visible.map((p) => {
            const isExpanded = expandedIds.has(p.id) || pinnedIds.has(p.id);
            const isPinned = pinnedIds.has(p.id);
            const firstItem = p.items[0];
            const remainingItems = p.items.slice(1);

            return (
              <li
                key={p.id}
                onMouseEnter={() => handleMouseEnter(p.id)}
                onMouseLeave={() => handleMouseLeave(p.id)}
              >
                <button
                  onClick={() => toggleExpanded(p.id)}
                  className={`w-full px-3 py-1.5 text-left transition-all duration-200 hover:bg-[rgba(204,175,125,0.1)] ${
                    isPinned ? 'bg-[rgba(117,76,36,0.08)]' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="h-3 w-3 shrink-0 text-neutral-500" />
                    ) : (
                      <ChevronRight className="h-3 w-3 shrink-0 text-neutral-500" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-neutral-900">
                      {firstItem?.nombre || 'Sin items'}
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <span className="text-[10px] text-neutral-500">
                        {p.fecha ? formatFecha(p.fecha) : '—'}
                      </span>
                      <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-600">
                        {p.items.length}
                      </span>
                    </div>
                  </div>

                  {!isExpanded && remainingItems.length > 0 && (
                    <div className="pointer-events-none mt-0.5 ml-5">
                      <p className="truncate text-[10px] text-neutral-500">
                        {remainingItems.length === 1
                          ? `+ ${remainingItems[0].nombre}`
                          : `+${remainingItems.length} más`}
                      </p>
                    </div>
                  )}
                </button>

                {isExpanded && remainingItems.length > 0 && (
                  <div className="animate-in fade-in slide-in-from-top-1 bg-neutral-25 border-t border-neutral-100 px-3 py-1.5 duration-200">
                    <ul className="ml-5 space-y-0.5">
                      {remainingItems.map((item) => (
                        <li key={item.id} className="text-[11px]">
                          <span className="font-medium text-neutral-900">• {item.nombre}</span>
                          {item.indicaciones && (
                            <span className="text-neutral-600"> — {item.indicaciones}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
          <li className="bg-neutral-25 border-t border-neutral-100 px-3 py-1.5 text-center">
            <Link
              href="/prescripciones"
              className="text-brand-morena inline-flex items-center gap-1 text-[10px] font-medium transition-colors hover:underline"
            >
              Ver todas →
            </Link>
          </li>
        </ul>
      )}

      <Modal
        open={showModal}
        onClose={closeModal}
        title="Nueva prescripción"
        description="Agrega las prescripciones y sus indicaciones"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="flex-1 sm:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="prescripcion-form"
              variant="primary"
              isLoading={isSaving}
              disabled={items.length === 0}
              className="flex-1 sm:flex-none"
            >
              Guardar
            </Button>
          </>
        }
      >
        <form id="prescripcion-form" onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="alert-danger text-xs">{error}</div>}

          <div className="space-y-3">
            {/* ── PRESCRIPCIÓN + INDICACIONES + AGREGAR ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="flex-1">
                <Label htmlFor="prescripcion" required>
                  Prescripción
                </Label>
                <Input
                  id="prescripcion"
                  value={prescripcion}
                  onChange={(e) => setPrescripcion(e.target.value)}
                  placeholder="Ej: Vitamina C"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="indicaciones" required>
                  Indicaciones
                </Label>
                <Input
                  id="indicaciones"
                  value={indicaciones}
                  onChange={(e) => setIndicaciones(e.target.value)}
                  placeholder="Ej: Tomar en la mañana"
                  className="text-sm sm:text-base"
                />
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={addItem}
                className="w-full sm:w-auto"
              >
                Agregar
              </Button>
            </div>
          </div>

          {/* ── LISTA DE ITEMS ── */}
          <section>
            <p className="mb-2 overline">Items ({items.length})</p>
            {items.length === 0 ? (
              <p className="muted italic">Aún no agregaste items.</p>
            ) : (
              <ul className="divide-y divide-neutral-100 overflow-hidden rounded-md border border-neutral-200">
                {items.map((it, i) => (
                  <li key={i} className="flex items-start gap-3 px-3 py-3 sm:py-2">
                    <div className="min-w-0 flex-1">
                      <p className="body-strong truncate text-sm text-neutral-900 sm:text-base">
                        {it.nombre}
                      </p>
                      <p className="text-xs text-neutral-600">{it.indicaciones}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(i)}
                      className="hover:text-danger shrink-0 rounded-full p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100"
                      aria-label="Quitar"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </form>
      </Modal>
    </PanelFrame>
  );
}
