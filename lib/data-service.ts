import {
  DEMO_COMPANIES,
  DEMO_EQUIPMENTS,
  DEMO_OPPORTUNITIES,
  DEMO_INSPECTIONS,
  DEMO_MAINTENANCES,
} from '@/lib/demo-data';
import { deleteRow, insertRow, isSupabaseConfigured, selectRows, updateRow } from '@/lib/supabase-rest';
import { hashPassword } from '@/lib/password-utils';
import type {
  ClientReadonlySnapshot,
  ClientAccount,
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

function normalizeCnpj(value: string): string {
  return value.replace(/[^\d]/g, '');
}

async function loadWithFallback<T>(loader: () => Promise<T[]>, fallback: T[]): Promise<T[]> {
  if (!isSupabaseConfigured()) {
    return fallback;
  }

  try {
    return await loader();
  } catch (error) {
    logSupabaseError(error);
    return fallback;
  }
}

async function ensureDeleteSucceeded(table: string, id: string, label: string): Promise<void> {
  const deleted = await deleteRow(table, { id });
  if (deleted) {
    return;
  }

  const stillExists = await selectRows<{ id: string }>(table, {
    select: 'id',
    filters: { id },
    limit: 1,
  });

  if (stillExists.length > 0) {
    throw new Error(
      `${label} existe, mas a exclusao foi bloqueada no Supabase. Ative policy DELETE para ${table}.`
    );
  }

  throw new Error(`${label} nao encontrado para exclusao.`);
}

async function assertEquipmentExists(equipmentId: string): Promise<void> {
  const equipmentRows = await selectRows<Equipment>('equipments', {
    select: 'id',
    filters: { id: equipmentId },
    limit: 1,
  });

  if (equipmentRows.length === 0) {
    throw new Error('Equipamento nao encontrado. Cadastre ou selecione um equipamento valido.');
  }
}

function assertWriteReady(): void {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase nao configurado. Defina NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY (ou NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) no ambiente.');
  }
}

function toReadableError(error: unknown, defaultMessage: string): Error {
  if (error instanceof Error) {
    return new Error(error.message || defaultMessage);
  }
  return new Error(defaultMessage);
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
  portal_username?: string;
  portal_password?: string;
  location?: string;
  responsible?: string;
  email?: string;
  phone?: string;
  status?: CompanyStatus;
}): Promise<Company> {
  const portalUsername = input.portal_username?.trim() ?? '';
  const portalPassword = input.portal_password?.trim() ?? '';

  if ((portalUsername && !portalPassword) || (!portalUsername && portalPassword)) {
    throw new Error('Informe usuario e senha do portal do cliente.');
  }

  if (portalUsername && portalPassword.length < 6) {
    throw new Error('A senha do portal deve ter ao menos 6 caracteres.');
  }

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

  assertWriteReady();

  try {
    if (portalUsername) {
      const existing = await selectRows<ClientAccount>('client_accounts', {
        filters: { username: portalUsername },
        limit: 1,
      });
      if (existing.length > 0) {
        throw new Error('Usuario do portal ja existe. Escolha outro usuario.');
      }
    }

    const inserted = await insertRow<Company>('companies', payload);
    if (!inserted) {
      throw new Error('Supabase retornou resposta vazia ao criar empresa.');
    }

    if (portalUsername && portalPassword) {
      const accountPayload: ClientAccount = {
        id: crypto.randomUUID(),
        company_id: inserted.id,
        username: portalUsername,
        password_hash: await hashPassword(portalPassword),
        is_active: true,
      };

      const accountInserted = await insertRow<ClientAccount>('client_accounts', accountPayload);
      if (!accountInserted) {
        throw new Error('Empresa criada, mas nao foi possivel criar o login do cliente.');
      }
    }

    return inserted;
  } catch (error) {
    throw toReadableError(error, 'Falha ao salvar empresa no Supabase.');
  }
}

export async function getClientAccounts(): Promise<ClientAccount[]> {
  return loadWithFallback(
    () => selectRows<ClientAccount>('client_accounts', { orderBy: { column: 'username' } }),
    []
  );
}

