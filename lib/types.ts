export type CompanyStatus = 'Ativo' | 'Inativo';

export interface Company {
  id: string;
  name: string;
  segment: string;
  cnpj: string;
  location: string | null;
  responsible: string | null;
  email: string | null;
  phone: string | null;
  status: CompanyStatus;
  created_at?: string;
}

export interface ClientAccount {
  id: string;
  company_id: string;
  username: string;
  password_hash: string;
  is_active: boolean;
  created_at?: string;
}

export interface Equipment {
  id: string;
  company_id: string | null;
  category: 'Mangueira' | 'Conector';
  type: string;
  manufacturer: string | null;
  model: string | null;
  material: string | null;
  length_mm: number | null;
  work_pressure_bar: number | null;
  max_pressure_bar: number | null;
  location: string | null;
  sector: string | null;
  manufactured_at: string | null;
  installed_at: string | null;
  expires_at: string | null;
  status: string;
  qr_code: string | null;
  created_at?: string;
}

export interface Opportunity {
  id: string;
  company_id: string | null;
  equipment_id: string | null;
  unit: string | null;
  service: string;
  urgency: 'Alta' | 'Media' | 'Baixa';
  deadline: string | null;
  status: string;
  notes: string | null;
  created_at?: string;
}

export interface Inspection {
  id: string;
  equipment_id: string;
  inspected_at: string;
  inspector: string;
  result: string;
  notes: string | null;
  status: string;
  created_at?: string;
}

export interface Maintenance {
  id: string;
  equipment_id: string;
  maintenance_type: string;
  scheduled_for: string;
  status: string;
  cost: number | null;
  technician: string | null;
  notes: string | null;
  created_at?: string;
}

export interface OpportunityView extends Opportunity {
  company_name: string;
  equipment_type: string;
}

export interface InspectionView extends Inspection {
  equipment_type: string;
}

export interface MaintenanceView extends Maintenance {
  equipment_type: string;
}

export interface DashboardSnapshot {
  totalEquipments: number;
  activeEquipments: number;
  expiredEquipments: number;
  expiringSoon: number;
  pendingInspections: number;
  maintenanceInProgress: number;
  openOpportunities: number;
  highUrgencyOpportunities: number;
  alerts: Array<{
    id: string;
    equipmentId: string;
    companyName: string;
    type: string;
    dateLabel: string;
    status: string;
  }>;
  companiesByEquipment: Array<{
    companyName: string;
    total: number;
  }>;
  equipmentStatusBreakdown: Array<{
    status: string;
    total: number;
  }>;
}

export interface ReportSnapshot {
  totalCompanies: number;
  totalEquipments: number;
  totalOpportunities: number;
  overdueCount: number;
  expiringIn30Days: number;
  generatedAt: string;
}

export interface ClientReadonlySnapshot {
  company: Company | null;
  equipments: Equipment[];
  opportunities: OpportunityView[];
  inspections: InspectionView[];
  maintenances: MaintenanceView[];
  indicators: {
    totalEquipments: number;
    expiringSoon: number;
    overdue: number;
    pendingInspections: number;
    pendingMaintenances: number;
    openOpportunities: number;
  };
}
