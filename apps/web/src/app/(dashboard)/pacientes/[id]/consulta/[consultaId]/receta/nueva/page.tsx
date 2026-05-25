import { RecetaConsultaForm } from '@/features/pacientes';

export default async function NuevaRecetaConsultaPage({
  params,
}: {
  params: Promise<{ id: string; consultaId: string }>;
}) {
  const { id, consultaId } = await params;
  return <RecetaConsultaForm pacienteId={id} consultaId={consultaId} />;
}
