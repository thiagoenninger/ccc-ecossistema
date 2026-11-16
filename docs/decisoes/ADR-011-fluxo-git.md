# ADR-011 — Fluxo Git e mensagens de commit

- **Status:** Aceita
- **Data:** 16/11/2026
- **Dependências:** Nenhuma.

## Contexto

Um único desenvolvedor; repositório único no GitHub; o desenvolvedor realiza commits, tags e pushes.

## Problema

Qual fluxo de branches e convenção de commits?

## Alternativas

GitFlow; trunk-based com branches curtas.

## Decisão

Branch `main` estável + branches curtas `feat/etapa-NN-nome`; Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`); tag de marco ao concluir M0/M1/M2. Normalização de fim de linha por `.gitattributes` (`eol=lf`). Claude sugere mensagens e marcos; não executa commits nem pushes.

## Justificativa

Simples e suficiente para uma pessoa.

## Consequências

Integração contínua (GitHub Actions) será proposta depois da E01 validada.
