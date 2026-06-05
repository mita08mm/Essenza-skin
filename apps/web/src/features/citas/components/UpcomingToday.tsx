'use client';

import { useState, type ReactNode } from 'react';
import { api } from '@/shared/api';
import EditIcon from '@/shared/icons/EditIcon';
import TrashIcon from '@/shared/icons/TrashIcon';
import {
  Badge,
  BottomSheet,
  Button,
  CalendarIcon,
  CardTitle,
  CloseIcon,
  LinkButton,
  Muted,
  Subtitle,
} from '@/shared/ui';
import { getCitaEstado } from '@/features/citas/lib/estado';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  telefono: string;
  email?: string;
}

interface Cita {
  id: string;
  pacienteId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: string;
  notas?: string;
  paciente: Paciente;
}

interface UpcomingTodayProps {
  citas: Cita[];
  onCitaEliminada: (id: string) => void;
  onCitaActualizada: () => void;
}

const MESES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];
const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

function getMotivoIcon(motivo: string): string {
  const l = motivo.toLowerCase();
  if (l.includes('consulta')) return '🩺';
  if (l.includes('control')) return '📋';
  if (l.includes('lab')) return '🧪';
  if (l.includes('biopsia')) return '✂️';
  if (l.includes('derm')) return '🔬';
  if (l.includes('odont')) return '🦷';
  return '📅';
}

function formatHora(hora: string): string {
  if (!hora) return '';
  const [h, m] = hora.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function parseFecha(fechaStr: string): Date {
  const [y, m, d] = fechaStr.split('T')[0].split('-').map(Number);
  return new Date(y, m - 1, d);
}

function labelFecha(fechaStr: string): string {
  const hoy = dateKey(new Date());
  const manana = dateKey(new Date(Date.now() + 86400000));
  const key = fechaStr.split('T')[0];
  if (key === hoy) return 'Hoy';
  if (key === manana) return 'Mañana';
  const d = parseFecha(fechaStr);
  return `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`;
}

/** Fila “Etiqueta · valor” usada dentro del detalle de la cita. */
function DetailRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-neutral-500">{label}</span>
      <span className="text-brand-morena font-medium">{children}</span>
    </div>
  );
}

/** Botón “×” de cierre reutilizable para los sheets. */
function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
      aria-label="Cerrar"
    >
      <CloseIcon className="h-4 w-4" />
    </button>
  );
}

