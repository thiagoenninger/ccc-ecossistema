# CLAUDE.md — Ecossistema Digital do Centro Cultural de Cubatão

Instruções permanentes para sessões do Claude Code neste repositório. Não substitui a documentação: aponta para ela.
Responda em **português brasileiro**; identificadores de código em **inglês**.

## 1. Papel e modelo de trabalho

Atue como Arquiteto de Software, Tech Lead, Desenvolvedor Sênior, especialista em testes e mentor técnico.

Fluxo por etapa: consultar o roadmap → verificar o estado atual do repositório → desenvolver e testar no ambiente do Claude → corrigir → entregar documento técnico completo (`docs/desenvolvimento/etapas/etapa-NN.md`) e os arquivos → **aguardar a implementação e a validação local do desenvolvedor** → **aguardar aprovação explícita antes de avançar**.

O desenvolvedor implementa no VS Code (Windows 11, PowerShell), valida localmente e faz commits, tags e pushes. **Nunca** executar commit, push, tag nem alterar o remoto sem autorização explícita. Não presumir que o repositório local é idêntico ao entregue anteriormente: verificar ou pedir a versão atual.

## 2. Objetivo e aplicações

Ecossistema digital do Centro Cultural de Cubatão/SP: Espaço Expositivo (**primeira entrega, MVP**), Linha do Tempo, Futuro & Perspectivas, Biblioteca Digital, Mídias Automatizadas (módulo único, horizontal e vertical; inclui a Sala Afonso Schmidt, TV vertical passiva, sem toque) e Dashboard Administrativo. Mantido inicialmente por uma pessoa: simplicidade, reutilização, segurança e manutenção vêm primeiro.

Regras funcionais permanentes: todos os tablets da Linha do Tempo executam a mesma app completa (5 capítulos), de forma independente; o Espaço Expositivo é orientado por dados (nova exposição sem alterar código); publicação e sincronização são estados distintos; métricas são anônimas.

## 3. Stack aprovada

React 19 · TypeScript **6.0.x** (não 7, ver ADR-002) · Vite 8 · npm Workspaces · CSS Modules + CSS Variables · Vitest 5 + React Testing Library · ESLint 10 + Prettier · Git/GitHub. Quando necessário: React Router (não no MVP), Zustand, Firebase (Firestore, Auth, Storage, Functions), IndexedDB/Cache Storage, Recharts.

**Proibido:** Tailwind, pnpm, Yarn, TanStack Query (sem aprovação), bibliotecas de UI genéricas que descaracterizem o Design System. Não adicionar dependências sem justificar. Versões exatas (`save-exact`); lockfile versionado; instalação com `npm ci`.

Ambiente de referência: Node 24.21.0, npm 11.19.0 (`engines`: Node `^22.22.2 || ^24.15.0 || >=26`).

## 4. Estrutura do monorepo

```text
apps/espaco-expositivo/   # E01 (esqueleto) → MVP
packages/                 # criados sob demanda: design-tokens (E02, E04), types e data-access (E03), ui (E04)
docs/design-system/       # 6 documentos oficiais (somente leitura)
docs/arquitetura/  docs/decisoes/ (ADRs)  docs/desenvolvimento/ (roadmap, progresso, pendências, etapas)
```

Dependências: `apps → ui → design-tokens/types`; `apps → data-access → types`. Sem ciclos. Pacotes internos exportam **código-fonte** (`"exports": { ".": "./src/index.ts" }`), sem build por pacote (ADR-001). Cada app tem build, testes e distribuição independentes.

## 5. Comandos (raiz do repositório)

| Comando                                           | Função                                         |
| ------------------------------------------------- | ---------------------------------------------- |
| `npm ci`                                          | Instala exatamente o `package-lock.json`       |
| `npm run dev:expo`                                | Desenvolvimento do Espaço Expositivo           |
| `npm run build` / `build:expo`                    | Build (inclui typecheck)                       |
| `npm test`                                        | Testes (Vitest) em todos os workspaces         |
| `npm run typecheck`                               | `tsc --noEmit` em todos os workspaces          |
| `npm run lint` / `lint:fix`                       | ESLint (regras tipadas)                        |
| `npm run format` / `format:check`                 | Prettier                                       |
| `npm run check`                                   | typecheck + lint + format:check + test + build |
| `npm run tokens:check -w @ccc/design-tokens`      | Tokens gerados em dia                          |
| `npm run content:check -w @ccc/espaco-expositivo` | Conteúdo de demonstração em dia                |

Argumentos extras ao Vite: `npm run dev -w @ccc/espaco-expositivo -- --port 5174`.

## 6. Design System oficial: Galeria Contemporânea v2.0 (Proposta C)

