'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/shared/api';
import { inputBase } from '@/shared/ui';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
  estado: string;
}

interface PacienteAutocompleteProps {
  value: string;
  onChange: (pacienteId: string) => void;
  disabled?: boolean;
  required?: boolean;
}

export function PacienteAutocomplete({
  value,
  onChange,
  disabled = false,
  required = false,
}: PacienteAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [resultados, setResultados] = useState<Paciente[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState<Paciente | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debounceRef.current !== null) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      try {
        const url = query.trim()
          ? `/pacientes?search=${encodeURIComponent(query)}`
          : `/pacientes`;
        const data = await api.get<Paciente[]>(url);
        const activos = data.filter((p) => p.estado === 'ACTIVO');
        setResultados(activos);
        setIsOpen(activos.length > 0);
      } catch {
        setResultados([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);
  }, [query]);

  // Cargar paciente seleccionado si ya hay un value
  useEffect(() => {
    if (value && !pacienteSeleccionado) {
      (async () => {
        try {
          const paciente = await api.get<Paciente>(`/pacientes/${value}`);
          setPacienteSeleccionado(paciente);
          setQuery(`${paciente.nombre} ${paciente.apellido}`);
        } catch {
          /* noop */
        }
      })();
    }
  }, [value, pacienteSeleccionado]);

  const handleSelect = (paciente: Paciente) => {
    setPacienteSeleccionado(paciente);
    setQuery(`${paciente.nombre} ${paciente.apellido}`);
    onChange(paciente.id);
    setIsOpen(false);
    setResultados([]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    if (pacienteSeleccionado) {
      setPacienteSeleccionado(null);
      onChange('');
    }
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        onFocus={() => {
          if (resultados.length > 0) setIsOpen(true);
          else setQuery(query); // dispara el useEffect
        }}
        placeholder="Buscar por nombre o carnet..."
        className={inputBase}
        disabled={disabled}
        required={required}
        autoComplete="off"
      />

      {isLoading && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-morena" />
        </div>
      )}

      {isOpen && resultados.length > 0 && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {resultados.map((paciente) => (
              <li key={paciente.id}>
                <button
                  type="button"
                  onClick={() => handleSelect(paciente)}
                  className="w-full px-4 py-2 text-left transition-colors hover:bg-[rgba(204,175,125,0.1)]"
                >
                  <div className="font-medium text-neutral-900">
                    {paciente.nombre} {paciente.apellido}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {paciente.tipoDocumento}: {paciente.documento}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {query.trim() && !isLoading && resultados.length === 0 && isOpen && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-500 shadow-lg">
          No se encontraron pacientes
        </div>
      )}
    </div>
  );
}
