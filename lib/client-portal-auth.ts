import { cookies } from 'next/headers';
import { hashPassword } from '@/lib/password-utils';
import { isSupabaseConfigured, selectRows } from '@/lib/supabase-rest';
import type { ClientAccount, Company } from '@/lib/types';

export const CLIENT_PORTAL_COOKIE = 'hosetrack_client_portal';

const CLIENT_PORTAL_USERNAME = (process.env.CLIENT_PORTAL_USERNAME ?? 'jomaga').trim();
const CLIENT_PORTAL_PASSWORD = (process.env.CLIENT_PORTAL_PASSWORD ?? 'jomaga1234').trim();
const CLIENT_PORTAL_CNPJ = (process.env.CLIENT_PORTAL_CNPJ ?? '33.000.167/0001-01').trim();

export interface ClientPortalSession {
  username: string;
  companyId: string | null;
  companyCnpj: string;
}

function normalize(value: string): string {
  return value.trim();
}

function fallbackAuth(username: string, password: string): ClientPortalSession | null {
  if (normalize(username) !== CLIENT_PORTAL_USERNAME || normalize(password) !== CLIENT_PORTAL_PASSWORD) {
    return null;
  }

  return {
    username: CLIENT_PORTAL_USERNAME,
    companyId: null,
    companyCnpj: CLIENT_PORTAL_CNPJ,
  };
}

export async function authenticateClient(username: string, password: string): Promise<ClientPortalSession | null> {
  const normalizedUsername = normalize(username);
  const normalizedPassword = normalize(password);

  if (!normalizedUsername || !normalizedPassword) {
    return null;
  }

  if (!isSupabaseConfigured()) {
    return fallbackAuth(normalizedUsername, normalizedPassword);
  }

  try {
    const accounts = await selectRows<ClientAccount>('client_accounts', {
      filters: {
        username: normalizedUsername,
        is_active: true,
      },
      limit: 1,
    });

    const account = accounts[0];
    if (!account) {
      return fallbackAuth(normalizedUsername, normalizedPassword);
    }

    const providedHash = await hashPassword(normalizedPassword);
    if (account.password_hash !== providedHash) {
      return null;
    }

    const companies = await selectRows<Company>('companies', {
      filters: { id: account.company_id },
      limit: 1,
    });

    const company = companies[0];
    if (!company) {
      return null;
    }

    return {
      username: account.username,
      companyId: company.id,
      companyCnpj: company.cnpj,
    };
  } catch {
    return fallbackAuth(normalizedUsername, normalizedPassword);
  }
}

export function encodeClientSession(session: ClientPortalSession): string {
  const payload = JSON.stringify(session);
  return Buffer.from(payload, 'utf8').toString('base64url');
}

export function decodeClientSession(value: string | undefined): ClientPortalSession | null {
  if (!value) {
    return null;
  }

  try {
    const json = Buffer.from(value, 'base64url').toString('utf8');
    const parsed = JSON.parse(json) as Partial<ClientPortalSession>;
    if (!parsed.username || !parsed.companyCnpj) {
      return null;
    }
    return {
      username: parsed.username,
      companyId: parsed.companyId ?? null,
      companyCnpj: parsed.companyCnpj,
    };
  } catch {
    return null;
  }
}

export async function getClientPortalSession(): Promise<ClientPortalSession | null> {
  const store = await cookies();
  const raw = store.get(CLIENT_PORTAL_COOKIE)?.value;
  return decodeClientSession(raw);
}
