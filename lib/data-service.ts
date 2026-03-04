import {
  DEMO_COMPANIES,
  DEMO_EQUIPMENTS,
  DEMO_OPPORTUNITIES,
  DEMO_INSPECTIONS,
  DEMO_MAINTENANCES,
} from '@/lib/demo-data';
import { insertRow, isSupabaseConfigured, selectRows } from '@/lib/supabase-rest';
import type {
  Company,
  CompanyStatus,
  DashboardSnapshot,
  Equipment,
  Inspection,
  InspectionView,
  Maintenance,
  MaintenanceView,
  Opportunity,
  OpportunityView,
  ReportSnapshot,
} from '@/lib/types';

let hasLoggedSupabaseError = false;

function logSupabaseError(error: unknown): void {
  if (!hasLoggedSupabaseError) {
    console.warn('Supabase unavailable; using demo data.', error);
    hasLoggedSupabaseError = true;
  }
}

function toDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatDateBR(value: string | null): string {
  if (!value) {
    return '-';
  }
  const parsed = toDate(value);
  if (!parsed) {
    return value;
  }
  return parsed.toLocaleDateString('pt-BR');
}

function daysUntil(value: string | null): number | null {
  const parsed = toDate(value);
  if (!parsed) {
    return null;
  }
  const now = new Date();
  const diff = parsed.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

async function loadWithFallback<T>(loader: () => Promise<T[]>, fallback: T[]): Promise<T[]> {
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    const data = await loader();
    return data.length > 0 ? data : fallback;
  } catch (error) {
    logSupabaseError(error);
    return fallback;
  }
}

export async function getCompanies(): Promise<Company[]> {
  return loadWithFallback(
    () => selectRows<Company>('companies', { orderBy: { column: 'name' } }),
    DEMO_COMPANIES
  );
}

export async function createCompany(input: {
  name: string;
  segment: string;
  cnpj: string;
  location?: string;
  responsible?: string;
  email?: string;
  phone?: string;
  status?: CompanyStatus;
}): Promise<Company> {
  const payload: Company = {
    id: crypto.randomUUID(),
    name: input.name.trim(),
    segment: input.segment.trim(),
    cnpj: input.cnpj.trim(),
    location: input.location?.trim() || null,
    responsible: input.responsible?.trim() || null,
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    status: input.status ?? 'Ativo',
  };

  if (!isSupabaseConfigured()) {
    return payload;
  }

  try {
    const inserted = await insertRow<Company>('companies', payload);
    return inserted ?? payload;
  } catch (error) {
    logSupabaseError(error);
    return payload;
  }
}

export async function getEquipments(): Promise<Equipment[]> {
  return loadWithFallback(
    () => selectRows<Equipment>('equipments', { orderBy: { column: 'id' } }),
    DEMO_EQUIPMENTS
  );
}

export async function createEquipment(input: Partial<Equipment> & { id: string; type: string }): Promise<Equipment> {
  const payload: Equipment = {
    id: input.id.trim(),
    company_id: input.company_id ?? null,
    category: input.category ?? 'Mangueira',
    type: input.type.trim(),
    manufacturer: input.manufacturer ?? null,
    model: input.model ?? null,
    material: input.material ?? null,
    length_mm: input.length_mm ?? null,
    work_pressure_bar: input.work_pressure_bar ?? null,
    max_pressure_bar: input.max_pressure_bar ?? null,
    location: input.location ?? null,
    sector: input.sector ?? null,
    manufactured_at: input.manufactured_at ?? null,
    installed_at: input.installed_at ?? null,
    expires_at: input.expires_at ?? null,
    status: input.status ?? 'Ativo',
    qr_code: input.qr_code ?? `QR-${input.id.trim()}`,
  };

  if (!isSupabaseConfigured()) {
    return payload;
  }

  try {
    const inserted = await insertRow<Equipment>('equipments', payload);
    return inserted ?? payload;
  } catch (error) {
    logSupabaseError(error);
    return payload;
  }
}

export async function getEquipmentById(id: string): Promise<Equipment | null> {
  const equipments = await getEquipments();
  return equipments.find((item) => item.id === id) ?? null;
}

export async function getOpportunities(): Promise<Opportunity[]> {
  return loadWithFallback(
    () => selectRows<Opportunity>('opportunities', { orderBy: { column: 'deadline' } }),
    DEMO_OPPORTUNITIES
  );
}

export async function getOpportunityViews(): Promise<OpportunityView[]> {
  const [opportunities, companies, equipments] = await Promise.all([
    getOpportunities(),
    getCompanies(),
    getEquipments(),
  ]);

  const companyMap = new Map(companies.map((item) => [item.id, item]));
  const equipmentMap = new Map(equipments.map((item) => [item.id, item]));

  return opportunities.map((item) => {
    const company = item.company_id ? companyMap.get(item.company_id) : null;
    const equipment = item.equipment_id ? equipmentMap.get(item.equipment_id) : null;
    return {
      ...item,
      company_name: company?.name ?? 'Empresa nao identificada',
      equipment_type: equipment?.type ?? 'Tipo nao informado',
    };
  });
}

