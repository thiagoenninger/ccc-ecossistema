# Ecossistema Digital — Centro Cultural de Cubatão

Monorepo (npm Workspaces) das aplicações museográficas, do módulo de mídias automatizadas, da biblioteca digital e do Dashboard Administrativo do Centro Cultural de Cubatão/SP.

Design System oficial: **Galeria Contemporânea v2.0** (documentos em `docs/design-system/`).

> Estado: **E01 — Monorepo e toolchain**. Apenas o esqueleto técnico do Espaço Expositivo existe. Ver [progresso](docs/desenvolvimento/progresso.md).

## Requisitos

- Node.js `^22.22.2 || ^24.15.0 || >=26` (referência do projeto: **24.21.0**; ver `.nvmrc`)
- npm 10.9 ou superior (referência: **11.19.0**)
- Git 2.40 ou superior (referência: 2.55.0.windows.5)

## Primeiros passos (PowerShell, na raiz do repositório)

```powershell
npm ci
npm run check
npm run dev:expo
```

Abra o endereço exibido (normalmente `http://localhost:5173/`).

## Comandos

| Comando                           | Função                                           |
| --------------------------------- | ------------------------------------------------ |
| `npm ci`                          | Instala exatamente o `package-lock.json`         |
| `npm run dev:expo`                | Servidor de desenvolvimento do Espaço Expositivo |
| `npm run build` / `build:expo`    | Build de produção (executa typecheck antes)      |
| `npm run preview:expo`            | Serve o build gerado                             |
| `npm test`                        | Testes (Vitest) em todos os workspaces           |
| `npm run typecheck`               | Verificação de tipos em todos os workspaces      |
| `npm run lint` / `lint:fix`       | ESLint com regras tipadas                        |
| `npm run format` / `format:check` | Prettier                                         |
| `npm run check`                   | typecheck + lint + format:check + testes + build |

Argumentos extras ao Vite: `npm run dev -w @ccc/espaco-expositivo -- --port 5174`.

## Estrutura

```text
apps/espaco-expositivo/   Primeira aplicação (MVP)
packages/                 Pacotes compartilhados (criados sob demanda)
docs/                     Design System, arquitetura, decisões (ADRs) e desenvolvimento
CLAUDE.md                 Instruções permanentes para o Claude Code
```

## Documentação

- [Visão geral](docs/arquitetura/visao-geral.md) · [Estrutura do monorepo](docs/arquitetura/estrutura-monorepo.md)
- [Decisões (ADRs)](docs/decisoes/README.md)
- [Roadmap](docs/desenvolvimento/roadmap.md) · [Progresso](docs/desenvolvimento/progresso.md) · [Pendências](docs/desenvolvimento/pendencias.md)
