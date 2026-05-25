'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { usuario, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !usuario) {
      router.push('/login');
    }
  }, [usuario, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="border-piel border-t-morena mx-auto h-16 w-16 animate-spin rounded-lg border-4"></div>
          <p className="text-marengo">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return null;
  }

  return <>{children}</>;
}
