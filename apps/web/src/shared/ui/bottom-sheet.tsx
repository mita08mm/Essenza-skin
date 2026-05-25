'use client';

import * as React from 'react';
import { cn } from '@/shared/utils';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Ancho máximo en desktop. Por defecto `sm` (max-w-sm). */
  size?: 'sm' | 'md' | 'lg';
  /** Si true, el panel ocupa máx 85vh y permite scroll interno. */
  scrollable?: boolean;
  /** Oculta el handle visual de arrastre (móvil). Por defecto se muestra. */
  hideHandle?: boolean;
  className?: string;
}

const SIZES: Record<NonNullable<BottomSheetProps['size']>, string> = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
};

/**
 * Diálogo que se comporta como bottom-sheet en móvil y modal centrado en desktop.
 * Encapsula el patrón backdrop + panel + drag-handle que se repetía en varios features.
 *
 * Para layouts con header/body/footer, componer libremente como hijos.
 */
export function BottomSheet({
  open,
  onClose,
  children,
  size = 'sm',
  scrollable = false,
  hideHandle = false,
  className,
}: BottomSheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/20 p-0 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'w-full overflow-hidden rounded-t-2xl border border-neutral-200 bg-white shadow-2xl sm:rounded-2xl',
          SIZES[size],
          scrollable && 'flex max-h-[85vh] flex-col',
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {!hideHandle && (
          <div className="mx-auto mt-3 h-1 w-10 flex-shrink-0 rounded-lg bg-neutral-200 sm:hidden" />
        )}
        {children}
      </div>
    </div>
  );
}
