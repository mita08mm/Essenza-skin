import { RecetaDetailView } from '@/features/recetas';

export default async function RecetaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <RecetaDetailView recetaId={id} />;
}
