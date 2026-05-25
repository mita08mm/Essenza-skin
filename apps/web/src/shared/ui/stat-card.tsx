import { Overline, Muted } from './typography';

export type StatTone = 'default' | 'success' | 'warning' | 'danger' | 'brand';

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  tone?: StatTone;
  /** Compact variant for dense rows */
  size?: 'sm' | 'md';
}

const toneCls: Record<StatTone, string> = {
  default: 'text-neutral-900',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  brand: 'text-brand-morena-dark',
};

export function StatCard({ label, value, hint, tone = 'default', size = 'md' }: StatCardProps) {
  const padding = size === 'sm' ? 'px-4 py-3' : 'p-5';
  const valueSize = size === 'sm' ? 'text-xl mt-1' : 'text-2xl mt-2';
  return (
    <div className={`surface ${padding}`}>
      <Overline>{label}</Overline>
      <p className={`font-heading font-medium tabular-nums ${valueSize} ${toneCls[tone]}`}>
        {value}
      </p>
      {hint && <Muted className="mt-1">{hint}</Muted>}
    </div>
  );
}
