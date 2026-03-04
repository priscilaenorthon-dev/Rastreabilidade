'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { createMaintenance, deleteMaintenance, getMaintenanceViews, updateMaintenanceStatus } from '@/lib/data-service';
import type { MaintenanceView } from '@/lib/types';
import { CircleCheck, Clock3, Search, Trash2, Wrench } from 'lucide-react';

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('pt-BR');
}

const EMPTY_FORM = {
  equipment_id: '',
  maintenance_type: 'Preventiva',
  scheduled_for: new Date().toISOString().slice(0, 10),
  status: 'Agendada',
  technician: '',
  cost: '',
  notes: '',
};

export default function ManutencoesPage() {
  const [rows, setRows] = React.useState<MaintenanceView[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [statusFilter, setStatusFilter] = React.useState<'Todas' | 'Agendada' | 'Em andamento' | 'Concluida'>('Todas');
  const [query, setQuery] = React.useState('');
  const [saving, setSaving] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(EMPTY_FORM);

  const loadRows = React.useCallback(async () => {
    try {
      const data = await getMaintenanceViews();
      setRows(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar manutencoes.');
    }
  }, []);

  React.useEffect(() => {
    let active = true;

    async function run() {
      if (!active) {
        return;
      }
      setLoading(true);
      await loadRows();
      if (active) {
        setLoading(false);
      }
    }

    void run();

    return () => {
      active = false;
    };
  }, [loadRows]);

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

  const handleFormChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.equipment_id.trim()) {
      setError('Informe o ID do equipamento para salvar a manutenção.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await createMaintenance({
        equipment_id: form.equipment_id,
        maintenance_type: form.maintenance_type,
        scheduled_for: form.scheduled_for,
        status: form.status,
        technician: form.technician,
        cost: form.cost ? Number(form.cost) : null,
        notes: form.notes,
      });

      await loadRows();
      setForm(EMPTY_FORM);
      setSuccessMessage('Manutenção salva no Supabase com sucesso.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar manutenção.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDone = async (id: string) => {
    setBusyId(id);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateMaintenanceStatus(id, { status: 'Concluida' });
      await loadRows();
      setSuccessMessage(`Manutenção ${id} atualizada.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar manutenção.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteMaintenance(id);
      setRows((current) => current.filter((item) => item.id !== id));
      setSuccessMessage(`Manutenção ${id} excluida.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir manutenção.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout title="Manutencoes">
      <div className="space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">CRUD de manutenções conectado ao Supabase.</p>
          <div className="relative w-full sm:w-auto">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar manutenção"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 sm:w-auto"
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
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">Nova manutenção</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">
            <input
              value={form.equipment_id}
              onChange={(event) => handleFormChange('equipment_id', event.target.value)}
              placeholder="Equipamento ID"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <select
              value={form.maintenance_type}
              onChange={(event) => handleFormChange('maintenance_type', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option>Preventiva</option>
              <option>Corretiva</option>
              <option>Preditiva</option>
            </select>
            <input
              type="date"
              value={form.scheduled_for}
              onChange={(event) => handleFormChange('scheduled_for', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <select
              value={form.status}
              onChange={(event) => handleFormChange('status', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option>Agendada</option>
              <option>Em andamento</option>
              <option>Concluida</option>
            </select>
            <input
              value={form.technician}
              onChange={(event) => handleFormChange('technician', event.target.value)}
              placeholder="Técnico"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.cost}
              onChange={(event) => handleFormChange('cost', event.target.value)}
              placeholder="Custo (R$)"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-px hover:bg-blue-700 hover:shadow-md disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar manutenção'}
            </button>
            <input
              value={form.notes}
              onChange={(event) => handleFormChange('notes', event.target.value)}
              placeholder="Observações"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 md:col-span-2 xl:col-span-7"
            />
          </form>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading && <p className="text-sm text-slate-500">Carregando manutenções...</p>}
          {!loading && filteredRows.length === 0 && (
            <p className="text-sm text-slate-500">Nenhuma manutenção encontrada para os filtros aplicados.</p>
          )}
          {filteredRows.map((item) => (
            <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
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
                  <span className="font-semibold">Técnico:</span> {item.technician ?? '-'}
                </p>
                <p>
                  <span className="font-semibold">Custo:</span> {item.cost ? `R$ ${item.cost.toFixed(2)}` : '-'}
                </p>
              </div>

              <div className="mt-3 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                {item.status === 'Concluida' ? <CircleCheck size={12} /> : <Clock3 size={12} />}
                {item.status}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                {item.status !== 'Concluida' && (
                  <button
                    type="button"
                    onClick={() => handleMarkDone(item.id)}
                    disabled={busyId === item.id}
                    className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
                  >
                    Concluir
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={busyId === item.id}
                  className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-1 text-xs font-semibold text-red-700 hover:bg-red-100 disabled:opacity-60"
                >
                  <Trash2 size={13} />
                  Excluir
                </button>
                <Link
                  href={`/equipamentos/${item.equipment_id}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                >
                  Ver equipamento
                </Link>
              </div>
            </article>
          ))}
        </section>
      </div>
    </DashboardLayout>
  );
}
