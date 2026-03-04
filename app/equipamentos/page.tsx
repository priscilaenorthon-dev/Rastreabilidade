'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/DashboardLayout';
import { createEquipment, getCompanies, getEquipments } from '@/lib/data-service';
import type { Company, Equipment } from '@/lib/types';
import { PlusCircle, QrCode, Search } from 'lucide-react';

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

const EMPTY_FORM = {
  id: '',
  type: '',
  category: 'Mangueira' as Equipment['category'],
  company_id: '',
  status: 'Ativo',
  expires_at: '',
};

export default function EquipamentosPage() {
  const [equipments, setEquipments] = React.useState<Equipment[]>([]);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [form, setForm] = React.useState(EMPTY_FORM);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [equipmentRows, companyRows] = await Promise.all([getEquipments(), getCompanies()]);
        if (!active) {
          return;
        }

        setEquipments(equipmentRows);
        setCompanies(companyRows);
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar equipamentos.');
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

  const companyMap = React.useMemo(() => new Map(companies.map((company) => [company.id, company.name])), [companies]);

  const filtered = React.useMemo(() => {
    if (!query.trim()) {
      return equipments;
    }

    return equipments.filter((item) => {
      const haystack = [item.id, item.type, item.status, item.category, companyMap.get(item.company_id ?? '') ?? '']
        .join(' ')
        .toLowerCase();
      return haystack.includes(query.trim().toLowerCase());
    });
  }, [equipments, query, companyMap]);

  const handleFormChange = <K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.id.trim() || !form.type.trim()) {
      setError('Informe ID e tipo do equipamento.');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const created = await createEquipment({
        id: form.id,
        type: form.type,
        category: form.category,
        company_id: form.company_id || null,
        status: form.status,
        expires_at: form.expires_at || null,
      });

      setEquipments((current) => [created, ...current.filter((item) => item.id !== created.id)]);
      setForm(EMPTY_FORM);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar equipamento.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Equipamentos">
      <div className="space-y-7">
        <section className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm text-slate-500">Cadastro tecnico de mangueiras e conectores integrado ao Supabase.</p>
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar equipamento"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </section>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Categoria</th>
                <th className="px-4 py-3">Empresa</th>
                <th className="px-4 py-3">Validade</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Acao</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {loading && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Carregando equipamentos...
                  </td>
                </tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                    Nenhum equipamento encontrado.
                  </td>
                </tr>
              )}
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold text-slate-800">{item.id}</td>
                  <td className="px-4 py-3">{item.type}</td>
                  <td className="px-4 py-3">{item.category}</td>
                  <td className="px-4 py-3">{companyMap.get(item.company_id ?? '') ?? '-'}</td>
                  <td className="px-4 py-3">{formatDate(item.expires_at)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{item.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/equipamentos/${item.id}`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      <QrCode size={14} />
                      Detalhes
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
            <PlusCircle size={16} className="text-blue-600" />
            Novo equipamento
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <input
              value={form.id}
              onChange={(event) => handleFormChange('id', event.target.value)}
              placeholder="ID (ex.: MANG-9001)"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.type}
              onChange={(event) => handleFormChange('type', event.target.value)}
              placeholder="Tipo do equipamento"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <select
              value={form.category}
              onChange={(event) => handleFormChange('category', event.target.value as Equipment['category'])}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="Mangueira">Mangueira</option>
              <option value="Conector">Conector</option>
            </select>
            <select
              value={form.company_id}
              onChange={(event) => handleFormChange('company_id', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            >
              <option value="">Empresa nao vinculada</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.expires_at}
              onChange={(event) => handleFormChange('expires_at', event.target.value)}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.status}
              onChange={(event) => handleFormChange('status', event.target.value)}
              placeholder="Status"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar equipamento'}
            </button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
