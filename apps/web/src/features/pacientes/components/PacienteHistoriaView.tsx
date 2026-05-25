'use client';

import {
  useHistoriaClinica,
  AttachmentsPanel,
  EmptyState,
  PagosHistory,
  PatientHeader,
  ProtocolosPanel,
  TratamientosList,
} from '@/features/historia-clinica';
import { Spinner } from '@/shared/ui';

export function PacienteHistoriaView({ pacienteId }: { pacienteId: string }) {
  const { historia, isLoading, error, refresh } = useHistoriaClinica(pacienteId);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !historia) {
    return (
      <div className="mx-auto mt-12 max-w-2xl px-6">
        <div className="bg-danger-bg rounded-lg border border-[rgba(181,58,58,0.2)] px-5 py-4">
          <p className="text-danger text-sm font-medium">
            {error || 'Historia clínica no encontrada'}
          </p>
        </div>
      </div>
    );
  }

  const documentos = historia.tratamientos?.flatMap((t) => t.documentos || []) ?? [];
  const tieneTratamientos = (historia.tratamientos?.length ?? 0) > 0;

  return (
    <main className="bg-neutral-25 min-h-screen">
      <PatientHeader historia={historia} pacienteId={pacienteId} />

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-12 lg:py-10">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <section className="lg:col-span-7 xl:col-span-8">
            {tieneTratamientos ? (
              <TratamientosList tratamientos={historia.tratamientos!} />
            ) : (
              <EmptyState pacienteId={pacienteId} />
            )}
          </section>

          <aside className="space-y-6 lg:col-span-5 xl:col-span-4">
            <ProtocolosPanel pacienteId={pacienteId} />
            <PagosHistory pacienteId={pacienteId} />
            <AttachmentsPanel
              documentos={documentos}
              pacienteId={pacienteId}
              onUploadSuccess={refresh}
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
