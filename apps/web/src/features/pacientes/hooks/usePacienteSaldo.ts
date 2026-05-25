'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { pacientesKeys } from './usePacientes';

export function usePacienteSaldo(pacienteId: string) {
  const { data, isLoading } = useQuery({
    queryKey: pacientesKeys.saldo(pacienteId),
    queryFn: () => api.get<{ saldo?: number }>(`/pacientes/${pacienteId}/saldo`),
    enabled: Boolean(pacienteId),
  });

  return { saldo: Number(data?.saldo ?? 0), isLoading };
}
