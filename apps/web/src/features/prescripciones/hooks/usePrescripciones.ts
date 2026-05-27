'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api';

export interface Prescripcion {
  id: string;
  fecha: string;
  nombre: string;
  paciente: { id: string; nombre: string; apellido: string };
  items: Array<{ id: string; nombre: string; indicaciones: string }>;
}

interface RawPrescripcion {
  id?: string;
  fecha?: string;
  nombre?: string;
  paciente?: { id?: string; nombre?: string; apellido?: string };
  items?: Array<{
    id?: string;
    nombre?: string;
    indicaciones?: string;
    aplicacion?: string;
    frecuencia?: string;
  }>;
}

export const recetasKeys = {
  all: ['recetas'] as const,
  list: () => [...recetasKeys.all, 'list'] as const,
  detail: (id: string) => [...recetasKeys.all, 'detail', id] as const,
};

function normalize(data: RawPrescripcion[]): Prescripcion[] {
  return data.map((raw, index) => {
    const items = (raw.items ?? []).map((item, itemIndex) => ({
      id: item.id ?? `${raw.id ?? index}-${itemIndex}`,
      nombre: item.nombre ?? 'Item',
      indicaciones: item.indicaciones ?? item.aplicacion ?? item.frecuencia ?? '',
    }));
    return {
      id: raw.id ?? `prescripcion-${index}`,
      fecha: raw.fecha ?? new Date().toISOString(),
      nombre: raw.nombre ?? (items[0]?.nombre || 'Prescripción'),
      paciente: {
        id: raw.paciente?.id ?? '',
        nombre: raw.paciente?.nombre ?? 'Paciente',
        apellido: raw.paciente?.apellido ?? '',
      },
      items,
    };
  });
}

export function usePrescripciones() {
  const { data, isLoading, error } = useQuery({
    queryKey: recetasKeys.list(),
    queryFn: async () => {
      const raw = await api.get<RawPrescripcion[]>('/prescripciones');
      return normalize(raw);
    },
  });

  return {
    prescripciones: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
