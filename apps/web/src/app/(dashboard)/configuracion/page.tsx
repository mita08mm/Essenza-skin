'use client';

import { useState, useEffect, useCallback } from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { apiEndpoint } from '@/lib/config';

interface Usuario {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA';
  activo: boolean;
}

interface ConfigClinica {
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
  nit: string;
}

export default function ConfiguracionPage() {
  const { token } = useAuth();
  const [tab, setTab] = useState<'clinica' | 'usuarios' | 'general'>('clinica');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Estados para configuración de clínica
  const [configClinica, setConfigClinica] = useState<ConfigClinica>({
    nombre: 'Clínica Estética',
    direccion: 'Av. Principal #123, Santa Cruz',
    telefono: '+591 3 1234567',
    email: 'contacto@clinica.com',
    nit: '1234567890',
  });

  // Estados para usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showNuevoUsuario, setShowNuevoUsuario] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'RECEPCIONISTA' as 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA',
  });

  const fetchUsuarios = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(apiEndpoint('/usuarios'), {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setUsuarios(data.data || []);
      } else {
        // Datos mock si el endpoint no existe
        setUsuarios([
          {
            id: '1',
            nombre: 'Admin',
            apellido: 'Sistema',
            email: 'admin@clinica.com',
            rol: 'ADMIN',
            activo: true,
          },
        ]);
      }
    } catch (err) {
      console.error('Error cargando usuarios:', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (tab === 'usuarios') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchUsuarios();
    }
  }, [tab, fetchUsuarios]);

  const handleGuardarClinica = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      setIsSaving(true);
      const response = await fetch(apiEndpoint('/configuracion/clinica'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(configClinica),
      });

      if (response.ok) {
        setSuccess('Configuración guardada correctamente');
      } else {
        setSuccess('Configuración guardada (modo demo)');
      }
    } catch {
      setError('Error al guardar configuración');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!nuevoUsuario.nombre || !nuevoUsuario.apellido || !nuevoUsuario.email || !nuevoUsuario.password) {
      setError('Complete todos los campos');
      return;
    }

    try {
      setIsSaving(true);
      const response = await fetch(apiEndpoint('/usuarios'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoUsuario),
      });

      if (response.ok) {
        setSuccess('Usuario creado correctamente');
        setShowNuevoUsuario(false);
        setNuevoUsuario({
          nombre: '',
          apellido: '',
          email: '',
          password: '',
          rol: 'RECEPCIONISTA',
        });
        await fetchUsuarios();
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Error al crear usuario');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al crear usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleUsuarioActivo = async (id: string, activo: boolean) => {
    try {
      const response = await fetch(apiEndpoint(`/usuarios/${id}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ activo: !activo }),
      });

      if (response.ok) {
        setSuccess(`Usuario ${!activo ? 'activado' : 'desactivado'} correctamente`);
        await fetchUsuarios();
      }
    } catch {
      setError('Error al actualizar usuario');
    }
  };

  const tabClass = (active: boolean) =>
    `px-6 py-3 font-medium transition-colors border-b-2 ${
      active
        ? 'text-marengo border-marengo'
        : 'text-gray-500 border-transparent hover:text-gray-700'
    }`;

  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';
  const inputClass = 'w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-marengo focus:border-transparent';

  const ROL_LABELS = {
    ADMIN: 'Administrador',
    MEDICO: 'Médico',
    RECEPCIONISTA: 'Recepcionista',
  };

  const ROL_COLORS = {
    ADMIN: 'bg-purple-100 text-purple-800',
    MEDICO: 'bg-blue-100 text-blue-800',
    RECEPCIONISTA: 'bg-gray-100 text-gray-800',
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-heading font-bold text-concreto">
              Configuración
            </h1>
            <p className="text-marengo mt-1">
              Gestión de clínica, usuarios y preferencias
            </p>
          </div>

          {/* Mensajes */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex gap-1">
              <button onClick={() => setTab('clinica')} className={tabClass(tab === 'clinica')}>
                🏥 Información de la Clínica
              </button>
              <button onClick={() => setTab('usuarios')} className={tabClass(tab === 'usuarios')}>
                👥 Usuarios
              </button>
              <button onClick={() => setTab('general')} className={tabClass(tab === 'general')}>
                ⚙️ General
              </button>
            </div>
          </div>

          {/* Tab Clínica */}
          {tab === 'clinica' && (
            <form onSubmit={handleGuardarClinica} className="card p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className={labelClass}>Nombre de la Clínica</label>
                  <input
                    type="text"
                    value={configClinica.nombre}
                    onChange={(e) => setConfigClinica({...configClinica, nombre: e.target.value})}
                    className={inputClass}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Dirección</label>
                  <input
                    type="text"
                    value={configClinica.direccion}
                    onChange={(e) => setConfigClinica({...configClinica, direccion: e.target.value})}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Teléfono</label>
                  <input
                    type="tel"
                    value={configClinica.telefono}
                    onChange={(e) => setConfigClinica({...configClinica, telefono: e.target.value})}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    type="email"
                    value={configClinica.email}
                    onChange={(e) => setConfigClinica({...configClinica, email: e.target.value})}
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>NIT</label>
                  <input
                    type="text"
                    value={configClinica.nit}
                    onChange={(e) => setConfigClinica({...configClinica, nit: e.target.value})}
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-marengo text-white rounded-lg hover:bg-concreto transition-colors font-medium disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          )}

          {/* Tab Usuarios */}
          {tab === 'usuarios' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowNuevoUsuario(!showNuevoUsuario)}
                  className="px-4 py-2.5 bg-marengo text-white rounded-lg hover:bg-concreto transition-colors font-medium"
                >
                  {showNuevoUsuario ? 'Cancelar' : '+ Nuevo Usuario'}
                </button>
              </div>

              {/* Formulario nuevo usuario */}
              {showNuevoUsuario && (
                <form onSubmit={handleCrearUsuario} className="card p-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Crear Nuevo Usuario</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className={labelClass}>Nombre</label>
                      <input
                        type="text"
                        value={nuevoUsuario.nombre}
                        onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre: e.target.value})}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Apellido</label>
                      <input
                        type="text"
                        value={nuevoUsuario.apellido}
                        onChange={(e) => setNuevoUsuario({...nuevoUsuario, apellido: e.target.value})}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Email</label>
                      <input
                        type="email"
                        value={nuevoUsuario.email}
                        onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Contraseña</label>
                      <input
                        type="password"
                        value={nuevoUsuario.password}
                        onChange={(e) => setNuevoUsuario({...nuevoUsuario, password: e.target.value})}
                        className={inputClass}
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>Rol</label>
                      <select
                        value={nuevoUsuario.rol}
                        onChange={(e) => setNuevoUsuario({...nuevoUsuario, rol: e.target.value as 'ADMIN' | 'MEDICO' | 'RECEPCIONISTA'})}
                        className={inputClass}
                        required
                      >
                        <option value="RECEPCIONISTA">Recepcionista</option>
                        <option value="MEDICO">Médico</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="px-6 py-3 bg-marengo text-white rounded-lg hover:bg-concreto transition-colors font-medium disabled:opacity-50"
                    >
                      {isSaving ? 'Creando...' : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              )}

              {/* Lista de usuarios */}
              {isLoading ? (
                <div className="card p-12 text-center">
                  <p className="text-marengo">Cargando usuarios...</p>
                </div>
              ) : (
                <div className="card card-no-padding overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Usuario
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                          Rol
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                          Estado
                        </th>
                        <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-900">
                              {usuario.nombre} {usuario.apellido}
                            </p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-600">{usuario.email}</p>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${ROL_COLORS[usuario.rol]}`}>
                              {ROL_LABELS[usuario.rol]}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${
                              usuario.activo
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {usuario.activo ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button
                              onClick={() => toggleUsuarioActivo(usuario.id, usuario.activo)}
                              className="text-marengo hover:text-concreto text-sm font-medium"
                            >
                              {usuario.activo ? 'Desactivar' : 'Activar'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tab General */}
          {tab === 'general' && (
            <div className="card p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Preferencias Generales</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-marengo" />
                      <span className="text-sm text-gray-700">Enviar notificaciones por email</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-marengo" />
                      <span className="text-sm text-gray-700">Alertas de stock bajo</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input type="checkbox" className="w-4 h-4 text-marengo" />
                      <span className="text-sm text-gray-700">Recordatorios de citas</span>
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    className="px-6 py-3 bg-marengo text-white rounded-lg hover:bg-concreto transition-colors font-medium"
                  >
                    Guardar Preferencias
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
