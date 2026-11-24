# Estrutura do monorepo

Versão 1.3 — 16/11/2026 (estado após a E04).

```text
ccc-ecossistema/
├── apps/
│   └── espaco-expositivo/        # @ccc/espaco-expositivo (Vite + React)
│       ├── public/content/       # conteúdo de demonstração (index, manifest, exposições, imagens)
│       └── scripts/demo-content/ # gerador determinístico do conteúdo de demonstração
├── packages/                     # design-tokens (E02), types e data-access (E03), ui (E04); demais sob demanda
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

| Local                               | Responsabilidade                                                                                                   |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Raiz                                | Ferramentas compartilhadas (TypeScript, ESLint, Prettier, Vitest, Testing Library), scripts agregadores, `engines` |
| `apps/<app>`                        | Dependências de execução (React), Vite, `tsconfig` próprio que estende a base, testes do app                       |
| `packages/design-tokens` (E02, E04) | JSON → CSS Variables, temas, fontes, tokens complementares, dados e layout dos templates de mosaico (E04)          |
| `packages/types` (E03)              | Contratos de dados e validadores (sem dependências)                                                                |
| `packages/data-access` (E03)        | `ExhibitionRepository`, repositório local em JSON e `resolveAssetUrl`                                              |
| `packages/ui` (E04)                 | Componentes React compartilhados: `Mosaic`, `ArtworkTile`, `Caption`, estados de conteúdo                          |

## Regras

- `apps → ui → design-tokens/types` e `apps → data-access → types`; nunca o inverso; sem ciclos.
- Pacote interno: `"exports": { ".": "./src/index.ts" }`, scripts `typecheck` e `test`, `tsconfig.json` que estende `../../tsconfig.base.json`.
- Ferramentas de desenvolvimento ficam na raiz; dependências de execução ficam no workspace que as usa.
- Novo workspace: criar a pasta, `npm install` na raiz, e conferir `npm run check`.
