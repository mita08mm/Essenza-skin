'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth';
import { Button } from '@/shared/ui';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="to-piel/10 flex min-h-screen items-center justify-center bg-gradient-to-br from-white px-4">
      <div className="w-full max-w-md">
        <div className="space-y-8 rounded-2xl bg-white p-8 shadow-xl">
          <div className="space-y-2 text-center">
            <h1 className="font-heading text-concreto text-3xl font-bold">Sistema Clinico</h1>
            <p className="text-marengo">Ingresa tus credenciales para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-concreto block text-sm font-medium">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-marengo/30 focus:border-morena focus:ring-piel/20 w-full rounded-lg border px-4 py-3 transition-all outline-none focus:ring-2"
                placeholder="tu@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-concreto block text-sm font-medium">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-marengo/30 focus:border-morena focus:ring-piel/20 w-full rounded-lg border px-4 py-3 transition-all outline-none focus:ring-2"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading} variant="primary" size="md">
              {isLoading ? 'Iniciando sesion...' : 'Iniciar Sesion'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
