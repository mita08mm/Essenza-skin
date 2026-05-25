import * as React from 'react';
import { cn } from '@/shared/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'sm' | 'md';
  isLoading?: boolean;
}

/**
 * Mapea (variant, size) a las CSS classes definidas en globals.css.
 * Sigue la regla global.css → ui → .tsx: el componente NO redeclara estilos,
 * solo consume las clases del sistema.
 */
function resolveClass(
  variant: NonNullable<ButtonProps['variant']>,
  size: NonNullable<ButtonProps['size']>,
): string {
  if (variant === 'primary') return size === 'sm' ? 'btn-primary-sm' : 'btn-primary';
  if (variant === 'secondary') return size === 'sm' ? 'btn-secondary-sm' : 'btn-secondary';
  if (variant === 'danger') return 'btn-danger';
  if (variant === 'outline') return 'btn-secondary-sm';
  if (variant === 'ghost') return 'btn-secondary-sm';
  if (variant === 'success') return 'btn-primary-sm';
  return 'btn-primary-sm';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'sm', isLoading, disabled, children, ...props },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(resolveClass(variant, size), className)}
        {...props}
      >
        {isLoading && (
          <svg
            className="h-3.5 w-3.5 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
            <path
              d="M22 12a10 10 0 0 1-10 10"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';

export { Button };
