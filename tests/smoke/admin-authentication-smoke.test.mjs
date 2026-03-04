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

test('admin auth API routes exist', () => {
  assert.equal(exists('app/api/admin-auth/login/route.ts'), true, 'Missing admin login API route');
  assert.equal(exists('app/api/admin-auth/logout/route.ts'), true, 'Missing admin logout API route');
});

test('admin login page validates credentials via API', () => {
  const loginPage = read('app/login/page.tsx');
  assert.match(loginPage, /\/api\/admin-auth\/login/, 'Admin login should call admin login API');
  assert.match(loginPage, /Validando\.\.\./, 'Admin login should expose loading feedback');
  assert.match(loginPage, /\/cliente\/login/, 'Admin login should direct client users to client login');
});

test('middleware enforces admin session on non-client routes', () => {
  const middleware = read('middleware.ts');
  assert.match(middleware, /ADMIN_PORTAL_COOKIE/, 'Middleware should check admin session cookie');
  assert.match(middleware, /url\.pathname = '\/login'/, 'Middleware should redirect unauthenticated admin routes to /login');
  assert.match(middleware, /hasClientSession && !hasAdminSession/, 'Middleware should keep client and admin sessions segregated');
});

test('sidebar logout clears admin auth before login navigation', () => {
  const sidebar = read('components/Sidebar.tsx');
  assert.match(sidebar, /\/api\/admin-auth\/logout/, 'Sidebar logout should call admin logout API');
  assert.match(sidebar, /href="\/login"|href='\/login'/, 'Sidebar logout should navigate to /login');
});
