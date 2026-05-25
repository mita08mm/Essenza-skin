import * as React from 'react';
import { cn } from '@/shared/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'brand' | 'outline';
  dot?: boolean;
}

const variants: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-neutral-100 text-neutral-700 ring-1 ring-inset ring-neutral-200',
  success: 'bg-success-bg text-success ring-1 ring-inset ring-[rgba(45,122,79,0.18)]',
  warning: 'bg-warning-bg text-warning ring-1 ring-inset ring-[rgba(199,122,31,0.20)]',
  danger: 'bg-danger-bg  text-danger  ring-1 ring-inset ring-[rgba(181,58,58,0.18)]',
  info: 'bg-info-bg    text-info    ring-1 ring-inset ring-[rgba(42,95,143,0.18)]',
  brand:
    'bg-[rgba(204,175,125,0.18)]     text-brand-morena     ring-1 ring-inset ring-[rgba(117,76,36,0.18)]',
  outline: 'bg-transparent text-neutral-700 ring-1 ring-inset ring-neutral-300',
};

const dotColors: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-neutral-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  brand: 'bg-brand-morena',
  outline: 'bg-neutral-500',
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', dot, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium tracking-wide',
          variants[variant],
          className,
        )}
        {...props}
      >
        {dot && <span className={cn('h-1.5 w-1.5 rounded-full', dotColors[variant])} />}
        {children}
      </div>
    );
  },
);
Badge.displayName = 'Badge';

export { Badge };
