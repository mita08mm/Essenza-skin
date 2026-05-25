'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';

export interface CobroResumen {
  id: string;
  fecha: string;
  total: number;
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
    tipoDocumento: string;
  };
  items?: Array<{ id: string; nombre: string }>;
  pagos: Array<{ monto: number }>;
}

export const cobrosKeys = {
  all: ['cobros'] as const,
  list: () => [...cobrosKeys.all, 'list'] as const,
  detail: (id: string) => [...cobrosKeys.all, 'detail', id] as const,
};

export function useCobros() {
  const { data, isLoading, error } = useQuery({
    queryKey: cobrosKeys.list(),
    queryFn: () => api.get<CobroResumen[]>('/cobros'),
  });

  return {
    cobros: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
