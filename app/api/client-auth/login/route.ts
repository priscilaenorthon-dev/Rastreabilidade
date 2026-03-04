import { NextResponse } from 'next/server';
import { authenticateClient, CLIENT_PORTAL_COOKIE, encodeClientSession } from '@/lib/client-portal-auth';

export async function POST(request: Request) {
  let payload: { username?: string; password?: string } = {};

  try {
    payload = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ ok: false, message: 'Requisicao invalida.' }, { status: 400 });
  }

  const username = payload.username?.trim() ?? '';
  const password = payload.password?.trim() ?? '';

  const session = await authenticateClient(username, password);
  if (!session) {
    return NextResponse.json({ ok: false, message: 'Usuario ou senha invalido.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_PORTAL_COOKIE, encodeClientSession(session), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 8,
  });

  return response;
}
