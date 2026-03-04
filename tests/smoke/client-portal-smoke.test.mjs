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

test('client portal auth routes and pages exist', () => {
  assert.equal(exists('app/cliente/login/page.tsx'), true, 'Missing client login page');
  assert.equal(exists('app/cliente/page.tsx'), true, 'Missing client dashboard page');
  assert.equal(exists('app/api/client-auth/login/route.ts'), true, 'Missing client login API route');
  assert.equal(exists('app/api/client-auth/logout/route.ts'), true, 'Missing client logout API route');
  assert.equal(exists('middleware.ts'), true, 'Missing middleware to enforce client-only scope');
});

test('client auth config contains jomaga credentials and scope', () => {
  const auth = read('lib/client-portal-auth.ts');
  assert.match(auth, /jomaga/, 'Expected jomaga username in auth config');
  assert.match(auth, /jomaga1234/, 'Expected jomaga password in auth config');
  assert.match(auth, /CLIENT_PORTAL_CNPJ/, 'Expected configurable company scope by CNPJ');
});

test('client login page posts to login API and redirects to portal', () => {
  const loginPage = read('components/ClientLoginForm.tsx');
  assert.match(loginPage, /\/api\/client-auth\/login/, 'Client login must call login API route');
  assert.match(loginPage, /router\.push\('\/cliente'\)/, 'Client login should redirect to /cliente');
});

test('client portal page is read-only (no create/update/delete actions)', () => {
  const portalPage = read('app/cliente/page.tsx');
  assert.doesNotMatch(portalPage, /createCompany|createEquipment|createInspection|createMaintenance/, 'Client portal must not create records');
  assert.doesNotMatch(portalPage, /updateInspectionStatus|updateMaintenanceStatus|deleteInspection|deleteMaintenance/, 'Client portal must not edit records');
  assert.match(portalPage, /Somente leitura|somente leitura|read-only/i, 'Client portal should clearly indicate read-only access');
});

test('middleware keeps client user restricted to /cliente routes', () => {
  const middleware = read('middleware.ts');
  assert.match(middleware, /CLIENT_PORTAL_COOKIE/, 'Middleware should use client session cookie');
  assert.match(middleware, /pathname\.startsWith\('\/cliente'\)/, 'Middleware should detect client routes');
  assert.match(middleware, /url\.pathname = '\/cliente'/, 'Middleware should redirect authenticated client to /cliente');
});

test('client layout does not self-redirect to /cliente/login', () => {
  const layout = read('app/cliente/layout.tsx');
  assert.doesNotMatch(
    layout,
    /redirect\('\/cliente\/login'\)/,
    'Client layout should not redirect to /cliente/login to avoid redirect loops'
  );
});

test('data service exposes scoped read-only snapshot for client portal', () => {
  const dataService = read('lib/data-service.ts');
  assert.match(dataService, /export\s+async\s+function\s+getClientReadonlySnapshot\s*\(/, 'Missing getClientReadonlySnapshot in data service');
  assert.match(dataService, /cnpj/, 'Client snapshot should scope by company CNPJ');
});