export async function updateCompany(input: {
  id: string;
  name: string;
  segment: string;
  cnpj: string;
  portal_username: string;
  portal_password?: string;
  location?: string;
  responsible?: string;
  email?: string;
  phone?: string;
  status?: CompanyStatus;
}): Promise<Company> {
  const portalUsername = input.portal_username.trim();
  const portalPassword = input.portal_password?.trim() ?? '';

  if (!portalUsername) {
    throw new Error('Informe usuario do portal do cliente.');
  }

  if (portalPassword && portalPassword.length < 6) {
    throw new Error('A senha do portal deve ter ao menos 6 caracteres.');
  }

  const payload: Partial<Company> = {
    name: input.name.trim(),
    segment: input.segment.trim(),
    cnpj: input.cnpj.trim(),
    location: input.location?.trim() || null,
    responsible: input.responsible?.trim() || null,
    email: input.email?.trim() || null,
    phone: input.phone?.trim() || null,
    status: input.status ?? 'Ativo',
  };

  assertWriteReady();

  try {
    const [existingAccountRows, accountByUsernameRows] = await Promise.all([
      selectRows<ClientAccount>('client_accounts', {
        filters: { company_id: input.id },
        limit: 1,
      }),
      selectRows<ClientAccount>('client_accounts', {
        filters: { username: portalUsername },
        limit: 1,
      }),
    ]);

    const existingAccount = existingAccountRows[0] ?? null;
    const usernameConflict = accountByUsernameRows[0] ?? null;

    if (usernameConflict && usernameConflict.company_id !== input.id) {
      throw new Error('Usuario do portal ja existe. Escolha outro usuario.');
    }

    const updatedCompany = await updateRow<Company>('companies', { id: input.id }, payload);
    if (!updatedCompany) {
      throw new Error('Empresa nao encontrada para atualizacao.');
    }

    if (existingAccount) {
      const accountPayload: {
        username: string;
        is_active: boolean;
        password_hash?: string;
      } = {
        username: portalUsername,
        is_active: true,
      };

      if (portalPassword) {
        accountPayload.password_hash = await hashPassword(portalPassword);
      }

      const accountUpdated = await updateRow<ClientAccount>('client_accounts', { id: existingAccount.id }, accountPayload);
      if (!accountUpdated) {
        throw new Error('Empresa atualizada, mas nao foi possivel atualizar o login do cliente.');
      }
    } else {
      if (!portalPassword) {
        throw new Error('Informe a senha para criar o login do portal desta empresa.');
      }

      const accountPayload: ClientAccount = {
        id: crypto.randomUUID(),
        company_id: input.id,
        username: portalUsername,
        password_hash: await hashPassword(portalPassword),
        is_active: true,
      };

      const accountInserted = await insertRow<ClientAccount>('client_accounts', accountPayload);
      if (!accountInserted) {
        throw new Error('Empresa atualizada, mas nao foi possivel criar o login do cliente.');
      }
    }

    return updatedCompany;
  } catch (error) {
    throw toReadableError(error, 'Falha ao atualizar empresa no Supabase.');
  }
}

