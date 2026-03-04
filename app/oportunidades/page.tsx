'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { getOpportunityViews } from '@/lib/data-service';
import type { OpportunityView } from '@/lib/types';
import { Download, Filter, FileText, Search, TriangleAlert } from 'lucide-react';

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

function downloadCsv(rows: OpportunityView[]) {
  const header = ['ID', 'Empresa', 'Equipamento', 'Servico', 'Urgencia', 'Prazo', 'Status'];
  const lines = rows.map((item) => [
    item.id,
    item.company_name,
    item.equipment_id ?? '-',
    item.service,
    item.urgency,
    formatDate(item.deadline),
    item.status,
  ]);

  const csv = [header, ...lines]
    .map((line) => line.map((column) => `"${String(column).replaceAll('"', '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `oportunidades-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function OportunidadesPage() {
  const [rows, setRows] = React.useState<OpportunityView[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState('');
  const [urgencyFilter, setUrgencyFilter] = React.useState<'Todas' | 'Alta' | 'Media' | 'Baixa'>('Todas');

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getOpportunityViews();
        if (active) {
          setRows(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar oportunidades.');
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

  const filteredRows = React.useMemo(() => {
    return rows.filter((item) => {
      if (urgencyFilter !== 'Todas' && item.urgency !== urgencyFilter) {
        return false;
      }

      if (!search.trim()) {
        return true;
      }

      const haystack = [item.id, item.company_name, item.equipment_id ?? '', item.service, item.status].join(' ').toLowerCase();
      return haystack.includes(search.trim().toLowerCase());
    });
  }, [rows, search, urgencyFilter]);

  const highUrgencyCount = rows.filter((item) => item.urgency === 'Alta').length;
  const pendingCount = rows.filter((item) => item.status.toLowerCase().includes('pendente')).length;

  return (
    <DashboardLayout title="Oportunidades de Servico">
      <div className="space-y-6 sm:space-y-7">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">
            Pipeline comercial e tecnico baseado na sua base de rastreabilidade no Supabase.
          </p>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
            <div className="relative w-full max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar oportunidade"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <button
              type="button"
              onClick={() => downloadCsv(filteredRows)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Download size={14} />
              Exportar CSV
            </button>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Total aberto</p>
            <p className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">{rows.length}</p>
          </article>
          <article className="rounded-xl border border-red-200 bg-red-50 p-4 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-red-700">Alta urgencia</p>
            <p className="mt-2 text-2xl font-black text-red-700 sm:text-3xl">{highUrgencyCount}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Pendentes</p>
            <p className="mt-2 text-2xl font-black text-amber-700 sm:text-3xl">{pendingCount}</p>
          </article>
        </section>

        <section className="flex flex-wrap items-center gap-2">
          {(['Todas', 'Alta', 'Media', 'Baixa'] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setUrgencyFilter(option)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                option === urgencyFilter
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Filter size={13} className="mr-1 inline" />
              {option}
            </button>
          ))}
        </section>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">Equipamento</th>
                  <th className="px-4 py-3">Servico</th>
                  <th className="px-4 py-3">Prazo</th>
                  <th className="px-4 py-3">Urgencia</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                      Carregando oportunidades...
                    </td>
                  </tr>
                )}
                {!loading && filteredRows.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                      Sem oportunidades para os filtros aplicados.
                    </td>
                  </tr>
                )}
                {filteredRows.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{item.company_name}</p>
                      <p className="text-xs text-slate-500">{item.unit ?? '-'}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{item.equipment_id ?? '-'}</p>
                      <p className="text-xs text-slate-500">{item.equipment_type}</p>
                    </td>
                    <td className="px-4 py-3">{item.service}</td>
                    <td className="px-4 py-3">{formatDate(item.deadline)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          item.urgency === 'Alta'
                            ? 'bg-red-100 text-red-700'
                            : item.urgency === 'Media'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.urgency}
                      </span>
                    </td>
                    <td className="px-4 py-3">{item.status}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/equipamentos/${item.equipment_id ?? ''}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        <FileText size={14} />
                        Detalhes
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <p className="font-semibold">Valor de venda</p>
          <p className="mt-1">
            Use este painel para demonstrar previsibilidade de receita com manutencao preventiva e reduzir paradas nao planejadas.
          </p>
          <p className="mt-2 inline-flex items-center gap-1 font-semibold text-blue-700">
            <TriangleAlert size={14} />
            Oportunidades de alta urgencia devem virar proposta em ate 24 horas.
          </p>
        </section>
      </div>
    </DashboardLayout>
  );
}
