'use client';

import { Muted } from '@/shared/ui';
import {
  TIMELINE_START,
  TIMELINE_END,
  TIMELINE_HOURS,
  pctTimeline,
  toMinutes,
} from '../lib/horario';

export interface CitaDelDia {
  id: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: string;
  paciente: { nombre: string; apellido: string };
}

interface Props {
  citas: CitaDelDia[];
  loading: boolean;
  nuevaInicio: string;
  nuevaFin: string;
  conflicto: boolean;
  selectionLabel?: string;
}

export function DisponibilidadTimeline({
  citas,
  loading,
  nuevaInicio,
  nuevaFin,
  conflicto,
  selectionLabel = 'Nueva',
}: Props) {
  const ni = toMinutes(nuevaInicio);
  const nf = toMinutes(nuevaFin);
  const nuevaValida = nuevaInicio && nuevaFin && nf > ni;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-neutral-700">Disponibilidad del día</span>
        {loading && <Muted as="span">Cargando...</Muted>}
        {!loading && citas.length === 0 && (
          <span className="text-success text-xs font-medium">Día libre</span>
        )}
        {!loading && citas.length > 0 && (
          <span className="text-xs font-medium text-neutral-600">
            {citas.length} cita{citas.length > 1 ? 's' : ''} agendada{citas.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div
        className="relative overflow-hidden rounded-md border border-neutral-200"
        style={{ height: 40 }}
      >
        <div className="absolute inset-0 bg-neutral-50" />
        {citas.map((c) => {
          const inicioMin = toMinutes(c.horaInicio);
          const finMin = toMinutes(c.horaFin);
          if (inicioMin < TIMELINE_START || finMin > TIMELINE_END) return null;
          const left = pctTimeline(inicioMin);
          const width = pctTimeline(finMin) - left;
          return (
            <div
              key={c.id}
              title={`${c.horaInicio}–${c.horaFin}: ${c.paciente?.nombre} (${c.motivo})`}
              className="absolute top-0 flex h-full items-center overflow-hidden border-l-2 border-neutral-500 bg-neutral-300"
              style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
            >
              <span className="truncate px-1 text-[9px] font-medium text-neutral-700">
                {c.horaInicio}
              </span>
            </div>
          );
        })}
        {nuevaValida &&
          (() => {
            const left = pctTimeline(ni);
            const width = pctTimeline(nf) - left;
            return (
              <div
                className={`absolute top-0 flex h-full items-center overflow-hidden border-l-2 transition-all ${
                  conflicto
                    ? 'bg-warning-bg border-warning'
                    : 'border-brand-morena bg-[rgba(117,76,36,0.18)]'
                }`}
                style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
              >
                <span
                  className={`truncate px-1 text-[9px] font-semibold ${conflicto ? 'text-neutral-900' : 'text-brand-morena-dark'}`}
                >
                  {selectionLabel}
                </span>
              </div>
            );
          })()}
        <div className="absolute right-0 bottom-0 left-0 flex justify-between px-1">
          {TIMELINE_HOURS.map((h) => (
            <span key={h} className="font-mono text-[8px] text-neutral-400">
              {h}:00
            </span>
          ))}
        </div>
      </div>

      {!loading && citas.length > 0 && (
        <div className="mt-2 space-y-1">
          {citas.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-md border border-neutral-100 bg-neutral-50 px-3 py-1.5 text-xs"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-neutral-500" />
              <span className="font-mono font-medium text-neutral-700">
                {c.horaInicio} – {c.horaFin}
              </span>
              <span className="text-neutral-600">
                {c.paciente?.nombre} {c.paciente?.apellido}
              </span>
              <span className="truncate text-neutral-400">· {c.motivo}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
