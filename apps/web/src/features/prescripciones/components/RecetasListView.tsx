'use client';

import { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Spinner,
  alertError,
  EmptyState,
  SearchInput,
  Subtitle,
  Overline,
  LinkButton,
  Modal,
  Button,
} from '@/shared/ui';
import { PlusIcon } from '@/shared/icons';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatFecha } from '@/shared/utils/date';
import { usePrescripciones, type Prescripcion, recetasKeys } from '../hooks/usePrescripciones';
import { api, ApiError } from '@/shared/api';

export function RecetasListView() {
  const queryClient = useQueryClient();
  const { prescripciones, isLoading, error } = usePrescripciones();
  const [query, setQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const debounced = useDebounce(query, 200);

  const filtradas = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return prescripciones;
    return prescripciones.filter((p) => {
      const nombre = `${p.paciente.nombre} ${p.paciente.apellido}`.toLowerCase();
      return nombre.includes(q) || p.nombre.toLowerCase().includes(q);
    });
  }, [prescripciones, debounced]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setIsDeleting(true);
      setDeleteError('');
      await api.delete(`/prescripciones/${deleteId}`);
      setDeleteId(null);
      // Invalidar la query para refrescar la lista
      await queryClient.invalidateQueries({ queryKey: recetasKeys.list() });
    } catch (err) {
      setDeleteError(
        err instanceof ApiError ? err.message : 'Error al eliminar prescripción'
      );
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Overline>Tratamientos</Overline>
          <h1 className="title-page mt-1">Prescripciones</h1>
          <Subtitle className="mt-0.5">Listado general de prescripciones registradas</Subtitle>
        </div>
        <LinkButton
          href="/prescripciones/nuevo"
          variant="primary"
          size="sm"
          className="h-10 gap-2 px-4 shadow-xs"
        >
          <PlusIcon className="h-4 w-4" />
          Nueva prescripción
        </LinkButton>
      </header>

      <div className="mb-5 flex items-center gap-3">
        <SearchInput
          containerClassName="flex-1 max-w-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por paciente o prescripción..."
        />
        <span className="muted ml-auto tabular-nums">
          {isLoading
            ? '—'
            : `${filtradas.length} ${filtradas.length === 1 ? 'prescripción' : 'prescripciones'}`}
        </span>
      </div>

      {error && <div className={`mb-4 ${alertError}`}>{error}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtradas.length === 0 ? (
        <div className="surface-dashed">
          <EmptyState
            title={debounced.trim() ? 'Sin resultados' : 'Sin prescripciones registradas'}
            description={
              debounced.trim()
                ? 'Ajusta la búsqueda para ver más resultados'
                : 'Crea la primera prescripción para comenzar'
            }
            action={
              !debounced.trim() ? (
                <LinkButton href="/prescripciones/nuevo" variant="primary" size="sm">
                  Crear primera prescripción
                </LinkButton>
              ) : undefined
            }
          />
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="surface hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-25 border-b border-neutral-200">
                  <Overline as="th" className="px-5 py-2.5 text-left">Fecha</Overline>
                  <Overline as="th" className="px-5 py-2.5 text-left">Paciente</Overline>
                  <Overline as="th" className="px-5 py-2.5 text-left">Prescripción</Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-left xl:table-cell">Indicaciones</Overline>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtradas.map((p) => (
                  <PrescripcionRow 
                    key={p.id} 
                    prescripcion={p} 
                    onDelete={() => setDeleteId(p.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtradas.map((p) => (
              <CardItem key={p.id} prescripcion={p} />
            ))}
          </div>
        </>
      )}

      {/* Modal de confirmación para eliminar */}
      <Modal
        open={deleteId !== null}
        onClose={() => {
          setDeleteId(null);
          setDeleteError('');
        }}
        title="Eliminar prescripción"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-700">
            ¿Estás seguro de que deseas eliminar esta prescripción? Esta acción no se puede deshacer.
          </p>
          {deleteError && <div className={alertError}>{deleteError}</div>}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDeleteId(null);
                setDeleteError('');
              }}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="danger"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? 'Eliminando...' : 'Eliminar'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PrescripcionRow({ 
  prescripcion,
  onDelete 
}: { 
  prescripcion: Prescripcion;
  onDelete: () => void;
}) {
  const indicaciones = prescripcion.items
    .map((i) => i.indicaciones)
    .filter(Boolean)
    .join(' · ');

  return (
    <tr className="hover:bg-neutral-25 group transition-colors">
      <td className="px-5 py-3 whitespace-nowrap text-neutral-700 tabular-nums">
        {formatFecha(prescripcion.fecha)}
      </td>
      <td className="px-5 py-3 font-medium text-neutral-900">
        {prescripcion.paciente.nombre} {prescripcion.paciente.apellido}
      </td>
      <td className="px-5 py-3">
        <p className="font-medium text-neutral-800">{prescripcion.nombre}</p>
        <p className="muted mt-0.5 text-xs">
          {prescripcion.items.length} item{prescripcion.items.length === 1 ? '' : 's'}
        </p>
      </td>
      <td className="hidden px-5 py-3 xl:table-cell">
        <span className="inline-block max-w-md truncate text-sm text-neutral-600">
          {indicaciones || <span className="text-neutral-400 italic">Sin indicaciones</span>}
        </span>
      </td>
      <td className="px-5 py-3 text-right">
        <div className="inline-flex items-center gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
          <ActionLink href={`/prescripciones/${prescripcion.id}`} label="Ver" />
          <ActionLink href={`/prescripciones/${prescripcion.id}/editar`} label="Editar" />
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="inline-flex h-7 items-center rounded-md px-2.5 text-xs font-medium text-danger transition-colors hover:bg-danger/10"
          >
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
}

function CardItem({ prescripcion }: { prescripcion: Prescripcion }) {
  return (
    <Link
      href={`/prescripciones/${prescripcion.id}`}
      className="surface block p-4 transition-colors hover:border-neutral-300"
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="body-strong truncate text-neutral-900">{prescripcion.nombre}</p>
          <p className="muted mt-0.5">
            {prescripcion.paciente.nombre} {prescripcion.paciente.apellido} ·{' '}
            {formatFecha(prescripcion.fecha)}
          </p>
        </div>
      </div>
      <p className="border-t border-neutral-100 pt-2 text-xs text-neutral-600">
        {prescripcion.items.length} item{prescripcion.items.length === 1 ? '' : 's'}
      </p>
    </Link>
  );
}

function ActionLink({ href, label, subtle }: { href: string; label: string; subtle?: boolean }) {
  return (
    <Link
      href={href}
      onClick={(e) => e.stopPropagation()}
      className={`inline-flex h-7 items-center rounded-md px-2.5 text-xs font-medium transition-colors ${
        subtle
          ? 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
          : 'text-brand-morena hover:bg-[rgba(204,175,125,0.18)]'
      }`}
    >
      {label}
    </Link>
  );
}
