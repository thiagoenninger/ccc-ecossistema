# ADR-013 — Contratos de conteúdo, repositório local e conteúdo de demonstração (E03)

- **Status:** Aceita (implementada na E03; aguardando validação local)
- **Data:** 16/11/2026
- **Dependências:** ADR-007 (contratos compatíveis com offline), ADR-009 (imagens de demonstração)

## Contexto

A E04 em diante precisa de dados tipados, carregados por uma interface estável, e de um acervo de teste que cubra formatos, títulos e estados. O ADR-007 exige repositório assíncrono, `resolveAssetUrl`, estados de arquivo e manifesto versionado desde o MVP.

## Decisões

1. **Dados como arquivos estáticos do app.** `apps/espaco-expositivo/public/content/` contém `index.json` (exposições publicadas e a padrão), `manifest.json` (versão, arquivos, tamanho, SHA-256) e `<id>/exhibition.json`. Trocar de exposição = trocar esses arquivos, sem alterar código.
2. **Contratos em `@ccc/types`** (`Exhibition`, `Artwork`, `Person`, `Category`, `ImageRef`, `Playback`, `ContentManifest`, `ContentIndex`, `AssetResolution`). `null` é explícito para "sem valor" (campo ausente é erro), para evitar leituras ambíguas.
3. **Validadores escritos à mão**, sem biblioteca (zod etc.): o conjunto é pequeno e evita dependência. Cada validador devolve todos os problemas com caminho (`$.artworks[3].image.width`). Reavaliar se os contratos crescerem na Fase 4.
4. **Imagens com texto alternativo obrigatório**, `fit` (`cover`/`contain`) e ponto focal opcionais.
5. **Tipos de obra (N-11):** `photo`, `document`, `map`, `audio`, `video`. `audio` e `video` exigem `playback`; os demais não podem tê-lo. Não há mídia de demonstração (formato e volume em aberto, N-23); o contrato já a suporta.
6. **Descrição com parágrafos** separados por linha em branco.
7. **`ExhibitionRepository`** (`@ccc/data-access`): `listExhibitions`, `getContentVersion`, `loadExhibition`, `resolveAssetUrl`. A implementação local valida o índice, o manifesto e cada exposição, confere as referências a arquivos e entrega somente obras publicadas, ordenadas por `order`.
8. **`resolveAssetUrl` nunca lança:** devolve `available` (com URL), `offline-unavailable`, `failed` ou `unpublished` (ADR-007). A disponibilidade local é injetada (`isAssetAvailable`); a camada offline da E13 fornecerá a real.
9. **Erros tipados:** `RepositoryError` com código `not-found`, `invalid-content` ou `load-failed`. Falhas não ficam em cache (permitem nova tentativa).
10. **Conteúdo de demonstração (ADR-009):** gerado por `scripts/demo-content` (determinístico, versionado, conferido por `content:check` e por teste). Imagens em **SVG procedural**, sem filtros e sem texto; conteúdo fictício rotulado como demonstração; `LICENCAS.md` documenta a origem.
11. **Adiados:** tipos de evento de uso e de configuração de equipamento (dependem de N-16/E17). Não foram inventados agora.
12. **`content.html`** é ferramenta de desenvolvimento (fora do build), para inspecionar o conteúdo pelo repositório.

## Alternativas consideradas

- JSON importado no código (`import data from ...`): mistura dados e build; impede trocar exposição sem recompilar.
- Biblioteca de validação: mais concisa, porém uma dependência nova sem necessidade imediata.
- Imagens raster (PNG/JPEG) geradas: arquivos maiores e geração mais complexa; SVG basta para testar mosaico, legenda e contraste (a rasterização ocorre no navegador).

## Consequências

- O build de produção inclui `content/` (~0,8 MB de demonstração). Para a apresentação institucional, substituir por acervo real, com licenças (N-04, N-24).
- Fotografias reais (JPEG/WebP) exigirão derivados por tamanho; decisão na fase de conteúdo/offline.
- A E04 pode ler dimensões e `fit` direto do contrato para escolher o enquadramento e testar contraste em imagens claras, escuras, panorâmicas e verticais.
