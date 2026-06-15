'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { historiaClinicaKeys } from './useHistoriaClinica';

export function useEliminarTratamiento(pacienteId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (tratamientoId: string) => api.delete(`/tratamientos/${tratamientoId}`),
    onSuccess: () => {
      // Invalidar la historia clínica para recargar la lista de tratamientos
      queryClient.invalidateQueries({ queryKey: historiaClinicaKeys.detail(pacienteId) });
    },
  });

  return {
    eliminar: (tratamientoId: string) => mutation.mutateAsync(tratamientoId),
    isLoading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
  };
}
