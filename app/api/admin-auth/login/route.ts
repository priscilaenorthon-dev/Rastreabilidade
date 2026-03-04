import { NextResponse } from 'next/server';
import { authenticateAdmin, ADMIN_PORTAL_COOKIE } from '@/lib/admin-portal-auth';
import { CLIENT_PORTAL_COOKIE } from '@/lib/auth-cookies';

export async function POST(request: Request) {
  let payload: { username?: string; password?: string } = {};

  try {
    payload = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, message: 'Requisicao invalida.' }, { status: 400 });
  }

  const username = payload.username?.trim() ?? '';
  const password = payload.password?.trim() ?? '';

  const session = authenticateAdmin(username, password);
  if (!session) {
    return NextResponse.json({ ok: false, message: 'Usuario ou senha de administrador invalido.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_PORTAL_COOKIE, session.username, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  response.cookies.set(CLIENT_PORTAL_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });

  return response;
}
