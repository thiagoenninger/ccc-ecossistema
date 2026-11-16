# ADR-003 — Templates de mosaico: coordenadas são normativas

- **Status:** Aceita (parcial: itens C-05, C-06 e balanceamento de 10+ obras pendentes)
- **Data:** 16/11/2026
- **Dependências:** E04

## Contexto

Handoff §5.3 define a regra "herói 28–45 %", mas nenhum template de 3 a 8 obras a cumpre (T3 47,8 %; T4 50,0 %; T5 27,7 %; T6 23,9 %; T7 e T8 21,8 %). O Handoff §8 exige "mín. 230 px de lado", mas ladrilhos como 420×170 e 360×225 do T8/T6 são menores.

## Problema

Qual fonte prevalece quando regras percentuais gerais e coordenadas divergem?

## Alternativas

1. Regras gerais prevalecem (recalcular templates).
2. Coordenadas dos templates prevalecem.

## Decisão

**Aprovado pelo desenvolvedor:** as coordenadas dos templates (Handoff §5.2) prevalecem sobre as regras percentuais gerais, e as dimensões dos templates prevalecem sobre o mínimo de 230 px. Os dados dos templates serão um arquivo derivado do Handoff, com testes geométricos (dentro da área, sem sobreposição, intervalo de 10 px, % do herói). A coluna "Restrições" do T3 ("56 %") é erro de texto; vale 47,8 %.

## Justificativa

Preserva a fidelidade aos templates aprovados e evita recálculos que descaracterizem as composições (ressalva A do prompt).

## Consequências

Ainda pendentes (decidir na E04/E05): slots editoriais por template (C-05), adaptação a 1366×768 e 1280×800 (C-06) e balanceamento de conjuntos com 10 ou mais obras. A regra 28–45 % vira orientação para eventuais novos templates.
