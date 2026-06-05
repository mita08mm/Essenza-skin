import { EditRecetaView } from '@/features/prescripciones';

export default async function EditarRecetaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditRecetaView recetaId={id} />;
}
