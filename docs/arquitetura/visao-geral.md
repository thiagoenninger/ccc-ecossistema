# Visão geral da arquitetura

Versão 1.0 — 16/11/2026. Resumo; detalhes no [planejamento](../desenvolvimento/planejamento-inicial.md) e nos [ADRs](../decisoes/README.md).

## Aplicações

| Aplicação                | Equipamento                                                | Interação       | Fase    |
| ------------------------ | ---------------------------------------------------------- | --------------- | ------- |
| Espaço Expositivo        | Painel touch                                               | Toque           | 2 (MVP) |
| Mídias Automatizadas     | TVs (horizontal e vertical, inclusive Sala Afonso Schmidt) | Passiva         | 3       |
| Dashboard Administrativo | Computador                                                 | Mouse/teclado   | 5       |
| Linha do Tempo           | Tablets (5 previstos, independentes)                       | Toque           | 6       |
| Biblioteca Digital       | Totem e tablets de leitura                                 | Toque + teclado | 7       |
| Futuro & Perspectivas    | Painel touch                                               | Toque           | 8       |

## Camadas

1. **Apresentação:** apps React + componentes compartilhados (`packages/ui`) sobre tokens do Design System (`packages/design-tokens`).
2. **Contratos e acesso a dados:** `packages/types` e `packages/data-access` (repositório assíncrono; implementação local no MVP; Firebase depois).
3. **Offline (Fase 4):** manifesto versionado, armazenamento local, versão ativa preservada, fila de eventos. Estratégia definitiva decidida na E13 (ADR-007).
4. **Backend (Fase 4):** Firebase Authentication, Firestore, Cloud Storage, Cloud Functions quando necessárias.

## Separação de responsabilidades (offline)

Atualização de **código**, de **conteúdo**, de **configuração do equipamento** e envio de **eventos** são mecanismos distintos. Publicação e sincronização são estados distintos.

## Não implementado ainda

`arquitetura-tecnica.md` e `fluxo-de-dados.md` serão criados quando houver decisões a registrar (a partir da E03 e da Fase 4).
