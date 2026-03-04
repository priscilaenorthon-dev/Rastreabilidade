import { ADMIN_PORTAL_COOKIE } from '@/lib/auth-cookies';

export { ADMIN_PORTAL_COOKIE };

function readEnv(name: string, fallback: string): string {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;
  return (env?.[name] ?? fallback).trim();
}

const ADMIN_PORTAL_USERNAME = readEnv('ADMIN_PORTAL_USERNAME', 'admin');
const ADMIN_PORTAL_PASSWORD = readEnv('ADMIN_PORTAL_PASSWORD', 'admin1234');

export interface AdminPortalSession {
  username: string;
  role: 'admin';
}

function normalize(value: string): string {
  return value.trim();
}

export function authenticateAdmin(username: string, password: string): AdminPortalSession | null {
  const normalizedUsername = normalize(username);
  const normalizedPassword = normalize(password);

  if (!normalizedUsername || !normalizedPassword) {
    return null;
  }

  if (normalizedUsername !== ADMIN_PORTAL_USERNAME || normalizedPassword !== ADMIN_PORTAL_PASSWORD) {
    return null;
  }

  return {
    username: ADMIN_PORTAL_USERNAME,
    role: 'admin',
  };
}
