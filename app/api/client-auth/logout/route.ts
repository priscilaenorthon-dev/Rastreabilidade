import { NextResponse } from 'next/server';
import { CLIENT_PORTAL_COOKIE } from '@/lib/client-portal-auth';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CLIENT_PORTAL_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  });
  return response;
}
