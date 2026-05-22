'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { apiEndpoint } from '@/lib/config';

interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  documento: string;
}

function NuevaConsultaContent() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const pacienteId = params.id as string;

  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Formulario simplificado
  const [tipoTratamiento, setTipoTratamiento] = useState<'FACIAL' | 'CORPORAL' | 'CAPILAR'>('FACIAL');
  const [zonaTratada, setZonaTratada] = useState('');
  const [evaluacionInicial, setEvaluacionInicial] = useState('');
  const [objetivoSesion, setObjetivoSesion] = useState('');
  const [procedimiento, setProcedimiento] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [proximaSesion, setProximaSesion] = useState('');

  useEffect(() => {
    if (!token) return;

    const fetchPaciente = async () => {
      try {
        const response = await fetch(apiEndpoint(`/pacientes/${pacienteId}`), {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Error al cargar paciente');

        const data = await response.json();
        setPaciente(data.data);
      } catch {
        setError('No se pudo cargar la información del paciente');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaciente();
  }, [pacienteId, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!zonaTratada.trim() || !objetivoSesion.trim()) {
      setError('La zona tratada y el objetivo son obligatorios');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const payload = {
        pacienteId,
        tipoTratamiento,
        motivoConsulta: objetivoSesion.trim(),
        examenFisico: evaluacionInicial.trim() || undefined,
        diagnostico: `${tipoTratamiento} - ${zonaTratada}`,
        tratamiento: procedimiento.trim() || undefined,
        observaciones: observaciones.trim() || undefined,
        proximaConsulta: proximaSesion || undefined,
      };

      const response = await fetch(apiEndpoint('/consultas'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear tratamiento');
      }

      // Redirigir a la historia clínica
      router.push(`/pacientes/${pacienteId}/historia`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar tratamiento');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-lg h-12 w-12 border-b-2 border-morena"></div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">No se encontró el paciente</p>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-morena focus:border-transparent transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";

  return (
    <div className="form-container space-y-6">
      {/* Header minimalista */}
      <div className="flex items-center gap-4">
        <Link
          href={`/pacientes/${pacienteId}/historia`}
          className="text-marengo hover:text-concreto transition-colors"
        >
          ← Volver
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-concreto">Nueva Sesión</h1>
          <p className="text-sm text-marengo mt-1">
            {paciente.nombre} {paciente.apellido}
          </p>
        </div>
      </div>

      {/* Formulario compacto con ancho limitado */}
      <form onSubmit={handleSubmit} className="card p-8 space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Fila 1: Tipo y Zona */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>
              Tipo de Tratamiento <span className="text-red-500">*</span>
            </label>
            <select
              value={tipoTratamiento}
              onChange={(e) => setTipoTratamiento(e.target.value as 'FACIAL' | 'CORPORAL' | 'CAPILAR')}
              className={inputClass}
            >
              <option value="FACIAL">Facial</option>
              <option value="CORPORAL">Corporal</option>
              <option value="CAPILAR">Capilar</option>
            </select>
          </div>

          <div>
            <label className={labelClass}>
              Zona Tratada <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={zonaTratada}
              onChange={(e) => setZonaTratada(e.target.value)}
              placeholder="Ej: Rostro completo, Abdomen, Cuero cabelludo"
              className={inputClass}
              required
            />
          </div>
        </div>

        {/* Fila 2: Objetivo */}
        <div>
          <label className={labelClass}>
            Objetivo de la Sesión <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={objetivoSesion}
            onChange={(e) => setObjetivoSesion(e.target.value)}
            placeholder="Ej: Reducir líneas de expresión, Mejorar textura de piel, Hidratación profunda"
            className={inputClass}
            required
          />
        </div>

        {/* Fila 3: Evaluación */}
        <div>
          <label className={labelClass}>Evaluación Inicial</label>
          <textarea
            value={evaluacionInicial}
            onChange={(e) => setEvaluacionInicial(e.target.value)}
            placeholder="Estado de la piel/zona, medidas base, condiciones relevantes..."
            rows={3}
            className={inputClass}
          />
        </div>

        {/* Fila 4: Procedimiento */}
        <div>
          <label className={labelClass}>Procedimiento Realizado</label>
          <textarea
            value={procedimiento}
            onChange={(e) => setProcedimiento(e.target.value)}
            placeholder="Técnicas aplicadas, productos usados, parámetros del equipo..."
            rows={3}
            className={inputClass}
          />
        </div>

        {/* Fila 5: Observaciones + Próxima sesión */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Reacciones, recomendaciones, cuidados..."
              rows={2}
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Próxima Sesión</label>
            <input
              type="date"
              value={proximaSesion}
              onChange={(e) => setProximaSesion(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
          <Link
            href={`/pacientes/${pacienteId}/historia`}
            className="btn-secondary"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="btn-primary"
          >
            {isSaving ? 'Guardando...' : 'Guardar Sesión'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function NuevaConsultaPage() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <NuevaConsultaContent />
      </DashboardLayout>
    </ProtectedRoute>
  );
}
