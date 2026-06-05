'use client';

import { useState, useEffect } from 'react';
import { RecetaForm } from './RecetaForm';
import { Spinner, alertError } from '@/shared/ui';
import { api } from '@/shared/api';

interface Prescripcion {
  id: string;
  pacienteId: string;
  nombre: string;
  items: Array<{
    id: string;
    nombre: string;
    indicaciones: string;
    aplicacion?: string;
  }>;
}

interface ApiPrescripcionItem {
  id: string;
  nombre: string;
  indicaciones?: string;
  aplicacion?: string;
}

interface ApiPrescripcion {
  id: string;
  pacienteId: string;
  nombre: string;
  items: ApiPrescripcionItem[];
}

export function EditRecetaView({ recetaId }: { recetaId: string }) {
  const [prescripcion, setPrescripcion] = useState<Prescripcion | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const data = await api.get<ApiPrescripcion>(`/prescripciones/${recetaId}`);
        setPrescripcion({
          id: data.id,
          pacienteId: data.pacienteId,
          nombre: data.nombre,
          items: data.items.map((item) => ({
            id: item.id,
            nombre: item.nombre,
            indicaciones: item.indicaciones || item.aplicacion || '',
          })),
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar prescripción');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [recetaId]);

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !prescripcion) {
    return <div className={alertError}>{error || 'Prescripción no encontrada'}</div>;
  }

  return (
    <RecetaForm
      recetaId={recetaId}
      initialData={{
        pacienteId: prescripcion.pacienteId,
        nombre: prescripcion.nombre,
        items: prescripcion.items,
      }}
    />
  );
}
