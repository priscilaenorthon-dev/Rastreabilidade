---
name: frontend-ui-modernizer
description: Moderniza telas React/Next.js com foco em clareza visual, usabilidade e consistencia, sem aumentar escopo funcional.
version: 1.0.0
---

# Frontend UI Modernizer

Skill para modernizar UI neste projeto (Next.js App Router + React + Tailwind), mantendo o comportamento existente e sem adicionar features extras.

## Quando usar

Use esta skill quando voce quiser:

- melhorar visual/legibilidade de telas existentes;
- padronizar espacamentos, tipografia e hierarquia visual;
- organizar formulários e tabelas para facilitar uso;
- melhorar estados de carregamento, erro e sucesso;
- deixar a tela mais consistente com o restante do app.

## Quando nao usar

Nao use esta skill para:

- criar novas funcionalidades de negocio;
- alterar regras de permissao/autenticacao;
- migracao de framework ou troca de stack;
- refatoracao de backend, banco ou APIs.

## Padrao obrigatorio neste repositorio

- Manter App Router e estrutura atual de pastas.
- Preservar rotas e fluxos existentes.
- Fazer mudancas pequenas e cirurgicas por tela.
- Reutilizar componentes atuais quando possivel (`DashboardLayout`, `Header`, `Sidebar`).
- Manter Tailwind existente (sem hardcode de tema fora do padrao atual do projeto).
- Nao adicionar dependencias novas sem necessidade real.

## Checklist de execucao

1. Ler a tela alvo e mapear problemas de UX/UI.
2. Definir melhorias minimas (layout, contraste, feedback, consistencia).
3. Implementar em pequenos patches, sem mudar regra de negocio.
4. Validar estados principais: carregando, sucesso, erro e vazio.
5. Rodar validacoes locais disponiveis (smoke/lint quando possivel).
6. Entregar resumo com arquivos alterados e impacto.

## Prompt base para usar a skill

Use este formato ao pedir alteracoes:

```text
Use a skill frontend-ui-modernizer na tela <rota/arquivo>.
Objetivo: <melhoria desejada>.
Restrições: nao criar novas features, manter comportamento atual e usar estilo existente.
```

## Prompts prontos para este projeto

### 1) Modernizar lista de empresas

```text
Use a skill frontend-ui-modernizer na tela app/empresas/page.tsx.
Objetivo: melhorar legibilidade da tabela e formulario sem alterar o CRUD.
Restrições: manter campos atuais, sem novas funcionalidades.
```

### 2) Modernizar dashboard

```text
Use a skill frontend-ui-modernizer na tela app/page.tsx.
Objetivo: reforcar hierarquia visual dos cards e alertas.
Restrições: manter os mesmos indicadores e links.
```

### 3) Modernizar login

```text
Use a skill frontend-ui-modernizer na tela app/login/page.tsx.
Objetivo: melhorar clareza dos campos e feedback de erro.
Restrições: manter o mesmo fluxo de autenticacao.
```

## Definicao de pronto

A modernizacao esta pronta quando:

- a tela ficou visualmente mais clara e consistente;
- os mesmos fluxos continuam funcionando;
- estados de erro/sucesso/carregamento estao claros;
- nao houve aumento indevido de escopo.
