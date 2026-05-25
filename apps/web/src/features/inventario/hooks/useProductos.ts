'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';

export type ProductoTipo = 'COSMECEUTICO' | 'DERMOCOSMETICO' | 'EQUIPO' | 'INSUMO';

export interface Producto {
  id: string;
  nombre: string;
  tipo: ProductoTipo;
  precio: number;
  stock: number;
  stockMinimo: number;
  unidad: string;
  descripcion?: string;
}

export const productosKeys = {
  all: ['productos'] as const,
  list: () => [...productosKeys.all, 'list'] as const,
};

export function useProductos() {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: productosKeys.list(),
    queryFn: async () => {
      const raw = await api.get<Producto[]>('/productos');
      return raw.map((p) => ({ ...p, precio: Number(p.precio) }));
    },
  });

  const stockMut = useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      api.patch(`/productos/${id}`, { stock }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productosKeys.list() });
    },
  });

  return {
    productos: data ?? [],
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: () => refetch(),
    actualizarStock: (id: string, stock: number) => stockMut.mutateAsync({ id, stock }),
  };
}
