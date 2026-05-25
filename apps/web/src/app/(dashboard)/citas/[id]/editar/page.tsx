import { Suspense } from 'react';
import { CitaForm } from '@/features/citas';

export default async function EditarCitaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="subtitle">Cargando...</div>}>
      <CitaForm mode="edit" citaId={id} />
    </Suspense>
  );
}