export async function getInspections(): Promise<Inspection[]> {
  return loadWithFallback(
    () => selectRows<Inspection>('inspections', { orderBy: { column: 'inspected_at', ascending: false } }),
    DEMO_INSPECTIONS
  );
}

export async function getInspectionViews(): Promise<InspectionView[]> {
  const [inspections, equipments] = await Promise.all([getInspections(), getEquipments()]);
  const equipmentMap = new Map(equipments.map((item) => [item.id, item]));

  return inspections.map((item) => ({
    ...item,
    equipment_type: equipmentMap.get(item.equipment_id)?.type ?? 'Equipamento nao encontrado',
  }));
}

export async function getMaintenances(): Promise<Maintenance[]> {
  return loadWithFallback(
    () => selectRows<Maintenance>('maintenances', { orderBy: { column: 'scheduled_for', ascending: false } }),
    DEMO_MAINTENANCES
  );
}

export async function getMaintenanceViews(): Promise<MaintenanceView[]> {
  const [maintenances, equipments] = await Promise.all([getMaintenances(), getEquipments()]);
  const equipmentMap = new Map(equipments.map((item) => [item.id, item]));

  return maintenances.map((item) => ({
    ...item,
    equipment_type: equipmentMap.get(item.equipment_id)?.type ?? 'Equipamento nao encontrado',
  }));
}

export async function getDashboardSnapshot(): Promise<DashboardSnapshot> {
  const [companies, equipments, opportunities, inspections, maintenances] = await Promise.all([
    getCompanies(),
    getEquipments(),
    getOpportunities(),
    getInspections(),
    getMaintenances(),
  ]);

  const expiredEquipments = equipments.filter((item) => {
    const dueIn = daysUntil(item.expires_at);
    return dueIn !== null && dueIn < 0;
  });

  const expiringSoon = equipments.filter((item) => {
    const dueIn = daysUntil(item.expires_at);
    return dueIn !== null && dueIn >= 0 && dueIn <= 30;
  });

  const activeEquipments = equipments.filter((item) => item.status.toLowerCase().includes('ativo'));
  const pendingInspections = inspections.filter((item) => item.status.toLowerCase().includes('pendente'));
  const maintenanceInProgress = maintenances.filter((item) =>
    ['agendada', 'em andamento', 'pendente'].some((status) =>
      item.status.toLowerCase().includes(status)
    )
  );
  const highUrgencyOpportunities = opportunities.filter((item) => item.urgency === 'Alta');

  const companyTotals = new Map<string, number>();
  for (const equipment of equipments) {
    if (!equipment.company_id) {
      continue;
    }
    companyTotals.set(equipment.company_id, (companyTotals.get(equipment.company_id) ?? 0) + 1);
  }

  const companiesByEquipment = companies
    .map((company) => ({
      companyName: company.name,
      total: companyTotals.get(company.id) ?? 0,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const statusCounts = new Map<string, number>();
  for (const equipment of equipments) {
    statusCounts.set(equipment.status, (statusCounts.get(equipment.status) ?? 0) + 1);
  }

  const equipmentStatusBreakdown = [...statusCounts.entries()].map(([status, total]) => ({
    status,
    total,
  }));

  const companyById = new Map(companies.map((company) => [company.id, company.name]));

  const alerts = opportunities
    .filter((item) => item.urgency === 'Alta' || item.status.toLowerCase().includes('pendente'))
    .slice(0, 6)
    .map((item) => ({
      id: item.id,
      equipmentId: item.equipment_id ?? '-',
      companyName: item.company_id ? companyById.get(item.company_id) ?? '-' : '-',
      type: item.service,
      dateLabel: formatDateBR(item.deadline),
      status: item.status,
    }));

  return {
    totalEquipments: equipments.length,
    activeEquipments: activeEquipments.length,
    expiredEquipments: expiredEquipments.length,
    expiringSoon: expiringSoon.length,
    pendingInspections: pendingInspections.length,
    maintenanceInProgress: maintenanceInProgress.length,
    openOpportunities: opportunities.length,
    highUrgencyOpportunities: highUrgencyOpportunities.length,
    alerts,
    companiesByEquipment,
    equipmentStatusBreakdown,
  };
}

export async function getReportSnapshot(): Promise<ReportSnapshot> {
  const [companies, equipments, opportunities] = await Promise.all([
    getCompanies(),
    getEquipments(),
    getOpportunities(),
  ]);

  const overdueCount = equipments.filter((equipment) => {
    const dueIn = daysUntil(equipment.expires_at);
    return dueIn !== null && dueIn < 0;
  }).length;

  const expiringIn30Days = equipments.filter((equipment) => {
    const dueIn = daysUntil(equipment.expires_at);
    return dueIn !== null && dueIn >= 0 && dueIn <= 30;
  }).length;

  return {
    totalCompanies: companies.length,
    totalEquipments: equipments.length,
    totalOpportunities: opportunities.length,
    overdueCount,
    expiringIn30Days,
    generatedAt: new Date().toLocaleString('pt-BR'),
  };
}
