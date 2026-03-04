'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DashboardLayout } from '@/components/DashboardLayout';
import { getCompanies, getEquipmentById, getInspections, getMaintenances } from '@/lib/data-service';
import type { Company, Equipment, Inspection, Maintenance } from '@/lib/types';
import { CalendarClock, ChevronRight, FileClock, QrCode, ShieldCheck, Wrench } from 'lucide-react';

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

export default function EquipamentoDetalhesPage() {
  const params = useParams<{ id: string }>();
  const equipmentId = params.id;

  const [equipment, setEquipment] = React.useState<Equipment | null>(null);
  const [company, setCompany] = React.useState<Company | null>(null);
  const [inspections, setInspections] = React.useState<Inspection[]>([]);
  const [maintenances, setMaintenances] = React.useState<Maintenance[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [equipmentRow, companyRows, inspectionRows, maintenanceRows] = await Promise.all([
          getEquipmentById(equipmentId),
          getCompanies(),
          getInspections(),
          getMaintenances(),
        ]);

        if (!active) {
          return;
        }

        setEquipment(equipmentRow);
        if (equipmentRow?.company_id) {
          setCompany(companyRows.find((item) => item.id === equipmentRow.company_id) ?? null);
        } else {
          setCompany(null);
        }
        setInspections(inspectionRows.filter((item) => item.equipment_id === equipmentId));
        setMaintenances(maintenanceRows.filter((item) => item.equipment_id === equipmentId));
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err.message : 'Falha ao carregar detalhes do equipamento.');
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
  }, [equipmentId]);

  return (
    <DashboardLayout title={`Equipamento: ${equipmentId}`}>
      <div className="space-y-6">
        <nav className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <Link href="/" className="hover:text-blue-600">
            Home
          </Link>
          <ChevronRight size={12} />
          <Link href="/equipamentos" className="hover:text-blue-600">
            Equipamentos
          </Link>
          <ChevronRight size={12} />
          <span className="text-slate-800">{equipmentId}</span>
        </nav>

        {loading && <p className="text-sm text-slate-500">Carregando detalhes do equipamento...</p>}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {!loading && !error && !equipment && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Equipamento nao encontrado.
          </div>
        )}

        {equipment && (
          <>
            <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-black text-slate-900">{equipment.id}</h1>
                    <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{equipment.status}</span>
                  </div>
                  <p className="text-sm text-slate-600">
                    {equipment.category} | {equipment.type}
                  </p>
                  <p className="text-sm text-slate-600">
                    Empresa: <strong>{company?.name ?? 'Nao vinculada'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <QrCode size={52} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">QR Code</p>
                    <p className="text-sm font-semibold text-slate-800">{equipment.qr_code ?? `QR-${equipment.id}`}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Fabricante</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{equipment.manufacturer ?? '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Modelo</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{equipment.model ?? '-'}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Validade</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(equipment.expires_at)}</p>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Local</p>
                  <p className="mt-1 text-sm font-semibold text-slate-800">{equipment.location ?? '-'}</p>
                </div>
              </div>
            </section>

            <section className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                  <ShieldCheck size={16} className="text-blue-600" />
                  Historico de inspecoes
                </h3>
                <div className="space-y-3">
                  {inspections.length === 0 && (
                    <p className="text-sm text-slate-500">Sem inspecoes registradas para este equipamento.</p>
                  )}
                  {inspections.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-800">{item.id}</p>
                      <p className="text-xs text-slate-600">{formatDate(item.inspected_at)} | {item.inspector}</p>
                      <p className="mt-1 text-sm text-slate-700">Resultado: {item.result}</p>
                      <p className="text-xs text-slate-500">{item.status}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-slate-700">
                  <Wrench size={16} className="text-blue-600" />
                  Historico de manutencoes
                </h3>
                <div className="space-y-3">
                  {maintenances.length === 0 && (
                    <p className="text-sm text-slate-500">Sem manutencoes registradas para este equipamento.</p>
                  )}
                  {maintenances.map((item) => (
                    <div key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                      <p className="text-sm font-semibold text-slate-800">{item.id}</p>
                      <p className="text-xs text-slate-600">{item.maintenance_type} | {formatDate(item.scheduled_for)}</p>
                      <p className="mt-1 text-sm text-slate-700">Status: {item.status}</p>
                      <p className="text-xs text-slate-500">Custo: {item.cost ? `R$ ${item.cost.toFixed(2)}` : '-'}</p>
                    </div>
                  ))}
                </div>
              </article>
            </section>

            <section className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
              <p className="flex items-center gap-2 font-semibold">
                <CalendarClock size={15} />
                Acao recomendada
              </p>
              <p className="mt-1">
                Priorize equipamentos com status vencido e sem manutencao concluida para elevar confiabilidade operacional.
              </p>
              <p className="mt-2 inline-flex items-center gap-1 text-blue-700">
                <FileClock size={14} />
                Dados sincronizados com Supabase ou fallback de demonstracao.
              </p>
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
