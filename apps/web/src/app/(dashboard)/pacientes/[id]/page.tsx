import { PacienteForm } from '@/features/pacientes';

export default async function EditarPacientePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PacienteForm mode="edit" pacienteId={id} />;
}
