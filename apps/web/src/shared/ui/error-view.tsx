'use client';

import { useEffect } from 'react';
import { SectionTitle, Subtitle, Button } from '@/shared/ui';
interface ErrorViewProps {
  error: Error & { digest?: string };
  reset: () => void;
  message?: string;
}

/**
 * Vista compartida para todos los `error.tsx` de rutas.
 * Centraliza markup y estilos en lugar de duplicar el componente por sección.
 */
export function ErrorView({ error, reset, message }: ErrorViewProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <SectionTitle>Ocurrió un error</SectionTitle>
      <Subtitle className="max-w-md">
        {error.message || message || 'No se pudo cargar esta sección.'}
      </Subtitle>
      <Button onClick={reset} variant="primary" size="sm" className="h-10 px-4">
        Reintentar
      </Button>
    </div>
  );
}
