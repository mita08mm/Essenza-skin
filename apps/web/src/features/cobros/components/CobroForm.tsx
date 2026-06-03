'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/shared/layout/PageHeader';
import { FormSection, FormField } from '@/shared/forms/FormSection';
import { PacienteAutocomplete } from '@/shared/forms/PacienteAutocomplete';
import { inputBase, alertError, Overline, Button, LinkButton } from '@/shared/ui';
import { api } from '@/shared/api';
import { formatMonto } from '@/shared/utils/money';

export function CobroForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [pacienteId, setPacienteId] = useState('');
  const [titulo, setTitulo] = useState('');
  const [costo, setCosto] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const monto = Number(costo);
    if (!titulo.trim()) {
      setError('Ingrese una descripción o título');
      return;
    }
    if (Number.isNaN(monto) || monto <= 0) {
      setError('El costo debe ser mayor a 0');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/cobros', {
        pacienteId,
        items: [{ tipo: 'PAQUETE', nombre: titulo.trim(), cantidad: 1, precioUnitario: monto }],
      });
      router.push('/cobros');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };

  const costoActual = Number(costo) || 0;

  return (
    <div className="max-w-4xl">
      <PageHeader
        overline="Cobros"
        title="Nuevo cobro"
        subtitle="Registra un producto o servicio y su costo"
        backHref="/cobros"
      />

      {error && <div className={`mb-5 ${alertError}`}>{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        <FormSection title="Paciente">
          <FormField label="Paciente" required>
            <PacienteAutocomplete
              value={pacienteId}
              onChange={setPacienteId}
              disabled={isLoading}
              required
            />
          </FormField>
        </FormSection>

        <FormSection title="Registro">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField label="Descripción o título" required>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ej. Limpieza facial, producto reparador"
                className={inputBase}
                required
              />
            </FormField>
            <FormField label="Costo (Bs.)" required>
              <input
                type="number"
                min="0"
                step="0.01"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
                placeholder="0.00"
                className={inputBase}
                required
              />
            </FormField>
          </div>

          <div className="mt-2 flex items-center justify-between rounded-md border border-neutral-100 bg-neutral-50 px-4 py-3">
            <Overline as="span">Total a cobrar</Overline>
            <span className="font-heading text-brand-morena-dark text-2xl font-medium">
              {formatMonto(costoActual)}
            </span>
          </div>
        </FormSection>

        <div className="flex items-center justify-end gap-3">
          <LinkButton href="/cobros" variant="secondary" size="sm">
            Cancelar
          </LinkButton>
          <Button
            type="submit"
            disabled={isLoading || !titulo.trim() || costoActual <= 0}
            variant="primary"
            size="sm"
          >
            {isLoading ? 'Guardando...' : 'Guardar registro'}
          </Button>
        </div>
      </form>
    </div>
  );
}
