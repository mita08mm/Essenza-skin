import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME } from '@/features/auth';

const PUBLIC_PATHS = ['/', '/sys-e7k9m2px'];

export function proxy(req: NextRequest) {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  const { pathname } = req.nextUrl;
  const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (!token && !isPublic) {
    const url = req.nextUrl.clone();
    url.pathname = '/sys-e7k9m2px';
    if (pathname !== '/') url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  if (token && pathname === '/sys-e7k9m2px') {
    const url = req.nextUrl.clone();
    url.pathname = '/pacientes';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/|api/|favicon.ico|.*\\..*).*)'],
};
