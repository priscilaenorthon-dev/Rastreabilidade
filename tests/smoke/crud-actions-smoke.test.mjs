import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('data service exposes inspection, maintenance and equipment CRUD operations', () => {
  const dataService = read('lib/data-service.ts');

  for (const fnName of [
    'createEquipment',
    'updateEquipment',
    'deleteEquipment',
    'createInspection',
    'updateInspectionStatus',
    'deleteInspection',
    'createMaintenance',
    'updateMaintenanceStatus',
    'deleteMaintenance',
  ]) {
    assert.match(
      dataService,
      new RegExp(`export\\s+async\\s+function\\s+${fnName}\\s*\\(`),
      `Missing CRUD function: ${fnName}`
    );
  }
});

test('equipment page wires create, edit and delete actions to CRUD service', () => {
  const page = read('app/equipamentos/page.tsx');

  assert.match(page, /createEquipment\(/, 'Equipamentos page should call createEquipment');
  assert.match(page, /updateEquipment\(/, 'Equipamentos page should call updateEquipment');
  assert.match(page, /deleteEquipment\(/, 'Equipamentos page should call deleteEquipment');
  assert.match(page, /Editar|Salvar alterações/, 'Equipamentos page should expose edit flow in UI');
  assert.match(page, /Excluir/, 'Equipamentos page should expose delete action in UI');
});

test('supabase rest helper supports update and delete mutations', () => {
  const rest = read('lib/supabase-rest.ts');
  assert.match(rest, /export\s+async\s+function\s+updateRow(?:<[^>]+>)?\s*\(/, 'Missing updateRow helper');
  assert.match(rest, /export\s+async\s+function\s+deleteRow\s*\(/, 'Missing deleteRow helper');
});

test('inspections page wires create and action buttons to CRUD service', () => {
  const page = read('app/inspecoes/page.tsx');

  assert.match(page, /createInspection\(/, 'Inspections page should call createInspection');
  assert.match(page, /updateInspectionStatus\(/, 'Inspections page should call updateInspectionStatus');
  assert.match(page, /deleteInspection\(/, 'Inspections page should call deleteInspection');
  assert.match(page, /type="submit"/, 'Inspections page should have submit button for create form');
});

test('maintenance page wires create and action buttons to CRUD service', () => {
  const page = read('app/manutencoes/page.tsx');

  assert.match(page, /createMaintenance\(/, 'Maintenance page should call createMaintenance');
  assert.match(page, /updateMaintenanceStatus\(/, 'Maintenance page should call updateMaintenanceStatus');
  assert.match(page, /deleteMaintenance\(/, 'Maintenance page should call deleteMaintenance');
  assert.match(page, /type="submit"/, 'Maintenance page should have submit button for create form');
});

test('company save flow surfaces success/failure state in UI', () => {
  const page = read('app/empresas/page.tsx');
  assert.match(page, /successMessage|setSuccess/, 'Companies page should show success feedback after save');
  assert.match(page, /Falha ao salvar empresa|Erro ao salvar empresa/, 'Companies page should show explicit save failure');
});
