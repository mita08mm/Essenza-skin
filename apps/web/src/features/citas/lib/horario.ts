export const DIAS_SEMANA = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

export const TIMELINE_START = 7 * 60; // 07:00
export const TIMELINE_END = 21 * 60; // 21:00
export const TIMELINE_TOTAL = TIMELINE_END - TIMELINE_START;
export const TIMELINE_HOURS = [7, 9, 11, 13, 15, 17, 19, 21];

export function toMinutes(hora: string): number {
  if (!hora) return 0;
  const [h, m] = hora.split(':').map(Number);
  return h * 60 + m;
}

export function pctTimeline(min: number): number {
  return Math.max(0, Math.min(100, ((min - TIMELINE_START) / TIMELINE_TOTAL) * 100));
}

export function hayConflicto(
  nuevaInicio: string,
  nuevaFin: string,
  existenteInicio: string,
  existenteFin: string,
): boolean {
  const ni = toMinutes(nuevaInicio);
  const nf = toMinutes(nuevaFin);
  const ei = toMinutes(existenteInicio);
  const ef = toMinutes(existenteFin);
  return ni < ef && nf > ei;
}

export function diaSemanaLabel(fecha: string): string {
  if (!fecha) return '';
  const [y, m, d] = fecha.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  return isNaN(dateObj.getTime()) ? '' : DIAS_SEMANA[dateObj.getDay()];
}
