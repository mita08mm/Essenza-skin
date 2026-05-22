'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiEndpoint } from '@/lib/config';
import { formatFecha } from '@/lib/utils/date';

interface ItemReceta {
  id: string;
  tipo: string;
  nombre: string;
  cantidad: number;
  dosis?: string;
  frecuencia?: string;
  duracion?: string;
  estado: string;
}

interface Receta {
  id: string;
  fecha: string;
  indicaciones?: string;
  paciente: {
    id: string;
    nombre: string;
    apellido: string;
    documento: string;
  };
  usuario: {
    nombre: string;
    apellido?: string;
  };
  items: ItemReceta[];
}

function RecetaDetailContent() {
  const params = useParams();
  const { token } = useAuth();
  const recetaId = params.id as string;

  const [receta, setReceta] = useState<Receta | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchReceta = async () => {
      try {
        const response = await fetch(apiEndpoint(`/recetas/${recetaId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al cargar receta');

        const data = await response.json();
        setReceta(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReceta();
  }, [recetaId, token]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-lg h-12 w-12 border-b-2 border-morena"></div>
      </div>
    );
  }

  if (error || !receta) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error || 'Receta no encontrada'}</p>
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
            Receta Médica
          </h1>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-marengo">Paciente:</span>
            <p className="font-medium text-concreto">
              {receta.paciente.nombre} {receta.paciente.apellido}
            </p>
          </div>
          <div>
            <span className="text-marengo">Fecha:</span>
            <p className="font-medium text-concreto">{formatFecha(receta.fecha)}</p>
          </div>
          <div>
            <span className="text-marengo">Médico:</span>
            <p className="font-medium text-concreto">
              Dr. {receta.usuario.nombre} {receta.usuario.apellido || ''}
            </p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="card p-6">
        <h2 className="text-xl font-heading font-bold text-concreto mb-4">
          Prescripción
        </h2>

        <div className="space-y-3">
          {receta.items.map((item) => (
            <div
              key={item.id}
              className="p-4 border border-gray-200 rounded-lg hover:border-morena/30 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-semibold text-concreto">{item.nombre}</h3>
                  <p className="text-xs text-marengo mt-1">{item.tipo}</p>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-lg ${
                    item.estado === 'ENTREGADO'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {item.estado}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 text-sm mt-3">
                <div>
                  <span className="text-marengo text-xs">Cantidad:</span>
                  <p className="font-medium">{item.cantidad}</p>
                </div>
                {item.dosis && (
                  <div>
                    <span className="text-marengo text-xs">Dosis:</span>
                    <p className="font-medium">{item.dosis}</p>
                  </div>
                )}
                {item.frecuencia && (
                  <div>
                    <span className="text-marengo text-xs">Frecuencia:</span>
                    <p className="font-medium">{item.frecuencia}</p>
                  </div>
                )}
                {item.duracion && (
                  <div>
                    <span className="text-marengo text-xs">Duración:</span>
                    <p className="font-medium">{item.duracion}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicaciones */}
      {receta.indicaciones && (
        <div className="card p-6">
          <h2 className="text-xl font-heading font-bold text-concreto mb-4">
            Indicaciones Generales
          </h2>
          <p className="text-marengo whitespace-pre-line">{receta.indicaciones}</p>
        </div>
      )}

      {/* Botón de impresión */}
      <div className="flex justify-end">
        <button
          onClick={() => window.print()}
          className="btn-secondary"
        >
          🖨️ Imprimir Receta
        </button>
      </div>
    </div>
  );
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
