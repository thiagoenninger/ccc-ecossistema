# ADR-006 — Navegação por estado (sem React Router) no MVP

- **Status:** Aceita
- **Data:** 16/11/2026
- **Dependências:** E05

## Contexto

Painéis touch em modo kiosk não usam URL nem botão voltar do navegador. O contexto (exposição, categoria, conjunto, obra, posição) precisa ser preservado e limpo na inatividade.

## Problema

Usar roteador ou um estado de navegação próprio?

## Alternativas

1. React Router.
2. Estado de navegação com `useReducer` + Context.

## Decisão

Opção 2 no MVP do Espaço Expositivo. Zustand somente se surgir estado realmente compartilhado entre árvores.

## Justificativa

Menos dependências, comportamento previsível para kiosk, teste direto do reducer.

## Consequências

Reavaliar para Dashboard e Biblioteca (podem se beneficiar de rotas).
