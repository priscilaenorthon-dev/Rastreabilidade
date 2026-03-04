import { redirect } from 'next/navigation';
import { Building2 } from 'lucide-react';
import { ClientLoginForm } from '@/components/ClientLoginForm';
import { getClientPortalSession } from '@/lib/client-portal-auth';

export default async function ClienteLoginPage() {
  const session = await getClientPortalSession();
  if (session) {
    redirect('/cliente');
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 space-y-2 text-center">
          <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Building2 size={22} />
          </div>
          <h1 className="text-xl font-black text-slate-900">Portal do Cliente</h1>
          <p className="text-sm text-slate-600">Acesso somente leitura para servicos e produtos da sua empresa.</p>
        </div>

        <ClientLoginForm />
      </section>
    </main>
  );
}
