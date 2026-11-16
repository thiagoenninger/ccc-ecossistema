# ADR-002 — TypeScript 6.0.x em vez de 7.x

- **Status:** Aceita (validada na E01)
- **Data:** 16/11/2026
- **Dependências:** Nenhuma.

## Contexto

Em 16/11/2026 a versão `latest` do TypeScript no npm é 7.0.2. O `typescript-eslint` 8.72.2 declara suporte a TypeScript `>=4.8.4 <6.1.0`.

## Problema

Qual versão do TypeScript garante lint tipado funcional sem forçar peer dependencies?

## Alternativas

1. TypeScript 7.0.2 com `--legacy-peer-deps`/overrides.
2. TypeScript 6.0.3 (suportado).
3. TypeScript 7 sem lint tipado.

## Decisão

Opção 2: `typescript` **6.0.3**, versão exata. Reavaliar quando o `typescript-eslint` declarar suporte a 7.x.

## Justificativa

A decisão foi condicionada a validação (aprovação do desenvolvedor). Validação na E01, em Node 24.21.0/npm 11.19.0 e em Node 22.23.4/npm 10.9.9: `typecheck`, `lint` (regras tipadas, incluindo `no-floating-promises`), testes, build e `format:check` aprovados; provas negativas confirmaram que lint e typecheck reprovam código incorreto.

## Consequências

Não usa recursos exclusivos do TypeScript 7. A migração futura será uma etapa própria, com novo teste de compatibilidade.
