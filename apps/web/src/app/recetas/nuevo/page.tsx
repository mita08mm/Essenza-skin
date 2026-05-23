'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  estado: string;
}

interface Item {
  id: string;
  nombre: string;
  indicaciones: string;
}

export default function NuevaRecetaPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loadingPacientes, setLoadingPacientes] = useState(true);

  const [pacienteId, setPacienteId] = useState('');
  const [items, setItems] = useState<Item[]>([]);
  const [nombreItem, setNombreItem] = useState('');
  const [indicaciones, setIndicaciones] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchPacientes = async () => {
      try {
        const response = await fetch(apiEndpoint('/pacientes'), {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar pacientes');
        }

        const data = await response.json();
        setPacientes(data.data.filter((p: Paciente) => p.estado === 'ACTIVO'));
      } catch (err) {
        console.error('Error cargando pacientes:', err);
      } finally {
        setLoadingPacientes(false);
      }
    };

    fetchPacientes();
  }, [token]);

  const agregarItem = () => {
    if (!nombreItem.trim() || !indicaciones.trim()) {
      setError('Complete el nombre y las indicaciones');
      return;
    }

    setItems([...items, {
      id: crypto.randomUUID(),
      nombre: nombreItem.trim(),
      indicaciones: indicaciones.trim(),
    }]);
    setNombreItem('');
    setIndicaciones('');
    setError('');
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (items.length === 0) {
      setError('Debe agregar al menos un item a la prescripción');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint('/protocolos'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          pacienteId,
          nombre: buildPrescriptionName(items),
          items: items.map((item) => ({
            nombre: item.nombre,
            indicaciones: item.indicaciones,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear prescripción');
      }

      router.push('/recetas');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="max-w-5xl space-y-6">
          <div className="flex items-center gap-4">
            <Link href="/recetas" className="text-marengo hover:text-concreto">
              ← Volver
            </Link>
            <div>
              <h1 className="text-3xl font-heading font-bold text-concreto">
                Nueva Prescripción
              </h1>
              <p className="text-marengo mt-1">
                Registro simple de nombre del producto e indicaciones
              </p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de paciente */}
            <div className="card p-8">
              <h2 className="text-xl font-heading font-bold text-concreto mb-4">
                Paciente
              </h2>
              {loadingPacientes ? (
                <div className="text-sm text-marengo">Cargando pacientes...</div>
              ) : (
                <select
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-marengo/30 
                           focus:border-morena focus:ring-2 focus:ring-piel/20 
                           transition-all outline-none"
                  required
                  disabled={isLoading}
                >
                  <option value="">Seleccione un paciente</option>
                  {pacientes.map((paciente) => (
                    <option key={paciente.id} value={paciente.id}>
                      {paciente.nombre} {paciente.apellido} - {paciente.tipoDocumento}: {paciente.documento}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Items de la prescripción */}
            <div className="card p-8">
              <h2 className="text-xl font-heading font-bold text-concreto mb-4">
                Lista de prescripción
              </h2>

              <div className="space-y-5 rounded-lg bg-piel/10 p-4">
                <div>
                  <label className="block text-xs font-medium text-concreto mb-2">
                    Nombre del producto
                  </label>
                  <input
                    type="text"
                    value={nombreItem}
                    onChange={(e) => setNombreItem(e.target.value)}
                    placeholder="Ej: Protector solar, crema reparadora"
                    className="w-full px-3 py-2 text-sm rounded border border-marengo/30 
                             focus:border-morena outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-concreto mb-2">
                    Indicaciones
                  </label>
                  <textarea
                    value={indicaciones}
                    onChange={(e) => setIndicaciones(e.target.value)}
                    rows={3}
                    placeholder="Ej: Aplicar por la noche durante 30 días"
                    className="w-full px-3 py-2 text-sm rounded border border-marengo/30 
                             focus:border-morena outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={agregarItem}
                    className="btn-primary"
                  >
                    Agregar
                  </button>
                </div>
              </div>

              {/* Lista de items */}
              {items.length > 0 ? (
                <div className="border border-marengo/20 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-marengo/20">
                    <thead className="bg-marengo/10">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-concreto">Nombre</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-concreto">Indicaciones</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-marengo/10">
                      {items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-concreto">{item.nombre}</td>
                          <td className="px-4 py-3 text-sm text-marengo">{item.indicaciones}</td>
                          <td className="px-4 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => eliminarItem(index)}
                              className="text-red-600 hover:text-red-800 text-sm"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-marengo">
                  No hay items agregados. Agregue al menos uno para continuar.
                </div>
              )}
            </div>

            {/* Indicaciones generales */}
            <div className="card p-8">
              <h2 className="text-xl font-heading font-bold text-concreto mb-4">
                Indicaciones Generales
              </h2>
              <textarea
                value={indicaciones}
                onChange={(e) => setIndicaciones(e.target.value)}
                rows={4}
                placeholder="Instrucciones adicionales para el paciente..."
                className="w-full px-4 py-3 rounded-lg border border-marengo/30 
                         focus:border-morena focus:ring-2 focus:ring-piel/20 
                         transition-all outline-none resize-none"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading || items.length === 0}
                className="btn-primary"
              >
                {isLoading ? 'Guardando...' : 'Guardar Prescripción'}
              </button>
              <Link
                href="/recetas"
                className="btn-secondary"
              >
                Cancelar
              </Link>
            </div>
          </form>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

function buildPrescriptionName(items: Item[]) {
  if (items.length === 1) {
    return items[0].nombre;
  }

  return `${items[0].nombre} y ${items.length - 1} mas`;
}
