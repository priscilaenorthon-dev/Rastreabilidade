import React from 'react';
import { redirect } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { getClientPortalSession } from '@/lib/client-portal-auth';
import { ClientLogoutButton } from '@/components/ClientLogoutButton';

export default async function ClienteLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientPortalSession();
  if (!session) {
    redirect('/cliente/login');
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-sm font-black text-slate-900">Portal do Cliente</p>
              <p className="text-xs text-slate-500">Usuario: {session.username}</p>
            </div>
          </div>
          <ClientLogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
