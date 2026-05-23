'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { apiEndpoint } from '@/lib/config';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
}

interface Cobro {
  id: string;
  fecha: string;
  total: number;
  paciente: Paciente;
  items?: Array<{ id: string; nombre: string }>;
  pagos: Array<{ monto: number }>;
}

export default function CobrosPage() {
  const [cobros, setCobros] = useState<Cobro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    const fetchCobros = async () => {
      try {
        const response = await fetch(apiEndpoint('/cobros'), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener cobros');
        }

        const data = await response.json();
        setCobros(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCobros();
  }, [token]);

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatMonto = (monto: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'USD',
    }).format(monto);
  };

  const calcularAbonado = (pagos: Array<{ monto: number }>) => {
    return pagos.reduce((sum, pago) => sum + Number(pago.monto), 0);
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-lg h-12 w-12 border-b-2 border-morena"></div>
            <span className="ml-3 text-marengo">Cargando registro de cobros...</span>
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
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
                Registro de cobros
              </h1>
              <p className="text-marengo mt-1">
                Lista para revisar a quien necesitas cobrar
              </p>
            </div>
            <Link
              href="/cobros/nuevo"
              className="btn-primary"
            >
              Nuevo registro
            </Link>
          </div>

          {cobros.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-xl font-heading font-semibold text-concreto mb-2">
                No hay registros de cobro
              </h3>
              <p className="text-marengo mb-6">
                Agrega un registro para recordar a quien necesitas cobrar
              </p>
              <Link
                href="/cobros/nuevo"
                className="inline-block px-6 py-3 bg-piel text-morena rounded-lg 
                         hover:bg-piel/90 transition-all"
              >
                Crear primer registro
              </Link>
            </div>
          ) : (
            <div className="card card-no-padding overflow-hidden">
              <table className="min-w-full divide-y divide-marengo/20">
                <thead className="bg-piel/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-concreto uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-concreto uppercase tracking-wider">
                      Paciente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-concreto uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-concreto uppercase tracking-wider">
                      Monto
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-concreto uppercase tracking-wider">
                      Abonado
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-concreto uppercase tracking-wider">
                      Pendiente
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-concreto uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-marengo/10">
                  {cobros.map((cobro) => {
                    const abonado = calcularAbonado(cobro.pagos || []);
                    const pendiente = Math.max(Number(cobro.total) - abonado, 0);

                    return (
                      <tr key={cobro.id} className="hover:bg-piel/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-concreto">
                          {formatFecha(cobro.fecha)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-concreto">
                            {cobro.paciente.nombre} {cobro.paciente.apellido}
                          </div>
                          <div className="text-sm text-marengo">
                            {cobro.paciente.tipoDocumento}: {cobro.paciente.documento}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-concreto">
                          {buildCobroTitle(cobro)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-concreto text-right font-medium">
                          {formatMonto(Number(cobro.total))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-concreto text-right">
                          {formatMonto(abonado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 text-right font-medium">
                          {formatMonto(pendiente)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Link
                            href={`/cobros/${cobro.id}`}
                            className="text-morena hover:text-morena/80 font-medium"
                          >
                            Ver registro
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

function buildCobroTitle(cobro: Cobro) {
  if (!cobro.items || cobro.items.length === 0) {
    return 'Registro de cobro';
  }

  if (cobro.items.length === 1) {
    return cobro.items[0].nombre;
  }

  return `${cobro.items[0].nombre} y ${cobro.items.length - 1} mas`;
}
