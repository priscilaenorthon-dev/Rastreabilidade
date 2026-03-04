# HoseTrack Pro

Plataforma web de rastreabilidade industrial para gestão de mangueiras e conexões, com foco em operação, manutenção e visão comercial.

## 🌐 Ambiente em produção

https://rastreabilidade-bpwc.vercel.app/

## ✨ Principais recursos

- Dashboard operacional com indicadores e alertas.
- CRUD completo de empresas, incluindo usuário e senha do portal do cliente.
- Gestão de equipamentos com vínculo por empresa e detalhamento por ativo.
- Gestão de inspeções e manutenções com ações de atualização/exclusão.
- Pipeline de oportunidades com filtros e exportação CSV.
- Relatórios executivos com exportação.
- Portal do cliente em modo somente leitura, com escopo por empresa.
- UI responsiva para desktop e mobile.

## 🧱 Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + REST)

## 🚀 Setup rápido

1. Instalar dependências:

```bash
npm install
```

2. Criar/atualizar `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://svhowqqwngxdrylonxul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_ANON_KEY>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ztYDrpek8Sd0EdGLsRNveQ_q_yxcEJu
```

3. Rodar em desenvolvimento:

```bash
npm run dev
```

## 🔐 Variáveis de ambiente

Obrigatórias:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` (ou `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`)

Opcionais:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `CLIENT_PORTAL_USERNAME` (fallback demo)
- `CLIENT_PORTAL_PASSWORD` (fallback demo)
- `CLIENT_PORTAL_CNPJ` (fallback demo)
- `ADMIN_PORTAL_USERNAME` (default: `admin`)
- `ADMIN_PORTAL_PASSWORD` (default: `admin1234`)

## 🗄️ Banco de dados (Supabase)

Executar no SQL Editor do Supabase, nesta ordem:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Tabelas principais:

- `companies`
- `client_accounts`
- `equipments`
- `opportunities`
- `inspections`
- `maintenances`

## 👤 Portal do cliente

- Login: `/cliente/login`
- Cada login é vinculado a uma empresa.
- O cliente visualiza apenas os dados da própria empresa.
- Fluxo somente leitura no portal.

## 🧪 Testes smoke

```bash
node --test tests/smoke/navigation-smoke.test.mjs
node --test tests/smoke/supabase-readiness.test.mjs
node --test tests/smoke/crud-actions-smoke.test.mjs
node --test tests/smoke/client-portal-smoke.test.mjs
node --test tests/smoke/client-account-provisioning-smoke.test.mjs
```

## 🤖 Skill local de UI (Copilot)

Skill incluída no repositório:

- `.github/skills/frontend-ui-modernizer.md`

Prompt base:

```text
Use a skill frontend-ui-modernizer na tela app/empresas/page.tsx.
Objetivo: modernizar o visual sem alterar regras de negocio.
Restricoes: nao criar features novas e manter comportamento atual.
```

## 🛡️ Segurança (observação importante)

As políticas de RLS no `supabase/schema.sql` estão abertas para facilitar demonstração com chave anônima.
Para produção, implemente políticas restritivas por usuário/perfil e mova operações sensíveis para backend seguro.
