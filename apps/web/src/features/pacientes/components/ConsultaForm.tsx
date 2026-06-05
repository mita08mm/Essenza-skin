'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/shared/layout/PageHeader';
import { FormSection, FormField } from '@/shared/forms/FormSection';
import { api } from '@/shared/api/client';
import { inputBase, textareaBase, alertError, Button, LinkButton } from '@/shared/ui';
import { TimePicker, addOneHour } from '@/shared/ui/TimePicker';
import { DisponibilidadTimeline, type CitaDelDia } from '@/features/citas/components/DisponibilidadTimeline';
import { hayConflicto, toMinutes } from '@/features/citas/lib/horario';
import { useMemo } from 'react';
import DatePicker from '@/shared/ui/DatePicker';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
}

export function ConsultaForm({ pacienteId }: { pacienteId: string }) {
  const router = useRouter();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [tipoTratamiento, setTipoTratamiento] = useState<'FACIAL' | 'CORPORAL' | 'CAPILAR'>(
    'FACIAL',
  );
  const [zonaTratada, setZonaTratada] = useState('');
  const [evaluacion, setEvaluacion] = useState('');
  const [objetivoSesion, setObjetivoSesion] = useState('');
  const [procedimiento, setProcedimiento] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [proximaConsulta, setProximaConsulta] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<Paciente>(`/pacientes/${pacienteId}`);
        setPaciente(data);
      } catch {
        setError('No se pudo cargar la información del paciente');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [pacienteId]);
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [citasDelDia, setCitasDelDia] = useState<CitaDelDia[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);


  useEffect(() => {
    if (!proximaConsulta) {
      // Reset states when no date selected
      (async () => {
        setCitasDelDia([]);
        setHoraInicio('');
        setHoraFin('');
      })();
      return;
    }
    (async () => {
      setLoadingCitas(true);
      try {
        const data = await api.get<CitaDelDia[]>('/citas', { params: { fecha: proximaConsulta } });
        setCitasDelDia(data.filter((c) => c.estado !== 'CANCELADA' && toMinutes(c.horaInicio) >= 6 * 60));
      } catch { setCitasDelDia([]); } finally { setLoadingCitas(false); }
    })();
  }, [proximaConsulta]);

  const conflicto = useMemo(() => {
    if (!horaInicio || !horaFin || citasDelDia.length === 0) return null;
    return citasDelDia.find((x) => hayConflicto(horaInicio, horaFin, x.horaInicio, x.horaFin)) ?? null;
  }, [horaInicio, horaFin, citasDelDia]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!zonaTratada.trim() || !objetivoSesion.trim()) {
      setError('La zona tratada y el objetivo son obligatorios');
      return;
    }
    if (proximaConsulta && horaInicio && horaFin && conflicto) {
      setError(`El horario de ${conflicto.horaInicio} a ${conflicto.horaFin} ya está ocupado con ${conflicto.paciente?.nombre} ${conflicto.paciente?.apellido}`);
      return;
    }
    if (proximaConsulta && (!horaInicio || !horaFin)) {
      setError('Si agendas próxima cita, debes indicar la hora de inicio y fin');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await api.post('/consultas', {
        pacienteId,
        tipoTratamiento,
        nombreTratamiento: procedimiento.trim() || `Consulta ${tipoTratamiento.toLowerCase()}`,
        zonaTratada: zonaTratada.trim(),
        objetivo: objetivoSesion.trim(),
        evaluacionInicial: evaluacion.trim() || undefined,
        protocolo: procedimiento.trim() || undefined,
        observaciones: observaciones.trim() || undefined,
        proximaSesion: proximaConsulta
          ? new Date(`${proximaConsulta}T00:00:00`).toISOString()
          : undefined,
      });
      if (proximaConsulta && horaInicio && horaFin) {
        await api.post('/citas', {
          pacienteId,
          fecha: proximaConsulta,
          horaInicio,
          horaFin,
          motivo: `Consulta ${tipoTratamiento.toLowerCase()} - ${zonaTratada.trim()}`,
          estado: 'PROGRAMADA',
          notas: '',
        });
      }
      router.push(`/pacientes/${pacienteId}/historia`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar tratamiento');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="subtitle flex min-h-[400px] items-center justify-center">
        Cargando paciente...
      </div>
    );
  }

  if (!paciente) {
    return <div className={alertError}>No se encontró el paciente</div>;
  }

  return (
    <div className="max-w-4xl">
      <PageHeader
        overline="Historia clínica"
        title="Nueva consulta"
        subtitle={`${paciente.nombre} ${paciente.apellido}`}
        backHref={`/pacientes/${pacienteId}/historia`}
      />

     
    
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSection title="Datos de la sesión">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Tipo de tratamiento" required>
              <select
                value={tipoTratamiento}
                onChange={(e) =>
                  setTipoTratamiento(e.target.value as 'FACIAL' | 'CORPORAL' | 'CAPILAR')
                }
                className={inputBase}
                disabled={isSaving}
              >
                <option value="FACIAL">Facial</option>
                <option value="CORPORAL">Corporal</option>
                <option value="CAPILAR">Capilar</option>
              </select>
            </FormField>
            <FormField label="Zona tratada" required>
              <input
                type="text"
                value={zonaTratada}
                onChange={(e) => setZonaTratada(e.target.value)}
                placeholder="Rostro, abdomen, cuero cabelludo..."
                className={inputBase}
                required
                disabled={isSaving}
              />
            </FormField>
          </div>

          <FormField label="Objetivo" required>
            <input
              type="text"
              value={objetivoSesion}
              onChange={(e) => setObjetivoSesion(e.target.value)}
              placeholder="Objetivo de la sesión"
              className={inputBase}
              required
              disabled={isSaving}
            />
          </FormField>
        </FormSection>

        <FormSection title="Detalles clínicos">
          <FormField label="Nota clínica / evaluación">
            <textarea
              value={evaluacion}
              onChange={(e) => setEvaluacion(e.target.value)}
              rows={3}
              className={textareaBase}
              disabled={isSaving}
            />
          </FormField>
          <FormField label="Procedimiento">
            <textarea
              value={procedimiento}
              onChange={(e) => setProcedimiento(e.target.value)}
              rows={3}
              className={textareaBase}
              disabled={isSaving}
            />
          </FormField>

          <FormField label="Observaciones">
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              className={textareaBase}
              disabled={isSaving}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <FormField label="Próxima consulta" hint="Solo fechas desde hoy en adelante">
              <DatePicker
                name="proximaConsulta"
                value={proximaConsulta}
                onChange={(e) => setProximaConsulta(e.target.value)}
                disabled={isSaving}
                minDate={new Date()}
              />
            </FormField>
            {proximaConsulta && (
              <>
                <TimePicker label="Hora inicio" value={horaInicio}
                  onChange={(v) => { setHoraInicio(v); setHoraFin(addOneHour(v)); }}
                  required disabled={isSaving} hasConflict={!!conflicto} />
                <TimePicker label="Hora fin" value={horaFin}
                  onChange={setHoraFin} required disabled={isSaving} hasConflict={!!conflicto} />
              </>
            )}
          </div>

          {proximaConsulta && (
            <DisponibilidadTimeline citas={citasDelDia} loading={loadingCitas}
              nuevaInicio={horaInicio} nuevaFin={horaFin} conflicto={!!conflicto} selectionLabel="Nueva" />
          )}
        </FormSection>

        <div className="space-y-4">
          {error && <div className={alertError}>{error}</div>}
          <div className="flex items-center justify-end gap-3">
          <LinkButton href={`/pacientes/${pacienteId}/historia`} variant="secondary" size="sm">
            Cancelar
          </LinkButton>
          <Button type="submit" disabled={isSaving} variant="primary" size="sm">
            {isSaving ? 'Guardando...' : 'Guardar consulta'}
          </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
