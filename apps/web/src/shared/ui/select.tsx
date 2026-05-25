import * as React from 'react';
import { cn } from '@/shared/utils';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          'flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
          'focus:ring-morena/20 focus:border-morena focus:ring-2 focus:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'transition-colors',
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  },
);

Select.displayName = 'Select';

export { Select };
