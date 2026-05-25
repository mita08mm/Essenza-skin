import type { ReactNode } from 'react';

type Variant = 'default' | 'muted' | 'dashed';

interface SurfaceProps {
  children: ReactNode;
  className?: string;
  variant?: Variant;
  /** padding preset: none | sm (p-3) | md (p-4) | lg (p-6) */
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variantCls: Record<Variant, string> = {
  default: 'surface',
  muted: 'surface-muted',
  dashed: 'surface-dashed',
};

const padCls = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

export function Surface({
  children,
  className = '',
  variant = 'default',
  padding = 'none',
}: SurfaceProps) {
  return (
    <div className={`${variantCls[variant]} ${padCls[padding]} ${className}`.trim()}>
      {children}
    </div>
  );
}
