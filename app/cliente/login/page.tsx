import { redirect } from 'next/navigation';
import { Building2, ShieldCheck, Sparkles, Wrench } from 'lucide-react';
import { ClientLoginForm } from '@/components/ClientLoginForm';
import { getClientPortalSession } from '@/lib/client-portal-auth';

export default async function ClienteLoginPage() {
  const session = await getClientPortalSession();
  if (session) {
    redirect('/cliente');
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-8 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-sky-500/20 blur-3xl" />
      </div>

      <section className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/15 bg-white/[0.03] shadow-[0_25px_80px_-20px_rgba(15,23,42,0.75)] backdrop-blur-xl lg:grid-cols-[1.1fr,0.9fr]">
        <div className="hidden border-r border-white/10 p-8 lg:block xl:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-100">
            <Sparkles size={14} />
            Portal Premium do Cliente
          </div>

          <h1 className="mt-6 text-3xl font-black leading-tight text-white">
            Seus equipamentos e serviços em um único painel confiável.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-slate-300">
            Consulte inspeções, manutenções e status dos produtos da sua empresa com transparência e atualização contínua.
          </p>

          <div className="mt-8 space-y-3">
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <ShieldCheck size={18} className="mt-0.5 text-emerald-300" />
              <div>
                <p className="text-sm font-semibold text-white">Acesso seguro</p>
                <p className="text-xs text-slate-300">Sessão protegida para visualização exclusiva dos seus dados.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
              <Wrench size={18} className="mt-0.5 text-blue-300" />
              <div>
                <p className="text-sm font-semibold text-white">Rastreamento técnico</p>
                <p className="text-xs text-slate-300">Status de inspeções e manutenções sempre disponível para auditoria.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-7 lg:p-8">
          <div className="mb-6 space-y-2 text-center lg:text-left">
            <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-600/30 lg:mx-0">
              <Building2 size={22} />
            </div>
            <h1 className="text-2xl font-black text-white">Portal do Cliente</h1>
            <p className="text-sm text-slate-300">Acesse para acompanhar produtos e serviços vinculados à sua empresa.</p>
          </div>

          <ClientLoginForm />

          <p className="mt-5 text-center text-xs text-slate-400 lg:text-left">
            Precisa de suporte? Fale com o administrador responsável pela sua conta.
          </p>
        </div>
      </section>
    </main>
  );
}
