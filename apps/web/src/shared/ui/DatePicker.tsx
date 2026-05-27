'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { cn } from '@/shared/utils';

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DIAS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'];

function toISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function parseISO(s?: string): Date | null {
  if (!s || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

function formatDisplay(iso?: string): string {
  const d = parseISO(iso);
  if (!d) return '';
  return `${String(d.getDate()).padStart(2, '0')} / ${MESES[d.getMonth()]} / ${d.getFullYear()}`;
}

function firstWeekdayOfMonth(year: number, month: number): number {
  const raw = new Date(year, month, 1).getDay();
  return raw === 0 ? 6 : raw - 1;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

export interface DatePickerProps {
  label?: string;
  name?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  minDate?: Date;
  maxDate?: Date;
  placeholder?: string;
}

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

  const selected = parseISO(value);
  const todayISO = toISO(new Date());

  const [viewYear, setViewYear] = useState(() => selected?.getFullYear() ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selected?.getMonth() ?? new Date().getMonth());
  const [open, setOpen] = useState(false);

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

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  const selectDay = (day: number) => {
    const date = new Date(viewYear, viewMonth, day);
    const iso = toISO(date);
    onChange?.({ target: { name, value: iso } } as React.ChangeEvent<HTMLInputElement>);
    setOpen(false);
  };

  // Generar días del calendario
  const offset = firstWeekdayOfMonth(viewYear, viewMonth);
  const days = daysInMonth(viewYear, viewMonth);
  const cells: number[] = [];
  
  for (let i = 0; i < offset; i++) {
    cells.push(0); // espacios vacíos
  }
  
  for (let d = 1; d <= days; d++) {
    cells.push(d);
  }

  const hasError = Boolean(error);

  return (
    <div ref={wrapRef} className="relative w-full">
      {label && (
        <label
          htmlFor={triggerId}
          className="text-concreto mb-2 block text-xs font-medium tracking-wider uppercase"
        >
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}

      <button
        id={triggerId}
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          'flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-3 text-sm transition-all outline-none',
          hasError
            ? 'border-red-300 bg-red-50/40'
            : open
              ? 'border-morena ring-piel/20 ring-2'
              : 'border-[#D7C5B9] hover:border-morena/50',
          disabled && 'cursor-not-allowed opacity-60',
        )}
      >
        <svg
          className="h-[18px] w-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
        <span className={cn('flex-1', value ? 'text-concreto' : 'text-marengo/45')}>
          {value ? formatDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute top-full left-0 z-50 mt-2 w-[310px] rounded-2xl border border-[#E5DDD6] bg-white p-4 shadow-xl">
          {/* Navegación mes/año */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="text-marengo hover:bg-piel/20 flex h-8 w-8 items-center justify-center rounded-lg"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="text-concreto text-sm font-semibold">
              {MESES[viewMonth]} {viewYear}
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="text-marengo hover:bg-piel/20 flex h-8 w-8 items-center justify-center rounded-lg"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Días de la semana */}
          <div className="mb-1 grid grid-cols-7">
            {DIAS.map((d) => (
              <div key={d} className="text-marengo flex h-8 items-center justify-center text-xs font-bold">
                {d}
              </div>
            ))}
          </div>

          {/* Grid de días */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (day === 0) {
                return <div key={idx} />;
              }

              const date = new Date(viewYear, viewMonth, day);
              const iso = toISO(date);
              const isSelected = iso === value;
              const isToday = iso === todayISO;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectDay(day)}
                  className={cn(
                    'h-9 w-full rounded-lg text-sm transition-all',
                    isSelected && 'bg-morena font-bold text-white',
                    !isSelected && isToday && 'text-morena font-bold underline',
                    !isSelected && !isToday && 'text-concreto hover:bg-piel/25',
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {hasError && (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      )}

      {!hasError && hint && (
        <p className="text-marengo mt-2 text-xs">{hint}</p>
      )}
    </div>
  );
}
