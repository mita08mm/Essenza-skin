import { PacienteHistoriaView } from '@/features/pacientes';

export default async function HistoriaClinicaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PacienteHistoriaView pacienteId={id} />;
}
