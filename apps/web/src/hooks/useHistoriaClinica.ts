import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiEndpoint } from '@/lib/config';
import { HistoriaClinica } from '@/types/historia';

export function useHistoriaClinica(pacienteId: string) {
  const { token } = useAuth();
  const [historia, setHistoria] = useState<HistoriaClinica | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchHistoria = useCallback(async () => {
    if (!token || !pacienteId) return;

    try {
      setIsLoading(true);
      const response = await fetch(
        apiEndpoint(`/pacientes/${pacienteId}/historia-clinica`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar historia clínica');
      }

      const data = await response.json();
      setHistoria(data.data);
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }, [pacienteId, token]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchHistoria();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { historia, isLoading, error, refresh: fetchHistoria };
}
