import * as React from 'react';
import { cn } from '@/shared/utils';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  bordered?: boolean;
  label: string;
}

/**
 * Botón cuadrado de solo ícono, reusado en toolbars, menús kebab y cierres de modal.
 * `label` es obligatorio: alimenta title + aria-label para accesibilidad.
 */
const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, active, bordered, label, type = 'button', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        title={label}
        className={cn(
          'icon-btn',
          bordered && 'icon-btn-bordered',
          active && 'icon-btn-active',
          className,
        )}
        {...props}
      >
        {children}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';

export { IconButton };
