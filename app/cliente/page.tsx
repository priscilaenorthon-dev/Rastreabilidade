import { AlertTriangle, ClipboardCheck, Factory, Wrench } from 'lucide-react';
import { getClientReadonlySnapshot } from '@/lib/data-service';
import { getClientPortalSession } from '@/lib/client-portal-auth';

function formatDate(value: string | null): string {
  if (!value) {
    return '-';
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('pt-BR');
}

export default async function ClienteDashboardPage() {
  const session = await getClientPortalSession();
  const snapshot = await getClientReadonlySnapshot(session?.companyCnpj ?? '');

  if (!snapshot.company) {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Nao encontramos dados da empresa vinculada ao seu acesso.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-lg font-black text-slate-900">{snapshot.company.name}</h1>
        <p className="text-sm text-slate-600">CNPJ: {snapshot.company.cnpj}</p>
        <p className="mt-2 rounded-md bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700">
          Somente leitura: este portal permite visualizar servicos e produtos da sua empresa.
        </p>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Produtos</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{snapshot.indicators.totalEquipments}</p>
        </article>
        <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Vence em 30 dias</p>
          <p className="mt-2 text-3xl font-black text-amber-800">{snapshot.indicators.expiringSoon}</p>
        </article>
        <article className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-red-700">Vencidos</p>
          <p className="mt-2 text-3xl font-black text-red-800">{snapshot.indicators.overdue}</p>
        </article>
        <article className="rounded-xl border border-blue-200 bg-blue-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">Inspecoes pendentes</p>
          <p className="mt-2 text-3xl font-black text-blue-800">{snapshot.indicators.pendingInspections}</p>
        </article>
        <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Manutencoes abertas</p>
          <p className="mt-2 text-3xl font-black text-emerald-800">{snapshot.indicators.pendingMaintenances}</p>
        </article>
        <article className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Servicos em aberto</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{snapshot.indicators.openOpportunities}</p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 p-4">
            <Factory size={16} className="text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Produtos da empresa</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Tipo</th>
                  <th className="px-4 py-3">Local</th>
                  <th className="px-4 py-3">Vencimento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {snapshot.equipments.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-6 text-center text-slate-500">
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
                {snapshot.equipments.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3 font-semibold text-slate-900">{item.id}</td>
                    <td className="px-4 py-3">{item.type}</td>
                    <td className="px-4 py-3">{item.location ?? '-'}</td>
                    <td className="px-4 py-3">{formatDate(item.expires_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 p-4">
            <AlertTriangle size={16} className="text-amber-600" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Servicos e oportunidades</h2>
          </div>
          <div className="space-y-3 p-4">
            {snapshot.opportunities.length === 0 && (
              <p className="text-sm text-slate-500">Nenhum servico em aberto.</p>
            )}
            {snapshot.opportunities.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">{item.service}</p>
                <p className="text-xs text-slate-600">
                  Equipamento: {item.equipment_id ?? '-'} | Prazo: {formatDate(item.deadline)}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-700">Status: {item.status}</p>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 p-4">
            <ClipboardCheck size={16} className="text-blue-600" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Inspecoes</h2>
          </div>
          <div className="space-y-3 p-4">
            {snapshot.inspections.length === 0 && (
              <p className="text-sm text-slate-500">Nenhuma inspecao registrada.</p>
            )}
            {snapshot.inspections.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">{item.id}</p>
                <p className="text-xs text-slate-600">
                  Equipamento: {item.equipment_id} | Data: {formatDate(item.inspected_at)}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {item.result} | {item.status}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-slate-200 p-4">
            <Wrench size={16} className="text-emerald-600" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Manutencoes</h2>
          </div>
          <div className="space-y-3 p-4">
            {snapshot.maintenances.length === 0 && (
              <p className="text-sm text-slate-500">Nenhuma manutencao registrada.</p>
            )}
            {snapshot.maintenances.map((item) => (
              <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-bold text-slate-900">{item.id}</p>
                <p className="text-xs text-slate-600">
                  Equipamento: {item.equipment_id} | Data: {formatDate(item.scheduled_for)}
                </p>
                <p className="mt-1 text-xs font-semibold text-slate-700">
                  {item.maintenance_type} | {item.status}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
