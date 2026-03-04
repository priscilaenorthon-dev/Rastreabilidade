# HoseTrack Pro

Sistema web para rastreabilidade industrial de mangueiras e conexoes, com controle de empresas, equipamentos, inspecoes, manutencoes e oportunidades.

## Site em producao

**https://rastreabilidade-bpwc.vercel.app/**

## Visao geral

O HoseTrack Pro foi projetado para operacao industrial com foco em:

- Cadastro e historico de empresas clientes
- Controle de equipamentos por identificador
- Registro de inspecoes com status e resultado
- Registro de manutencoes com agendamento, tecnico e custo
- Painel com indicadores operacionais
- Oportunidades comerciais com filtros e exportacao
- Relatorios executivos em CSV
- Portal do cliente com acesso somente leitura

## Stack tecnica

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase (PostgreSQL + REST)

## Setup local rapido

1. Instale dependencias:

```bash
npm install
```

2. Configure o arquivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://svhowqqwngxdrylonxul.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_ANON_KEY>
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ztYDrpek8Sd0EdGLsRNveQ_q_yxcEJu
```

3. Rode o projeto:

```bash
npm run dev
```

## Variaveis de ambiente

Obrigatorias:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Opcional:

- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `CLIENT_PORTAL_USERNAME` (fallback de demonstracao)
- `CLIENT_PORTAL_PASSWORD` (fallback de demonstracao)
- `CLIENT_PORTAL_CNPJ` (fallback de demonstracao)

## Bootstrap do banco (Supabase)

No SQL Editor do Supabase, execute nesta ordem:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Esses scripts criam as tabelas principais:

- `companies`
- `client_accounts`
- `equipments`
- `opportunities`
- `inspections`
- `maintenances`

## Portal do cliente

- URL de acesso: `/cliente/login`
- O cadastro de empresa agora inclui `Usuario do portal` e `Senha do portal`.
- Cada login de cliente fica vinculado a uma empresa e enxerga apenas os dados dela (somente leitura).

## Testes rapidos

```bash
node --test tests/smoke/navigation-smoke.test.mjs
node --test tests/smoke/supabase-readiness.test.mjs
node --test tests/smoke/crud-actions-smoke.test.mjs
node --test tests/smoke/client-portal-smoke.test.mjs
node --test tests/smoke/client-account-provisioning-smoke.test.mjs
```

## Observacao de seguranca

As policies de RLS no `schema.sql` estao abertas para facilitar demonstracao com chave anonima.
Para producao, aplique politicas restritivas por usuario/perfil e mova operacoes sensiveis para backend seguro.
