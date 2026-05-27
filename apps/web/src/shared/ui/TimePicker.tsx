'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/shared/utils';
import { Input } from './input';
import { Label } from './label';

interface TimePickerProps {
  label?: string;
  name?: string;
  value?: string; // "HH:mm" format
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  hint?: string;
  /** Hora mínima permitida (HH:mm), ej: "06:00" */
  minTime?: string;
  /** Hora máxima permitida (HH:mm), ej: "22:00" */
  maxTime?: string;
  /** Mostrar botones de incremento rápido */
  showQuickButtons?: boolean;
  /** Intervalos para botones rápidos (en minutos) */
  intervals?: number[];
  className?: string;
}

const DEFAULT_MIN = '06:00';
const DEFAULT_MAX = '22:00';
const DEFAULT_INTERVALS = [5, 10, 15, 30];

/** Convierte "HH:mm" a minutos desde medianoche */
function toMinutes(time: string): number {
  if (!time || !/^\d{2}:\d{2}$/.test(time)) return 0;
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Convierte minutos desde medianoche a "HH:mm" */
function toTimeString(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function TimePicker({
  label,
  name = '',
  value = '',
  onChange,
  required,
  disabled,
  error,
  hint,
  minTime = DEFAULT_MIN,
  maxTime = DEFAULT_MAX,
  showQuickButtons = true,
  intervals = DEFAULT_INTERVALS,
  className = '',
}: TimePickerProps) {
  const [localValue, setLocalValue] = useState(value);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const validateTime = (time: string): string => {
    if (!time) return '';

    const mins = toMinutes(time);
    const minMins = toMinutes(minTime);
    const maxMins = toMinutes(maxTime);

    if (mins < minMins || mins > maxMins) {
      return `Horario permitido: ${minTime} - ${maxTime}`;
    }

    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalValue(newValue);

    const validationMsg = validateTime(newValue);
    setValidationError(validationMsg);

    // Solo emitir cambio si es válido
    if (!validationMsg && onChange) {
      onChange({ ...e, target: { ...e.target, name, value: newValue } });
    }
  };

  const addMinutes = (minutes: number) => {
    if (!localValue || disabled) return;

    const current = toMinutes(localValue);
    let newMinutes = current + minutes;

    // Limitar al rango permitido
    const minMins = toMinutes(minTime);
    const maxMins = toMinutes(maxTime);
    newMinutes = Math.min(Math.max(newMinutes, minMins), maxMins);

    const newValue = toTimeString(newMinutes);
    setLocalValue(newValue);
    setValidationError('');

    if (onChange) {
      const syntheticEvent = {
        target: { name, value: newValue },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const errorMsg = error || validationError;
  const hasError = Boolean(errorMsg);

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <Label className="mb-2">
          {label}
          {required && (
            <span className="ml-1 text-red-500" aria-hidden>
              *
            </span>
          )}
        </Label>
      )}

      <div className="flex items-start gap-2">
        <div className="flex-1">
          <input
            type="time"
            name={name}
            value={localValue}
            onChange={handleChange}
            min={minTime}
            max={maxTime}
            required={required}
            disabled={disabled}
            className={cn(
              'flex w-full rounded-xl border bg-white px-4 py-3 text-sm transition-all duration-150 outline-none',
              hasError
                ? 'border-red-300 bg-red-50/40 focus:border-red-400 focus:ring-2 focus:ring-red-100'
                : 'hover:border-morena/50 focus:border-morena focus:ring-piel/20 border-[#D7C5B9] focus:ring-2',
              disabled && 'cursor-not-allowed border-[#D7C5B9] bg-[#F5F0EB] opacity-60',
            )}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${name}-error` : hint ? `${name}-hint` : undefined}
          />
        </div>

        {showQuickButtons && localValue && !disabled && (
          <div className="flex gap-1">
            {intervals.map((interval) => (
              <button
                key={interval}
                type="button"
                onClick={() => addMinutes(interval)}
                className={cn(
                  'hover:bg-morena/10 flex h-10 min-w-[2.5rem] items-center justify-center rounded-lg border border-[#D7C5B9] bg-white px-2 text-xs font-medium transition-all active:scale-95',
                  'text-morena hover:border-morena',
                )}
                title={`Agregar ${interval} minutos`}
              >
                +{interval}m
              </button>
            ))}
          </div>
        )}
      </div>

      {hasError && (
        <p role="alert" id={`${name}-error`} className="mt-2 flex items-center gap-1.5 text-xs text-red-600">
          <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"
            />
          </svg>
          {errorMsg}
        </p>
      )}

      {!hasError && hint && (
        <p id={`${name}-hint`} className="text-marengo mt-2 text-xs">
          {hint}
        </p>
      )}
    </div>
  );
}
