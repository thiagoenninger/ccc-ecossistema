# ADR-008 — Fontes locais via pacotes @fontsource

- **Status:** Aceita (implementação na E02)
- **Data:** 16/11/2026
- **Dependências:** E02

## Contexto

O DS exige Source Serif 4, IBM Plex Sans e IBM Plex Sans Condensed como arquivos locais, sem CDN.

## Problema

Versionar binários woff2 ou usar pacotes npm?

## Alternativas

1. Binários woff2 versionados.
2. `@fontsource/*` (OFL-1.1) empacotados pelo Vite.

## Decisão

Opção 2: `@fontsource/source-serif-4` 5.3.1, `@fontsource/ibm-plex-sans` 5.3.0, `@fontsource/ibm-plex-sans-condensed` 5.3.0, subconjunto latino e pesos 400/500/600.

## Justificativa

Sem entrega manual de binários; funciona offline porque o Vite copia os arquivos para o build.

## Consequências

Três dependências justificadas. Teste na E02 garantirá ausência de requisições externas de fonte.
