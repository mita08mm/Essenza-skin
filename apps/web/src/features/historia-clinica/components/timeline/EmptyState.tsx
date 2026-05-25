import { Subtitle, CardTitle, ClipboardListIcon, LinkButton } from '@/shared/ui';
interface EmptyStateProps {
  pacienteId: string;
}

export default function EmptyState({ pacienteId }: EmptyStateProps) {
  return (
    <section className="bg-neutral-25 rounded-lg border border-dashed border-neutral-300 px-6 py-16 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white">
        <ClipboardListIcon className="h-5 w-5 text-neutral-400" />
      </div>
      <CardTitle>Sin consultas registradas</CardTitle>
      <Subtitle className="mx-auto mt-1 max-w-sm">
        Cuando registres una consulta aparecerá aquí con su historial completo.
      </Subtitle>
      <LinkButton
        href={`/pacientes/${pacienteId}/consulta/nueva`}
        variant="primary"
        size="sm"
        className="mt-5 gap-1.5 px-4"
      >
        Registrar primera consulta
      </LinkButton>
    </section>
  );
}
