'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/shared/layout/PageHeader';
import { alertError, Muted, Overline, ProgressBar, Button, Input, Label, Modal } from '@/shared/ui';
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
  notas?: string;
  fechaRecordatorio?: string;
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
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [monto, setMonto] = useState('');
  const [isSavingPago, setIsSavingPago] = useState(false);
  const [pagoError, setPagoError] = useState('');
  const [editNotas, setEditNotas] = useState(false);
  const [notas, setNotas] = useState('');
  const [fechaRecordatorio, setFechaRecordatorio] = useState('');
  const [isSavingNotas, setIsSavingNotas] = useState(false);
  const [notasError, setNotasError] = useState('');

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await api.get<Cobro>(`/cobros/${cobroId}`);
        if (mounted) {
          setCobro(data);
          setNotas(data.notas || '');
          setFechaRecordatorio(data.fechaRecordatorio ? data.fechaRecordatorio.split('T')[0] : '');
        }
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

  const handleRegistrarPago = async (e: React.FormEvent) => {
    e.preventDefault();
    const montoNum = Number(monto);
    if (isNaN(montoNum) || montoNum <= 0) {
      setPagoError('El monto debe ser mayor a 0');
      return;
    }
    if (montoNum > pendiente) {
      setPagoError(`El monto no puede superar el pendiente (${formatMonto(pendiente)})`);
      return;
    }

    try {
      setIsSavingPago(true);
      setPagoError('');
      await api.post(`/cobros/${cobroId}/pago`, {
        monto: montoNum,
        metodoPago: 'EFECTIVO',
        notas: 'Pago registrado desde detalle de cobro',
      });
      // Recargar cobro
      const data = await api.get<Cobro>(`/cobros/${cobroId}`);
      setCobro(data);
      setShowPagoModal(false);
      setMonto('');
    } catch (err) {
      setPagoError(err instanceof Error ? err.message : 'Error al registrar pago');
    } finally {
      setIsSavingPago(false);
    }
  };

  const handleGuardarNotas = async () => {
    try {
      setIsSavingNotas(true);
      setNotasError('');
      await api.patch(`/cobros/${cobroId}`, {
        notas: notas.trim() || null,
        fechaRecordatorio: fechaRecordatorio ? new Date(fechaRecordatorio).toISOString() : null,
      });
      const data = await api.get<Cobro>(`/cobros/${cobroId}`);
      setCobro(data);
      setEditNotas(false);
    } catch (err) {
      setNotasError(err instanceof Error ? err.message : 'Error al guardar notas');
    } finally {
      setIsSavingNotas(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <PageHeader
        overline="Cobros"
        title="Registro de cobro"
        subtitle={formatFecha(cobro.fecha)}
        backHref={`/pacientes/${cobro.paciente.id}/historia`}
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

        <section className="surface p-6">
          <div className="mb-3 flex items-center justify-between">
            <Overline>Notas y recordatorio</Overline>
            {!editNotas && (
              <Button variant="outline" size="sm" onClick={() => setEditNotas(true)}>
                {cobro.notas || cobro.fechaRecordatorio ? 'Editar' : 'Agregar'}
              </Button>
            )}
          </div>
          
          {editNotas ? (
            <div className="space-y-4">
              {notasError && <div className={alertError}>{notasError}</div>}
              <div>
                <Label htmlFor="notas">Notas</Label>
                <textarea
                  id="notas"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-brand-morena focus:outline-none focus:ring-1 focus:ring-brand-morena"
                  rows={3}
                  value={notas}
                  onChange={(e) => setNotas(e.target.value)}
                  placeholder="Ej: Recordar cobrar la próxima semana, acordamos pago en 2 partes..."
                />
              </div>
              <div>
                <Label htmlFor="fechaRecordatorio">Fecha de recordatorio</Label>
                <Input
                  id="fechaRecordatorio"
                  type="date"
                  value={fechaRecordatorio}
                  onChange={(e) => setFechaRecordatorio(e.target.value)}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditNotas(false);
                    setNotas(cobro.notas || '');
                    setFechaRecordatorio(cobro.fechaRecordatorio ? cobro.fechaRecordatorio.split('T')[0] : '');
                    setNotasError('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGuardarNotas}
                  isLoading={isSavingNotas}
                >
                  Guardar
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {cobro.notas ? (
                <div>
                  <Muted>Notas</Muted>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-neutral-700">{cobro.notas}</p>
                </div>
              ) : null}
              {cobro.fechaRecordatorio ? (
                <div>
                  <Muted>Recordar cobrar el</Muted>
                  <p className="mt-1 text-sm font-medium text-neutral-900">{formatFecha(cobro.fechaRecordatorio)}</p>
                </div>
              ) : null}
              {!cobro.notas && !cobro.fechaRecordatorio && (
                <Muted>Sin notas ni recordatorios</Muted>
              )}
            </div>
          )}
        </section>

        <section className="surface overflow-hidden">
          <div className="border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
            <Overline>Historial de pagos</Overline>
            {pendiente > 0 && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowPagoModal(true)}
              >
                Registrar pago
              </Button>
            )}
          </div>
          {cobro.pagos.length > 0 ? (
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
          ) : (
            <div className="px-6 py-8 text-center">
              <Muted>Sin pagos registrados</Muted>
            </div>
          )}
        </section>
      </div>

      <Modal
        open={showPagoModal}
        onClose={() => {
          setShowPagoModal(false);
          setMonto('');
          setPagoError('');
        }}
        title="Registrar pago"
        description={`Pendiente de cobro: ${formatMonto(pendiente)}`}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setShowPagoModal(false);
                setMonto('');
                setPagoError('');
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="pago-form"
              variant="primary"
              isLoading={isSavingPago}
            >
              Registrar
            </Button>
          </>
        }
      >
        <form id="pago-form" onSubmit={handleRegistrarPago} className="space-y-4">
          {pagoError && <div className={alertError}>{pagoError}</div>}
          <div>
            <Label htmlFor="monto">Monto (Bs.)</Label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              min="0.01"
              max={pendiente}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              autoFocus
            />
          </div>
        </form>
      </Modal>
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
