'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Badge, Spinner, SearchInput, Overline, Subtitle, BodyStrong } from '@/shared/ui';
import { PlusIcon } from '@/shared/icons';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { usePacientes, type Paciente } from '../hooks/usePacientes';
import { calcularEdad } from '../lib/paciente';

export function PacientesListView() {
  const { pacientes, isLoading, error } = usePacientes();
  const [query, setQuery] = useState('');
  const debounced = useDebounce(query, 200);

  const filtrados = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    if (!q) return pacientes;
    return pacientes.filter((p) => {
      const completo = `${p.nombre} ${p.apellido}`.toLowerCase();
      return (
        completo.includes(q) ||
        p.documento.toLowerCase().includes(q) ||
        p.telefono?.includes(q) ||
        (p.email?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [pacientes, debounced]);

  const tieneBusqueda = debounced.trim().length > 0;

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Overline>Directorio</Overline>
          <h1 className="title-page mt-1">Pacientes</h1>
          <Subtitle className="mt-0.5">Gestión de pacientes y fichas clínicas</Subtitle>
        </div>
        <Link href="/pacientes/nuevo" className="btn-primary-sm h-10 gap-2 px-4 shadow-xs">
          <PlusIcon className="h-4 w-4" />
          Nuevo paciente
        </Link>
      </header>

      {/* Toolbar */}
      <div className="mb-5 flex items-center gap-3">
        <SearchInput
          containerClassName="max-w-md flex-1"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onClear={() => setQuery('')}
          clearable
          placeholder="Buscar por nombre, documento o teléfono..."
        />
        <span className="muted tabular-nums">
          {isLoading
            ? '—'
            : `${filtrados.length} ${filtrados.length === 1 ? 'paciente' : 'pacientes'}`}
        </span>
      </div>

      {error && <div className="alert-danger mb-4">{error}</div>}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="surface-dashed px-6 py-16 text-center">
          <BodyStrong as="p">
            {tieneBusqueda ? 'Sin resultados' : 'Sin pacientes registrados'}
          </BodyStrong>
          <Subtitle className="muted mt-1">
            {tieneBusqueda ? (
              <>No hay coincidencias para “{debounced}”</>
            ) : (
              'Comienza creando el primer paciente'
            )}
          </Subtitle>
          {!tieneBusqueda && (
            <Link href="/pacientes/nuevo" className="btn-primary-sm mt-5 gap-1.5 px-4">
              Crear primer paciente
            </Link>
          )}
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="surface hidden lg:block">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-25 border-b border-neutral-200">
                  <Overline as="th" className="px-5 py-2.5 text-left">Paciente</Overline>
                  <Overline as="th" className="px-5 py-2.5 text-left">Documento</Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-left xl:table-cell">Edad</Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-left xl:table-cell">Teléfono</Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-left 2xl:table-cell">Estado</Overline>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtrados.map((p) => (
                  <PacienteRow key={p.id} paciente={p} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtrados.map((p) => (
              <PacienteCard key={p.id} paciente={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function PacienteRow({ paciente }: { paciente: Paciente }) {
  return (
    <tr className="hover:bg-neutral-25 group transition-colors">
      <td className="px-5 py-3">
        <Link
          href={`/pacientes/${paciente.id}/historia`}
          className="flex min-w-0 items-center gap-3"
        >
          <Avatar nombre={paciente.nombre} apellido={paciente.apellido} />
          <div className="min-w-0">
            <p className="body-strong group-hover:text-brand-morena truncate text-neutral-900 transition-colors">
              {paciente.nombre} {paciente.apellido}
            </p>
            {paciente.email && <p className="muted truncate text-xs">{paciente.email}</p>}
          </div>
        </Link>
      </td>
      <td className="px-5 py-3">
        <p className="text-sm tabular-nums text-neutral-800">{paciente.documento}</p>
      </td>
      <td className="hidden px-5 py-3 text-sm tabular-nums text-neutral-800 xl:table-cell">
        {calcularEdad(paciente.fechaNacimiento)}
      </td>
      <td className="hidden px-5 py-3 xl:table-cell">
        <p className="text-sm text-neutral-800">{paciente.telefono || '—'}</p>
      </td>
      <td className="hidden px-5 py-3 2xl:table-cell">
        <EstadoBadge estado={paciente.estado} />
      </td>
      <td className="px-5 py-3 text-right">
        <div className="inline-flex items-center gap-1 opacity-100 transition-opacity lg:opacity-0 lg:group-hover:opacity-100">
          <ActionLink href={`/pacientes/${paciente.id}/historia`} label="Historia" />
          <ActionLink href={`/pacientes/${paciente.id}`} label="Editar" subtle />
        </div>
      </td>
    </tr>
  );
}

function PacienteCard({ paciente }: { paciente: Paciente }) {
  return (
    <Link
      href={`/pacientes/${paciente.id}/historia`}
      className="surface block p-4 transition-colors hover:border-neutral-300"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar nombre={paciente.nombre} apellido={paciente.apellido} />
          <div className="min-w-0">
            <p className="body-strong truncate text-neutral-900">
              {paciente.nombre} {paciente.apellido}
            </p>
            <p className="muted truncate">
              {paciente.tipoDocumento} {paciente.documento}
            </p>
          </div>
        </div>
        <EstadoBadge estado={paciente.estado} />
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <Overline>Edad</Overline>
          <p className="mt-0.5 text-neutral-800 tabular-nums">
            {calcularEdad(paciente.fechaNacimiento)} años
          </p>
        </div>
        <div>
          <Overline>Teléfono</Overline>
          <p className="mt-0.5 text-neutral-800">{paciente.telefono || '—'}</p>
        </div>
      </div>
    </Link>
  );
}

function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  const initials = `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase();
  return (
    <div className="text-brand-morena flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(204,175,125,0.22)] text-xs font-semibold">
      {initials}
    </div>
  );
}

function EstadoBadge({ estado }: { estado: string }) {
  const activo = estado === 'ACTIVO';
  return (
    <Badge variant={activo ? 'success' : 'default'} dot>
      {activo ? 'Activo' : estado}
    </Badge>
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
