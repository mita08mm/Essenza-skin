'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';

export interface Cita {
  id: string;
  pacienteId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: string;
  notas?: string;
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
    telefono: string;
    email?: string;
  };
}

export const citasKeys = {
  all: ['citas'] as const,
  list: () => [...citasKeys.all, 'list'] as const,
  detail: (id: string) => [...citasKeys.all, 'detail', id] as const,
};

export function useCitas() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: citasKeys.list(),
    queryFn: () => api.get<Cita[]>('/citas'),
  });

  const removeCita = (id: string) => {
    queryClient.setQueryData<Cita[]>(citasKeys.list(), (prev) =>
      prev ? prev.filter((c) => c.id !== id) : prev,
    );
  };

  return {
    citas: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: () => refetch(),
    removeCita,
  };
}
