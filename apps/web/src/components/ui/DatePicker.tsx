'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { cn } from '@/lib/utils';

// ─── Constantes ───────────────────────────────────────────────────────────────

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

const YEAR_ACTUAL = new Date().getFullYear();
// Rango de años: desde 120 años atrás hasta 10 años adelante
const YEARS = Array.from({ length: 131 }, (_, i) => YEAR_ACTUAL - 120 + i);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convierte Date → "YYYY-MM-DD" */
function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Parsea "YYYY-MM-DD" sin problemas de zona horaria */
function parseISO(s?: string): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Formatea "YYYY-MM-DD" → "17 / Mayo / 2008" */
function formatDisplay(iso?: string): string {
  const d = parseISO(iso);
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')} / ${MESES[d.getMonth()]} / ${d.getFullYear()}`;
}

/** Offset (0 = lunes) del primer día del mes */
function firstWeekdayOfMonth(year: number, month: number): number {
  const raw = new Date(year, month, 1).getDay(); // 0=Dom
  return raw === 0 ? 6 : raw - 1;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DatePickerProps {
  /** Etiqueta del campo */
  label?: string;
  /** name del campo (para el evento sintético que emite) */
  name?: string;
  /** Valor actual en formato "YYYY-MM-DD" */
  value?: string;
  /**
   * Callback 100 % compatible con React.ChangeEventHandler<HTMLInputElement>.
   * Puede pasarse directamente el `handleChange` del formulario.
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
  /** Mensaje de error — activa el estado visual rojo */
  error?: string;
  /** Texto de ayuda (ignorado si hay error) */
  hint?: string;
  /** Fecha mínima seleccionable */
  minDate?: Date;
  /** Fecha máxima seleccionable */
  maxDate?: Date;
  /** Placeholder del trigger */
  placeholder?: string;
}

// ─── Celda del calendario ─────────────────────────────────────────────────────

type CellMonth = 'prev' | 'cur' | 'next';

interface Cell {
  day: number;
  iso: string;
  belongs: CellMonth;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function DatePicker({
  label,
  name = '',
  value,
  onChange,
  required,
  disabled,
  error,
  hint,
  minDate,
  maxDate,
  placeholder = 'dd / mes / aaaa',
}: DatePickerProps) {
  const triggerId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const selected = parseISO(value);
  const todayISO = toISO(new Date());

  // Mes/año que se está viendo en el calendario
  const [viewYear, setViewYear] = useState(
    selected?.getFullYear() ?? YEAR_ACTUAL - 18,
  );
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? 0);
  const [open, setOpen] = useState(false);

  // Sincronizar vista cuando el valor cambia desde fuera
  useEffect(() => {
    if (selected) {
      setViewYear(selected.getFullYear());
      setViewMonth(selected.getMonth());
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Cerrar con Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  // ── Navegación de mes ──────────────────────────────────────────────────────

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  };

  // ── Selección de día ───────────────────────────────────────────────────────

  const selectDay = (iso: string) => {
    onChange?.({ target: { name, value: iso } } as React.ChangeEvent<HTMLInputElement>);
    setOpen(false);
  };

  const clearValue = () => {
    onChange?.({ target: { name, value: '' } } as React.ChangeEvent<HTMLInputElement>);
    setOpen(false);
  };

  // ── Celdas del grid ────────────────────────────────────────────────────────

  const cells: Cell[] = [];

  // Días del mes anterior para rellenar la primera fila
  const offset = firstWeekdayOfMonth(viewYear, viewMonth);
  const prevDays = daysInMonth(viewYear, viewMonth === 0 ? 11 : viewMonth - 1);
  for (let i = offset - 1; i >= 0; i--) {
    const d = prevDays - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    cells.push({ day: d, iso: toISO(new Date(y, m, d)), belongs: 'prev' });
  }

  // Días del mes actual
  const curDays = daysInMonth(viewYear, viewMonth);
  for (let d = 1; d <= curDays; d++) {
    cells.push({ day: d, iso: toISO(new Date(viewYear, viewMonth, d)), belongs: 'cur' });
  }

  // Días del mes siguiente para completar la última fila
  let nd = 1;
  while (cells.length % 7 !== 0) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    cells.push({ day: nd, iso: toISO(new Date(y, m, nd)), belongs: 'next' });
    nd++;
  }

  const isOutOfRange = (iso: string) => {
    const d = parseISO(iso);
    if (!d) return true;
    if (minDate && d < minDate) return true;
    if (maxDate && d > maxDate) return true;
    return false;
  };

  const hasError = Boolean(error);

  return (
    <div ref={wrapRef} className="relative w-full">

      {/* ── Label ──────────────────────────────────────────────────────────── */}
      {label && (
        <label
          htmlFor={triggerId}
          className="block text-xs font-medium text-concreto uppercase tracking-wider mb-2 cursor-pointer"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden>*</span>}
        </label>
      )}

      {/* ── Trigger ─────────────────────────────────────────────────────────── */}
      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          'w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all duration-150 bg-white outline-none',
          hasError
            ? 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100'
            : open
              ? 'border-morena ring-2 ring-piel/20'
              : 'border-[#D7C5B9] hover:border-morena/50 focus:border-morena focus:ring-2 focus:ring-piel/20',
          disabled && 'bg-[#F5F0EB] border-[#D7C5B9] opacity-60 cursor-not-allowed',
        )}
      >
        {/* Icono calendario */}
        <svg
          className={cn(
            'w-[18px] h-[18px] shrink-0 transition-colors',
            value ? 'text-morena' : hasError ? 'text-red-400' : 'text-marengo/50',
          )}
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>

        {/* Texto de valor o placeholder */}
        <span className={cn('flex-1 truncate', value ? 'text-concreto' : 'text-marengo/45')}>
          {value ? formatDisplay(value) : placeholder}
        </span>

        {/* Chevron */}
        <svg
          className={cn(
            'w-4 h-4 shrink-0 text-marengo/40 transition-transform duration-200',
            open && 'rotate-180',
          )}
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          aria-hidden
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* ── Popover ─────────────────────────────────────────────────────────── */}
      {open && (
        <div
          ref={popoverRef}
          role="dialog"
          aria-modal="true"
          aria-label="Seleccionar fecha"
          className="absolute z-50 top-full mt-2 left-0 w-[310px] bg-white rounded-2xl border border-[#E5DDD6] shadow-xl p-4"
        >
          {/* ── Cabecera: flechas + selects ─────────────────────────────────── */}
          <div className="flex items-center gap-2 mb-3">

            {/* Flecha anterior */}
            <button
              type="button"
              onClick={prevMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-marengo
                         hover:bg-piel/20 hover:text-morena active:scale-90 transition-all shrink-0"
              aria-label="Mes anterior"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {/* Select de mes */}
            <select
              value={viewMonth}
              onChange={e => setViewMonth(Number(e.target.value))}
              className="flex-1 px-2 py-1.5 rounded-lg border border-[#D7C5B9] text-sm font-semibold
                         text-concreto bg-white outline-none focus:border-morena focus:ring-2 focus:ring-piel/20
                         cursor-pointer transition-all text-center appearance-none"
              aria-label="Mes"
            >
              {MESES.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>

            {/* Select de año */}
            <select
              value={viewYear}
              onChange={e => setViewYear(Number(e.target.value))}
              className="w-[76px] px-2 py-1.5 rounded-lg border border-[#D7C5B9] text-sm font-semibold
                         text-concreto bg-white outline-none focus:border-morena focus:ring-2 focus:ring-piel/20
                         cursor-pointer transition-all text-center appearance-none"
              aria-label="Año"
            >
              {YEARS.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>

            {/* Flecha siguiente */}
            <button
              type="button"
              onClick={nextMonth}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-marengo
                         hover:bg-piel/20 hover:text-morena active:scale-90 transition-all shrink-0"
              aria-label="Mes siguiente"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* ── Encabezado días de semana ───────────────────────────────────── */}
          <div className="grid grid-cols-7 mb-1">
            {DIAS.map(d => (
              <div
                key={d}
                className="h-8 flex items-center justify-center text-[10px] font-bold
                           text-marengo uppercase tracking-widest"
              >
                {d}
              </div>
            ))}
          </div>

          {/* ── Grid de días ───────────────────────────────────────────────── */}
          <div className="grid grid-cols-7">
            {cells.map((cell, idx) => {
              const isOther = cell.belongs !== 'cur';
              const isSelected = cell.iso === value;
              const isToday = cell.iso === todayISO;
              const isDisabled = isOther || isOutOfRange(cell.iso);

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => !isDisabled && selectDay(cell.iso)}
                  tabIndex={isDisabled ? -1 : 0}
                  aria-label={cell.iso}
                  aria-pressed={isSelected}
                  className={cn(
                    'relative h-9 w-full rounded-lg text-sm transition-all duration-100 outline-none',
                    // días de otro mes
                    isOther && 'text-marengo/25 cursor-default pointer-events-none',
                    // día del mes actual normal
                    !isOther && !isSelected && !isDisabled &&
                      'text-concreto hover:bg-piel/25 hover:text-morena font-medium',
                    // hoy (sin seleccionar)
                    isToday && !isSelected &&
                      'font-bold text-morena underline underline-offset-2 decoration-piel',
                    // seleccionado
                    isSelected &&
                      'bg-morena text-white font-bold shadow-sm',
                    // deshabilitado del mes actual
                    !isOther && isDisabled &&
                      'text-marengo/30 cursor-not-allowed',
                  )}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* ── Footer: fecha seleccionada + limpiar ─────────────────────────── */}
          {value && (
            <div className="mt-3 pt-3 border-t border-[#EDE6DF] flex items-center justify-between">
              <span className="text-xs text-marengo font-medium">{formatDisplay(value)}</span>
              <button
                type="button"
                onClick={clearValue}
                className="text-xs text-marengo/60 hover:text-red-500 transition-colors"
              >
                Limpiar
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Error ──────────────────────────────────────────────────────────── */}
      {hasError && (
        <p role="alert" className="mt-2 text-xs text-red-600 flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path fillRule="evenodd" clipRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
          {error}
        </p>
      )}

      {/* ── Hint ───────────────────────────────────────────────────────────── */}
      {!hasError && hint && (
        <p className="mt-2 text-xs text-marengo">{hint}</p>
      )}
    </div>
  );
}
