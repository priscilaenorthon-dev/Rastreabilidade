import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { ADMIN_PORTAL_COOKIE, CLIENT_PORTAL_COOKIE } from '@/lib/auth-cookies';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const hasAdminSession = Boolean(request.cookies.get(ADMIN_PORTAL_COOKIE)?.value);
  const hasClientSession = Boolean(request.cookies.get(CLIENT_PORTAL_COOKIE)?.value);

  const isClientRoute = pathname.startsWith('/cliente');
  const isClientLogin = pathname === '/cliente/login';
  const isAdminLogin = pathname === '/login';

  const isApiRoute = pathname.startsWith('/api/');
  const isClientAuthApi = pathname.startsWith('/api/client-auth/');
  const isAdminAuthApi = pathname.startsWith('/api/admin-auth/');

  if (isApiRoute) {
    return NextResponse.next();
  }

  if (isClientAuthApi || isAdminAuthApi) {
    return NextResponse.next();
  }

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

  if (hasClientSession && !hasAdminSession && !isClientRoute && !isAdminLogin) {
    const url = request.nextUrl.clone();
    url.pathname = '/cliente';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isAdminLogin) {
    if (hasAdminSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.search = '';
      return NextResponse.redirect(url);
    }

    if (hasClientSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/cliente';
      url.search = '';
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  if (!isClientRoute && !hasAdminSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\..*).*)'],
};
