# Progresso

Atualizado em 16/11/2026.

## Resumo

| Item                 | Situação                                              |
| -------------------- | ----------------------------------------------------- |
| Planejamento inicial | **Aprovado** (v1.1)                                   |
| Arquitetura          | **Aprovada**                                          |
| Roadmap              | **Aprovado**                                          |
| Etapa atual          | **E01 — Monorepo e toolchain**                        |
| Próxima etapa        | E02 — Fundação visual (**não iniciar sem aprovação**) |
| Marco atual          | Nenhum atingido (M0 previsto para o fim da E02)       |

## Etapas

| ID      | Nome                              | Estado                                                                                      | Observações                              |
| ------- | --------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------- |
| E01     | Monorepo e toolchain              | **Documentada** (testada no ambiente do Claude; aguardando implementação e validação local) | Resultados reais em `etapas/etapa-01.md` |
| E02     | Fundação visual (tokens)          | Planejada                                                                                   | Depende da aprovação da E01              |
| E03     | Contratos e dados de demonstração | Planejada                                                                                   |                                          |
| E04     | Mosaico e legenda                 | Planejada                                                                                   | Requer decisões C-05/C-06                |
| E05     | Catálogo e navegação              | Planejada                                                                                   |                                          |
| E06     | Ficha, transição e visualizador   | Planejada                                                                                   | M1                                       |
| E07     | Inatividade e modal               | Planejada                                                                                   | Requer regras de teto                    |
| E08     | Telas complementares              | Planejada                                                                                   | Galeria audiovisual adiável              |
| E09     | Fechamento do MVP                 | Planejada                                                                                   | M2                                       |
| E10–E42 | Fases 3 a 9                       | Planejadas                                                                                  | Detalhamento ao aproximar cada fase      |

## Decisões aprovadas

Ver [../decisoes/README.md](../decisoes/README.md). Aprovadas em 16/11/2026: D-01 a D-09, C-01 (coordenadas dos templates), C-03 (gradiente do Handoff), C-04 (dimensões dos templates) e a localização dos documentos oficiais.

## Mudanças de escopo

| Data       | Mudança                                      | Origem         |
| ---------- | -------------------------------------------- | -------------- |
| 16/11/2026 | TV do Espaço Expositivo fora do MVP (Fase 3) | D-08 / ADR-010 |

## Resultados de testes

| Etapa | Ambiente                                            | typecheck | lint     | format   | testes        | build    | Observação                                |
| ----- | --------------------------------------------------- | --------- | -------- | -------- | ------------- | -------- | ----------------------------------------- |
| E01   | Claude: Linux, Node 24.21.0, npm 11.19.0            | Aprovado  | Aprovado | Aprovado | 3/3 aprovados | Aprovado | `npm ci` e `npm run check` em cópia limpa |
| E01   | Claude: Linux, Node 22.23.4, npm 10.9.9             | Aprovado  | Aprovado | Aprovado | 3/3 aprovados | Aprovado | `npm run check` com saída 0               |
| E01   | Desenvolvedor: Windows 11, PowerShell, Node 24.21.0 | Pendente  | Pendente | Pendente | Pendente      | Pendente | **Pendente de validação local**           |
