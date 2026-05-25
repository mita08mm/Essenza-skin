import { CobroDetailView } from '@/features/cobros';

export default async function CobroDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <CobroDetailView cobroId={id} />;
}