export async function deleteCompany(id: string): Promise<void> {
  assertWriteReady();

  try {
    await ensureDeleteSucceeded('companies', id, 'Empresa');
  } catch (error) {
    throw toReadableError(error, 'Falha ao excluir empresa no Supabase.');
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

  assertWriteReady();

  try {
    const inserted = await insertRow<Equipment>('equipments', payload);
    if (!inserted) {
      throw new Error('Supabase retornou resposta vazia ao criar equipamento.');
    }
    return inserted;
  } catch (error) {
    throw toReadableError(error, 'Falha ao salvar equipamento no Supabase.');
  }
}

export async function updateEquipment(input: {
  id: string;
  type: string;
  category: Equipment['category'];
  company_id?: string | null;
  status?: string;
  expires_at?: string | null;
}): Promise<Equipment> {
  assertWriteReady();

  const payload: Partial<Equipment> = {
    type: input.type.trim(),
    category: input.category,
    company_id: input.company_id ?? null,
    status: input.status?.trim() || 'Ativo',
    expires_at: input.expires_at ?? null,
  };

  try {
    const updated = await updateRow<Equipment>('equipments', { id: input.id.trim() }, payload);
    if (!updated) {
      throw new Error('Equipamento nao encontrado para atualizacao.');
    }
    return updated;
  } catch (error) {
    throw toReadableError(error, 'Falha ao atualizar equipamento no Supabase.');
  }
}

export async function deleteEquipment(id: string): Promise<void> {
  assertWriteReady();

  try {
    await ensureDeleteSucceeded('equipments', id, 'Equipamento');
  } catch (error) {
    throw toReadableError(error, 'Falha ao excluir equipamento no Supabase.');
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

export async function createInspection(input: {
  equipment_id: string;
  inspector: string;
  result: string;
  status: string;
  inspected_at?: string;
  notes?: string | null;
}): Promise<Inspection> {
  assertWriteReady();

  const payload: Inspection = {
    id: `INSP-${Math.floor(Math.random() * 90000 + 10000)}`,
    equipment_id: input.equipment_id.trim(),
    inspector: input.inspector.trim(),
    result: input.result.trim(),
    status: input.status.trim(),
    inspected_at: input.inspected_at || new Date().toISOString().slice(0, 10),
    notes: input.notes?.trim() || null,
  };

  try {
    await assertEquipmentExists(payload.equipment_id);

    const inserted = await insertRow<Inspection>('inspections', payload);
    if (!inserted) {
      throw new Error('Supabase retornou resposta vazia ao criar inspecao.');
    }
    return inserted;
  } catch (error) {
    throw toReadableError(error, 'Falha ao salvar inspecao no Supabase.');
  }
}

export async function updateInspectionStatus(
  id: string,
  patch: { status?: string; result?: string; notes?: string | null }
): Promise<Inspection> {
  assertWriteReady();

  const payload = {
    ...(patch.status ? { status: patch.status.trim() } : {}),
    ...(patch.result ? { result: patch.result.trim() } : {}),
    ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
  };

  try {
    const updated = await updateRow<Inspection>('inspections', { id }, payload);
    if (!updated) {
      throw new Error('Inspecao nao encontrada para atualizacao.');
    }
    return updated;
  } catch (error) {
    throw toReadableError(error, 'Falha ao atualizar inspecao no Supabase.');
  }
}

export async function deleteInspection(id: string): Promise<void> {
  assertWriteReady();

  try {
    await ensureDeleteSucceeded('inspections', id, 'Inspecao');
  } catch (error) {
    throw toReadableError(error, 'Falha ao excluir inspecao no Supabase.');
  }
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

export async function createMaintenance(input: {
  equipment_id: string;
  maintenance_type: string;
  scheduled_for: string;
  status: string;
  technician?: string;
  cost?: number | null;
  notes?: string | null;
}): Promise<Maintenance> {
  assertWriteReady();

  const payload: Maintenance = {
    id: `MAN-${Math.floor(Math.random() * 90000 + 10000)}`,
    equipment_id: input.equipment_id.trim(),
    maintenance_type: input.maintenance_type.trim(),
    scheduled_for: input.scheduled_for,
    status: input.status.trim(),
    technician: input.technician?.trim() || null,
    cost: input.cost ?? null,
    notes: input.notes?.trim() || null,
  };

  try {
    await assertEquipmentExists(payload.equipment_id);

    const inserted = await insertRow<Maintenance>('maintenances', payload);
    if (!inserted) {
      throw new Error('Supabase retornou resposta vazia ao criar manutencao.');
    }
    return inserted;
  } catch (error) {
    throw toReadableError(error, 'Falha ao salvar manutencao no Supabase.');
  }
}

export async function updateMaintenanceStatus(
  id: string,
  patch: { status?: string; scheduled_for?: string; technician?: string; notes?: string | null; cost?: number | null }
): Promise<Maintenance> {
  assertWriteReady();

  const payload = {
    ...(patch.status ? { status: patch.status.trim() } : {}),
    ...(patch.scheduled_for ? { scheduled_for: patch.scheduled_for } : {}),
    ...(patch.technician !== undefined ? { technician: patch.technician ? patch.technician.trim() : null } : {}),
    ...(patch.notes !== undefined ? { notes: patch.notes } : {}),
    ...(patch.cost !== undefined ? { cost: patch.cost } : {}),
  };

  try {
    const updated = await updateRow<Maintenance>('maintenances', { id }, payload);
    if (!updated) {
      throw new Error('Manutencao nao encontrada para atualizacao.');
    }
    return updated;
  } catch (error) {
    throw toReadableError(error, 'Falha ao atualizar manutencao no Supabase.');
  }
}

export async function deleteMaintenance(id: string): Promise<void> {
  assertWriteReady();

  try {
    await ensureDeleteSucceeded('maintenances', id, 'Manutencao');
  } catch (error) {
    throw toReadableError(error, 'Falha ao excluir manutencao no Supabase.');
  }
}

export async function getMaintenanceViews(): Promise<MaintenanceView[]> {
  const [maintenances, equipments] = await Promise.all([getMaintenances(), getEquipments()]);
  const equipmentMap = new Map(equipments.map((item) => [item.id, item]));

  return maintenances.map((item) => ({
    ...item,
    equipment_type: equipmentMap.get(item.equipment_id)?.type ?? 'Equipamento nao encontrado',
  }));
}

export async function getClientReadonlySnapshot(companyCnpj: string): Promise<ClientReadonlySnapshot> {
  const [companies, equipments, opportunities, inspectionViews, maintenanceViews] = await Promise.all([
    getCompanies(),
    getEquipments(),
    getOpportunityViews(),
    getInspectionViews(),
    getMaintenanceViews(),
  ]);

  const normalizedTarget = normalizeCnpj(companyCnpj);
  const company = companies.find((item) => normalizeCnpj(item.cnpj) === normalizedTarget) ?? null;

  if (!company) {
    return {
      company: null,
      equipments: [],
      opportunities: [],
      inspections: [],
      maintenances: [],
      indicators: {
        totalEquipments: 0,
        expiringSoon: 0,
        overdue: 0,
        pendingInspections: 0,
        pendingMaintenances: 0,
        openOpportunities: 0,
      },
    };
  }

  const scopedEquipments = equipments.filter((item) => item.company_id === company.id);
  const equipmentIds = new Set(scopedEquipments.map((item) => item.id));

  const scopedOpportunities = opportunities.filter(
    (item) => item.company_id === company.id || (item.equipment_id ? equipmentIds.has(item.equipment_id) : false)
  );
  const scopedInspections = inspectionViews.filter((item) => equipmentIds.has(item.equipment_id));
  const scopedMaintenances = maintenanceViews.filter((item) => equipmentIds.has(item.equipment_id));

  const expiringSoon = scopedEquipments.filter((item) => {
    const days = daysUntil(item.expires_at);
    return days !== null && days >= 0 && days <= 30;
  }).length;

  const overdue = scopedEquipments.filter((item) => {
    const days = daysUntil(item.expires_at);
    return days !== null && days < 0;
  }).length;

  const pendingInspections = scopedInspections.filter((item) => item.status.toLowerCase().includes('pendente')).length;
  const pendingMaintenances = scopedMaintenances.filter((item) =>
    ['agendada', 'em andamento', 'pendente'].some((status) => item.status.toLowerCase().includes(status))
  ).length;
  const openOpportunities = scopedOpportunities.filter((item) =>
    ['aberta', 'pendente', 'agendada'].some((status) => item.status.toLowerCase().includes(status))
  ).length;

  return {
    company,
    equipments: scopedEquipments,
    opportunities: scopedOpportunities,
    inspections: scopedInspections,
    maintenances: scopedMaintenances,
    indicators: {
      totalEquipments: scopedEquipments.length,
      expiringSoon,
      overdue,
      pendingInspections,
      pendingMaintenances,
      openOpportunities,
    },
  };
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
