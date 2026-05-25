import { CitaDetailView } from '@/features/citas';

export default async function CitaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CitaDetailView citaId={id} />;
}
