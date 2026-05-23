'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { apiEndpoint } from '@/lib/config';

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

export default function RecetasPage() {
  const { token } = useAuth();
  const [prescripciones, setPrescripciones] = useState<Prescripcion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchPrescripciones = async () => {
      try {
        const response = await fetch(apiEndpoint('/protocolos'), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar prescripciones');
        }

        const data = await response.json();
        setPrescripciones(normalizePrescripciones(data.data || []));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrescripciones();
  }, [token]);

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-lg h-12 w-12 border-b-2 border-morena mx-auto mb-4"></div>
              <p className="text-marengo">Cargando prescripciones...</p>
            </div>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-heading font-bold text-concreto">
                Prescripciones
              </h1>
              <p className="text-marengo mt-1">
                Lista general de prescripciones registradas
              </p>
            </div>
            <Link
              href="/recetas/nuevo"
              className="btn-primary"
            >
              Nueva Prescripción
            </Link>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {prescripciones.length === 0 ? (
            <div className="card p-12 text-center">
              <p className="text-marengo mb-4">
                No hay prescripciones registradas
              </p>
              <Link
                href="/recetas/nuevo"
                className="btn-primary"
              >
                Crear primera prescripción
              </Link>
            </div>
          ) : (
            <div className="card card-no-padding overflow-hidden">
              <table className="min-w-full divide-y divide-marengo/20">
                <thead className="bg-marengo/10">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-concreto uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-concreto uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-concreto uppercase tracking-wider">
                      Prescripción
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-concreto uppercase tracking-wider">
                      Indicaciones
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-concreto uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-marengo/10">
                  {prescripciones.map((prescripcion) => {
                    return (
                      <tr key={prescripcion.id} className="hover:bg-piel/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-concreto">
                          {formatFecha(prescripcion.fecha)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-concreto">
                            {prescripcion.paciente.nombre} {prescripcion.paciente.apellido}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-concreto">
                          <div className="font-medium">{prescripcion.nombre}</div>
                          <div className="text-xs text-marengo">{prescripcion.items.length} item{prescripcion.items.length === 1 ? '' : 's'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-marengo">
                          {prescripcion.items.map((item) => item.indicaciones).filter(Boolean).join(' • ') || 'Sin indicaciones'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <Link
                            href={`/recetas/${prescripcion.id}`}
                            className="text-morena hover:text-morena/80 font-medium"
                          >
                            Ver prescripción
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function normalizePrescripciones(data: unknown[]): Prescripcion[] {
  return data.map((entry, index) => {
    const raw = entry as {
      id?: string;
      fecha?: string;
      nombre?: string;
      paciente?: { id?: string; nombre?: string; apellido?: string };
      items?: Array<{ id?: string; nombre?: string; indicaciones?: string; aplicacion?: string; frecuencia?: string }>;
    };

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
