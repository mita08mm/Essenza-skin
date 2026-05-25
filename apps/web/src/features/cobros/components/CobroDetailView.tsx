'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/shared/layout/PageHeader';
import { alertError, Muted, Overline, ProgressBar } from '@/shared/ui';
import { api } from '@/shared/api';
import { formatFecha } from '@/shared/utils/date';
import { formatMonto } from '@/shared/utils/money';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
}

interface Cobro {
  id: string;
  fecha: string;
  total: number;
  paciente: Paciente;
  items: Array<{ id: string; nombre: string }>;
  pagos: Array<{ id: string; monto: number; fecha: string }>;
}

function buildCobroTitle(cobro: Cobro) {
  if (!cobro.items || cobro.items.length === 0) return 'Registro de cobro';
  if (cobro.items.length === 1) return cobro.items[0].nombre;
  return `${cobro.items[0].nombre} y ${cobro.items.length - 1} mas`;
}

export function CobroDetailView({ cobroId }: { cobroId: string }) {
  const [cobro, setCobro] = useState<Cobro | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.get<Cobro>(`/cobros/${cobroId}`);
        if (mounted) setCobro(data);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [cobroId]);

  if (isLoading) {
    return (
      <div className="subtitle flex min-h-[400px] items-center justify-center">
        Cargando cobro...
      </div>
    );
  }

  if (error && !cobro) return <div className={alertError}>{error}</div>;
  if (!cobro) return null;

  const abonado = cobro.pagos.reduce((sum, p) => sum + Number(p.monto), 0);
  const totalNum = Number(cobro.total);
  const pendiente = Math.max(totalNum - abonado, 0);
  const porcentajeAbonado = totalNum > 0 ? Math.min((abonado / totalNum) * 100, 100) : 0;

  return (
    <div className="max-w-4xl">
      <PageHeader
        overline="Cobros"
        title="Registro de cobro"
        subtitle={formatFecha(cobro.fecha)}
        backHref="/cobros"
      />

      {error && <div className={`mb-5 ${alertError}`}>{error}</div>}

      <div className="space-y-5">
        <section className="surface p-6">
          <Overline className="mb-3">Paciente</Overline>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Muted>Nombre</Muted>
              <p className="mt-0.5 text-base font-medium text-neutral-900">
                {cobro.paciente.nombre} {cobro.paciente.apellido}
              </p>
            </div>
            <div>
              <Muted>Documento</Muted>
              <p className="mt-0.5 text-base font-medium text-neutral-900">
                {cobro.paciente.tipoDocumento}: {cobro.paciente.documento}
              </p>
            </div>
          </div>
        </section>

        <section className="surface p-6">
          <Overline className="mb-3">Detalle</Overline>
          <div>
            <Muted>Descripción</Muted>
            <p className="mt-0.5 text-base font-medium text-neutral-900">
              {buildCobroTitle(cobro)}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            <MontoCard label="Monto total" value={formatMonto(totalNum)} />
            <MontoCard label="Abonado" value={formatMonto(abonado)} tone="success" />
            <MontoCard
              label="Pendiente"
              value={formatMonto(pendiente)}
              tone={pendiente > 0 ? 'danger' : 'muted'}
            />
          </div>

          <div className="mt-4">
            <ProgressBar value={porcentajeAbonado} label="Progreso de cobro" />
          </div>
        </section>

        {cobro.pagos.length > 0 && (
          <section className="surface overflow-hidden">
            <div className="border-b border-neutral-100 px-6 py-4">
              <Overline>Historial de pagos</Overline>
            </div>
            <table className="w-full">
              <thead className="border-b border-neutral-100 bg-neutral-50">
                <tr>
                  <Overline as="th" className="px-6 py-2.5 text-left">
                    Fecha
                  </Overline>
                  <Overline as="th" className="px-6 py-2.5 text-right">
                    Monto
                  </Overline>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {cobro.pagos.map((p) => (
                  <tr key={p.id}>
                    <td className="body px-6 py-3">{formatFecha(p.fecha)}</td>
                    <td className="body-strong px-6 py-3 text-right text-neutral-900 tabular-nums">
                      {formatMonto(Number(p.monto))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}
      </div>
    </div>
  );
}

function MontoCard({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: string;
  tone?: 'default' | 'success' | 'danger' | 'muted';
}) {
  const styles = {
    default: {
      wrap: 'bg-neutral-50 border-neutral-100',
      labelClr: 'text-neutral-500',
      valueClr: 'text-neutral-900',
    },
    success: {
      wrap: 'bg-success-bg border-[rgba(58,138,79,0.18)]',
      labelClr: 'text-success',
      valueClr: 'text-success',
    },
    danger: {
      wrap: 'bg-danger-bg border-[rgba(181,58,58,0.18)]',
      labelClr: 'text-danger',
      valueClr: 'text-danger',
    },
    muted: {
      wrap: 'bg-neutral-50 border-neutral-100',
      labelClr: 'text-neutral-500',
      valueClr: 'text-neutral-700',
    },
  }[tone];
  return (
    <div className={`rounded-md border px-4 py-3 ${styles.wrap}`}>
      <Overline className={styles.labelClr}>{label}</Overline>
      <p className={`font-heading mt-1 text-xl font-medium tabular-nums ${styles.valueClr}`}>
        {value}
      </p>
    </div>
  );
}
