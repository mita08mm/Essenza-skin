import type { BadgeProps } from '@/shared/ui';

export type CitaEstado =
  | 'PROGRAMADA'
  | 'CONFIRMADA'
  | 'EN_CURSO'
  | 'COMPLETADA'
  | 'CANCELADA'
  | 'NO_ASISTIO';

interface EstadoMeta {
  label: string;
  variant: NonNullable<BadgeProps['variant']>;
  /** Clase Tailwind para el punto/dot visual del timeline. */
  dotClass: string;
}

const FALLBACK: EstadoMeta = {
  label: 'Pendiente',
  variant: 'warning',
  dotClass: 'bg-warning',
};

const MAP: Record<CitaEstado, EstadoMeta> = {
  PROGRAMADA: { label: 'Pendiente', variant: 'warning', dotClass: 'bg-warning' },
  CONFIRMADA: { label: 'Confirmada', variant: 'success', dotClass: 'bg-success' },
  EN_CURSO: { label: 'En curso', variant: 'info', dotClass: 'bg-info' },
  COMPLETADA: { label: 'Completada', variant: 'default', dotClass: 'bg-neutral-400' },
  CANCELADA: { label: 'Cancelada', variant: 'danger', dotClass: 'bg-danger' },
  NO_ASISTIO: { label: 'No asistió', variant: 'danger', dotClass: 'bg-danger' },
};

export function getCitaEstado(estado: string): EstadoMeta {
  return MAP[estado as CitaEstado] ?? FALLBACK;
}
