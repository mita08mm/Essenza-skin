'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
  telefono: string;
  email?: string;
  estado: string;
  fechaNacimiento: string;
}

export const pacientesKeys = {
  all: ['pacientes'] as const,
  list: () => [...pacientesKeys.all, 'list'] as const,
  detail: (id: string) => [...pacientesKeys.all, 'detail', id] as const,
  saldo: (id: string) => [...pacientesKeys.all, 'saldo', id] as const,
  cobros: (id: string) => [...pacientesKeys.all, 'cobros', id] as const,
  protocolos: (id: string) => [...pacientesKeys.all, 'protocolos', id] as const,
};

export function usePacientes() {
  const { data, isLoading, error } = useQuery({
    queryKey: pacientesKeys.list(),
    queryFn: () => api.get<Paciente[]>('/pacientes'),
  });

  return {
    pacientes: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
