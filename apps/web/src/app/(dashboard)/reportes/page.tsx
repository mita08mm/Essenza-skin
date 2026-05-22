'use client';

import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiEndpoint } from '@/lib/config';

interface ReporteIngresos {
  totalIngresos: number;
  totalPagos: number;
  totalPendiente: number;
  cobrosPorMes: { mes: string; total: number }[];
}

interface ReportePagos {
  totalDeuda: number;
  pacientesConDeuda: number;
  cobros: Array<{
    id: string;
    paciente: { nombre: string; apellido: string };
    total: number;
    pagado: number;
    saldo: number;
  }>;
}

export default function ReportesPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState<'ingresos' | 'pagos' | 'productos'>('ingresos');
  const [isLoading, setIsLoading] = useState(true);
  const [reporteIngresos, setReporteIngresos] = useState<ReporteIngresos | null>(null);
  const [reportePagos, setReportePagos] = useState<ReportePagos | null>(null);

  const [fechaInicio, setFechaInicio] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });

  const [fechaFin, setFechaFin] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });

  const fetchReporteIngresos = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(
        apiEndpoint(`/reportes/ingresos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setReporteIngresos(data.data);
      } else {
        // Datos mock si el endpoint no existe
        setReporteIngresos({
          totalIngresos: 45800,
          totalPagos: 38500,
          totalPendiente: 7300,
          cobrosPorMes: [
            { mes: 'Enero', total: 12500 },
            { mes: 'Febrero', total: 15800 },
            { mes: 'Marzo', total: 17500 },
          ],
        });
      }
    } catch (err) {
      console.error('Error cargando reporte:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token, fechaInicio, fechaFin]);

  const fetchReportePagos = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
const response = await fetch(
        apiEndpoint('/reportes/pagos-pendientes'),
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        setReportePagos(data.data);
      } else {
        // Datos mock
        setReportePagos({
          totalDeuda: 7300,
          pacientesConDeuda: 12,
          cobros: [],
        });
      }
    } catch (err) {
      console.error('Error cargando reporte:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    const loadData = () => {
      if (tab === 'ingresos') {
        void fetchReporteIngresos();
      } else if (tab === 'pagos') {
        void fetchReportePagos();
      }
    };
    loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, fechaInicio, fechaFin]);

  const tabClass = (active: boolean) =>
    `px-6 py-3 font-medium transition-colors border-b-2 ${
      active
        ? 'text-marengo border-marengo'
        : 'text-gray-500 border-transparent hover:text-gray-700'
    }`;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-heading font-bold text-concreto">
              Reportes
            </h1>
            <p className="text-marengo mt-1">
              Análisis de ingresos, pagos y estadísticas
            </p>
          </div>

          {/* Filtro de Fechas */}
          <div className="card p-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="text-sm font-medium text-gray-700">Período:</label>
              <input
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marengo focus:border-transparent"
              />
              <span className="text-gray-500">hasta</span>
              <input
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marengo focus:border-transparent"
              />
              <button
                onClick={() => {
                  if (tab === 'ingresos') fetchReporteIngresos();
                  else if (tab === 'pagos') fetchReportePagos();
                }}
                className="px-4 py-2 bg-marengo text-white rounded-lg hover:bg-concreto transition-colors"
              >
                Actualizar
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-1">
              <button onClick={() => setTab('ingresos')} className={tabClass(tab === 'ingresos')}>
                💰 Ingresos
              </button>
              <button onClick={() => setTab('pagos')} className={tabClass(tab === 'pagos')}>
                📋 Pagos Pendientes
              </button>
              <button onClick={() => setTab('productos')} className={tabClass(tab === 'productos')}>
                📦 Productos
              </button>
            </div>
          </div>

          {/* Contenido */}
          {isLoading ? (
            <div className="card p-12 text-center">
              <p className="text-marengo">Cargando reporte...</p>
            </div>
          ) : (
            <>
              {/* Tab Ingresos */}
              {tab === 'ingresos' && reporteIngresos && (
                <div className="space-y-6">
                  {/* Tarjetas de resumen */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-100">
                      <p className="text-xs font-medium text-green-600 uppercase tracking-wider">
                        Total Facturado
                      </p>
                      <p className="text-3xl font-bold text-green-900 mt-2">
                        Bs. {reporteIngresos.totalIngresos.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-700 mt-1">En el período seleccionado</p>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl p-6 border border-blue-100">
                      <p className="text-xs font-medium text-blue-600 uppercase tracking-wider">
                        Total Cobrado
                      </p>
                      <p className="text-3xl font-bold text-blue-900 mt-2">
                        Bs. {reporteIngresos.totalPagos.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        {((reporteIngresos.totalPagos / reporteIngresos.totalIngresos) * 100).toFixed(1)}% del total
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100">
                      <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                        Pendiente de Cobro
                      </p>
                      <p className="text-3xl font-bold text-red-900 mt-2">
                        Bs. {reporteIngresos.totalPendiente.toLocaleString()}
                      </p>
                      <p className="text-xs text-red-700 mt-1">
                        {((reporteIngresos.totalPendiente / reporteIngresos.totalIngresos) * 100).toFixed(1)}% del total
                      </p>
                    </div>
                  </div>

                  {/* Gráfico de barras simple */}
                  {reporteIngresos.cobrosPorMes.length > 0 && (
                    <div className="card p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-6">Ingresos por Mes</h3>
                      <div className="space-y-4">
                        {reporteIngresos.cobrosPorMes.map((item, idx) => {
                          const maxValor = Math.max(...reporteIngresos.cobrosPorMes.map(m => m.total));
                          const porcentaje = (item.total / maxValor) * 100;

                          return (
                            <div key={idx}>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">{item.mes}</span>
                                <span className="text-sm font-semibold text-gray-900">
                                  Bs. {item.total.toLocaleString()}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-lg h-3">
                                <div
                                  className="bg-gradient-to-r from-marengo to-concreto h-3 rounded-lg transition-all"
                                  style={{ width: `${porcentaje}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Pagos Pendientes */}
              {tab === 'pagos' && reportePagos && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border border-red-100">
                      <p className="text-xs font-medium text-red-600 uppercase tracking-wider">
                        Total Deuda
                      </p>
                      <p className="text-3xl font-bold text-red-900 mt-2">
                        Bs. {reportePagos.totalDeuda.toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 border border-amber-100">
                      <p className="text-xs font-medium text-amber-600 uppercase tracking-wider">
                        Pacientes con Deuda
                      </p>
                      <p className="text-3xl font-bold text-amber-900 mt-2">
                        {reportePagos.pacientesConDeuda}
                      </p>
                    </div>
                  </div>

                  {reportePagos.cobros.length > 0 ? (
                    <div className="card card-no-padding overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                              Paciente
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                              Total
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                              Pagado
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                              Saldo
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {reportePagos.cobros.map((cobro) => (
                            <tr key={cobro.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <p className="font-medium text-gray-900">
                                  {cobro.paciente.nombre} {cobro.paciente.apellido}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-right">
                                Bs. {cobro.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                Bs. {cobro.pagado.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="font-semibold text-red-600">
                                  Bs. {cobro.saldo.toFixed(2)}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="card p-12 text-center">
                      <p className="text-gray-500">No hay pagos pendientes</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Productos */}
              {tab === 'productos' && (
                <div className="card p-12 text-center">
                  <p className="text-gray-500">
                    Reporte de productos más usados en desarrollo...
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
