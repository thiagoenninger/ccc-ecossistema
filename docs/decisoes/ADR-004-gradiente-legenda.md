# ADR-004 — Gradiente de legenda: metodologia do Handoff prevalece sobre o JSON

- **Status:** Aceita
- **Data:** 16/11/2026
- **Dependências:** E02, E04

## Contexto

Handoff §3.3: platô de 68 % cobrindo o bloco de texto + 10 px e fade linear de 56 px; altura = mín(ladrilho; bloco + 14 + 10 + 56); blocos de 142/74/66 px. O JSON traz `caption-gradient` com paradas percentuais (0→.86; .38→.68; .74→.30; 1→0) e teto 250 px/64 %.

## Problema

Qual definição de gradiente implementar?

## Alternativas

1. Paradas percentuais do JSON.
2. Metodologia do Handoff, com parâmetros em tokens complementares.

## Decisão

**Aprovado:** metodologia do Handoff. Parâmetros de referência (platô 68 %, margem 10 px, fade 56 px, blocos 142/74/66 px) serão tokens complementares em arquivo próprio, **sem editar** o JSON oficial. Validação de contraste pelo método único do Handoff §11 (pior pixel) com imagens de demonstração e, depois, acervo real (P-04).

## Justificativa

Atende ao método de contraste documentado (piso analítico 6,06:1 para título) e à ressalva B do prompt.

## Consequências

Nunca reduzir a opacidade do componente inteiro. Parâmetros ajustáveis após medições. Opacidade `scrim`: usar os valores semânticos por tema (o `opacity.scrim` 0,72 do JSON diverge do scrim Galeria ≈ 0,84).
