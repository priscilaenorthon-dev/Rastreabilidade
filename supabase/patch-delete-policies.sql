-- Apply this patch in Supabase SQL Editor for existing environments
-- that were created before DELETE RLS policies were added.

drop policy if exists companies_delete_public on public.companies;
create policy companies_delete_public on public.companies for delete using (true);

drop policy if exists client_accounts_delete_public on public.client_accounts;
create policy client_accounts_delete_public on public.client_accounts for delete using (true);

drop policy if exists equipments_delete_public on public.equipments;
create policy equipments_delete_public on public.equipments for delete using (true);

drop policy if exists opportunities_delete_public on public.opportunities;
create policy opportunities_delete_public on public.opportunities for delete using (true);

drop policy if exists inspections_delete_public on public.inspections;
create policy inspections_delete_public on public.inspections for delete using (true);

drop policy if exists maintenances_delete_public on public.maintenances;
create policy maintenances_delete_public on public.maintenances for delete using (true);
