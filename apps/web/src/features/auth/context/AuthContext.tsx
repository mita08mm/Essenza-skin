'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError } from '@/shared/api';
import { getClientToken, setClientToken, clearClientToken } from '@/features/auth/lib/cookies';

interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: string;
}

interface LoginResponse {
  token: string;
  usuario: Usuario;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    const verifyToken = async () => {
      const storedToken = getClientToken();

      if (!storedToken) {
        if (!cancelled) setIsLoading(false);
        return;
      }

      try {
        const data = await api.get<Usuario>('/auth/me');
        if (!cancelled) {
          setUsuario(data);
          setToken(storedToken);
        }
      } catch (error) {
        if (error instanceof ApiError && error.status !== 401) {
          console.error('Error verificando token:', error);
        }
        if (!cancelled) {
          clearClientToken();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    verifyToken();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<LoginResponse>(
        '/auth/login',
        { email, password },
        { skipAuth: true },
      );

      setClientToken(data.token);
      setToken(data.token);
      setUsuario(data.usuario);

      router.push('/pacientes');
    },
    [router],
  );

  const logout = useCallback(() => {
    setUsuario(null);
    setToken(null);
    clearClientToken();
    router.push('/login');
  }, [router]);

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
