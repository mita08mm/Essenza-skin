import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/shared/utils';

type LinkProps = ComponentProps<typeof Link>;

interface LinkButtonProps extends Omit<LinkProps, 'className'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md';
  className?: string;
}

function resolveClass(
  variant: NonNullable<LinkButtonProps['variant']>,
  size: NonNullable<LinkButtonProps['size']>,
): string {
  if (variant === 'primary') return size === 'sm' ? 'btn-primary-sm' : 'btn-primary';
  if (variant === 'secondary' || variant === 'ghost')
    return size === 'sm' ? 'btn-secondary-sm' : 'btn-secondary';
  return 'btn-danger';
}

/**
 * Next.js Link estilizado como botón.
 * Consume las CSS classes del sistema (globals.css → ui → .tsx).
 */
export function LinkButton({
  variant = 'primary',
  size = 'sm',
  className,
  ...props
}: LinkButtonProps) {
  return <Link {...props} className={cn(resolveClass(variant, size), className)} />;
}
