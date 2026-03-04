'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { getReportSnapshot } from '@/lib/data-service';
import type { ReportSnapshot } from '@/lib/types';
import { BarChart3, Download, FileText, ShieldCheck } from 'lucide-react';

function downloadExecutiveSummary(snapshot: ReportSnapshot) {
  const rows = [
    ['Indicador', 'Valor'],
    ['Total de Empresas', snapshot.totalCompanies],
    ['Total de Equipamentos', snapshot.totalEquipments],
    ['Total de Oportunidades', snapshot.totalOpportunities],
    ['Equipamentos Vencidos', snapshot.overdueCount],
    ['Vencendo em 30 dias', snapshot.expiringIn30Days],
    ['Gerado em', snapshot.generatedAt],
  ];

  const csv = rows
    .map((line) => line.map((col) => `"${String(col).replaceAll('"', '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resumo-executivo-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function RelatoriosPage() {
  const [snapshot, setSnapshot] = React.useState<ReportSnapshot | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getReportSnapshot();
        if (active) {
          setSnapshot(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar relatorios.');
        }
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

  return (
    <DashboardLayout title="Relatorios">
      <div className="space-y-6">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">Relatorios executivos para vendas consultivas e auditoria tecnica.</p>
          <button
            type="button"
            disabled={!snapshot}
            onClick={() => snapshot && downloadExecutiveSummary(snapshot)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60 sm:w-auto"
          >
            <Download size={14} />
            Exportar resumo executivo
          </button>
        </section>

        {loading && <p className="text-sm text-slate-500">Carregando indicadores do relatorio...</p>}
        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        {snapshot && (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Empresas</p>
                <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{snapshot.totalCompanies}</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Equipamentos</p>
                <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{snapshot.totalEquipments}</p>
              </article>
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Oportunidades</p>
                <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{snapshot.totalOpportunities}</p>
              </article>
              <article className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-red-700">Vencidos</p>
                <p className="mt-2 text-2xl font-black text-red-700 sm:text-3xl">{snapshot.overdueCount}</p>
              </article>
              <article className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Vencendo em 30 dias</p>
                <p className="mt-2 text-2xl font-black text-amber-700 sm:text-3xl">{snapshot.expiringIn30Days}</p>
              </article>
            </section>

            <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                  <BarChart3 size={16} className="text-blue-600" />
                  Narrativa comercial
                </h3>
                <p className="text-sm leading-relaxed text-slate-700">
                  O sistema demonstra previsibilidade operacional: identifica vencimentos, transforma eventos tecnicos em oportunidades
                  comerciais e reduz risco de parada com manutencao preventiva.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  <li>- Visibilidade de ponta a ponta por empresa e ativo.</li>
                  <li>- Alertas para acao antes da indisponibilidade.</li>
                  <li>- Base pronta para SLA e contratos recorrentes.</li>
                </ul>
              </article>

              <article className="rounded-xl border border-blue-200 bg-blue-50 p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-blue-700">
                  <ShieldCheck size={16} />
                  Confianca para auditoria
                </h3>
                <p className="text-sm text-blue-800">
                  Dados centralizados no Supabase com trilha de manutencao e inspecoes para auditoria interna e cliente final.
                </p>
                <p className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-blue-700">
                  <FileText size={14} />
                  Ultima geracao: {snapshot.generatedAt}
                </p>
              </article>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
