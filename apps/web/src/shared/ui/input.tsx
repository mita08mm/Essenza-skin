import * as React from 'react';
import { cn } from '@/shared/utils';

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'flex h-10 w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2',
          'text-sm text-neutral-800 transition-colors duration-150',
          'placeholder:text-neutral-400',
          'focus:border-brand-morena focus:ring-[3px] focus:ring-[rgba(117,76,36,0.12)] focus:outline-none',
          'disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:opacity-50',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
