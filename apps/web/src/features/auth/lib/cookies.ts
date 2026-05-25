/**
 * Helpers para manejar el token de autenticación en cookie + localStorage.
 *
 * Nota arquitectónica:
 * - Hoy el backend devuelve el JWT en el body del login. Lo guardamos en
 *   `localStorage` (para que el cliente lo añada como `Bearer` en cada fetch)
 *   y, en paralelo, lo escribimos en una cookie `SameSite=Lax` para que el
 *   middleware del Edge pueda leerlo y proteger rutas server-side.
 * - Cuando el backend pase a emitir `Set-Cookie` httpOnly, este módulo deja
 *   de escribir en cliente y `getClientToken()` se vuelve obsoleto.
 */

export const AUTH_COOKIE_NAME = 'auth_token';
const LOCAL_STORAGE_KEY = 'token';
// 7 días en segundos. Si el JWT del backend tiene otro TTL, ajustar aquí.
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

export function getClientToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(LOCAL_STORAGE_KEY);
}

export function setClientToken(token: string): void {
  if (!isBrowser()) return;
  localStorage.setItem(LOCAL_STORAGE_KEY, token);
  // Cookie no-httpOnly (la pone JS). Es leída por el middleware.
  // `Secure` se omite intencionalmente para que funcione también en `localhost`;
  // en producción se debe servir por HTTPS y el navegador lo trata como seguro
  // por host (excepto `localhost`).
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax${secure}`;
}

export function clearClientToken(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  document.cookie = `${AUTH_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}
