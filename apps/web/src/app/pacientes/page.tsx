'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import Link from 'next/link';
import { apiEndpoint } from '@/lib/config';
import EditIcon from '@/components/icons/EditIcon';
import ClipboardIcon from '@/components/icons/ClipboardIcon';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
  telefono: string;
  email?: string;
  estado: string;
  fechaNacimiento: string;
}

// ─── Hook de debounce ──────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// ─── Badge de estado reutilizable ──────────────────────────────────────────────
function EstadoBadge({ estado }: { estado: string }) {
  const esActivo = estado === 'ACTIVO';
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${
        esActivo
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
          : 'bg-red-50 text-red-700 ring-1 ring-red-200'
      }`}
    >
      {/* Dot indicador */}
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          esActivo ? 'bg-emerald-500' : 'bg-red-500'
        }`}
      />
      {estado}
    </span>
  );
}

// ─── Avatar de iniciales ───────────────────────────────────────────────────────
function Avatar({ nombre, apellido }: { nombre: string; apellido: string }) {
  return (
    <div className="w-10 h-10 rounded-xl bg-piel/30 flex items-center justify-center shrink-0">
      <span className="text-morena font-semibold text-sm">
        {nombre[0]}{apellido[0]}
      </span>
    </div>
  );
}

// ─── Botones de acción reutilizables ──────────────────────────────────────────
function AccionesButtons({ pacienteId }: { pacienteId: string }) {
  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/pacientes/${pacienteId}/historia`}
        title="Ver historia clínica"
        className="w-10 h-10 rounded-xl bg-[#FEF4E4] flex items-center justify-center
                   hover:bg-[#fde9c4] hover:scale-105 active:scale-95 transition-all duration-150"
      >
        <ClipboardIcon color="#5A350F" className="w-5 h-5" />
      </Link>
      <Link
        href={`/pacientes/${pacienteId}`}
        title="Editar paciente"
        className="w-10 h-10 rounded-xl bg-[#EEEAE7] flex items-center justify-center
                   hover:bg-[#e0dbd6] hover:scale-105 active:scale-95 transition-all duration-150"
      >
        <EditIcon />
      </Link>
    </div>
  );
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { token } = useAuth();

  const debouncedQuery = useDebounce(searchQuery, 200);

  useEffect(() => {
    if (!token) return;
    const fetchPacientes = async () => {
      try {
        const response = await fetch(apiEndpoint('/pacientes'), {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Error al obtener pacientes');
        const data = await response.json();
        setPacientes(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    };
    fetchPacientes();
  }, [token]);

  const pacientesFiltrados = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return pacientes;
    return pacientes.filter((p) => {
      const nombreCompleto = `${p.nombre} ${p.apellido}`.toLowerCase();
      const apellidoNombre = `${p.apellido} ${p.nombre}`.toLowerCase();
      return (
        nombreCompleto.includes(q) ||
        apellidoNombre.includes(q) ||
        p.documento.toLowerCase().includes(q) ||
        p.telefono.includes(q) ||
        (p.email?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [pacientes, debouncedQuery]);

  const calcularEdad = (fechaNacimiento: string) => {
    const hoy = new Date();
    const fecha = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - fecha.getFullYear();
    const mes = hoy.getMonth() - fecha.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fecha.getDate())) edad--;
    return edad;
  };

  const hayBusqueda = debouncedQuery.trim().length > 0;

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">

          {/* ── ENCABEZADO ─────────────────────────────────────────────────── */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-concreto">
                Pacientes
              </h1>
              <p className="text-marengo mt-1 text-sm sm:text-base">
                Gestión de pacientes y fichas clínicas
              </p>
            </div>
            <Link href="/pacientes/nuevo" className="btn-primary-prominent shrink-0">
              Nuevo Paciente
            </Link>
          </div>

          {/* ── BUSCADOR ───────────────────────────────────────────────────── */}
          <div className="relative">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-marengo pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, documento o teléfono..."
              className="w-full pl-12 pr-12 py-3 rounded-xl border border-[#D7C5B9]
                         focus:border-morena focus:ring-2 focus:ring-piel/20
                         transition-all outline-none bg-white text-concreto text-sm sm:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2
                           text-marengo hover:text-concreto transition-colors"
                aria-label="Limpiar búsqueda"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Contador de resultados */}
          {hayBusqueda && !isLoading && (
            <p className="text-sm text-marengo -mt-2">
              {pacientesFiltrados.length === 0
                ? 'No se encontraron pacientes'
                : `${pacientesFiltrados.length} paciente${pacientesFiltrados.length !== 1 ? 's' : ''} encontrado${pacientesFiltrados.length !== 1 ? 's' : ''}`}
            </p>
          )}

          {/* ── ERROR ──────────────────────────────────────────────────────── */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* ── ESTADOS: cargando / vacío / contenido ──────────────────────── */}
          {isLoading ? (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 border-4 border-piel border-t-morena rounded-xl animate-spin mx-auto" />
              <p className="text-marengo mt-4">Cargando pacientes...</p>
            </div>

          ) : pacientesFiltrados.length === 0 ? (
            <div className="card p-8 text-center">
              {hayBusqueda ? (
                <>
                  <p className="text-marengo">
                    No hay pacientes que coincidan con{' '}
                    <span className="font-medium text-concreto">"{debouncedQuery}"</span>
                  </p>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="inline-block mt-4 px-6 py-2 border border-[#D7C5B9]
                               text-marengo rounded-xl hover:bg-piel/10 transition-all"
                  >
                    Limpiar búsqueda
                  </button>
                </>
              ) : (
                <>
                  <p className="text-marengo">No hay pacientes registrados</p>
                  <Link
                    href="/pacientes/nuevo"
                    className="inline-block mt-4 px-6 py-2 bg-morena text-white
                               rounded-xl hover:bg-morena/90 transition-all"
                  >
                    Crear primer paciente
                  </Link>
                </>
              )}
            </div>

          ) : (
            <>
              {/* ════════════════════════════════════════════════════════════
                  VISTA DESKTOP — tabla tradicional (oculta en móvil/tablet)
              ════════════════════════════════════════════════════════════ */}
              <div className="hidden xl:block card card-no-padding overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      {['Paciente', 'Documento', 'Edad', 'Teléfono', 'Estado', 'Acciones'].map((col) => (
                        <th
                          key={col}
                          className="px-6 py-3 text-left text-xs font-semibold text-marengo uppercase tracking-wider"
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {pacientesFiltrados.map((paciente) => (
                      <tr
                        key={paciente.id}
                        className="hover:bg-gray-50/80 transition-colors group"
                      >
                        {/* Paciente */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Avatar nombre={paciente.nombre} apellido={paciente.apellido} />
                            <div>
                              <div className="text-sm font-semibold text-concreto">
                                {paciente.nombre} {paciente.apellido}
                              </div>
                              {paciente.email && (
                                <div className="text-xs text-marengo mt-0.5">{paciente.email}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        {/* Documento */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-xs font-medium text-marengo uppercase tracking-wide">
                            {paciente.tipoDocumento}
                          </div>
                          <div className="text-sm text-concreto mt-0.5">{paciente.documento}</div>
                        </td>
                        {/* Edad */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm font-medium text-concreto">
                            {calcularEdad(paciente.fechaNacimiento)}
                          </span>
                          <span className="text-xs text-marengo ml-1">años</span>
                        </td>
                        {/* Teléfono */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-marengo">
                          {paciente.telefono}
                        </td>
                        {/* Estado */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <EstadoBadge estado={paciente.estado} />
                        </td>
                        {/* Acciones */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <AccionesButtons pacienteId={paciente.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ════════════════════════════════════════════════════════════
                  VISTA MÓVIL/TABLET — cards apiladas (oculta en desktop)
              ════════════════════════════════════════════════════════════ */}
              <div className="flex flex-col gap-3 xl:hidden">
                {pacientesFiltrados.map((paciente) => (
                  <div
                    key={paciente.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm
                               overflow-hidden transition-shadow hover:shadow-md"
                  >
                    {/* ── Cabecera de la card ───────────────────────────── */}
                    <div className="flex items-center justify-between px-4 pt-4 pb-3
                                    border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <Avatar nombre={paciente.nombre} apellido={paciente.apellido} />
                        <div>
                          <p className="text-sm font-semibold text-concreto leading-tight">
                            {paciente.nombre} {paciente.apellido}
                          </p>
                          {paciente.email && (
                            <p className="text-xs text-marengo mt-0.5 truncate max-w-[180px]">
                              {paciente.email}
                            </p>
                          )}
                        </div>
                      </div>
                      {/* Badge de estado arriba a la derecha */}
                      <EstadoBadge estado={paciente.estado} />
                    </div>

                    {/* ── Grilla de datos ───────────────────────────────── */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3 px-4 py-3">
                      {/* Documento */}
                      <div>
                        <p className="text-[10px] font-semibold text-marengo uppercase tracking-widest mb-0.5">
                          Documento
                        </p>
                        <p className="text-xs font-medium text-marengo/70">
                          {paciente.tipoDocumento}
                        </p>
                        <p className="text-sm font-medium text-concreto">
                          {paciente.documento}
                        </p>
                      </div>
                      {/* Edad */}
                      <div>
                        <p className="text-[10px] font-semibold text-marengo uppercase tracking-widest mb-0.5">
                          Edad
                        </p>
                        <p className="text-sm font-medium text-concreto">
                          {calcularEdad(paciente.fechaNacimiento)}{' '}
                          <span className="text-marengo font-normal">años</span>
                        </p>
                      </div>
                      {/* Teléfono — ocupa todo el ancho */}
                      <div className="col-span-2">
                        <p className="text-[10px] font-semibold text-marengo uppercase tracking-widest mb-0.5">
                          Teléfono
                        </p>
                        <a
                          href={`tel:${paciente.telefono}`}
                          className="text-sm font-medium text-concreto hover:text-morena transition-colors"
                        >
                          {paciente.telefono}
                        </a>
                      </div>
                    </div>

                    {/* ── Pie de la card: acciones ──────────────────────── */}
                    <div className="flex items-center justify-end gap-2 px-4 py-3
                                    bg-gray-50/60 border-t border-gray-100">
                      <Link
                        href={`/pacientes/${paciente.id}/historia`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl
                                   bg-[#FEF4E4] text-[#5A350F] text-xs font-semibold
                                   hover:bg-[#fde9c4] active:scale-95 transition-all duration-150"
                      >
                        <ClipboardIcon color="#5A350F" className="w-4 h-4" />
                        Historia
                      </Link>
                      <Link
                        href={`/pacientes/${paciente.id}`}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl
                                   bg-[#EEEAE7] text-concreto text-xs font-semibold
                                   hover:bg-[#e0dbd6] active:scale-95 transition-all duration-150"
                      >
                        <EditIcon />
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              {/* ═══════════════════════════════════════════════════════════ */}
            </>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}