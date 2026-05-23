'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiEndpoint } from '@/lib/config';
import { formatFecha } from '@/lib/utils/date';

interface Prescripcion {
  id: string;
  fecha: string;
  nombre: string;
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
  };
  items: Array<{
    id: string;
    nombre: string;
    indicaciones: string;
  }>;
}

function RecetaDetailContent() {
  const params = useParams();
  const { token } = useAuth();
  const recetaId = params.id as string;

  const [prescripcion, setPrescripcion] = useState<Prescripcion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchPrescripcion = async () => {
      try {
        const response = await fetch(apiEndpoint(`/protocolos/${recetaId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al cargar prescripción');

        const data = await response.json();
        setPrescripcion(normalizePrescripcion(data.data));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescripcion();
  }, [recetaId, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-lg h-12 w-12 border-b-2 border-morena"></div>
      </div>
    );
  }

  if (error || !prescripcion) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error || 'Prescripción no encontrada'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/recetas" className="text-marengo hover:text-concreto">
            ← Volver
          </Link>
          <h1 className="text-3xl font-heading font-bold text-concreto">
            Prescripción
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-marengo">Paciente:</span>
            <p className="font-medium text-concreto">
              {prescripcion.paciente.nombre} {prescripcion.paciente.apellido}
            </p>
          </div>
          <div>
            <span className="text-marengo">Fecha:</span>
            <p className="font-medium text-concreto">{formatFecha(prescripcion.fecha)}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-concreto mb-4">
          {prescripcion.nombre}
        </h2>

        <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
          <div className="hidden grid-cols-[minmax(0,220px)_minmax(0,1fr)] gap-4 border-b border-stone-200 px-4 py-3 text-[11px] font-medium uppercase tracking-[0.18em] text-marengo/70 sm:grid">
            <p>Nombre del producto</p>
            <p>Indicaciones</p>
          </div>
          {prescripcion.items.map((item) => (
            <div key={item.id} className="grid grid-cols-1 gap-2 border-t border-stone-200 px-4 py-4 first:border-t-0 sm:grid-cols-[minmax(0,220px)_minmax(0,1fr)] sm:gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-marengo/60 sm:hidden">Nombre del producto</p>
                <p className="text-sm font-medium text-concreto">{item.nombre}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-marengo/60 sm:hidden">Indicaciones</p>
                <p className="text-sm text-marengo">{item.indicaciones || 'Sin indicaciones'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botón de impresión */}
      <div className="flex justify-end">
        <button
          onClick={() => window.print()}
          className="btn-secondary"
        >
          🖨️ Imprimir Prescripción
        </button>
      </div>
    </div>
  );
}

function normalizePrescripcion(entry: unknown): Prescripcion {
  const raw = entry as {
    id?: string;
    fecha?: string;
    nombre?: string;
    paciente?: { id?: string; nombre?: string; apellido?: string };
    items?: Array<{ id?: string; nombre?: string; indicaciones?: string; aplicacion?: string; frecuencia?: string }>;
  };

  return {
    id: raw.id ?? '',
    fecha: raw.fecha ?? new Date().toISOString(),
    nombre: raw.nombre ?? 'Prescripción',
    paciente: {
      id: raw.paciente?.id ?? '',
      nombre: raw.paciente?.nombre ?? 'Paciente',
      apellido: raw.paciente?.apellido ?? '',
    },
    items: (raw.items ?? []).map((item, index) => ({
      id: item.id ?? `item-${index}`,
      nombre: item.nombre ?? 'Item',
      indicaciones: item.indicaciones ?? item.aplicacion ?? item.frecuencia ?? '',
    })),
  };
}

export default function RecetaDetailPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <RecetaDetailContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
