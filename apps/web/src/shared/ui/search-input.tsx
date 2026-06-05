'use client';

import type { InputHTMLAttributes } from 'react';
import { SearchIcon, CloseIcon } from '@/shared/icons';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  containerClassName?: string;
  /** Si `true` muestra una "X" cuando hay texto; llama a `onClear`. */
  clearable?: boolean;
  onClear?: () => void;
}

export function SearchInput({
  containerClassName = '',
  className = '',
  placeholder = 'Buscar...',
  clearable = false,
  onClear,
  value,
  ...rest
}: SearchInputProps) {
  const showClear = clearable && typeof value === 'string' && value.length > 0;
  return (
    <div className={`relative ${containerClassName}`}>
      <SearchIcon
        className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-neutral-400"
        aria-hidden
      />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        className={`input-base ${showClear ? 'pr-9' : 'pr-3'} pl-10 ${className}`}
        {...rest}
      />
      {showClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-700"
          aria-label="Limpiar"
        >
          <CloseIcon className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
