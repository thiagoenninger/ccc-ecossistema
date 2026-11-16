# Estrutura do monorepo

Versão 1.0 — 16/11/2026 (estado após a E01).

```text
ccc-ecossistema/
├── apps/
│   └── espaco-expositivo/        # @ccc/espaco-expositivo (Vite + React)
├── packages/                     # vazio na E01; criado sob demanda
├── docs/
├── CLAUDE.md
├── README.md
├── package.json                  # workspaces: apps/*, packages/*
├── package-lock.json
├── tsconfig.base.json
├── eslint.config.js
├── .prettierrc.json / .prettierignore
├── .editorconfig / .gitattributes / .gitignore
├── .npmrc / .nvmrc
└── .vscode/
```

## Responsabilidades

| Local                          | Responsabilidade                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| Raiz                           | Ferramentas compartilhadas (TypeScript, ESLint, Prettier, Vitest, Testing Library), scripts agregadores, `engines` |
| `apps/<app>`                   | Dependências de execução (React), Vite, `tsconfig` próprio que estende a base, testes do app                       |
| `packages/design-tokens` (E02) | JSON → CSS Variables, temas, fontes, tokens complementares, dados dos templates                                    |
| `packages/types` (E03)         | Contratos de dados                                                                                                 |
| `packages/data-access` (E03)   | Repositório assíncrono e `resolveAssetUrl`                                                                         |
| `packages/ui` (E04+)           | Componentes React compartilhados, criados quando uma app precisar                                                  |

## Regras

- `apps → ui → design-tokens/types` e `apps → data-access → types`; nunca o inverso; sem ciclos.
- Pacote interno: `"exports": { ".": "./src/index.ts" }`, scripts `typecheck` e `test`, `tsconfig.json` que estende `../../tsconfig.base.json`.
- Ferramentas de desenvolvimento ficam na raiz; dependências de execução ficam no workspace que as usa.
- Novo workspace: criar a pasta, `npm install` na raiz, e conferir `npm run check`.
