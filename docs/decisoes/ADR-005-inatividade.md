# ADR-005 — Temporizador de inatividade

- **Status:** Parcialmente aceita (regras de exceção na E07)
- **Data:** 16/11/2026
- **Dependências:** E07

## Contexto

Handoff §10 pode ser lido como 120 s + 20 s de aviso. O prompt define 120 s totais, aviso aos 100 s, aviso de 20 s incluído nos 120 s. O Handoff pausa o temporizador durante mídia/leitura sem limite; o prompt proíbe sessão abandonada indefinidamente.

## Problema

Como definir tempos e exceções?

## Alternativas

Ver proposta no planejamento §6.4.

## Decisão

**Aceito agora:** 120 s totais; aviso aos 100 s; 20 s de aviso incluídos; interação durante o aviso cancela e reinicia; parâmetros configuráveis por app/equipamento; contexto limpo ao fim. **Pendente (E07):** regras de teto para vídeo/áudio, leitura de documento e visualizador ampliado (propostas: duração do item + 120 s; 300 s; 180 s; são hipóteses).

## Justificativa

Segue o prompt e o Plano Técnico §6.

## Consequências

Valores a refinar em hardware real (P-07).
