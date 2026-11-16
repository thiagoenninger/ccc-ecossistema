# ADR-012 — Pipeline de tokens (JSON oficial → CSS) e decisões da E02

- **Status:** Aceita (implementada na E02; aguardando validação local)
- **Data:** 16/11/2026

## Contexto

O Design System oficial entrega `design-tokens.json`. As aplicações usam CSS Modules e CSS Variables. O JSON não cobre alguns valores necessários (gradiente de legenda segundo o Handoff, anel de foco, barra de seleção, superfície de tile sem imagem no tema Papel).

## Decisões

1. **JSON oficial permanece intocado** em `docs/design-system/design-tokens.json`. Um gerador (`packages/design-tokens/scripts/build-tokens.ts`) o converte em `src/generated/tokens.css` e `src/generated/catalog.ts`.
2. **Complementos** (ADR-004 e itens abaixo) ficam em `src/source/complementary-tokens.json`, versionados à parte e mesclados na geração.
3. **Arquivos gerados são versionados** e protegidos por teste de paridade (`tokens:check` e testes Vitest): falha se divergirem do JSON.
4. **Temas:** `:root, [data-theme='galeria']` (padrão) e `[data-theme='papel']`; cada um declara `color-scheme`. Os dois definem exatamente o mesmo conjunto de tokens semânticos (testado).
5. **`surface-tile-no-image` no tema Papel:** o JSON não define o valor. **Hipótese provisória:** reutilizar `#262C2E` (mesmo do Galeria), pois o tile mostra legenda clara sobre fundo escuro nos dois temas. Revalidar na E04.
6. **Anel de foco duplo** (interno `rgb(8 10 11 / 0.85)` 3 px + externo `turquesa-400` 3 px) via `box-shadow`; **barra de seleção** `ambar-500` 4 px.
7. **Inatividade:** somente valores numéricos do JSON viram variáveis (120 s / 20 s); regras e tetos seguem pendentes para a E07 (ADR-005).
8. **Fontes:** `@font-face` próprio, somente woff2, a partir de `@fontsource/*/files` (ADR-008). Nenhuma URL externa (testado no CSS e conferido no `dist`).
9. **Página de referência** `tokens.html` é exclusiva de desenvolvimento: não entra no build de produção.
10. **TypeScript:** `allowImportingTsExtensions` passa para `tsconfig.base.json` (o pacote é consumido como fonte e os scripts rodam direto no Node com remoção de tipos).

## Consequências

- Alterar o JSON oficial exige rodar `npm run tokens:build -w @ccc/design-tokens` e commitar os gerados.
- Os itens 5 e 6 são interpretações; se o Design System for revisado, atualizar o arquivo de complementos.
