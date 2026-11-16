# ADR-007 — Contratos de dados e arquivos compatíveis com offline desde o MVP

- **Status:** Aceita
- **Data:** 16/11/2026
- **Dependências:** E03, E13

## Contexto

O MVP não implementa sincronização, mas não pode assumir `fetch` direto de URLs. Firestore persistence não resolve sozinho o offline de mídias (Plano Técnico §2). Quatro comportamentos distintos: servidor local sem internet, app instalável offline, persistência local de conteúdo, sincronização remota.

## Problema

Como evitar reescrita quando offline e Firebase chegarem?

## Alternativas

1. Componentes lendo JSON/URLs diretamente.
2. Repositório assíncrono + resolução de arquivos abstrata + manifesto versionado.

## Decisão

Opção 2: `ExhibitionRepository` assíncrono, `resolveAssetUrl(id)`, estados de arquivo (`available`, `offline-unavailable`, `failed`, `unpublished`) e manifesto com versão e checksum nos tipos desde a E03. A estratégia offline definitiva será decidida na E13, por ADR, com spike em hardware real.

## Justificativa

Troca de implementação sem tocar na apresentação.

## Consequências

Pequeno custo de abstração no MVP. Offline completo continua pendente (P-11).
