'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { createInspection, deleteInspection, getEquipments, getInspectionViews, updateInspectionStatus } from '@/lib/data-service';
import type { Equipment, InspectionView } from '@/lib/types';
import { CheckCircle2, CircleAlert, ClipboardCheck, Search, Trash2 } from 'lucide-react';

function formatDate(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }
  return parsed.toLocaleDateString('pt-BR');
}

const EMPTY_FORM = {
  equipment_id: '',
  inspector: '',
  result: 'Aprovado',
  status: 'Pendente de acao',
  inspected_at: new Date().toISOString().slice(0, 10),
  notes: '',
};

export default function InspecoesPage() {
  const [rows, setRows] = React.useState<InspectionView[]>([]);
  const [equipments, setEquipments] = React.useState<Equipment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [onlyPending, setOnlyPending] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [busyId, setBusyId] = React.useState<string | null>(null);
  const [form, setForm] = React.useState(EMPTY_FORM);

  const loadRows = React.useCallback(async () => {
    try {
      const data = await getInspectionViews();
      setRows(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao carregar inspecoes.');
    }
  }, []);

  const loadEquipments = React.useCallback(async () => {
    const equipmentRows = await getEquipments();
    setEquipments(equipmentRows);
  }, []);

  React.useEffect(() => {
    let active = true;

    async function run() {
      if (!active) {
        return;
      }
      setLoading(true);
      try {
        await Promise.all([loadRows(), loadEquipments()]);
      } catch {
        // handled in individual loaders
      }
      if (active) {
        setLoading(false);
      }
    }

    void run();

    return () => {
      active = false;
    };
  }, [loadRows, loadEquipments]);

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

  const handleFormChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.equipment_id.trim() || !form.inspector.trim()) {
      setError('Informe equipamento e inspetor para salvar a inspeção.');
      return;
    }

    if (!equipments.some((item) => item.id === form.equipment_id)) {
      setError('Selecione um equipamento válido para salvar a inspeção.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await createInspection({
        equipment_id: form.equipment_id,
        inspector: form.inspector,
        result: form.result,
        status: form.status,
        inspected_at: form.inspected_at,
        notes: form.notes,
      });
      await loadRows();
      setForm(EMPTY_FORM);
      setSuccessMessage('Inspeção salva no Supabase com sucesso.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar inspeção.');
    } finally {
      setSaving(false);
    }
  };

  const handleMarkDone = async (id: string) => {
    setBusyId(id);
    setError(null);
    setSuccessMessage(null);

    try {
      await updateInspectionStatus(id, { status: 'Concluida', result: 'Aprovado' });
      await loadRows();
      setSuccessMessage(`Inspeção ${id} atualizada.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao atualizar inspeção.');
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (id: string) => {
    setBusyId(id);
    setError(null);
    setSuccessMessage(null);

    try {
      await deleteInspection(id);
      setRows((current) => current.filter((item) => item.id !== id));
      setSuccessMessage(`Inspeção ${id} excluida.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao excluir inspeção.');
    } finally {
      setBusyId(null);
    }
  };

  return (
    <DashboardLayout title="Inspecoes">
      <div className="space-y-6">
        <section className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-slate-500">Controle de inspeções com CRUD conectado ao Supabase.</p>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="relative w-full sm:w-auto">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Buscar inspeção"
                className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 sm:w-auto"
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
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{successMessage}</div>
        )}

        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-700">Nova inspeção</h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
            <select
              value={form.equipment_id}
              onChange={(event) => handleFormChange('equipment_id', event.target.value)}
              disabled={equipments.length === 0}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">{equipments.length === 0 ? 'Cadastre um equipamento primeiro' : 'Selecione o equipamento'}</option>
              {equipments.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.id} - {item.type}
                </option>
              ))}
            </select>
            <input
              value={form.inspector}
              onChange={(event) => handleFormChange('inspector', event.target.value)}
              placeholder="Inspetor"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <select
              value={form.result}
              onChange={(event) => handleFormChange('result', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option>Aprovado</option>
              <option>Reprovado</option>
            </select>
            <select
              value={form.status}
              onChange={(event) => handleFormChange('status', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option>Pendente de acao</option>
              <option>Concluida</option>
            </select>
            <input
              type="date"
              value={form.inspected_at}
              onChange={(event) => handleFormChange('inspected_at', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:-translate-y-px hover:bg-blue-700 hover:shadow-md disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar inspeção'}
            </button>
            <input
              value={form.notes}
              onChange={(event) => handleFormChange('notes', event.target.value)}
              placeholder="Observações"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30 md:col-span-2 xl:col-span-6"
            />
          </form>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Equipamento</th>
                <th className="px-4 py-3">Inspetor</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Resultado</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Carregando inspeções...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Nenhuma inspeção encontrada.
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
                    <div className="flex items-center justify-end gap-2">
                      {!item.status.toLowerCase().includes('concluida') && (
                        <button
                          type="button"
                          onClick={() => handleMarkDone(item.id)}
                          disabled={busyId === item.id}
                          className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 disabled:opacity-60"
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
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                      >
                        <ClipboardCheck size={14} />
                        Abrir
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
