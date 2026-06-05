'use client';

import { useState, useEffect, useCallback } from 'react';
import { PageHeader } from '@/shared/layout/PageHeader';
import { FormSection, FormField } from '@/shared/forms/FormSection';
import { api, ApiError } from '@/shared/api/client';
import { inputBase, alertError, Tabs, DataTable, Button, type Column } from '@/shared/ui';

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
  ciudad?: string;
  pais?: string;
  logo?: string | null;
}

const ROL_LABELS = {
  ADMIN: 'Administrador',
  MEDICO: 'Médico',
  RECEPCIONISTA: 'Recepcionista',
};

const ROL_COLORS = {
  ADMIN: 'bg-[rgba(117,76,36,0.1)] text-brand-morena-dark',
  MEDICO: 'bg-info-bg text-info',
  RECEPCIONISTA: 'bg-neutral-100 text-neutral-700',
};

type Tab = 'clinica' | 'usuarios' | 'general';
const TABS = [
  { value: 'clinica' as const, label: 'Clínica' },
  { value: 'usuarios' as const, label: 'Usuarios' },
];

export function ConfiguracionView() {
  const [tab, setTab] = useState<Tab>('clinica');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [configClinica, setConfigClinica] = useState<ConfigClinica>({
    nombre: 'Clínica Estética',
    direccion: 'Av. Principal #123',
    telefono: '+591 3 1234567',
    email: 'contacto@clinica.com',
    nit: '1234567890',
    ciudad: 'Santa Cruz',
    pais: 'Bolivia',
    logo: null,
  });

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [showNuevoUsuario, setShowNuevoUsuario] = useState(false);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'RECEPCIONISTA' as Usuario['rol'],
  });

  // Cargar configuración de la clínica al montar
  useEffect(() => {
    const fetchConfigClinica = async () => {
      try {
        setIsLoading(true);
        const data = await api.get<ConfigClinica>('/configuracion');
        if (data) setConfigClinica(data);
      } catch (err) {
        console.error('Error cargando configuración:', err);
        // Mantener valores por defecto en caso de error
      } finally {
        setIsLoading(false);
      }
    };
    fetchConfigClinica();
  }, []);

  const fetchUsuarios = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await api.get<Usuario[]>('/usuarios');
      setUsuarios(data || []);
    } catch (err) {
      if (err instanceof ApiError) {
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
      } else {
        console.error('Error cargando usuarios:', err);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

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
      const updated = await api.put<ConfigClinica>('/configuracion', configClinica);
      if (updated) setConfigClinica(updated);
      setSuccess('Configuración guardada correctamente');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || 'Error al guardar configuración');
      } else {
        setError('Error al guardar configuración');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCrearUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (
      !nuevoUsuario.nombre ||
      !nuevoUsuario.apellido ||
      !nuevoUsuario.email ||
      !nuevoUsuario.password
    ) {
      setError('Complete todos los campos');
      return;
    }
    try {
      setIsSaving(true);
      await api.post('/usuarios', nuevoUsuario);
      setSuccess('Usuario creado correctamente');
      setShowNuevoUsuario(false);
      setNuevoUsuario({ nombre: '', apellido: '', email: '', password: '', rol: 'RECEPCIONISTA' });
      await fetchUsuarios();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleUsuarioActivo = async (id: string, activo: boolean) => {
    try {
      await api.patch(`/usuarios/${id}`, { activo: !activo });
      setSuccess(`Usuario ${!activo ? 'activado' : 'desactivado'} correctamente`);
      await fetchUsuarios();
    } catch {
      setError('Error al actualizar usuario');
    }
  };

  const usuariosCols: Column<Usuario>[] = [
    {
      key: 'usuario',
      label: 'Usuario',
      render: (u) => (
        <span className="font-medium text-neutral-800">
          {u.nombre} {u.apellido}
        </span>
      ),
    },
    { key: 'email', label: 'Email', cellClassName: 'text-neutral-600', render: (u) => u.email },
    {
      key: 'rol',
      label: 'Rol',
      align: 'center',
      render: (u) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${ROL_COLORS[u.rol]}`}
        >
          {ROL_LABELS[u.rol]}
        </span>
      ),
    },
    {
      key: 'estado',
      label: 'Estado',
      align: 'center',
      render: (u) => (
        <span
          className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${u.activo ? 'bg-success-bg text-success' : 'bg-neutral-100 text-neutral-600'}`}
        >
          {u.activo ? 'Activo' : 'Inactivo'}
        </span>
      ),
    },
    {
      key: 'acciones',
      label: '',
      align: 'right',
      render: (u) => (
        <button
          onClick={() => toggleUsuarioActivo(u.id, u.activo)}
          className="text-brand-morena-dark text-xs font-medium hover:underline"
        >
          {u.activo ? 'Desactivar' : 'Activar'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        overline="Sistema"
        title="Configuración"
        subtitle="Gestión de clínica, usuarios y preferencias"
      />

      {error && <div className={`mb-5 ${alertError}`}>{error}</div>}
      {success && (
        <div className="bg-success-bg text-success mb-5 rounded-md border border-[rgba(58,138,79,0.2)] px-4 py-3 text-sm">
          {success}
        </div>
      )}

      <Tabs value={tab} onChange={setTab} items={TABS} className="mb-5" />

      {tab === 'clinica' && (
        <form onSubmit={handleGuardarClinica} className="max-w-4xl space-y-5">
          <FormSection title="Información de la clínica">
            <FormField label="Nombre de la clínica" required>
              <input
                type="text"
                value={configClinica.nombre}
                onChange={(e) => setConfigClinica({ ...configClinica, nombre: e.target.value })}
                className={inputBase}
                required
              />
            </FormField>
            <FormField label="Dirección" required>
              <input
                type="text"
                value={configClinica.direccion}
                onChange={(e) => setConfigClinica({ ...configClinica, direccion: e.target.value })}
                className={inputBase}
                required
              />
            </FormField>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <FormField label="Teléfono" required>
                <input
                  type="tel"
                  value={configClinica.telefono}
                  onChange={(e) => setConfigClinica({ ...configClinica, telefono: e.target.value })}
                  className={inputBase}
                  required
                />
              </FormField>
              <FormField label="Email" required>
                <input
                  type="email"
                  value={configClinica.email}
                  onChange={(e) => setConfigClinica({ ...configClinica, email: e.target.value })}
                  className={inputBase}
                  required
                />
              </FormField>
              <FormField label="NIT">
                <input
                  type="text"
                  value={configClinica.nit || ''}
                  onChange={(e) => setConfigClinica({ ...configClinica, nit: e.target.value })}
                  className={inputBase}
                  placeholder="Ej. 1234567890"
                />
              </FormField>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Ciudad" hint="Se muestra en la landing page">
                <input
                  type="text"
                  value={configClinica.ciudad || ''}
                  onChange={(e) => setConfigClinica({ ...configClinica, ciudad: e.target.value })}
                  className={inputBase}
                  placeholder="Ej. Santa Cruz"
                />
              </FormField>
              <FormField label="País" hint="Se muestra en la landing page">
                <input
                  type="text"
                  value={configClinica.pais || 'Bolivia'}
                  onChange={(e) => setConfigClinica({ ...configClinica, pais: e.target.value })}
                  className={inputBase}
                  placeholder="Ej. Bolivia"
                />
              </FormField>
            </div>
          </FormSection>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} variant="primary" size="sm">
              {isSaving ? 'Guardando...' : 'Guardar cambios'}
            </Button>
          </div>
        </form>
      )}

      {tab === 'usuarios' && (
        <div className="max-w-5xl space-y-5">
          <div className="flex justify-end">
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowNuevoUsuario(!showNuevoUsuario)}
            >
              {showNuevoUsuario ? 'Cancelar' : 'Nuevo usuario'}
            </Button>
          </div>

          {showNuevoUsuario && (
            <form onSubmit={handleCrearUsuario} className="space-y-5">
              <FormSection title="Crear nuevo usuario">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField label="Nombre" required>
                    <input
                      type="text"
                      value={nuevoUsuario.nombre}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, nombre: e.target.value })}
                      className={inputBase}
                      required
                    />
                  </FormField>
                  <FormField label="Apellido" required>
                    <input
                      type="text"
                      value={nuevoUsuario.apellido}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, apellido: e.target.value })
                      }
                      className={inputBase}
                      required
                    />
                  </FormField>
                  <FormField label="Email" required>
                    <input
                      type="email"
                      value={nuevoUsuario.email}
                      onChange={(e) => setNuevoUsuario({ ...nuevoUsuario, email: e.target.value })}
                      className={inputBase}
                      required
                    />
                  </FormField>
                  <FormField label="Contraseña" required hint="Mínimo 6 caracteres">
                    <input
                      type="password"
                      value={nuevoUsuario.password}
                      onChange={(e) =>
                        setNuevoUsuario({ ...nuevoUsuario, password: e.target.value })
                      }
                      className={inputBase}
                      required
                      minLength={6}
                    />
                  </FormField>
                  <div className="md:col-span-2">
                    <FormField label="Rol" required>
                      <select
                        value={nuevoUsuario.rol}
                        onChange={(e) =>
                          setNuevoUsuario({
                            ...nuevoUsuario,
                            rol: e.target.value as Usuario['rol'],
                          })
                        }
                        className={inputBase}
                        required
                      >
                        <option value="RECEPCIONISTA">Recepcionista</option>
                        <option value="MEDICO">Médico</option>
                        <option value="ADMIN">Administrador</option>
                      </select>
                    </FormField>
                  </div>
                </div>
              </FormSection>
              <div className="flex justify-end">
                <Button type="submit" disabled={isSaving} variant="primary" size="sm">
                  {isSaving ? 'Creando...' : 'Crear usuario'}
                </Button>
              </div>
            </form>
          )}

          {isLoading ? (
            <div className="subtitle surface p-12 text-center">Cargando usuarios...</div>
          ) : (
            <DataTable<Usuario> rows={usuarios} getKey={(u) => u.id} columns={usuariosCols} />
          )}
        </div>
      )}

      {tab === 'general' && (
        <div className="max-w-2xl space-y-5">
          <FormSection title="Apariencia y formato">
            <FormField label="Formato de fecha">
              <select className={inputBase} disabled>
                <option>DD/MM/YYYY</option>
                <option>MM/DD/YYYY</option>
              </select>
            </FormField>
            <FormField label="Formato de hora">
              <select className={inputBase} disabled>
                <option>24 horas (14:30)</option>
                <option>12 horas (2:30 PM)</option>
              </select>
            </FormField>
            <FormField label="Moneda">
              <select className={inputBase} disabled>
                <option>Bs. (Bolivianos)</option>
                <option>USD (Dólares)</option>
              </select>
            </FormField>
          </FormSection>

          <div className="rounded-md border border-neutral-200 bg-neutral-50 px-4 py-3">
            <p className="text-sm text-neutral-600">
              ⚙️ Esta sección está en desarrollo. Próximamente: notificaciones por email, alertas de
              stock, recordatorios automáticos de citas.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
