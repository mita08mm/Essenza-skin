import { ConsultaForm } from '@/features/pacientes';

export default async function NuevaConsultaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ConsultaForm pacienteId={id} />;
}
