'use client';

import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Tratamiento } from '@/features/historia-clinica/types';
import { Overline, SectionTitle, CardTitle } from '@/shared/ui';

interface TratamientosListProps {
  tratamientos: Tratamiento[];
}

export default function TratamientosList({ tratamientos }: TratamientosListProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <section>
      <header className="mb-5 flex items-baseline justify-between">
        <SectionTitle>Historial clínico</SectionTitle>
        <Overline as="span">
          {tratamientos.length} {tratamientos.length === 1 ? 'consulta' : 'consultas'}
        </Overline>
      </header>

      <ol className="relative space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-neutral-200">
        {tratamientos.map((t) => {
          const isExpanded = expandedIds.has(t.id);
          const hasDetails = !!(t.evaluacionInicial || t.protocolo || t.observaciones || t.proximaSesion);

          return (
            <li key={t.id} className="relative pl-7">
              <span className="bg-brand-morena absolute top-3.5 left-0 h-[15px] w-[15px] rounded-full border-[3px] border-white shadow-xs" />
              <article className="surface overflow-hidden transition-colors hover:border-neutral-300">
                <button
                  onClick={() => hasDetails && toggleExpanded(t.id)}
                  disabled={!hasDetails}
                  className={`bg-neutral-25 flex w-full items-baseline justify-between gap-4 border-b border-neutral-100 px-5 py-3 text-left ${
                    hasDetails ? 'cursor-pointer rounded-t-md transition-colors hover:bg-[rgba(204,175,125,0.1)]' : 'cursor-default'
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-2">
                    {hasDetails && (
                      isExpanded ? (
                        <ChevronDown className="h-4 w-4 shrink-0 text-brand-morena" />
                      ) : (
                        <ChevronRight className="h-4 w-4 shrink-0 text-neutral-500" />
                      )
                    )}
                    <CardTitle className="truncate">{t.nombreTratamiento}</CardTitle>
                  </div>
                  <Overline as="time" className="shrink-0">
                    {formatDate(t.fecha)}
                  </Overline>
                </button>

                {/* Información completa (visible al expandir) */}
                {isExpanded && (
                  <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
                    <Field label="Tipo" value={formatTipo(t.tipoTratamiento)} />
                    <Field label="Zona tratada" value={t.zonaTratada} />
                    <Field label="Objetivo" value={t.objetivo} wide />
                    <Field label="Nota clínica" value={t.evaluacionInicial} wide />
                    <Field label="Procedimiento" value={t.protocolo} wide />
                    <Field label="Observaciones" value={t.observaciones} wide />
                    <Field label="Próxima consulta" value={formatOptionalDate(t.proximaSesion)} />
                  </div>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function Field({ label, value, wide }: { label: string; value?: string; wide?: boolean }) {
  if (!value) return null;
  return (
    <div className={wide ? 'sm:col-span-2' : ''}>
      <Overline>{label}</Overline>
      <p className="mt-1 text-sm leading-relaxed text-neutral-800">{value}</p>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatTipo(tipo: Tratamiento['tipoTratamiento']) {
  const labels: Record<Tratamiento['tipoTratamiento'], string> = {
    FACIAL: 'Facial',
    CORPORAL: 'Corporal',
    CAPILAR: 'Capilar',
    COMBINADO: 'Combinado',
  };
  return labels[tipo];
}

function formatOptionalDate(date?: string) {
  if (!date) return undefined;
  return new Date(date).toLocaleDateString('es-BO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
