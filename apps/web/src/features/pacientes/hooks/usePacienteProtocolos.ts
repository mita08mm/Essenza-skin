'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { pacientesKeys } from './usePacientes';

export interface PrescripcionItem {
  id: string;
  nombre: string;
  indicaciones: string;
}

export interface Prescripcion {
  id: string;
  nombre?: string;
  fecha?: string;
  items: PrescripcionItem[];
}

export interface NuevaPrescripcionItem {
  nombre: string;
  indicaciones: string;
}

function buildPrescriptionName(items: NuevaPrescripcionItem[]): string {
  if (items.length === 1) return items[0].nombre;
  return `${items[0].nombre} y ${items.length - 1} más`;
}

function normalizePrescriptions(data: unknown[]): Prescripcion[] {
  return (data as Array<Record<string, unknown>>).map((raw) => ({
    id: String(raw.id ?? ''),
    nombre: raw.nombre as string | undefined,
    fecha: (raw.fecha ?? raw.createdAt) as string | undefined,
    items:
      (raw.items as Array<Record<string, unknown>> | undefined)?.map((item) => ({
        id: String(item.id ?? ''),
        nombre: String(item.nombre ?? ''),
        indicaciones: String(item.indicaciones ?? item.instrucciones ?? ''),
      })) ?? [],
  }));
}

export function usePacienteProtocolos(pacienteId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: pacientesKeys.protocolos(pacienteId),
    queryFn: async () => {
      const raw = await api.get<unknown[]>(`/pacientes/${pacienteId}/protocolos`);
      return normalizePrescriptions(raw);
    },
    enabled: Boolean(pacienteId),
  });

  const crearMut = useMutation({
    mutationFn: async (items: NuevaPrescripcionItem[]) => {
      if (items.length === 0) throw new Error('Agregue al menos un item');
      await api.post('/protocolos', {
        pacienteId,
        nombre: buildPrescriptionName(items),
        items,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pacientesKeys.protocolos(pacienteId) });
    },
  });

  return {
    prescripciones: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: () => refetch(),
    crearPrescripcion: (items: NuevaPrescripcionItem[]) => crearMut.mutateAsync(items),
  };
}
