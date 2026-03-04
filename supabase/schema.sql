-- Supabase bootstrap schema for HoseTrack Pro demo
-- Run this file first in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  segment text not null,
  cnpj text not null unique,
  location text,
  responsible text,
  email text,
  phone text,
  status text not null default 'Ativo' check (status in ('Ativo', 'Inativo')),
  created_at timestamptz not null default now()
);

create table if not exists public.client_accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references public.companies(id) on delete cascade,
  username text not null unique,
  password_hash text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.equipments (
  id text primary key,
  company_id uuid references public.companies(id) on delete set null,
  category text not null check (category in ('Mangueira', 'Conector')),
  type text not null,
  manufacturer text,
  model text,
  material text,
  length_mm integer,
  work_pressure_bar integer,
  max_pressure_bar integer,
  location text,
  sector text,
  manufactured_at date,
  installed_at date,
  expires_at date,
  status text not null default 'Ativo',
  qr_code text,
  created_at timestamptz not null default now()
);

create table if not exists public.opportunities (
  id text primary key,
  company_id uuid references public.companies(id) on delete set null,
  equipment_id text references public.equipments(id) on delete set null,
  unit text,
  service text not null,
  urgency text not null default 'Media' check (urgency in ('Alta', 'Media', 'Baixa')),
  deadline date,
  status text not null default 'Pendente',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.inspections (
  id text primary key,
  equipment_id text not null references public.equipments(id) on delete cascade,
  inspected_at date not null,
  inspector text not null,
  result text not null,
  notes text,
  status text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.maintenances (
  id text primary key,
  equipment_id text not null references public.equipments(id) on delete cascade,
  maintenance_type text not null,
  scheduled_for date not null,
  status text not null,
  cost numeric(12,2),
  technician text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_equipments_company_id on public.equipments(company_id);
create index if not exists idx_client_accounts_company_id on public.client_accounts(company_id);
create index if not exists idx_client_accounts_username on public.client_accounts(username);
create index if not exists idx_opportunities_company_id on public.opportunities(company_id);
create index if not exists idx_opportunities_equipment_id on public.opportunities(equipment_id);
create index if not exists idx_inspections_equipment_id on public.inspections(equipment_id);
create index if not exists idx_maintenances_equipment_id on public.maintenances(equipment_id);

alter table public.companies enable row level security;
alter table public.client_accounts enable row level security;
alter table public.equipments enable row level security;
alter table public.opportunities enable row level security;
alter table public.inspections enable row level security;
alter table public.maintenances enable row level security;

-- Demo policies for anon key access. Restrict in production.
drop policy if exists companies_select_public on public.companies;
create policy companies_select_public on public.companies for select using (true);

drop policy if exists companies_insert_public on public.companies;
create policy companies_insert_public on public.companies for insert with check (true);

drop policy if exists companies_update_public on public.companies;
create policy companies_update_public on public.companies for update using (true) with check (true);

drop policy if exists client_accounts_select_public on public.client_accounts;
create policy client_accounts_select_public on public.client_accounts for select using (true);

drop policy if exists client_accounts_insert_public on public.client_accounts;
create policy client_accounts_insert_public on public.client_accounts for insert with check (true);

drop policy if exists client_accounts_update_public on public.client_accounts;
create policy client_accounts_update_public on public.client_accounts for update using (true) with check (true);

drop policy if exists equipments_select_public on public.equipments;
create policy equipments_select_public on public.equipments for select using (true);

drop policy if exists equipments_insert_public on public.equipments;
create policy equipments_insert_public on public.equipments for insert with check (true);

drop policy if exists equipments_update_public on public.equipments;
create policy equipments_update_public on public.equipments for update using (true) with check (true);

drop policy if exists opportunities_select_public on public.opportunities;
create policy opportunities_select_public on public.opportunities for select using (true);

drop policy if exists opportunities_insert_public on public.opportunities;
create policy opportunities_insert_public on public.opportunities for insert with check (true);

drop policy if exists opportunities_update_public on public.opportunities;
create policy opportunities_update_public on public.opportunities for update using (true) with check (true);

drop policy if exists inspections_select_public on public.inspections;
create policy inspections_select_public on public.inspections for select using (true);

drop policy if exists inspections_insert_public on public.inspections;
create policy inspections_insert_public on public.inspections for insert with check (true);

drop policy if exists inspections_update_public on public.inspections;
create policy inspections_update_public on public.inspections for update using (true) with check (true);

drop policy if exists maintenances_select_public on public.maintenances;
create policy maintenances_select_public on public.maintenances for select using (true);

drop policy if exists maintenances_insert_public on public.maintenances;
create policy maintenances_insert_public on public.maintenances for insert with check (true);

drop policy if exists maintenances_update_public on public.maintenances;
create policy maintenances_update_public on public.maintenances for update using (true) with check (true);
