'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { HistoriaClinica } from '@/features/historia-clinica/types';

export const historiaClinicaKeys = {
  all: ['historia-clinica'] as const,
  detail: (pacienteId: string) => [...historiaClinicaKeys.all, pacienteId] as const,
};

export function useHistoriaClinica(pacienteId: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: historiaClinicaKeys.detail(pacienteId),
    queryFn: () => api.get<HistoriaClinica>(`/pacientes/${pacienteId}/historia-clinica`),
    enabled: Boolean(pacienteId),
  });

  return {
    historia: data ?? null,
    isLoading,
    error: error instanceof Error ? error.message : '',
    refresh: () => refetch(),
  };
}