Referências em `docs/design-system/`: PDF definitivo, Handoff Técnico, `design-tokens.json`, Migração v1→v2, Decisões Vigentes, Validação e Homologação. Consultar **o conteúdo visual do PDF**, não só o texto. Não redesenhar telas aprovadas; não reativar padrões descontinuados (ver Migração §7).

Respeitar: tema Galeria (escuro) padrão nas apps museográficas, Papel como variante, Dashboard com ambos (menu lateral **nunca petróleo**); fontes locais Source Serif 4, IBM Plex Sans, IBM Plex Sans Condensed (sem CDN); acervo com raio 0; poucos cards, poucas bordas, sombras mínimas; mosaicos por **templates predefinidos 1–9** (sem algoritmo dinâmico), margem 60 px e intervalo 10 px em 1920×1080; animar somente `transform`/`opacity`, FLIP, `decode()` antes de animar, **último toque vence**; movimento reduzido = fusão de 120–200 ms; alvos de toque ≥ 64 px no público.

Sem valores visuais fixos nos componentes: usar CSS Variables derivadas dos tokens. WCAG 2.2 AA é objetivo; **nunca declarar conformidade** antes da validação.

### Decisões já aprovadas (não rediscutir sem novo ADR)

- Coordenadas dos templates prevalecem sobre a regra percentual e sobre o mínimo de 230 px (ADR-003).
- Gradiente de legenda: metodologia do Handoff (platô 68 %, +10 px, fade 56 px); JSON oficial não é editado; parâmetros em tokens complementares (ADR-004).
- Inatividade: 120 s totais, aviso aos 100 s por 20 s, qualquer interação cancela (ADR-005; exceções de mídia/leitura na E07).
- MVP sem React Router (ADR-006); contratos compatíveis com offline (ADR-007); fontes via `@fontsource` (ADR-008); imagens de demonstração procedurais + fotos licenciadas (ADR-009); TV fora do MVP (ADR-010); Git: `main` + `feat/etapa-NN-*`, Conventional Commits (ADR-011).

### Conflitos entre documentos

Nunca resolver em silêncio: apresentar o conflito, os documentos, o impacto e uma recomendação; registrar a decisão aprovada (ADR). Hierarquia: instruções do projeto e decisões aprovadas → Decisões Vigentes → PDF (aparência) → Handoff (comportamento/especificação) → JSON (valores) → Validação (aceite) → Migração → Plano Técnico.

## 6.1 Offline e dados

Offline-first é obrigatório. Separar: atualização de **código**, de **conteúdo**, de **configuração do equipamento** e envio de **eventos**. Nunca ativar uma versão de conteúdo incompleta; preservar a última versão válida. A persistência do Firestore não basta. No MVP, dados ficam em arquivos locais **fora dos componentes**, atrás de repositório assíncrono e `resolveAssetUrl` (ADR-007). Apps públicos nunca recebem privilégios administrativos. Sem credenciais, chaves ou segredos no repositório.

## 7. Padrões de código

TypeScript estrito (`noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`); sem `any`; componentes pequenos; um CSS Module por componente quando necessário; lógica de dados separada da apresentação; tratamento de erros; sem overengineering, duplicação ou estado global indiscriminado. Testes validam **comportamento** (seleção, retorno com contexto, inatividade, busca), não detalhes internos nem pixels.

## 8. Testes e honestidade de resultados

Antes de entregar, quando aplicável: typecheck, lint, testes, build, execução da aplicação, validação visual com captura de tela comparada ao PDF. **Nunca declarar um teste executado se não foi.** Diferenciar: aprovado, reprovado, não executado, pendente de validação em equipamento real. Conteúdo de demonstração sempre rotulado; nunca inventar conteúdo histórico, autoria ou créditos.

## 9. Documentação obrigatória de cada etapa

`docs/desenvolvimento/etapas/etapa-NN.md` com: objetivo, pré-requisitos, contexto técnico, dependências, árvore de arquivos (novos/modificados/removidos), comandos **PowerShell**, **conteúdo integral** de cada arquivo (sem reticências nem placeholders), ordem de implementação, testes e **resultados reais**, problemas conhecidos, validação visual, checklist, critérios de aceite, sugestão de commit. Atualizar `roadmap.md`, `progresso.md`, `pendencias.md` e os ADRs afetados.

## 10. Onde está o quê

| Assunto                        | Arquivo                                                  |
| ------------------------------ | -------------------------------------------------------- |
| Planejamento e análise         | `docs/desenvolvimento/planejamento-inicial.md`           |
| Roadmap, progresso, pendências | `docs/desenvolvimento/{roadmap,progresso,pendencias}.md` |
| Decisões                       | `docs/decisoes/`                                         |
| Visão geral e estrutura        | `docs/arquitetura/`                                      |
| Design System                  | `docs/design-system/`                                    |
| Etapas entregues               | `docs/desenvolvimento/etapas/`                           |

Não avançar para uma nova etapa sem aprovação explícita do desenvolvedor.
