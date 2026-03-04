import React from 'react';
import { Building2 } from 'lucide-react';
import { getClientPortalSession } from '@/lib/client-portal-auth';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientPortalSession();
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:flex-nowrap">
          <div className="flex min-w-0 items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Building2 size={20} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-black text-slate-900">Portal do Cliente</p>
              <p className="truncate text-xs text-slate-500">Usuario: {session.username}</p>
            </div>
          </div>
          <ClientLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-5 sm:py-6">{children}</main>
    </div>
  );
}
