'use client';

import React from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { createCompany, getCompanies, getMaintenances } from '@/lib/data-service';
import type { Company } from '@/lib/types';
import { Building2, CheckCircle2, Clock3, Eye, Search, UserPlus2 } from 'lucide-react';

const EMPTY_FORM = {
  name: '',
  segment: '',
  cnpj: '',
  location: '',
  responsible: '',
  email: '',
  phone: '',
};

export default function EmpresasPage() {
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [maintenancePending, setMaintenancePending] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState('');
  const [form, setForm] = React.useState(EMPTY_FORM);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [companyRows, maintenanceRows] = await Promise.all([getCompanies(), getMaintenances()]);
        if (!active) {
          return;
        }

        setCompanies(companyRows);
        setMaintenancePending(
          maintenanceRows.filter((item) => ['agendada', 'em andamento', 'pendente'].some((status) => item.status.toLowerCase().includes(status))).length
        );
      } catch (err) {
        if (!active) {
          return;
        }
        setError(err instanceof Error ? err.message : 'Falha ao carregar empresas.');
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

  const filteredCompanies = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return companies;
    }

    return companies.filter((company) => {
      return [company.name, company.segment, company.cnpj, company.location ?? '', company.responsible ?? '']
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [companies, query]);

  const activeCompanies = companies.filter((company) => company.status === 'Ativo').length;
  const inactiveCompanies = companies.length - activeCompanies;

  const handleFormChange = (field: keyof typeof EMPTY_FORM, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim() || !form.segment.trim() || !form.cnpj.trim()) {
      setError('Preencha nome, segmento e CNPJ para salvar.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const created = await createCompany({
        name: form.name,
        segment: form.segment,
        cnpj: form.cnpj,
        location: form.location,
        responsible: form.responsible,
        email: form.email,
        phone: form.phone,
        status: 'Ativo',
      });

      setCompanies((current) => [created, ...current]);
      setForm(EMPTY_FORM);
      setSuccessMessage(`Empresa "${created.name}" salva no Supabase com sucesso.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao salvar empresa.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout title="Gestao de Empresas">
      <div className="space-y-8">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-slate-500">Cadastro de clientes industriais conectado ao Supabase.</p>
          </div>
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar empresa, CNPJ ou responsavel"
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <article className="rounded-xl border border-blue-200 bg-blue-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-700">Total de empresas</p>
            <p className="mt-2 text-3xl font-black text-blue-800">{companies.length}</p>
          </article>
          <article className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-700">Ativas</p>
            <p className="mt-2 text-3xl font-black text-emerald-800">{activeCompanies}</p>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">Inativas</p>
            <p className="mt-2 text-3xl font-black text-slate-900">{inactiveCompanies}</p>
          </article>
          <article className="rounded-xl border border-amber-200 bg-amber-50 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">Manutencoes pendentes</p>
            <p className="mt-2 text-3xl font-black text-amber-800">{maintenancePending}</p>
          </article>
        </section>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {successMessage && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {successMessage}
          </div>
        )}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h3 className="text-sm font-bold uppercase tracking-wide text-slate-700">Empresas cadastradas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-[11px] uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3">Empresa</th>
                  <th className="px-4 py-3">CNPJ</th>
                  <th className="px-4 py-3">Segmento</th>
                  <th className="px-4 py-3">Responsavel</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Acao</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {loading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-5 text-center text-slate-500">
                      Carregando empresas...
                    </td>
                  </tr>
                )}
                {!loading && filteredCompanies.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-5 text-center text-slate-500">
                      Nenhuma empresa encontrada para o filtro informado.
                    </td>
                  </tr>
                )}
                {filteredCompanies.map((company) => (
                  <tr key={company.id}>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800">{company.name}</p>
                      <p className="text-xs text-slate-500">{company.location ?? '-'}</p>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">{company.cnpj}</td>
                    <td className="px-4 py-3">{company.segment}</td>
                    <td className="px-4 py-3">{company.responsible ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-semibold ${
                          company.status === 'Ativo'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {company.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                        <Eye size={14} />
                        Visualizar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
            <UserPlus2 size={16} className="text-blue-600" />
            Novo cadastro de empresa
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <input
              value={form.name}
              onChange={(event) => handleFormChange('name', event.target.value)}
              placeholder="Nome da empresa"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.cnpj}
              onChange={(event) => handleFormChange('cnpj', event.target.value)}
              placeholder="CNPJ"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.segment}
              onChange={(event) => handleFormChange('segment', event.target.value)}
              placeholder="Segmento"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.location}
              onChange={(event) => handleFormChange('location', event.target.value)}
              placeholder="Cidade / Estado"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.responsible}
              onChange={(event) => handleFormChange('responsible', event.target.value)}
              placeholder="Responsavel"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.email}
              onChange={(event) => handleFormChange('email', event.target.value)}
              placeholder="Email"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <input
              value={form.phone}
              onChange={(event) => handleFormChange('phone', event.target.value)}
              placeholder="Telefone"
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
            />
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {saving ? 'Salvando...' : 'Salvar empresa'}
            </button>
          </form>
        </section>
      </div>
    </DashboardLayout>
  );
}
