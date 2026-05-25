'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/shared/layout/PageHeader';
import { FormSection, FormField } from '@/shared/forms/FormSection';
import { Badge, inputBase, textareaBase, alertError, Muted, Overline, Button } from '@/shared/ui';
import { api } from '@/shared/api';
import { getCitaEstado } from '@/features/citas/lib/estado';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
  tipoDocumento: string;
  telefono: string;
  email?: string;
  fechaNacimiento: string;
}

interface Cita {
  id: string;
  pacienteId: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  estado: string;
  notas?: string;
  createdAt: string;
  paciente: Paciente;
}

const formatFecha = (fecha: string) =>
  new Date(fecha).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  });

export function CitaDetailView({ citaId }: { citaId: string }) {
  const [cita, setCita] = useState<Cita | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    fecha: '',
    horaInicio: '',
    horaFin: '',
    motivo: '',
    estado: 'PROGRAMADA',
    notas: '',
  });

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Cita>(`/citas/${citaId}`);
        setCita(data);
        setFormData({
          fecha: data.fecha.split('T')[0],
          horaInicio: data.horaInicio,
          horaFin: data.horaFin,
          motivo: data.motivo,
          estado: data.estado,
          notas: data.notas || '',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [citaId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    try {
      const updated = await api.patch<Cita>(`/citas/${citaId}`, formData);
      setCita(updated);
      setIsEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelar = async () => {
    if (!confirm('¿Está seguro de cancelar esta cita?')) return;
    setError('');
    setIsSaving(true);
    try {
      const updated = await api.post<Cita>(`/citas/${citaId}/cancelar`, {
        notas: 'Cancelada por el usuario',
      });
      setCita(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="subtitle flex min-h-[400px] items-center justify-center">
        Cargando cita...
      </div>
    );
  }

  if (error || !cita) {
    return (
      <div className="max-w-3xl space-y-3">
        <div className={alertError}>{error || 'Cita no encontrada'}</div>
        <Link href="/citas" className="text-brand-morena inline-block text-sm hover:underline">
          ← Volver a citas
        </Link>
      </div>
    );
  }

  const estado = getCitaEstado(cita.estado);
  const isLocked = cita.estado === 'CANCELADA' || cita.estado === 'COMPLETADA';

  return (
    <div className="max-w-4xl">
      <PageHeader
        overline="Citas"
        title="Detalle de cita"
        subtitle={formatFecha(cita.fecha)}
        backHref="/citas"
        actions={
          !isEditMode && !isLocked ? (
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => setIsEditMode(true)}
                variant="primary"
                size="sm"
                className="px-4"
              >
                Editar
              </Button>
              <Button
                type="button"
                onClick={handleCancelar}
                disabled={isSaving}
                variant="danger"
                size="sm"
              >
                Cancelar cita
              </Button>
            </div>
          ) : null
        }
      />

      {error && <div className={`mb-5 ${alertError}`}>{error}</div>}

      <div className="space-y-5">
        <section className="surface p-6">
          <Overline className="mb-3">Paciente</Overline>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <Muted>Nombre completo</Muted>
              <Link
                href={`/pacientes/${cita.paciente.id}`}
                className="text-brand-morena mt-0.5 inline-block text-base font-medium hover:underline"
              >
                {cita.paciente.nombre} {cita.paciente.apellido}
              </Link>
            </div>
            <div>
              <Muted>Documento</Muted>
              <p className="mt-0.5 text-base text-neutral-900">
                {cita.paciente.tipoDocumento}: {cita.paciente.documento}
              </p>
            </div>
            <div>
              <Muted>Teléfono</Muted>
              <p className="mt-0.5 text-base text-neutral-900">{cita.paciente.telefono}</p>
            </div>
            <div>
              <Muted>Email</Muted>
              <p className="mt-0.5 text-base text-neutral-900">{cita.paciente.email || '—'}</p>
            </div>
          </div>
        </section>

        {isEditMode ? (
          <form onSubmit={handleSubmit}>
            <FormSection title="Editar cita">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Fecha" required>
                  <input
                    type="date"
                    name="fecha"
                    value={formData.fecha}
                    onChange={handleChange}
                    className={inputBase}
                    required
                    disabled={isSaving}
                  />
                </FormField>
                <FormField label="Estado" required>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className={inputBase}
                    required
                    disabled={isSaving}
                  >
                    <option value="PROGRAMADA">Programada</option>
                    <option value="CONFIRMADA">Confirmada</option>
                    <option value="EN_CURSO">En curso</option>
                    <option value="COMPLETADA">Completada</option>
                    <option value="NO_ASISTIO">No asistió</option>
                  </select>
                </FormField>
                <FormField label="Hora inicio" required>
                  <input
                    type="time"
                    name="horaInicio"
                    value={formData.horaInicio}
                    onChange={handleChange}
                    className={inputBase}
                    required
                    disabled={isSaving}
                  />
                </FormField>
                <FormField label="Hora fin" required>
                  <input
                    type="time"
                    name="horaFin"
                    value={formData.horaFin}
                    onChange={handleChange}
                    className={inputBase}
                    required
                    disabled={isSaving}
                  />
                </FormField>
              </div>
              <FormField label="Motivo" required>
                <input
                  type="text"
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  className={inputBase}
                  required
                  disabled={isSaving}
                />
              </FormField>
              <FormField label="Notas">
                <textarea
                  name="notas"
                  value={formData.notas}
                  onChange={handleChange}
                  rows={3}
                  className={textareaBase}
                  disabled={isSaving}
                />
              </FormField>
            </FormSection>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setIsEditMode(false);
                  setError('');
                  setFormData({
                    fecha: cita.fecha.split('T')[0],
                    horaInicio: cita.horaInicio,
                    horaFin: cita.horaFin,
                    motivo: cita.motivo,
                    estado: cita.estado,
                    notas: cita.notas || '',
                  });
                }}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSaving} variant="primary" size="sm">
                {isSaving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
            </div>
          </form>
        ) : (
          <section className="surface p-6">
            <Overline className="mb-3">Detalles de la cita</Overline>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <Muted>Fecha</Muted>
                <p className="mt-0.5 text-base text-neutral-900">{formatFecha(cita.fecha)}</p>
              </div>
              <div>
                <Muted>Horario</Muted>
                <p className="mt-0.5 text-base text-neutral-900 tabular-nums">
                  {cita.horaInicio} – {cita.horaFin}
                </p>
              </div>
              <div>
                <Muted>Motivo</Muted>
                <p className="mt-0.5 text-base text-neutral-900">{cita.motivo}</p>
              </div>
              <div>
                <Muted>Estado</Muted>
                <div className="mt-1">
                  <Badge variant={estado.variant}>{estado.label}</Badge>
                </div>
              </div>
              {cita.notas && (
                <div className="md:col-span-2">
                  <Muted>Notas</Muted>
                  <p className="body mt-0.5 whitespace-pre-line">{cita.notas}</p>
                </div>
              )}
              <div className="md:col-span-2">
                <Muted>Creada</Muted>
                <p className="body mt-0.5">
                  {new Date(cita.createdAt).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
