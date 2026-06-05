'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Badge,
  Spinner,
  alertError,
  EmptyState,
  StatCard,
  SearchInput,
  PlusIcon,
  Subtitle,
  Muted,
  Overline,
  LinkButton,
} from '@/shared/ui';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { formatFecha } from '@/shared/utils/date';
import { formatMonto } from '@/shared/utils/money';
import { useCobros, type CobroResumen } from '../hooks/useCobros';

type Filtro = 'todos' | 'pendientes' | 'pagados';
type CobroConTotales = CobroResumen & { abonado: number; pendiente: number };

function buildTitle(cobro: CobroResumen): string {
  if (!cobro.items || cobro.items.length === 0) return 'Registro de cobro';
  if (cobro.items.length === 1) return cobro.items[0].nombre;
  return `${cobro.items[0].nombre} +${cobro.items.length - 1}`;
}

export function CobrosListView() {
  const { cobros, isLoading, error } = useCobros();
  const [query, setQuery] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('todos');
  const debounced = useDebounce(query, 200);

  const cobrosConTotales = useMemo<CobroConTotales[]>(
    () =>
      cobros.map((c) => {
        const abonado = (c.pagos || []).reduce((sum, p) => sum + Number(p.monto), 0);
        const pendiente = Math.max(Number(c.total) - abonado, 0);
        return { ...c, abonado, pendiente };
      }),
    [cobros],
  );

  const filtrados = useMemo(() => {
    const q = debounced.trim().toLowerCase();
    return cobrosConTotales.filter((c) => {
      if (filtro === 'pendientes' && c.pendiente <= 0) return false;
      if (filtro === 'pagados' && c.pendiente > 0) return false;
      if (!q) return true;
      const nombre = `${c.paciente.nombre} ${c.paciente.apellido}`.toLowerCase();
      return nombre.includes(q) || c.paciente.documento.toLowerCase().includes(q);
    });
  }, [cobrosConTotales, debounced, filtro]);

  const resumen = useMemo(
    () =>
      cobrosConTotales.reduce(
        (acc, c) => ({
          total: acc.total + Number(c.total),
          abonado: acc.abonado + c.abonado,
          pendiente: acc.pendiente + c.pendiente,
        }),
        { total: 0, abonado: 0, pendiente: 0 },
      ),
    [cobrosConTotales],
  );

  return (
    <div className="max-w-6xl">
      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Overline>Finanzas</Overline>
          <h1 className="title-page mt-1">Cobros</h1>
          <Subtitle className="mt-0.5">Registro de cobros y seguimiento de pagos</Subtitle>
        </div>
        <LinkButton
          href="/cobros/nuevo"
          variant="primary"
          size="sm"
          className="h-10 gap-2 px-4 shadow-xs"
        >
          <PlusIcon className="h-4 w-4" />
          Nuevo cobro
        </LinkButton>
      </header>

      {!isLoading && cobros.length > 0 && (
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard size="sm" label="Facturado" value={formatMonto(resumen.total)} />
          <StatCard size="sm" label="Cobrado" value={formatMonto(resumen.abonado)} tone="success" />
          <StatCard
            size="sm"
            label="Pendiente"
            value={formatMonto(resumen.pendiente)}
            tone="warning"
          />
        </div>
      )}

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchInput
          containerClassName="flex-1 min-w-[220px] max-w-md"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar paciente o documento..."
        />
        <div className="inline-flex rounded-md border border-neutral-300 bg-white p-0.5">
          {(['todos', 'pendientes', 'pagados'] as Filtro[]).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`h-8 rounded px-3 text-xs font-medium capitalize transition-colors ${
                filtro === f
                  ? 'bg-neutral-100 text-neutral-900'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <span className="muted ml-auto tabular-nums">
          {isLoading
            ? '—'
            : `${filtrados.length} ${filtrados.length === 1 ? 'registro' : 'registros'}`}
        </span>
      </div>

      {error && <div className={`mb-4 ${alertError}`}>{error}</div>}

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Spinner size="lg" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="surface-dashed">
          <EmptyState
            title={
              debounced.trim() || filtro !== 'todos' ? 'Sin resultados' : 'Sin registros de cobro'
            }
            description={
              debounced.trim() || filtro !== 'todos'
                ? 'Ajusta el filtro o la búsqueda para ver más resultados'
                : 'Crea tu primer registro para comenzar a llevar cuentas'
            }
            action={
              !debounced.trim() && filtro === 'todos' ? (
                <LinkButton href="/cobros/nuevo" variant="primary" size="sm">
                  Crear primer cobro
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
                  <Overline as="th" className="px-5 py-2.5 text-left">
                    Fecha
                  </Overline>
                  <Overline as="th" className="px-5 py-2.5 text-left">
                    Paciente
                  </Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-left xl:table-cell">
                    Descripción
                  </Overline>
                  <Overline as="th" className="px-5 py-2.5 text-right">
                    Total
                  </Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-right 2xl:table-cell">
                    Abonado
                  </Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-right 2xl:table-cell">
                    Pendiente
                  </Overline>
                  <Overline as="th" className="hidden px-5 py-2.5 text-left xl:table-cell">
                    Estado
                  </Overline>
                  <th className="px-5 py-2.5"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filtrados.map((c) => (
                  <CobroRow key={c.id} cobro={c} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 lg:hidden">
            {filtrados.map((c) => (
              <CobroCard key={c.id} cobro={c} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function CobroRow({ cobro }: { cobro: CobroConTotales }) {
  return (
    <tr className="hover:bg-neutral-25 group transition-colors">
      <td className="px-5 py-3 whitespace-nowrap text-neutral-700 tabular-nums">
        {formatFecha(cobro.fecha)}
      </td>
      <td className="px-5 py-3">
        <p className="font-medium text-neutral-900">
          {cobro.paciente.nombre} {cobro.paciente.apellido}
        </p>
        <Muted className="text-xs xl:hidden">{buildTitle(cobro)}</Muted>
      </td>
      <td className="hidden px-5 py-3 text-neutral-700 xl:table-cell">{buildTitle(cobro)}</td>
      <td className="px-5 py-3 text-right font-medium text-neutral-800 tabular-nums">
        {formatMonto(Number(cobro.total))}
      </td>
      <td className="hidden px-5 py-3 text-right text-neutral-700 tabular-nums 2xl:table-cell">
        {formatMonto(cobro.abonado)}
      </td>
      <td className="hidden px-5 py-3 text-right 2xl:table-cell">
        <span
          className={`font-medium tabular-nums ${cobro.pendiente <= 0 ? 'text-neutral-400' : 'text-danger'}`}
        >
          {formatMonto(cobro.pendiente)}
        </span>
      </td>
      <td className="hidden px-5 py-3 xl:table-cell">
        <Badge variant={cobro.pendiente <= 0 ? 'success' : 'warning'} dot>
          {cobro.pendiente <= 0 ? 'Pagado' : 'Pendiente'}
        </Badge>
      </td>
      <td className="px-5 py-3 text-right">
        <Link
          href={`/cobros/${cobro.id}`}
          className="text-brand-morena inline-flex h-7 items-center rounded-md px-2.5 text-xs font-medium opacity-100 transition-colors hover:bg-[rgba(204,175,125,0.18)] lg:opacity-0 lg:group-hover:opacity-100"
        >
          Ver
        </Link>
      </td>
    </tr>
  );
}

function CobroCard({ cobro }: { cobro: CobroConTotales }) {
  const pagado = cobro.pendiente <= 0;
  return (
    <Link
      href={`/cobros/${cobro.id}`}
      className="surface block p-4 transition-colors hover:border-neutral-300"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="body-strong truncate text-neutral-900">
            {cobro.paciente.nombre} {cobro.paciente.apellido}
          </p>
          <p className="muted mt-0.5">
            {formatFecha(cobro.fecha)} · {buildTitle(cobro)}
          </p>
        </div>
        <Badge variant={pagado ? 'success' : 'warning'} dot>
          {pagado ? 'Pagado' : 'Pendiente'}
        </Badge>
      </div>
      <div className="grid grid-cols-3 gap-2 border-t border-neutral-100 pt-3 text-xs">
        <Stat label="Total" value={formatMonto(Number(cobro.total))} />
        <Stat label="Abonado" value={formatMonto(cobro.abonado)} />
        <Stat
          label="Pendiente"
          value={formatMonto(cobro.pendiente)}
          tone={pagado ? 'muted' : 'danger'}
        />
      </div>
    </Link>
  );
}

function Stat({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'muted' | 'danger';
}) {
  const color =
    tone === 'danger' ? 'text-danger' : tone === 'muted' ? 'text-neutral-400' : 'text-neutral-800';
  return (
    <div>
      <Overline>{label}</Overline>
      <p className={`mt-0.5 font-medium tabular-nums ${color}`}>{value}</p>
    </div>
  );
}
