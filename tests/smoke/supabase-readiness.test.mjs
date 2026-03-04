import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

test('env example includes Supabase public configuration variables', () => {
  const envExample = read('.env.example');
  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_URL=/m, 'Missing NEXT_PUBLIC_SUPABASE_URL');
  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_ANON_KEY=/m, 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
  assert.match(envExample, /^NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=/m, 'Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY');
});

test('supabase SQL bootstrap files exist with core entities', () => {
  assert.ok(exists('supabase/schema.sql'), 'Expected supabase/schema.sql');
  assert.ok(exists('supabase/seed.sql'), 'Expected supabase/seed.sql');

  const schema = read('supabase/schema.sql');
  for (const tableName of ['companies', 'equipments', 'opportunities', 'inspections', 'maintenances']) {
    assert.match(schema, new RegExp(`create table if not exists\\s+public\\.${tableName}`, 'i'), `Missing table ${tableName}`);
  }

  for (const policyName of [
    'companies_delete_public',
    'equipments_delete_public',
    'opportunities_delete_public',
    'inspections_delete_public',
    'maintenances_delete_public',
  ]) {
    assert.match(schema, new RegExp(`create policy\\s+${policyName}`, 'i'), `Missing delete policy ${policyName}`);
  }
});

test('centralized supabase data service exists', () => {
  assert.ok(exists('lib/supabase-rest.ts'), 'Expected lib/supabase-rest.ts');
  assert.ok(exists('lib/data-service.ts'), 'Expected lib/data-service.ts');
});

test('pages consume centralized data service instead of page-level fixtures', () => {
  const empresas = read('app/empresas/page.tsx');
  const oportunidades = read('app/oportunidades/page.tsx');
  const inspecoes = read('app/inspecoes/page.tsx');
  const manutencoes = read('app/manutencoes/page.tsx');

  assert.match(empresas, /getCompanies\(/, 'Empresas page should load from getCompanies');
  assert.match(oportunidades, /getOpportunityViews\(|getOpportunities\(/, 'Oportunidades page should load from opportunities service');
  assert.match(inspecoes, /getInspectionViews\(|getInspections\(/, 'Inspecoes page should load from inspections service');
  assert.match(manutencoes, /getMaintenanceViews\(|getMaintenances\(/, 'Manutencoes page should load from maintenances service');

  assert.doesNotMatch(empresas, /const\s+companies\s*=\s*\[/, 'Empresas page should not keep static fixture array');
  assert.doesNotMatch(oportunidades, /const\s+opportunities\s*=\s*\[/, 'Oportunidades page should not keep static fixture array');
});
