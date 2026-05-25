import { Suspense } from 'react';
import { CitaForm } from '@/features/citas';

export default function NuevaCitaPage() {
  return (
    <Suspense fallback={<div className="subtitle">Cargando...</div>}>
      <CitaForm mode="create" />
    </Suspense>
  );
}
