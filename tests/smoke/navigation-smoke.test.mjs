import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = process.cwd();

function read(relativePath) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function routeToPagePath(route) {
  if (route === '/') {
    return path.join(root, 'app', 'page.tsx');
  }

  const segments = route.split('/').filter(Boolean);
  return path.join(root, 'app', ...segments, 'page.tsx');
}

test('sidebar nav routes have corresponding Next.js pages', () => {
  const sidebar = read('components/Sidebar.tsx');
  const hrefMatches = [...sidebar.matchAll(/href:\s*'([^']+)'/g)];
  const routes = hrefMatches.map((m) => m[1]);

  assert.ok(routes.length > 0, 'Expected nav routes in Sidebar.tsx');

  for (const route of routes) {
    const pagePath = routeToPagePath(route);
    assert.ok(
      fs.existsSync(pagePath),
      `Missing page for sidebar route "${route}" (${path.relative(root, pagePath)})`
    );
  }
});

test('sidebar logout is wired to login navigation', () => {
  const sidebar = read('components/Sidebar.tsx');
  assert.match(
    sidebar,
    /href="\/login"|href='\/login'/,
    'Logout action should navigate to /login'
  );
});

test('login form submits through handler instead of Link-wrapped submit button', () => {
  const login = read('app/login/page.tsx');
  assert.doesNotMatch(
    login,
    /<Link\s+href="\/"\s+className="w-full">\s*<button[^>]*type="submit"/s,
    'Submit button should not be wrapped by Link'
  );
  assert.match(
    login,
    /onSubmit=\{[^}]*\}/,
    'Login form should have explicit submit handler'
  );
});

test('dashboard alerts section has navigation for "Ver todos"', () => {
  const dashboard = read('app/page.tsx');
  assert.match(
    dashboard,
    /href="\/oportunidades"|href='\/oportunidades'/,
    'Dashboard should link alerts CTA to /oportunidades'
  );
});

test('header shortcuts are wired to internal pages', () => {
  const header = read('components/Header.tsx');
  assert.match(header, /href="\/oportunidades"|href='\/oportunidades'/, 'Bell shortcut should open opportunities');
  assert.match(header, /href="\/relatorios"|href='\/relatorios'/, 'Help shortcut should open reports');
  assert.match(header, /href="\/login"|href='\/login'/, 'Profile shortcut should navigate to login/profile page');
});
