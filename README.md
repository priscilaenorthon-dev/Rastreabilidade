# HoseTrack Pro - Demo com Supabase

Aplicacao Next.js para rastreabilidade de mangueiras/conectores, inspeções, manutencoes e oportunidades comerciais.

## 1) Configuracao local

1. Instale dependencias:
   `npm install`
2. Crie/ajuste `.env.local` com:

```env
NEXT_PUBLIC_SUPABASE_URL=https://svhowqqwngxdrylonxul.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_ztYDrpek8Sd0EdGLsRNveQ_q_yxcEJu
NEXT_PUBLIC_SUPABASE_ANON_KEY=<SUA_ANON_KEY>
```

3. Rode o projeto:
   `npm run dev`

## 2) Bootstrap do banco no Supabase

Abra o SQL Editor do projeto e execute na ordem:

1. `supabase/schema.sql`
2. `supabase/seed.sql`

Esses scripts criam as tabelas:
- `companies`
- `equipments`
- `opportunities`
- `inspections`
- `maintenances`

E inserem dados iniciais para demonstracao.

## 3) O que ja esta integrado

- Dashboard com KPIs reais (ou fallback de demo)
- Empresas com cadastro (insert no Supabase)
- Equipamentos com cadastro e detalhe
- Oportunidades com filtros e exportacao CSV
- Inspecoes e manutencoes conectadas ao banco
- Relatorio executivo com exportacao CSV

## 4) Verificacao rapida

Comandos de smoke test:

- `node --test tests/smoke/navigation-smoke.test.mjs`
- `node --test tests/smoke/supabase-readiness.test.mjs`

## 5) Nota de seguranca

As policies de RLS do `schema.sql` estao abertas para facilitar a demonstracao com anon key.
Antes de producao, restrinja policies por usuario/perfil e mova operacoes criticas para backend seguro.
