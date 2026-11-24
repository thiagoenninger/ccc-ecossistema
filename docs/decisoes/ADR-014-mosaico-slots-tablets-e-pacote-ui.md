# ADR-014 — Mosaico: slots editoriais, adaptação a tablets, pacote `@ccc/ui` e medição de contraste (E04)

- **Status:** Aceita (decisões C-05 e C-06 aprovadas pelo desenvolvedor em 16/11/2026; implementação aguardando validação local)
- **Data:** 16/11/2026
- **Dependências:** ADR-003 (templates normativos), ADR-004 (gradiente), ADR-007, ADR-013

## Contexto

O Handoff §5.2 traz coordenadas apenas para 1920×1080 e vários templates não preenchem a área 1800×750 (C-05). Para 1366×768 e 1280×800 só há número de itens e margem (C-06). A única referência visual de slot é a página 38 do PDF (T8). A E04 precisava decidir esses pontos antes de consolidar o componente.

## Decisões aprovadas

### C-05 — Slots editoriais

1. O **slot editorial** é o retângulo livre de cada template, reservado a título da exposição e paginação:

   | Template | Slot (espaço da área 1800×750) | Tamanho                        |
   | -------- | ------------------------------ | ------------------------------ |
   | T3       | x 1350, y 370                  | 450×380                        |
   | T5       | x 0, y 490                     | 1800×260                       |
   | T6       | x 710, y 470                   | 1090×280                       |
   | T7       | x 990, y 470                   | 810×280                        |
   | T8       | x 990, y 470                   | 810×280 (documentado na p. 38) |

   T1, T2, T4 e T9 não têm slot: a grade ocupa toda a área.

2. **Template com slot:** título, subtítulo e paginação ficam no slot (segue a p. 38).
3. **Template sem slot:** a paginação vai para a **faixa abaixo da grade**, com o mesmo desenho. Os slots dos T3, T5, T6 e T7 e a faixa são **propostas** derivadas das áreas livres; só o T8 está documentado visualmente no Design System.
4. **Risco registrado (K-13):** a paginação muda de posição entre conjuntos com templates diferentes (por exemplo 9 obras → 5+4: T5 tem slot e T4 não). Alternativa recusada: paginação fixa no rodapé. Revisar com teste de toque em equipamento real (P-05).

### C-06 — Tablets

5. Cada template é escrito em coordenadas de referência e escalado **proporcionalmente** à largura da área: `escala = (largura da tela − 2 × margem) / 1800`. Margens: 60 px (1920), 36 px (1366), 32 px (1280).
6. O **intervalo de 10 px é mantido** em todas as escalas (cada retângulo perde `10 − 10 × escala` px). Acima da escala 1 o intervalo cresce proporcionalmente.
7. O template é escolhido pelo **número de itens**, conforme o Handoff §5.5: 1366×768 até 6 itens (T6); 1280×800 até 5 (T5). Perfil por largura: ≥ 1600 px "wide"; ≥ 1300 "compact"; abaixo disso "tablet" (valores de referência, P-06/P-08).
8. **Critério novo (hipótese a validar em hardware):** nos tablets o **menor lado de ladrilho é ≥ 150 px** nos templates permitidos por perfil (medido: 159 px no T6 a 1366 e 156 px no T5 a 1280). O mínimo de 230 px do Handoff §8 continua sem aplicação nos templates (ADR-003).
9. Título de ladrilhos não heróis ≥ 20 px nos tablets (Handoff §5.5): tokens complementares `tile-compact-title-size/line` (20/24 px), gerados pelo pipeline de tokens sem editar o JSON oficial.
10. Valores de moldura da tela (topo da grade: 150 px em 1920, 104 px em 1366, 112 px em 1280; cabeçalho e rodapé) são **propostas de harness**, não normativas. A tela real é da E05.

## Decisões técnicas da implementação

