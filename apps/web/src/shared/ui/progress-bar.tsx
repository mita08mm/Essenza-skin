import { cn } from '@/shared/utils';

interface ProgressBarProps {
  /** Valor 0..100 */
  value: number;
  label?: string;
  /** Mostrar el porcentaje a la derecha del label */
  showPercent?: boolean;
  className?: string;
}

/**
 * Barra de progreso reutilizable.
 * Consume tokens del sistema (bg-brand-morena, bg-neutral-100).
 */
export function ProgressBar({ value, label, showPercent = true, className }: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('w-full', className)}>
      {(label || showPercent) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && <span className="text-xs font-medium text-neutral-600">{label}</span>}
          {showPercent && (
            <span className="text-xs font-medium text-neutral-700 tabular-nums">
              {clamped.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className="bg-brand-morena h-2 rounded-full transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
