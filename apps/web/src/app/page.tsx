'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Home() {
  const router = useRouter();
  const { usuario, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (usuario) {
        router.push('/pacientes');
      } else {
        router.push('/login');
      }
    }
  }, [usuario, isLoading, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-piel border-t-morena rounded-full animate-spin mx-auto"></div>
        <p className="text-marengo">Redirigiendo...</p>
      </div>
    </div>
  );
}

