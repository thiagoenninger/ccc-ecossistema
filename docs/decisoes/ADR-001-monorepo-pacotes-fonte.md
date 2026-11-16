# ADR-001 — Monorepo npm Workspaces com pacotes internos consumidos como código-fonte

- **Status:** Aceita (validada na E01)
- **Data:** 16/11/2026
- **Dependências:** Nenhuma.

## Contexto

O projeto é mantido por um único desenvolvedor e terá seis aplicações com build independente e pacotes compartilhados. Ambiente do desenvolvedor: Windows 11, VS Code, PowerShell, Node 24.21.0, npm 11.19.0, Git 2.55.0.windows.5. Os documentos oficiais do Design System ficam em `docs/design-system/`.

## Problema

Como compartilhar código entre apps sem criar uma cadeia de builds por pacote que um único desenvolvedor precise manter?

## Alternativas

1. Pacotes compilados (`tsc` + `dist`) com ordem de build.
2. Pacotes internos consumidos como código-fonte TypeScript (`exports` apontando para `src/`).
3. Nx/Turborepo (vetado pelas instruções sem necessidade demonstrada).

## Decisão

Opção 2. Cada pacote declara `"exports": { ".": "./src/index.ts" }`; o Vite do aplicativo transpila o código dos pacotes. Raiz com `workspaces: ["apps/*", "packages/*"]`, `.npmrc` com `save-exact` e `engine-strict`, `engines.node = ^22.22.2 || ^24.15.0 || >=26.0.0`, `.nvmrc = 24`. Pacotes são criados sob demanda. Documentos oficiais do DS em `docs/design-system/` (somente leitura; alterações por ADR).

## Justificativa

Elimina ordem de build e `dist` por pacote. A viabilidade foi comprovada na E01 com um experimento descartável (pacote `@ccc/demo-lib` consumido pelo app): typecheck, lint, testes (no pacote e no app) e build passaram. As restrições de `engines` derivam do jsdom 31 e do Vitest 5.

## Consequências

Cada app precisa transpilar os pacotes que usa (custo pequeno). Se um pacote for usado fora do Vite (ex.: Cloud Functions), ele ganhará build próprio nesse momento. Scripts da raiz não repassam argumentos extras ao Vite; usar `npm run <script> -w @ccc/<app> -- <args>`.
