# HoseTrack Pro

Plataforma web de rastreabilidade industrial para gestão de mangueiras e conexões, com foco em operação, manutenção, inspeção e visão comercial.

## 📌 About

- Website: https://rastreabilidade-bpwc.vercel.app/

## 🌐 Ambiente em produção

https://rastreabilidade-bpwc.vercel.app/

## ✨ O que este sistema faz

- Dashboard com indicadores operacionais e alertas por prioridade.
- Cadastro e gestão de empresas (incluindo credenciais do portal do cliente).
- Gestão de equipamentos com vínculo por empresa e detalhamento por ativo.
- Gestão de inspeções com registro, atualização de status e exclusão.
- Gestão de manutenções com controle de agenda, custo e técnico responsável.
- Pipeline de oportunidades com busca, filtro por urgência e exportação CSV.
- Relatórios executivos com exportação de resumo.
- Portal do cliente em modo somente leitura, escopado por empresa.
- Autenticação separada para admin e cliente com rotas dedicadas.

## 🧱 Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
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

# Fallback demo (opcional)
CLIENT_PORTAL_USERNAME=jomaga
CLIENT_PORTAL_PASSWORD=jomaga1234
CLIENT_PORTAL_CNPJ=33.000.167/0001-01
ADMIN_PORTAL_USERNAME=admin
ADMIN_PORTAL_PASSWORD=admin1234
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
- `CLIENT_PORTAL_USERNAME`
- `CLIENT_PORTAL_PASSWORD`
- `CLIENT_PORTAL_CNPJ`
- `ADMIN_PORTAL_USERNAME`
- `ADMIN_PORTAL_PASSWORD`

## 🗄️ Banco de dados (Supabase)

Executar no SQL Editor do Supabase, nesta ordem:

1. `supabase/schema.sql`
2. `supabase/seed.sql`
3. (opcional para ambientes antigos) `supabase/patch-delete-policies.sql`

Tabelas principais:

- `companies`
- `client_accounts`
- `equipments`
- `opportunities`
- `inspections`
- `maintenances`

## 👤 Acessos do sistema

- Login admin: `/login`
- Login cliente: `/cliente/login`
- O portal do cliente é somente leitura e mostra apenas dados da empresa vinculada.

## 🧪 Testes smoke

```bash
node --test tests/smoke/navigation-smoke.test.mjs
node --test tests/smoke/supabase-readiness.test.mjs
node --test tests/smoke/crud-actions-smoke.test.mjs
node --test tests/smoke/client-portal-smoke.test.mjs
node --test tests/smoke/client-account-provisioning-smoke.test.mjs
node --test tests/smoke/admin-authentication-smoke.test.mjs
```

## 📜 Scripts

| Comando | Descrição |
|---|---|
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm run clean` | Limpa cache do Next |

## 🛡️ Segurança (observação importante)

As políticas de RLS no `supabase/schema.sql` estão permissivas para facilitar demonstração com chave anônima.
Para produção, implemente políticas restritivas por usuário/perfil e mova operações sensíveis para backend seguro.
