'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { getMaintenanceViews } from '@/lib/data-service';
import type { MaintenanceView } from '@/lib/types';
import { CircleCheck, Clock3, Search, Wrench } from 'lucide-react';

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('pt-BR');
}

export default function ManutencoesPage() {
  const [rows, setRows] = React.useState<MaintenanceView[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<'Todas' | 'Agendada' | 'Em andamento' | 'Concluida'>('Todas');
  const [query, setQuery] = React.useState('');

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await getMaintenanceViews();
        if (active) {
          setRows(data);
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar manutencoes.');
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
      if (statusFilter !== 'Todas' && item.status !== statusFilter) {
        return false;
      }

      if (!query.trim()) {
        return true;
      }

      const haystack = [item.id, item.equipment_id, item.equipment_type, item.maintenance_type, item.technician ?? '']
        .join(' ')
        .toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [rows, statusFilter, query]);

  return (
    <DashboardLayout title="Manutencoes">
      <div className="space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Acompanhe ordens de servico, custos e status de execucao.</p>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar manutencao"
              className="rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </section>

        <section className="flex flex-wrap items-center gap-2">
          {(['Todas', 'Agendada', 'Em andamento', 'Concluida'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                statusFilter === status
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </section>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading && <p className="text-sm text-slate-500">Carregando manutencoes...</p>}
          {!loading && filteredRows.length === 0 && (
            <p className="text-sm text-slate-500">Nenhuma manutencao encontrada para os filtros aplicados.</p>
          )}
          {filteredRows.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.id}</p>
                  <p className="text-xs text-slate-500">{item.maintenance_type}</p>
                </div>
                <Wrench size={16} className="text-blue-600" />
              </div>

              <div className="space-y-1 text-sm text-slate-700">
                <p>
                  <span className="font-semibold">Equipamento:</span> {item.equipment_id}
                </p>
                <p>
                  <span className="font-semibold">Tipo:</span> {item.equipment_type}
                </p>
                <p>
                  <span className="font-semibold">Data:</span> {formatDate(item.scheduled_for)}
                </p>
                <p>
                  <span className="font-semibold">Tecnico:</span> {item.technician ?? '-'}
                </p>
                <p>
                  <span className="font-semibold">Custo:</span> {item.cost ? `R$ ${item.cost.toFixed(2)}` : '-'}
                </p>
              </div>

              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {item.status === 'Concluida' ? <CircleCheck size={12} /> : <Clock3 size={12} />}
                {item.status}
              </div>

              <Link
                href={`/equipamentos/${item.equipment_id}`}
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
              >
                Ver equipamento
              </Link>
            </article>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}