export default function UpcomingToday({ citas, onCitaEliminada }: UpcomingTodayProps) {
  const [expandido, setExpandido] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState<Cita | null>(null);
  const [modalTodas, setModalTodas] = useState(false);
  const [confirmandoEliminar, setConfirmandoEliminar] = useState(false);
  const [eliminando, setEliminando] = useState(false);
  const [errorEliminar, setErrorEliminar] = useState('');

  const hoyKey = dateKey(new Date());

  const citasHoy = citas
    .filter((c) => c.fecha.split('T')[0] === hoyKey && c.estado !== 'CANCELADA')
    .sort((a, b) => a.horaInicio.localeCompare(b.horaInicio));

  const citasPendientes = citasHoy.filter(
    (c) => c.estado === 'PROGRAMADA' || c.estado === 'CONFIRMADA',
  );
  const MAX_VISIBLE = 3;
  const citasVisibles = expandido ? citasHoy : citasHoy.slice(0, MAX_VISIBLE);
  const hayMas = citasHoy.length > MAX_VISIBLE;

  const citasFuturas = citas
    .filter((c) => c.fecha.split('T')[0] >= hoyKey)
    .sort((a, b) => {
      const fechaDiff = a.fecha.localeCompare(b.fecha);
      return fechaDiff !== 0 ? fechaDiff : a.horaInicio.localeCompare(b.horaInicio);
    });

  const agrupadasPorDia = citasFuturas.reduce<Record<string, Cita[]>>((acc, cita) => {
    const key = cita.fecha.split('T')[0];
    if (!acc[key]) acc[key] = [];
    acc[key].push(cita);
    return acc;
  }, {});

  const diasOrdenados = Object.keys(agrupadasPorDia).sort();

  const cerrarDetalle = () => {
    setCitaSeleccionada(null);
    setConfirmandoEliminar(false);
    setErrorEliminar('');
  };

  const handleEliminar = async () => {
    if (!citaSeleccionada) return;
    setEliminando(true);
    setErrorEliminar('');
    try {
      await api.delete(`/citas/${citaSeleccionada.id}`);
      onCitaEliminada(citaSeleccionada.id);
      cerrarDetalle();
    } catch (err) {
      setErrorEliminar(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setEliminando(false);
    }
  };

  return (
    <>
      {/* ── WIDGET PRINCIPAL ── */}
      <div className="bg-neutral-25 w-full overflow-hidden rounded-2xl border border-neutral-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-4 sm:px-5">
          <div>
            <CardTitle className="font-serif">Citas de Hoy</CardTitle>
            <Muted>
              {new Date().toLocaleDateString('es-BO', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </Muted>
          </div>
          {citasPendientes.length > 0 ? (
            <Badge variant="brand">{citasPendientes.length} pendiente</Badge>
          ) : citasHoy.length > 0 ? (
            <Badge variant="success">✓ Todo listo</Badge>
          ) : null}
        </div>

        {/* Citas de hoy */}
        <div className="divide-y divide-neutral-100">
          {citasHoy.length === 0 ? (
            <div className="px-5 py-10 text-center">
              <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100">
                <CalendarIcon className="h-6 w-6 text-neutral-400" />
              </div>
              <Subtitle className="mb-1">Sin citas programadas para hoy</Subtitle>
              <Muted className="mb-3">Tu agenda está libre</Muted>
              <LinkButton href="/citas/nueva" variant="ghost" size="sm">
                + Agendar una cita
              </LinkButton>
            </div>
          ) : (
            citasVisibles.map((cita, idx) => {
              const meta = getCitaEstado(cita.estado);
              return (
                <div
                  key={cita.id}
                  onClick={() => (window.location.href = `/pacientes/${cita.pacienteId}/historia`)}
                  className="group flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors hover:bg-neutral-50 sm:px-5"
                >
                  <div className="flex flex-shrink-0 flex-col items-center pt-1">
                    <div className={`h-2 w-2 rounded-lg ${meta.dotClass} ring-2 ring-white`} />
                    {idx < citasVisibles.length - 1 && (
                      <div className="mt-1 w-px bg-neutral-200" style={{ minHeight: '32px' }} />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant={meta.variant}>{meta.label}</Badge>
                      <span className="flex-shrink-0 font-mono text-xs font-semibold text-neutral-600">
                        {formatHora(cita.horaInicio)}
                      </span>
                    </div>
                    <p className="body-strong mt-1 truncate text-sm">
                      {cita.paciente?.nombre} {cita.paciente?.apellido}
                    </p>
                    <p className="caption mt-0.5 flex items-center gap-1 truncate">
                      <span>{getMotivoIcon(cita.motivo)}</span>
                      <span className="truncate">{cita.motivo}</span>
                    </p>
                  </div>
                  <span className="pt-1 text-neutral-400 opacity-0 transition-opacity group-hover:opacity-100">
                    ›
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Ver más del día */}
        {hayMas && (
          <button
            onClick={() => setExpandido(!expandido)}
            className="hover:text-brand-morena w-full border-t border-neutral-200 py-2.5 text-xs font-medium text-neutral-500 transition-all hover:bg-neutral-50"
          >
            {expandido ? '▲ Ver menos' : `▼ Ver ${citasHoy.length - MAX_VISIBLE} más de hoy`}
          </button>
        )}

        {/* Footer */}
        <div className="border-t border-neutral-200 px-4 py-3 sm:px-5">
          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => setModalTodas(true)}
          >
            Ver agenda completa
          </Button>
        </div>
      </div>

      {/* ── BOTTOM SHEET: DETALLE DE CITA ── */}
      <BottomSheet open={!!citaSeleccionada} onClose={cerrarDetalle} size="sm">
        {citaSeleccionada &&
          (() => {
            const meta = getCitaEstado(citaSeleccionada.estado);
            return (
              <>
                <div className="bg-neutral-25 px-6 pt-5 pb-4">
                  <div className="flex items-center justify-between">
                    <Badge variant={meta.variant}>{meta.label}</Badge>
                    <CloseButton onClick={cerrarDetalle} />
                  </div>
                  <CardTitle className="mt-2 font-serif">
                    {citaSeleccionada.paciente?.nombre} {citaSeleccionada.paciente?.apellido}
                  </CardTitle>
                  <Subtitle className="mt-0.5 flex items-center gap-1.5">
                    <span>{getMotivoIcon(citaSeleccionada.motivo)}</span>
                    {citaSeleccionada.motivo}
                  </Subtitle>
                </div>

                <div className="space-y-3 px-6 py-4">
                  <DetailRow label="Horario">
                    <span className="font-mono">
                      {formatHora(citaSeleccionada.horaInicio)} –{' '}
                      {formatHora(citaSeleccionada.horaFin)}
                    </span>
                  </DetailRow>
                  <DetailRow label="Fecha">
                    {new Date(citaSeleccionada.fecha).toLocaleDateString('es-BO', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'long',
                    })}
                  </DetailRow>
                  <DetailRow label="Teléfono">
                    <a
                      href={`tel:${citaSeleccionada.paciente?.telefono}`}
                      className="text-brand-morena hover:underline"
                    >
                      {citaSeleccionada.paciente?.telefono}
                    </a>
                  </DetailRow>
                  {citaSeleccionada.notas && (
                    <div>
                      <Muted className="mb-1">Notas</Muted>
                      <p className="bg-neutral-25 rounded-lg px-3 py-2 text-xs text-neutral-700">
                        {citaSeleccionada.notas}
                      </p>
                    </div>
                  )}
                  {errorEliminar && (
                    <p className="alert-danger rounded-lg px-3 py-2 text-xs">{errorEliminar}</p>
                  )}
                </div>

                <div className="space-y-2 px-6 pb-6">
                  {!confirmandoEliminar ? (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="md"
                        className="flex-1"
                        onClick={cerrarDetalle}
                      >
                        Cerrar
                      </Button>
                      <LinkButton
                        href={`/citas/${citaSeleccionada.id}/editar`}
                        variant="primary"
                        size="md"
                        className="flex-1"
                      >
                        <EditIcon />
                        Editar
                      </LinkButton>
                      <Button
                        variant="danger"
                        size="md"
                        className="flex-1"
                        onClick={() => setConfirmandoEliminar(true)}
                      >
                        <TrashIcon color="currentColor" />
                        Eliminar
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="alert-danger rounded-xl p-3 text-center">
                        <p className="text-sm font-semibold">¿Eliminar esta cita?</p>
                        <p className="mt-0.5 text-xs opacity-80">
                          {citaSeleccionada.paciente?.nombre} ·{' '}
                          {formatHora(citaSeleccionada.horaInicio)}
                        </p>
                        <p className="mt-1 text-xs opacity-70">Esta acción no se puede deshacer.</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="md"
                          className="flex-1"
                          disabled={eliminando}
                          onClick={() => {
                            setConfirmandoEliminar(false);
                            setErrorEliminar('');
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="danger"
                          size="md"
                          className="flex-1"
                          disabled={eliminando}
                          isLoading={eliminando}
                          onClick={handleEliminar}
                        >
                          {eliminando ? 'Eliminando...' : 'Sí, eliminar'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            );
          })()}
      </BottomSheet>

      {/* ── BOTTOM SHEET: TODAS LAS CITAS ── */}
      <BottomSheet open={modalTodas} onClose={() => setModalTodas(false)} size="md" scrollable>
        <div className="flex flex-shrink-0 items-center justify-between border-b border-neutral-200 px-5 py-4">
          <div>
            <CardTitle className="font-serif">Todas las citas</CardTitle>
            <Muted>{citasFuturas.length} citas próximas</Muted>
          </div>
          <CloseButton onClick={() => setModalTodas(false)} />
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
          {diasOrdenados.length === 0 ? (
            <div className="py-10 text-center">
              <p className="mb-2 text-2xl">📭</p>
              <Subtitle>No hay citas próximas</Subtitle>
            </div>
          ) : (
            diasOrdenados.map((diaKey) => {
              const citasDia = agrupadasPorDia[diaKey];
              const esHoy = diaKey === hoyKey;
              return (
                <div key={diaKey}>
                  <div className="mb-1 flex items-center gap-2 px-3">
                    <span
                      className={`text-xs font-bold ${esHoy ? 'text-brand-morena' : 'text-neutral-500'}`}
                    >
                      {labelFecha(diaKey)}
                    </span>
                    <div className="h-px flex-1 bg-neutral-100" />
                    <span className="text-[10px] text-neutral-400">
                      {citasDia.length} cita{citasDia.length > 1 ? 's' : ''}
                    </span>
                  </div>

                  <div className="bg-neutral-25 divide-y divide-neutral-100 overflow-hidden rounded-xl border border-neutral-200">
                    {citasDia.map((cita) => {
                      const meta = getCitaEstado(cita.estado);
                      return (
                        <div
                          key={cita.id}
                          onClick={() => {
                            window.location.href = `/pacientes/${cita.pacienteId}/historia`;
                          }}
                          className="group flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-neutral-50"
                        >
                          <div className={`h-2 w-2 rounded-lg ${meta.dotClass} flex-shrink-0`} />
                          <div className="min-w-0 flex-1">
                            <p className="body-strong truncate text-sm">
                              {cita.paciente?.nombre} {cita.paciente?.apellido}
                            </p>
                            <p className="caption flex items-center gap-1 truncate">
                              <span>{getMotivoIcon(cita.motivo)}</span>
                              <span>{cita.motivo}</span>
                            </p>
                          </div>
                          <div className="flex flex-shrink-0 flex-col items-end gap-0.5">
                            <p className="font-mono text-xs font-semibold text-neutral-600">
                              {formatHora(cita.horaInicio)}
                            </p>
                            <Badge variant={meta.variant}>{meta.label}</Badge>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="flex-shrink-0 border-t border-neutral-200 px-5 py-3">
          <LinkButton href="/citas/nueva" variant="primary" size="md" className="w-full">
            + Nueva Cita
          </LinkButton>
        </div>
      </BottomSheet>
    </>
  );
}