11. **Dados dos templates em `@ccc/design-tokens`** (`src/mosaic/templates.ts`), no espaço da própria área (origem 0,0), derivados do Handoff §5.2, com testes geométricos: dentro da área, sem sobreposição, intervalo ≥ 10 px, % do herói igual ao Handoff §5.1, T9 ≥ 20 %, slots só nos templates 3, 5, 6, 7 e 8.
12. **Layout como função pura** (`computeMosaicLayout`) que devolve retângulos em px; o componente só aplica posições. Sem algoritmo dinâmico.
13. **Classe de tamanho do ladrilho** (define o bloco de texto 142/74/66 px): herói = primeiro; "pequeno" se o menor lado de referência < **250 px**; senão "médio". **Hipótese** (o Handoff não define o critério); verificada pela medição de contraste.
14. **Novo pacote `@ccc/ui`** (previsto na estrutura do monorepo): `Mosaic`, `ArtworkTile` (imagem interativa), `Caption`, `ContentStateArt`, `computeImagePlacement`. Dependências: `@ccc/design-tokens`, `@ccc/types`, `react`, `react-dom` (mesmas versões exatas do app; nenhuma dependência nova no lockfile além do workspace).
15. **Ladrilho = `<button>` nativo.** Nome acessível "título. meta" (mais a mensagem do estado); `aria-current` na obra selecionada; foco pelo anel duplo global; um toque chama `onSelect` (a abertura da ficha é da E05/E06). A legenda é decorativa para tecnologias assistivas (o nome vem do botão).
16. **Recuo (P-01):** só a camada de imagem usa `--opacity-image-secondary` (0,55). Legenda, barra de seleção e foco não herdam a opacidade.
17. **Estados de conteúdo (Handoff §9):** sem imagem, offline, falha e em preparação, cada um com rótulo textual, ícone ou padrão (nunca só cor) e textos públicos do Handoff. Uma imagem que falha ao carregar passa a "falha"; mudando a URL, tenta de novo.
18. **Largura medida por `clientWidth`** (ignora transformações de escala), com `ResizeObserver` quando existe; a propriedade `width` permite fixar o valor (testes e harness).
19. **Medição de contraste no navegador** (`mosaic.html`): rasteriza o ladrilho sem legenda em canvas 2D, aplica o degradê, mede o retângulo do texto e toma o pixel mais claro (Handoff §11). Funções puras (luminância, razão, pior pixel, piso analítico) têm testes no Vitest; a rasterização só roda no navegador. Sem nova dependência.
20. **`mosaic.html`** é ferramenta de desenvolvimento (fora do build), como `tokens.html` e `content.html`. Aceita parâmetros de URL para capturas (`template`, `viewport`, `theme`, `fit`, `state`, `recede`, `selected`, `scale`, `bare`, `autorun=contrast`).

## Alternativas consideradas

- **Paginação sempre fixa no rodapé** (recusada na C-05): estável para o toque, mas contraria a p. 38 e deixa áreas vazias.
- **Nenhum slot** (recusada): uniforme, porém empobrece os templates de 5 a 8 itens.
- **Reduzir itens para manter 230 px nos tablets** (recusada na C-06): ladrilhos maiores, mas mais conjuntos e afastamento dos números do Handoff §5.5.
- **Gabaritos próprios para tablet** (recusada): exigiria redesenho autorizado.
- **Posicionamento por porcentagem/`cqw` em CSS:** dispensa JavaScript, mas não mantém o intervalo de 10 px e depende de suporte a unidades de contêiner no navegador do painel (P-08, N-13).
- **Biblioteca de visão computacional ou Puppeteer para contraste:** dependência pesada; o canvas do navegador basta.

## Consequências

- A E05 usa `Mosaic` e `templateForCount`; decide onde mora a paginação quando não há slot e implementa o balanceamento de 10+ obras (N-07).
- Os valores de moldura e o critério de 150 px dependem de validação em hardware (P-05, P-06, P-08).
- O resultado do contraste vale só para imagens sintéticas (P-04); repetir com acervo real.
- Recalculado o piso analítico do título (pixel branco puro sob o platô de 68 %): **6,02:1**, e não 6,06:1 como no Handoff §11 (K-12).
