import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { CLIENT_PORTAL_COOKIE } from '@/lib/client-portal-auth';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const hasClientSession = Boolean(request.cookies.get(CLIENT_PORTAL_COOKIE)?.value);
  const isClientRoute = pathname.startsWith('/cliente');
  const isClientLogin = pathname === '/cliente/login';
  const isClientAuthApi = pathname.startsWith('/api/client-auth/');

  if (!hasClientSession && isClientRoute && !isClientLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/cliente/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (hasClientSession && isClientLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/cliente';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (hasClientSession && !isClientRoute && !isClientAuthApi) {
    const url = request.nextUrl.clone();
    url.pathname = '/cliente';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)'],
};
