import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test('database schema includes client_accounts table with password hash', () => {
  const schema = read('supabase/schema.sql');
  assert.match(schema, /create table if not exists\s+(public\.)?client_accounts/i, 'Missing client_accounts table in schema.sql');
  assert.match(schema, /password_hash/i, 'Missing password_hash column in client_accounts');
  assert.match(schema, /username/i, 'Missing username column in client_accounts');
});

test('company creation flow supports portal username and password', () => {
  const dataService = read('lib/data-service.ts');
  assert.match(dataService, /portal_username/i, 'createCompany should accept portal_username');
  assert.match(dataService, /portal_password/i, 'createCompany should accept portal_password');
  assert.match(dataService, /insertRow<[^>]+>\('client_accounts'/, 'createCompany should provision client_accounts record');
});

test('companies page has fields for portal credentials', () => {
  const page = read('app/empresas/page.tsx');
  assert.match(page, /Usuario do portal|Usuário do portal/i, 'Companies form should include portal username field');
  assert.match(page, /Senha do portal/i, 'Companies form should include portal password field');
});

test('client authentication validates against client_accounts table', () => {
  const auth = read('lib/client-portal-auth.ts');
  assert.match(auth, /client_accounts/, 'Client auth should read from client_accounts table');
  assert.match(auth, /password_hash/, 'Client auth should validate password hash');
});
