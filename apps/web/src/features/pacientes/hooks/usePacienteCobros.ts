'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api';
import { pacientesKeys } from './usePacientes';

export interface CobroItem {
  id?: string;
  tipo?: string;
  nombre?: string;
  precioUnitario?: number | string;
  cantidad?: number;
}

export interface CobroPago {
  monto?: number | string;
}

export interface CobroRaw {
  id?: string;
  total?: number | string;
  items?: CobroItem[];
  pagos?: CobroPago[];
}

export interface CobroRow {
  id: string;
  cobroId: string;
  titulo: string;
  tipo: 'SERVICIO' | 'PRODUCTO';
  costo: number;
  pagado: number;
  pendiente: number;
  total: number;
}

export interface CobroTotales {
  costoTotal: number;
  pagadoTotal: number;
  pendienteTotal: number;
}

export interface CrearCobroPayload {
  titulo: string;
  costo: number;
  pagado: number;
}

function normalizeCobros(data: CobroRaw[]): CobroRow[] {
  return data.flatMap((raw, index) => {
    const total = Number(raw.total ?? 0);
    const pagado = (raw.pagos ?? []).reduce((sum, p) => sum + Number(p.monto ?? 0), 0);
    const pendiente = Math.max(total - pagado, 0);
    const cobroId = raw.id ?? `cobro-${index}`;

    if (!raw.items || raw.items.length === 0) {
      return [
        {
          id: cobroId,
          cobroId,
          titulo: 'Cobro',
          tipo: 'SERVICIO',
          costo: total,
          pagado,
          pendiente,
          total,
        },
      ];
    }

    return raw.items.map((item, itemIndex) => ({
      id: item.id ?? `${cobroId}-${itemIndex}`,
      cobroId,
      titulo: item.nombre ?? 'Cobro',
      tipo: (item.tipo === 'PRODUCTO' ? 'PRODUCTO' : 'SERVICIO') as 'SERVICIO' | 'PRODUCTO',
      costo: Number(item.precioUnitario ?? 0) * Number(item.cantidad ?? 1),
      pagado,
      pendiente,
      total,
    }));
  });
}

function calcularTotales(rows: CobroRow[]): CobroTotales {
  const seen = new Set<string>();
  let costoTotal = 0;
  let pagadoTotal = 0;
  let pendienteTotal = 0;

  rows.forEach((row) => {
    costoTotal += row.costo;
    if (!seen.has(row.cobroId)) {
      seen.add(row.cobroId);
      pagadoTotal += row.pagado;
      pendienteTotal += row.pendiente;
    }
  });

  return { costoTotal, pagadoTotal, pendienteTotal };
}

export function usePacienteCobros(pacienteId: string) {
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: pacientesKeys.cobros(pacienteId),
    queryFn: () => api.get<CobroRaw[]>('/cobros', { params: { pacienteId } }),
    enabled: Boolean(pacienteId),
  });

  const cobros = data ? normalizeCobros(data) : [];
  const totales = calcularTotales(cobros);

  const crearCobroMut = useMutation({
    mutationFn: async ({ titulo, costo, pagado }: CrearCobroPayload) => {
      const cobro = await api.post<{ id: string }>('/cobros', {
        pacienteId,
        items: [{ tipo: 'PAQUETE', nombre: titulo, cantidad: 1, precioUnitario: costo }],
      });

      if (pagado > 0 && cobro?.id) {
        await api.post(`/cobros/${cobro.id}/pago`, {
          monto: pagado,
          metodoPago: 'EFECTIVO',
          notas: 'Registro manual desde historia del paciente',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pacientesKeys.cobros(pacienteId) });
      queryClient.invalidateQueries({ queryKey: pacientesKeys.saldo(pacienteId) });
      queryClient.invalidateQueries({ queryKey: ['cobros'] });
    },
  });

  return {
    cobros,
    totales,
    isLoading,
    error: error instanceof Error ? error.message : null,
    refresh: () => refetch(),
    crearCobro: (payload: CrearCobroPayload) => crearCobroMut.mutateAsync(payload),
  };
}
