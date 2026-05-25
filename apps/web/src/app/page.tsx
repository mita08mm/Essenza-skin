import { redirect } from 'next/navigation';

export default function Home() {
  // Middleware ya redirige a /login si no hay token.
  // Si llegamos aquí, el usuario está autenticado.
  redirect('/pacientes');
}
