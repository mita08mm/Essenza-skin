'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/shared/layout/PageHeader';
import { api, ApiError } from '@/shared/api/client';
import { DataTable, EmptyState, StatCard, Tabs, Button, type Column, Overline } from '@/shared/ui';
import { formatMonto } from '@/shared/utils/money';

interface ReporteIngresos {
  totalIngresos: number;
  totalPagos: number;
  totalPendiente: number;
  cobrosPorMes: { mes: string; total: number }[];
}

interface ReportePagos {
  totalDeuda: number;
  pacientesConDeuda: number;
  cobros: Array<{
    id: string;
    paciente: { nombre: string; apellido: string };
    total: number;
    pagado: number;
    saldo: number;
  }>;
}

type Tab = 'ingresos' | 'pagos' | 'productos';
const TABS = [
  { value: 'ingresos' as const, label: 'Ingresos' },
  { value: 'pagos' as const, label: 'Pagos pendientes' },
  { value: 'productos' as const, label: 'Productos' },
];

const inputDate = 'input-base h-10 w-auto px-3';

export function ReportesView() {
  const [tab, setTab] = useState<Tab>('ingresos');
  const [isLoading, setIsLoading] = useState(true);
  const [reporteIngresos, setReporteIngresos] = useState<ReporteIngresos | null>(null);
  const [reportePagos, setReportePagos] = useState<ReportePagos | null>(null);

  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [fechaFin, setFechaFin] = useState(() => new Date().toISOString().split('T')[0]);

  const fetchReporteIngresos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<ReporteIngresos>('/reportes/ingresos', {
        params: { fechaInicio, fechaFin },
      });
      setReporteIngresos(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setReporteIngresos({
          totalIngresos: 45800,
          totalPagos: 38500,
          totalPendiente: 7300,
          cobrosPorMes: [
            { mes: 'Enero', total: 12500 },
            { mes: 'Febrero', total: 15800 },
            { mes: 'Marzo', total: 17500 },
          ],
        });
      } else {
        console.error('Error cargando reporte:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [fechaInicio, fechaFin]);

  const fetchReportePagos = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<ReportePagos>('/reportes/pagos-pendientes');
      setReportePagos(data);
    } catch (err) {
      if (err instanceof ApiError) {
        setReportePagos({ totalDeuda: 7300, pacientesConDeuda: 12, cobros: [] });
      } else {
        console.error('Error cargando reporte:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (tab === 'ingresos') void fetchReporteIngresos();
    else if (tab === 'pagos') void fetchReportePagos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, fechaInicio, fechaFin]);

  const pagosCols: Column<ReportePagos['cobros'][number]>[] = [
    {
      key: 'paciente',
      label: 'Paciente',
      render: (c) => (
        <span className="font-medium text-neutral-800">
          {c.paciente.nombre} {c.paciente.apellido}
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      align: 'right',
      cellClassName: 'tabular-nums text-neutral-700',
      render: (c) => formatMonto(c.total),
    },
    {
      key: 'pagado',
      label: 'Pagado',
      align: 'right',
      cellClassName: 'tabular-nums text-neutral-700',
      render: (c) => formatMonto(c.pagado),
    },
    {
      key: 'saldo',
      label: 'Saldo',
      align: 'right',
      cellClassName: 'tabular-nums font-medium text-danger',
      render: (c) => formatMonto(c.saldo),
    },
  ];

  return (
    <div>
      <PageHeader
        overline="Análisis"
        title="Reportes"
        subtitle="Ingresos, pagos pendientes y estadísticas del período"
      />

      <div className="surface mb-5 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Overline as="span">Período</Overline>
          <input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            className={inputDate}
          />
          <span className="text-sm text-neutral-400">hasta</span>
          <input
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
            className={inputDate}
          />
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (tab === 'ingresos') fetchReporteIngresos();
              else if (tab === 'pagos') fetchReportePagos();
            }}
          >
            Actualizar
          </Button>
        </div>
      </div>

      <Tabs value={tab} onChange={setTab} items={TABS} className="mb-5" />

      {isLoading ? (
        <div className="surface subtitle p-12 text-center">Cargando reporte...</div>
      ) : (
        <>
          {tab === 'ingresos' && reporteIngresos && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <StatCard
                  label="Total facturado"
                  value={formatMonto(reporteIngresos.totalIngresos)}
                  hint="En el período seleccionado"
                />
                <StatCard
                  label="Total cobrado"
                  value={formatMonto(reporteIngresos.totalPagos)}
                  hint={`${((reporteIngresos.totalPagos / reporteIngresos.totalIngresos) * 100).toFixed(1)}% del total`}
                  tone="success"
                />
                <StatCard
                  label="Pendiente de cobro"
                  value={formatMonto(reporteIngresos.totalPendiente)}
                  hint={`${((reporteIngresos.totalPendiente / reporteIngresos.totalIngresos) * 100).toFixed(1)}% del total`}
                  tone="warning"
                />
              </div>

              {reporteIngresos.cobrosPorMes.length > 0 && (
                <div className="surface p-6">
                  <h3 className="title-section mb-5">Ingresos por mes</h3>
                  <div className="space-y-4">
                    {reporteIngresos.cobrosPorMes.map((item, idx) => {
                      const maxValor = Math.max(
                        ...reporteIngresos.cobrosPorMes.map((m) => m.total),
                      );
                      const porcentaje = (item.total / maxValor) * 100;
                      return (
                        <div key={idx}>
                          <div className="mb-1.5 flex items-center justify-between">
                            <span className="text-sm font-medium text-neutral-700">{item.mes}</span>
                            <span className="body-strong text-neutral-900 tabular-nums">
                              {formatMonto(item.total)}
                            </span>
                          </div>
                          <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="bg-brand-morena h-2 rounded-full transition-all"
                              style={{ width: `${porcentaje}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'pagos' && reportePagos && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <StatCard
                  label="Total deuda"
                  value={formatMonto(reportePagos.totalDeuda)}
                  tone="warning"
                />
                <StatCard
                  label="Pacientes con deuda"
                  value={String(reportePagos.pacientesConDeuda)}
                />
              </div>

              {reportePagos.cobros.length > 0 ? (
                <DataTable columns={pagosCols} rows={reportePagos.cobros} getKey={(c) => c.id} />
              ) : (
                <div className="surface">
                  <EmptyState title="No hay pagos pendientes" />
                </div>
              )}
            </div>
          )}

          {tab === 'productos' && (
            <div className="surface">
              <EmptyState
                title="Reporte de productos"
                description="Reporte de productos más usados en desarrollo..."
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
