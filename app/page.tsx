'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { getDashboardSnapshot } from '@/lib/data-service';
import type { DashboardSnapshot } from '@/lib/types';
import { AlertTriangle, ArrowRight, Building2, ClipboardCheck, Clock3, Factory, Wrench } from 'lucide-react';

function StatCard({
  title,
  value,
  helper,
  tone = 'slate',
}: {
  title: string;
  value: number;
  helper: string;
  tone?: 'slate' | 'red' | 'amber' | 'blue' | 'emerald';
}) {
  const toneClass = {
    slate: 'border-slate-200 bg-white text-slate-900',
    red: 'border-red-200 bg-red-50 text-red-700',
    amber: 'border-amber-200 bg-amber-50 text-amber-700',
    blue: 'border-blue-200 bg-blue-50 text-blue-700',
    emerald: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  }[tone];

  return (
    <article className={`rounded-xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${toneClass}`}>
      <p className="text-[11px] font-semibold uppercase tracking-wide">{title}</p>
      <p className="mt-2 text-2xl font-black sm:text-3xl">{value}</p>
      <p className="mt-1 text-xs opacity-80">{helper}</p>
    </article>
  );
}

export default function DashboardPage() {
  const [snapshot, setSnapshot] = React.useState<DashboardSnapshot | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getDashboardSnapshot();
        if (!active) {
          return;
        }
        setSnapshot(data);
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Falha ao carregar dashboard.');
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const content = (() => {
    if (loading) {
      return <p className="text-sm text-slate-500">Carregando indicadores de rastreabilidade...</p>;
    }

    if (error || !snapshot) {
      return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Nao foi possivel carregar o dashboard. {error ?? 'Tente novamente em alguns segundos.'}
        </div>
      );
    }

    const maxCompanyTotal = Math.max(1, ...snapshot.companiesByEquipment.map((item) => item.total));

    return (
      <div className="space-y-6 sm:space-y-8">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total de Equipamentos"
            value={snapshot.totalEquipments}
            helper="Base consolidada"
            tone="blue"
          />
          <StatCard
            title="Equipamentos Vencidos"
            value={snapshot.expiredEquipments}
            helper="Prioridade de troca"
            tone={snapshot.expiredEquipments > 0 ? 'red' : 'emerald'}
          />
          <StatCard
            title="Vencimento em 30 dias"
            value={snapshot.expiringSoon}
            helper="Acao preventiva"
            tone={snapshot.expiringSoon > 0 ? 'amber' : 'emerald'}
          />
          <StatCard
            title="Oportunidades Abertas"
            value={snapshot.openOpportunities}
            helper={`${snapshot.highUrgencyOpportunities} em alta urgencia`}
            tone="slate"
          />
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Carteira por empresa</h3>
              <Building2 size={18} className="text-blue-600" />
            </div>
            <div className="space-y-3">
              {snapshot.companiesByEquipment.length === 0 && (
                <p className="text-sm text-slate-500">Sem dados de empresas para exibir.</p>
              )}
              {snapshot.companiesByEquipment.map((item) => (
                <div key={item.companyName}>
                  <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{item.companyName}</span>
                    <span>{item.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-blue-600"
                      style={{ width: `${Math.max(8, (item.total / maxCompanyTotal) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Status operacional</h3>
              <Factory size={18} className="text-blue-600" />
            </div>
            <div className="space-y-3">
              {snapshot.equipmentStatusBreakdown.map((item) => (
                <div key={item.status} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                  <span className="text-sm font-medium text-slate-700">{item.status}</span>
                  <span className="text-sm font-black text-slate-900">{item.total}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-slate-600">
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="font-semibold">Inspecoes pendentes</p>
                <p className="text-xl font-black text-slate-900">{snapshot.pendingInspections}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-2">
                <p className="font-semibold">Manutencoes ativas</p>
                <p className="text-xl font-black text-slate-900">{snapshot.maintenanceInProgress}</p>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="flex flex-col items-start justify-between gap-2 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:p-5">
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
              <AlertTriangle size={18} className="text-red-600" />
              Alertas e oportunidades
            </h3>
            <Link href="/oportunidades" className="text-xs font-semibold text-blue-600 hover:underline">
              Ver painel completo
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Equipamento</th>
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Servico</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {snapshot.alerts.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                      Nenhum alerta ativo no momento.
                    </td>
                  </tr>
                )}
                {snapshot.alerts.map((alert) => (
                  <tr key={alert.id}>
                    <td className="px-4 py-3 font-semibold text-slate-800">{alert.id}</td>
                    <td className="px-4 py-3">{alert.equipmentId}</td>
                    <td className="px-4 py-3">{alert.companyName}</td>
                    <td className="px-4 py-3">{alert.type}</td>
                    <td className="px-4 py-3">{alert.dateLabel}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                        {alert.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/equipamentos/${alert.equipmentId}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Detalhes
                        <ArrowRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link href="/inspecoes" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md active:scale-[0.99]">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <ClipboardCheck size={14} />
              Inspecoes
            </p>
            <p className="text-sm text-slate-700">Gerencie checklists, aprovacoes e pendencias tecnicas.</p>
          </Link>
          <Link href="/manutencoes" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md active:scale-[0.99]">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Wrench size={14} />
              Manutencoes
            </p>
            <p className="text-sm text-slate-700">Acompanhe ordens de servico e custos por equipamento.</p>
          </Link>
          <Link href="/relatorios" className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md active:scale-[0.99]">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-slate-500">
              <Clock3 size={14} />
              Relatorios
            </p>
            <p className="text-sm text-slate-700">Gere material executivo para cliente e auditoria tecnica.</p>
          </Link>
        </section>
      </div>
    );
  })();

  return <DashboardLayout title="Dashboard Principal">{content}</DashboardLayout>;
}
