'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { getInspectionViews } from '@/lib/data-service';
import type { InspectionView } from '@/lib/types';
import { CheckCircle2, CircleAlert, ClipboardCheck, Search } from 'lucide-react';

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('pt-BR');
}

export default function InspecoesPage() {
  const [rows, setRows] = React.useState<InspectionView[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [onlyPending, setOnlyPending] = React.useState(false);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getInspectionViews();
        if (active) {
          setRows(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar inspecoes.');
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

  const filtered = React.useMemo(() => {
    return rows.filter((item) => {
      if (onlyPending && !item.status.toLowerCase().includes('pendente')) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

      const haystack = [item.id, item.equipment_id, item.equipment_type, item.inspector, item.result].join(' ').toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [rows, onlyPending, query]);

  return (
    <DashboardLayout title="Inspecoes">
      <div className="space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Controle de inspeções periodicas com historico por equipamento.</p>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar inspecao"
                className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
            <button
              type="button"
              onClick={() => setOnlyPending((value) => !value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {onlyPending ? 'Mostrar todas' : 'Somente pendentes'}
            </button>
          </div>
        </section>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Equipamento</th>
                <th className="px-4 py-3">Inspetor</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Resultado</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Acao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Carregando inspecoes...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Nenhuma inspecao encontrada.
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.id}</td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-slate-800">{item.equipment_id}</p>
                    <p className="text-xs text-slate-500">{item.equipment_type}</p>
                  </td>
                  <td className="px-4 py-3">{item.inspector}</td>
                  <td className="px-4 py-3">{formatDate(item.inspected_at)}</td>
                  <td className="px-4 py-3">{item.result}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                      {item.status.toLowerCase().includes('pendente') ? <CircleAlert size={12} /> : <CheckCircle2 size={12} />}
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/equipamentos/${item.equipment_id}`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      <ClipboardCheck size={14} />
                      Abrir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </DashboardLayout>
  );
}
