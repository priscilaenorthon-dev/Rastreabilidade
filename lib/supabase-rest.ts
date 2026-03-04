interface SupabaseConfig {
  url: string;
  anonKey: string;
  publishableKey: string;
}

type Primitive = string | number | boolean | null;

interface SelectOptions {
  select?: string;
  filters?: Record<string, Primitive>;
  orderBy?: { column: string; ascending?: boolean };
  limit?: number;
}

const REQUEST_TIMEOUT_MS = 8000;

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim();
const SUPABASE_ANON_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '').trim();
const SUPABASE_PUBLISHABLE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? '').trim();

export function getSupabaseConfig(): SupabaseConfig {
  return {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY,
    publishableKey: SUPABASE_PUBLISHABLE_KEY,
  };
}

export function isSupabaseConfigured(): boolean {
  const config = getSupabaseConfig();
  return Boolean(config.url && (config.anonKey || config.publishableKey));
}

function getRestKey(): string {
  const config = getSupabaseConfig();
  return config.anonKey || config.publishableKey;
}

function buildHeaders(extra?: Record<string, string>): HeadersInit {
  const apiKey = getRestKey();
  return {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    ...extra,
  };
}

function buildUrl(path: string): string {
  const { url } = getSupabaseConfig();
  return `${url.replace(/\/+$/, '')}/rest/v1/${path.replace(/^\/+/, '')}`;
}

async function requestJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase is not configured.');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(buildUrl(path), {
      ...init,
      headers: buildHeaders(init.headers as Record<string, string>),
      signal: controller.signal,
      cache: 'no-store',
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase request failed (${response.status}): ${text}`);
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timeout);
  }
}

function applyFilters(params: URLSearchParams, filters: Record<string, Primitive>): void {
  for (const [column, value] of Object.entries(filters)) {
    if (value === undefined) {
      continue;
    }

    if (value === null) {
      params.set(column, 'is.null');
      continue;
    }

    params.set(column, `eq.${value}`);
  }
}

export async function selectRows<T>(table: string, options: SelectOptions = {}): Promise<T[]> {
  const params = new URLSearchParams();
  params.set('select', options.select ?? '*');

  if (options.filters) {
    applyFilters(params, options.filters);
  }

  if (options.orderBy) {
    const direction = options.orderBy.ascending === false ? 'desc' : 'asc';
    params.set('order', `${options.orderBy.column}.${direction}`);
  }

  if (options.limit) {
    params.set('limit', String(options.limit));
  }

  const data = await requestJson<T[]>(`${table}?${params.toString()}`, {
    method: 'GET',
  });

  return Array.isArray(data) ? data : [];
}

export async function insertRow<T>(table: string, payload: object): Promise<T | null> {
  const data = await requestJson<T[]>(table, {
    method: 'POST',
    headers: {
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  return data[0] ?? null;
}

export async function updateRow<T>(
  table: string,
  filters: Record<string, Primitive>,
  payload: object
): Promise<T | null> {
  const params = new URLSearchParams();
  applyFilters(params, filters);
  params.set('select', '*');

  const data = await requestJson<T[]>(`${table}?${params.toString()}`, {
    method: 'PATCH',
    headers: {
      Prefer: 'return=representation',
    },
    body: JSON.stringify(payload),
  });

  return data[0] ?? null;
}

export async function deleteRow(table: string, filters: Record<string, Primitive>): Promise<boolean> {
  const params = new URLSearchParams();
  applyFilters(params, filters);
  params.set('select', 'id');

  const data = await requestJson<Array<{ id: string }>>(`${table}?${params.toString()}`, {
    method: 'DELETE',
    headers: {
      Prefer: 'return=representation',
    },
  });

  return data.length > 0;
}
