# CCC — Design System — Handoff Técnico

Centro Cultural de Cubatão · Direção visual: Galeria Contemporânea (Proposta C) · versão 2.0

Este documento não depende de imagens. Os valores aqui são idênticos aos de `design-tokens.json` e do PDF “Design System Definitivo v2.0”. Nada aqui é código de produção: são especificações para implementação (monorepo npm Workspaces, React, TypeScript, Vite, CSS Modules, Firebase, Vitest, React Testing Library). Sem Tailwind. Telas do PDF são protótipos visuais, não código homologado. Conteúdos de exemplo são sempre identificados como demonstração.

## 1. Como usar

Tokens viram variáveis CSS (`--nome`) num pacote compartilhado do DS. Componentes compartilhados recebem variações por `props`; evite duplicar componentes por app. Elementos de versões anteriores que contradizem a Proposta C estão listados em “CCC — Migração do Design System v1 para v2”.

## 2. Identidade e direção de arte

Tema padrão **Galeria** (escuro, basalto). Variante **Papel** (claro). Imagens grandes, tipografia editorial, espaço negativo generoso, mosaicos assimétricos predefinidos, sem cartões com sombra, sem cantos arredondados no acervo (raio 0). Cores de núcleo são acento contido (marcadores), nunca fundo.

## 3. Cores

### 3.1 Primitivas

| Token | Valor |
|---|---|
| color-cal-50 | #FBF8F2 |
| color-cal-100 | #F5F0E6 |
| color-cal-200 | #ECE5D6 |
| color-cal-300 | #D9D0BC |
| color-cal-400 | #B9AF98 |
| color-osso-100 | #F1ECE0 |
| color-osso-300 | #C9C4B6 |
| color-ink-900 | #1E2224 |
| color-petroleo-900 | #0E2F36 |
| color-petroleo-800 | #14434C |
| color-petroleo-700 | #1D5560 |
| color-petroleo-600 | #2A6F7B |
| color-petroleo-100 | #DCEBEC |
| color-turquesa-500 | #3FA9A5 |
| color-turquesa-400 | #66C8C4 |
| color-turquesa-300 | #A5DEDB |
| color-turquesa-600 | #23807C |
| color-ambar-800 | #6E3507 |
| color-ambar-700 | #8F4608 |
| color-ambar-500 | #F5960E |
| color-ambar-300 | #F8C36B |
| color-guara-700 | #A92E16 |
| color-guara-500 | #D9472B |
| color-guara-300 | #F29B87 |
| color-mata-700 | #1F5E4B |
| color-mata-500 | #3D8A6E |
| color-mata-300 | #8CCBB0 |
| color-sepia-700 | #6A4E2F |
| color-sepia-500 | #9A754A |
| color-sepia-300 | #D8BF93 |
| color-madeira-500 | #8B5E3C |
| color-aco-700 | #454C50 |
| color-aco-600 | #5B6366 |
| color-aco-500 | #6B7479 |
| color-aco-300 | #A9B0B3 |
| color-basalto-950 | #0C0E0F |
| color-basalto-900 | #101314 |
| color-basalto-850 | #15191A |
| color-basalto-800 | #1B2022 |
| color-basalto-700 | #262C2E |
| color-basalto-600 | #343B3E |
| color-azulejo-600 | #2F5FA3 |
| color-azulejo-300 | #9BBDEB |
| color-ocre-500 | #E9B72C |
| color-ocre-800 | #6B4A00 |

### 3.2 Semânticas por tema

| Token | Galeria | Papel |
|---|---|---|
| color-surface-page | #15191A | #F5F0E6 |
| color-surface-raised | #1B2022 | #FBF8F2 |
| color-surface-sunken | #101314 | #ECE5D6 |
| color-surface-inverse | #F5F0E6 | #15191A |
| color-surface-brand | #14434C | #1D5560 |
| color-surface-media | #0C0E0F | #0C0E0F |
| color-surface-scrim | #0C0E0FD6 | #0C0E0FB8 |
| color-text-primary | #F1ECE0 | #1E2224 |
| color-text-secondary | #C9C4B6 | #454C50 |
| color-text-muted | #A9B0B3 | #5B6366 |
| color-text-disabled | #6B7276 | #8B9194 |
| color-text-inverse | #1E2224 | #F5F0E6 |
| color-text-link | #66C8C4 | #1D5560 |
| color-text-accent | #F8C36B | #8F4608 |
| color-text-on-brand | #0E2F36 | #F5F0E6 |
| color-text-on-brand-surface | #F5F0E6 | #F5F0E6 |
| color-text-on-accent | #1E2224 | #1E2224 |
| color-text-on-media | #F1ECE0 | #F1ECE0 |
| color-brand-primary | #66C8C4 | #1D5560 |
| color-brand-primary-hover | #A5DEDB | #14434C |
| color-brand-primary-pressed | #3FA9A5 | #0E2F36 |
| color-brand-secondary | #66C8C4 | #66C8C4 |
| color-brand-secondary-strong | #66C8C4 | #23807C |
| color-brand-accent | #F5960E | #F5960E |
| color-header-bg | #101314 | #FBF8F2 |
| color-header-border | #343B3E | #B9AF98 |
| color-header-fg | #F1ECE0 | #1E2224 |
| color-header-fg-muted | #C9C4B6 | #454C50 |
| color-header-marker | #F5960E | #1D5560 |
| color-sidebar-bg | #101314 | #FBF8F2 |
| color-sidebar-border | #343B3E | #B9AF98 |
| color-sidebar-fg | #F1ECE0 | #1E2224 |
| color-sidebar-fg-muted | #C9C4B6 | #454C50 |
| color-sidebar-label | #A9B0B3 | #5B6366 |
| color-sidebar-hover | #F1ECE014 | #1D55600F |
| color-sidebar-active-bg | #66C8C426 | #DCEBEC |
| color-sidebar-active-fg | #A5DEDB | #14434C |
| color-sidebar-active-icon | #66C8C4 | #1D5560 |
| color-border-subtle | #262C2E | #D9D0BC |
| color-border-default | #343B3E | #B9AF98 |
| color-border-strong | #7C8386 | #7F7867 |
| color-border-focus | #66C8C4 | #14434C |
| color-state-hover | #F1ECE014 | #1D55600F |
| color-state-pressed | #F1ECE024 | #1D556022 |
| color-state-selected-bg | #66C8C42E | #DCEBEC |
| color-state-selected-border | #66C8C4 | #1D5560 |
| color-state-disabled-bg | #F1ECE00F | #1E22240D |
| color-success-fg | #8CCBB0 | #1F5E4B |
| color-success-bg | #8CCBB033 | #1F5E4B1A |
| color-warning-fg | #E9B72C | #6B4A00 |
| color-warning-bg | #E9B72C26 | #E9B72C33 |
| color-error-fg | #F29B87 | #A92E16 |
| color-error-bg | #F29B8730 | #A92E161A |
| color-info-fg | #9BBDEB | #2F5FA3 |
| color-info-bg | #9BBDEB2E | #2F5FA31A |
| color-marker-memoria | #D8BF93 | #9A754A |
| color-marker-industria | #A9B0B3 | #6B7479 |
| color-marker-natureza | #8CCBB0 | #3D8A6E |
| color-marker-cultura | #9BBDEB | #2F5FA3 |
| color-marker-futuro | #66C8C4 | #23807C |
| color-chart-1 | #66C8C4 | #1D5560 |
| color-chart-2 | #F5960E | #F5960E |
| color-chart-3 | #8CCBB0 | #3D8A6E |
| color-chart-4 | #D8BF93 | #9A754A |
| color-chart-5 | #9BBDEB | #2F5FA3 |
| color-chart-grid | #262C2E | #D9D0BC |

### 3.3 Degradê de legenda sobre imagem

Cor base `rgba(8,10,11,·)`; **platô de 68 %** cobrindo o bloco de texto + 10 px, depois fade linear de 56 px até 0. Altura = min(altura do ladrilho, bloco de texto + 14 + 10 + 56). Bloco de texto: herói 142 px, médio 74 px, pequeno 66 px. Texto `#F1ECE0`; meta a 88 % de opacidade. Foco: anel duplo (turquesa-400 3 px + interno rgba(8,10,11,.85) 3 px). Seleção: barra âmbar-500 de 4 px na base.

**Recuo de imagens secundárias (hipótese P-01):** reduz a opacidade só da camada de imagem (0,55). Título, legenda, crédito, ano, indicadores e controles permanecem a 100 %.

## 4. Tipografia

| Família | Pilha |
|---|---|
| display | "Source Serif 4", "Source Serif Pro", Georgia, "Times New Roman", serif |
| sans | "IBM Plex Sans", system-ui, "Segoe UI", Arial, sans-serif |
| condensed | "IBM Plex Sans Condensed", "IBM Plex Sans", system-ui, "Arial Narrow", sans-serif |

Fontes servidas como arquivos locais (woff2) para funcionamento offline; sem CDN.

| Estilo | Família | Tamanho | Entrelinha | Peso |
|---|---|---|---|---|
| display-xl | display | 88 px | 92 px | 500 |
| display-lg | display | 64 px | 68 px | 500 |
| title-xl | display | 48 px | 54 px | 500 |
| title-lg | display | 38 px | 44 px | 500 |
| title-md | display | 30 px | 38 px | 600 |
| title-sm | display | 24 px | 32 px | 600 |
| tile-title-hero | display | 36 px | 40 px | 500 |
| tile-title | sans | 21 px | 26 px | 500 |
| tile-title-small | sans | 18 px | 22 px | 500 |
| tile-meta | condensed | 14 px | 18 px | 500 |
| reading-lg | display | 24 px | 40 px | 400 |
| reading | display | 20 px | 32 px | 400 |
| quote | display | 34 px | 46 px | 400 |
| caption-editorial | sans | 16 px | 24 px | 400 |
| body-touch | sans | 20 px | 30 px | 400 |
| body | sans | 16 px | 24 px | 400 |
| body-dense | sans | 14 px | 20 px | 400 |
| label | sans | 14 px | 20 px | 500 |
| label-touch | sans | 18 px | 24 px | 500 |
| button | sans | 18 px | 24 px | 600 |
| button-dense | sans | 14 px | 20 px | 600 |
| eyebrow | condensed | 14 px | 16 px | 600 |
| meta | condensed | 14 px | 18 px | 500 |
| year | display | 40 px | 40 px | 600 |
| year-touch | display | 32 px | 36 px | 600 |
| year-sm | display | 24 px | 24 px | 600 |
| data-xl | sans | 72 px | 72 px | 600 |
| data-lg | sans | 44 px | 44 px | 600 |
| data-md | sans | 28 px | 32 px | 600 |
| data-sm | sans | 14 px | 20 px | 500 |
| signage-title | display | 96 px | 100 px | 500 |
| signage-body | display | 44 px | 62 px | 400 |
| signage-credit | condensed | 28 px | 36 px | 500 |

Espaçamento entre letras: títulos de exibição −0,02em; títulos −0,01em; caixa-alta condensada +0,10em; eyebrow +0,14em. Coluna de leitura: 62 caracteres. Textos longos rolam sem reduzir a fonte.

## 5. Composição e mosaicos

Tela de referência 1920×1080. Área do mosaico: x 60–1860, y 150–900 (1800×750). Margem 60 px. Intervalo 10 px. Máximos por conjunto: Espaço Expositivo 8, Biblioteca 9, Futuro & Perspectivas 8. Conjuntos desiguais são balanceados (9→5+4; 12→6+6; 15→8+7). **Sem algoritmo dinâmico**: gabaritos predefinidos.

### 5.1 Matriz de templates 1–9

| N | Nome | Distribuição | Herói (% da área) | Primeiros blocos (L×A) | Espaçamento | Aplicações | Restrições |
|---|---|---|---|---|---|---|---|
| 1 | Obra única | Herói único centrado | 88.9 % | 1600×750 | 10 px · margem 60 px | Exposição/ficha com uma obra; contain para documentos | Não usar para 2+ obras; exceção à regra 28–45 % (89 %) |
| 2 | Duas obras | Dois blocos 61 % / 38 % | 61.1 % | 1100×750, 690×750 | 10 px · margem 60 px | Pares de proporções distintas (apaisado + retrato) | Exceção à regra de herói; proporção da obra decide a coluna |
| 3 | Três obras | Herói à esquerda + coluna + bloco | 47.8 % | 860×750, 470×750, 450×360 | 10 px · margem 60 px | Conjuntos mínimos de exposição | Herói 56 %: exceção documentada (poucos elementos) |
| 4 | Quatro obras | Herói + duas empilhadas + coluna alta | 50.0 % | 900×750, 440×370, 440×370… | 10 px · margem 60 px | Conjuntos curtos | Evitar com mais de 1 retrato |
| 5 | Cinco obras | Herói + coluna + 2 médios + coluna | 27.7 % | 780×480, 380×480, 310×235… | 10 px · margem 60 px | Conjuntos de 5; Futuro e Perspectivas | — |
| 6 | Seis obras | Herói + coluna + 2 médios + coluna + faixa base | 23.9 % | 700×460, 360×460, 360×225… | 10 px · margem 60 px | Linha do Tempo reduzida; tablets | Padrão para 1366×768 |
| 7 | Sete obras | Herói + coluna + 2 médios + bloco + 2 base | 21.8 % | 640×460, 330×460, 420×280… | 10 px · margem 60 px | Conjuntos de 7 | — |
| 8 | Oito obras | Referência do catálogo: herói + 5 blocos + 2 base | 21.8 % | 640×460, 330×460, 420×280… | 10 px · margem 60 px | Espaço Expositivo (máx. 8 por conjunto) | Máximo do Espaço Expositivo |
| 9 | Nove obras | Herói + colunas altas + 2 faixas largas na base | 21.8 % | 640×460, 280×225, 280×225… | 10 px · margem 60 px | Biblioteca Digital (máx. 9 por página, modo Galeria) | Somente Biblioteca; herói 21,8 % (mín. 20 % para N = 9) |

### 5.2 Coordenadas (x, y, largura, altura) em 1920×1080

| N | Retângulos |
|---|---|
| 8 | (60,150,640,460); (710,150,330,460); (1050,150,420,280); (1050,440,420,170); (1480,150,380,230); (1480,390,380,220); (60,620,420,280); (490,620,550,280) |
| 3 | (60,150,860,750); (930,150,470,750); (1410,150,450,360) |
| 2 | (60,150,1100,750); (1170,150,690,750) |
| 1 | (160,150,1600,750) |
| 5 | (60,150,780,480); (850,150,380,480); (1240,150,310,235); (1240,395,310,235); (1560,150,300,480) |
| 6 | (60,150,700,460); (770,150,360,460); (1140,150,360,225); (1140,385,360,225); (1510,150,350,460); (60,620,700,280) |
| 4 | (60,150,900,750); (970,150,440,370); (970,530,440,370); (1420,150,440,750) |
| 7 | (60,150,640,460); (710,150,330,460); (1050,150,420,280); (1050,440,420,170); (1480,150,380,460); (60,620,480,280); (550,620,490,280) |
| 9 | (60,150,640,460); (710,150,280,225); (710,385,280,225); (1000,150,280,460); (1290,150,280,225); (1290,385,280,225); (1580,150,280,460); (60,620,900,280); (970,620,890,280) |

### 5.3 Regra do herói e exceções

Regra geral (3–8 obras): herói entre 28 % e 45 % da área, salvo exceções. Exceções documentadas: 1 obra (herói até 89 %, modo contain); 2 obras (≈ 61 % / 38 %, a proporção decide a coluna); 3 obras (herói 56 %); poucos elementos; obras que pedem destaque curatorial; proporções incomuns (não forçar proporção). Template 9: herói mínimo de 20 %.

### 5.4 Modos de enquadramento (configuráveis por conteúdo)

- `cover`: preenche o ladrilho e pode cortar; ponto focal definido pelo curador (`object-position`). Para fotografias e imagens com corte autorizado. Não há mais limite obrigatório de corte (o antigo teto de 35 % foi retirado).
- `contain`: exibe a imagem inteira, sem distorção e sem corte automático; aceita espaço negativo. Para obras de arte, documentos históricos, mapas, fotografias com enquadramento original relevante, manuscritos e gravuras.

### 5.5 Adaptação por resolução (não é só escala)

| Referência | Equipamento típico | Itens simultâneos | Margem | Regras |
|---|---|---|---|---|
| 1920×1080 | TV/painel horizontal | até 8 (9 na Biblioteca) | 60 px | gabaritos 1–9 |
| 1366×768 | notebook / tablet largo | até 6 | 36 px | título ≥ 20 px; alvos ≥ 64 px |
| 1280×800 | tablet / painel compacto | até 5 | 32 px | alvos ≥ 64 px; legenda 2 linhas |
| 1080×1920 | TV vertical (reprodução) | 1 a 4 (mosaico vertical); passivo 1 | 60 px | tipografia de distância (signage) |
| 1440×900 · 1366×768 | computador administrativo | n/a (tabelas) | 36 px | densidade administrativa |

Esses valores são referências de projeto, não hardware confirmado (pendência P-08). Ao reduzir a resolução: reduzir itens simultâneos, trocar o template, preservar dimensões mínimas, manter legendas legíveis e áreas de toque, ajustar margens e espaçamentos.

## 6. Movimento

| Token | Valor (ms) | Uso |
|---|---|---|
| motion-micro | 120 | feedback de toque |
| motion-standard | 280 | mudança de estado |
| motion-mosaic-select | 420 | seleção no mosaico |
| motion-ficha-open | 480 | abertura integrada seleção + ficha |
| motion-historical-nav | 560 | navegação histórica |
| motion-return-catalog | 360 | retorno ao catálogo |
| motion-media-transition | 800 | transição de mídias automatizadas |

Easings: out `cubic-bezier(.22,.61,.36,1)`; in-out `cubic-bezier(.65,0,.35,1)`; in `cubic-bezier(.4,0,1,1)`. Anime apenas `transform` e `opacity`; use FLIP para continuidade espacial; decodifique a imagem (`decode()`) antes de animar; no máximo duas camadas grandes animando. **O último toque válido vence** (sem fila de animações). Selecionar + abrir ficha é uma transição integrada, não duas animações completas seguidas. Movimento reduzido: apenas fusões de opacidade de 120–200 ms. Tempos são referências a refinar após testes em hardware (P-07).

Variáveis CSS sugeridas: `--motion-micro: 120ms; --motion-standard: 280ms; --motion-mosaic-select: 420ms; --motion-ficha-open: 480ms; --motion-historical-nav: 560ms; --motion-return-catalog: 360ms; --motion-media-transition: 800ms;`

## 7. Navegação e comportamento por app

### 7.1 Linha do Tempo

Cinco capítulos; todos os tablets com a experiência completa; navegação livre entre capítulos; conteúdo complementar; offline. **Um toque num marcador ou ano seleciona imediatamente**: o mosaico se reorganiza, foto principal, ano e texto atualizam, e a animação (560 ms) dá continuidade. Estado ativo compartilhado entre mosaico e eixo. Não existe etapa de confirmação nem pré-visualização intermediária.

| Elemento | Visual | Área de toque |
|---|---|---|
| Marcador | 20 px (selecionado 28 px + anel 56 px) | 72 × 72 px |
| Ano | 22 px (selecionado 40 px) | 72 px de altura |
| Segmento de capítulo | linha 1 px (ativo 3 px); rótulo 18 px condensado | 72 px de altura |
| Setas | ícone 28 px | 80 × 80 px |

Área de toque pode exceder o visual, de forma discreta. Período vazio: mensagem **“Sem registros disponíveis no acervo para este período.”** e orientação para o próximo capítulo com registros.

### 7.2 Espaço Expositivo (MVP)

Telas: Abertura; Catálogo em mosaico; Ficha; Visualizador ampliado; Sobre a exposição; Artista/participante; Galeria audiovisual; TV automatizada. **Selecionar uma obra e abrir a ficha é um único toque** (realce → expansão → ficha, 480 ms). Ao voltar (360 ms) preservam-se exposição, categoria, conjunto, obra selecionada e posição de navegação; a obra aberta retorna destacada e com foco.

### 7.3 Biblioteca Digital

Faixa de controles (campo 72 px, categorias 64 px, filtros, ordem, alternador Galeria/Lista 64 px). Regras de busca preservadas: parcial, sem distinguir acentos, parte do título. Galeria × Lista preserva termo, categorias, filtros, ordem e conjunto de resultados. Telas: Galeria, Lista, busca com teclado, vazio, ficha, leitor de documento, player de áudio/vídeo, visualizador de imagem, estados.

**Teclado virtual (toque):** o campo é visível antes da interação; tocar no campo abre o teclado na base da tela (altura ≈ 340 px); layout QWERTY em português do Brasil com `ç`, acentos por toque longo (´ ` ^ ~), espaço, números (tecla “123”), apagar e “Buscar”; o campo e as sugestões/resultados essenciais permanecem visíveis acima do teclado (resultados reduzem para uma linha); Fechar ao tocar fora, Buscar ou recolher; teclado físico funciona em paralelo. **Avaliação:** teclado próprio garante layout, acentos e comportamento offline iguais em todos os equipamentos e não cobre os resultados; o nativo reduz trabalho, mas varia por sistema e pode cobrir o campo. **Recomendação do DS:** próprio. A decisão técnica final é do desenvolvimento (P-03).

## 8. Componentes compartilhados

| Componente | Finalidade | Variantes | Dimensões | Tokens | Estados | Comportamento e acessibilidade | Apps | Escopo |
|---|---|---|---|---|---|---|---|---|
| Botão | Executar ação | Primário (preenchido), secundário (contorno), sublinhado (âmbar, ação textual), ícone+texto | Altura 64 px (toque), 40 px (admin); alvo mínimo 48 px | color-brand-primary, color-border-strong, size-touch-comfort | padrão, foco (anel duplo), pressionado, desabilitado (0,4) | Um toque executa; rótulo textual sempre; ícone nunca sozinho sem rótulo acessível | Todos | Compartilhado |
| Controle de ícone | Ação curta (fechar, ampliar, play) | Quadrado 64 / 80 px | 64 × 64 px (80 px em setas da Linha do Tempo e players) | size-touch-comfort, size-touch-large | padrão, foco, pressionado, desabilitado | Rótulo acessível obrigatório (aria-label); área de toque ≥ visual | Todos | Compartilhado |
| Campo de busca | Buscar no acervo | Faixa (padrão), com sugestões | Altura 72 px; fonte 34 px (serifada) | color-border-strong, type tile… | vazio, digitando, resultados, parcial, sugestão, sem resultado, offline, foco | Aceita parte do título; ignora acentos; botão de limpar 64 px | Biblioteca Digital | Compartilhado (props) |
| Campo de formulário | Entrada de dados na administração | Texto, área, data, seleção, upload | Altura 40 px; rótulo acima | color-border-default, spacing-3 | padrão, foco, erro, desabilitado | Rótulo visível; erro por texto + ícone | Dashboard | Específico do Dashboard |
| Filtros e seletores | Categorias, autor, tema, período, ordem | Abas de categoria (64 px), menus suspensos | Altura 64 px | color-border-focus, acc | padrão, selecionado (barra 3 px), foco | Mudança preserva termo e resultados; estado não só por cor | Biblioteca, Espaço Expositivo | Compartilhado |
| Alternador de visão | Galeria × Lista | Dois segmentos | Altura 64 px | acc | Galeria, Lista | Preserva termo, categorias, filtros, ordem e conjunto de resultados | Biblioteca Digital | Compartilhado |
| Navegação de capítulo | Pular entre capítulos | Segmentos no eixo | Altura de toque 72 px; rótulo 18 px condensado | touch.timeline-chapter-hit-h | padrão, ativo (linha 3 px), foco | Toque troca de capítulo imediatamente; navegação livre | Linha do Tempo | App |
| Eixo da Linha do Tempo | Selecionar ano/acontecimento | Padrão, ampliado (muitos eventos), poucos registros | Marcador 20 px (selecionado 28 + anel 56); toque 72 px; ano 22/40 px | touch.timeline-marker-hit, motion.historical-nav | padrão, selecionado, foco, sem registros | Toque seleciona imediatamente, sem confirmação; estado ativo compartilhado com o mosaico | Linha do Tempo | App |
| Mosaico | Distribuir obras em gabaritos 1–9 | Templates 1–9; cover/contain | Área 1800×750; intervalo 10 px; margem 60 px | mosaic.*, motion.mosaic-select | padrão, foco, selecionada, recuada (só imagem), sem imagem, offline, falha, não publicada | Gabaritos predefinidos; sem algoritmo dinâmico; último toque vence | Espaço Expositivo, Biblioteca, Linha do Tempo, Futuro | Compartilhado |
| Imagem interativa | Ladrilho de obra | Herói, médio, pequeno | Mín. 230 px de lado em 1920×1080 | tile-title*, caption-gradient | ver Mosaico | Legenda sempre legível; toque abre a ficha em um único gesto | Vários | Compartilhado |
| Legenda e crédito | Título, tipo, crédito | Sobre imagem (degradê), sob imagem | Título 21 px (herói 36 px), meta 14 px | color.caption-gradient, text-on-media | — | Platô de 68 % sobre o bloco de texto; método de contraste unificado | Todos | Compartilhado |
| Paginação de conjuntos | Navegar entre conjuntos | Segmentos 46×4 px + setas 64 px | Setas 64 px | color-text-primary | padrão, foco, desabilitada | Preserva posição ao voltar | Espaço Expositivo, Biblioteca, Futuro | Compartilhado |
| Ficha editorial | Detalhe de obra/livro/cenário | Imagem + coluna de texto | Coluna de leitura 62 ch | reading, title-lg | — | Texto rola sem reduzir a fonte; imagem permanece visível | Espaço Expositivo, Biblioteca, Futuro | Compartilhado |
| Visualizador de imagem | Ampliar obra | Tela cheia, fundo preto | Controles 64 px | z-overlay | padrão, ampliado | Pinça/duplo toque; legenda ao pé; fechar 64 px | Espaço Expositivo, Biblioteca, Futuro | Compartilhado |
| Leitor de documento | Ler PDFs e páginas | Página + navegação | Controles 64 px | — | padrão, ampliado, tamanho de texto | Página anterior/próxima; indicador “Página x de y” | Biblioteca Digital | App (reutilizável) |
| Player de áudio/vídeo | Reproduzir mídia | Áudio, vídeo (legendas) | Controles 80 px | size-touch-large | tocando, pausado, carregando, falha | Recuar/avançar 10 s; legendas e transcrição; pausa o temporizador de inatividade | Espaço Expositivo, Biblioteca | Compartilhado |
| Teclado virtual | Digitar no toque | Próprio (padrão), nativo do SO (alternativa) | Tecla 72 px de altura | touch.keyboard-key-h | padrão, pressionada, toque longo (acentos) | Não oculta o campo nem os resultados essenciais; teclado físico compatível | Biblioteca Digital | Compartilhado |
| Modal e sobreposição | Avisos e confirmações | Aviso de inatividade, confirmação | — | color-surface-scrim, z-modal | aberto, fechado | Foco preso; Esc/toque fora conforme caso | Todos | Compartilhado |
| Indicadores de foco e seleção | Mostrar foco e seleção | Anel duplo turquesa (foco), barra âmbar 4 px (seleção) | 3 px + 3 px | color.focus-ring, selected-bar | foco, selecionado | Nunca depende só de cor | Todos | Compartilhado |
| Estados vazio/carregando/offline | Informar situação | Sem imagem, offline, falha, não publicado, vazio, carregando | — | — | 4 tratamentos de conteúdo + 3 de tela | Mensagem curta pública; detalhe técnico só no log do Dashboard | Todos | Compartilhado |
| Aviso de inatividade | Preparar retorno ao início | Diálogo central | — | inactivity.* | contagem 20 s | Qualquer toque cancela; limpa contexto ao fim | Apps interativos | Compartilhado |
| Tabela administrativa | Listar registros | Densa, com seleção | Linha 44 px | spacing, border-subtle | padrão, selecionada, ordenável | Poucas bordas; cabeçalho condensado; estado em texto + ícone | Dashboard | Específico do Dashboard |
| Indicador operacional | Mostrar estado | Online, offline, pendente, falha, publicado, em preparação | Altura 24 px | color-success/warning/error/info | 7 estados de sincronização + 3 de publicação | Texto + ícone; nunca só cor | Dashboard | Específico do Dashboard |
| Navegação lateral do Dashboard | Navegar na administração | Fixa, clara (não petróleo) | Largura 248 px | color-sidebar-* | item ativo (barra 3 px) | Discreta; claro e escuro | Dashboard | Específico do Dashboard |
| Módulo de Mídias Automatizadas | Reprodução passiva | Horizontal, vertical | 1920×1080 · 1080×1920 | motion.media-transition | reproduzindo, transição, falha de mídia, moldura institucional | Sem controles; reprodução contínua; offline | Espaço Expositivo (TV), Sala Afonso Schmidt, demais | Compartilhado |

Anatomia detalhada, quando necessária, segue a tabela acima. Elementos antigos que contradizem a Proposta C (cartões com sombra, painéis sobrepostos da Linha do Tempo v1, busca em 4 cartões, menu lateral petróleo) não devem ser reativados.

## 9. Estados de conteúdo

| Estado | Quando | Tratamento visual | Mensagem pública |
|---|---|---|---|
| Sem imagem | Registro sem foto/capa | ladrilho tipográfico basalto-700, rótulo “sem imagem” | “Sem imagem para esta obra.” |
| Indisponível offline | Dado presente, arquivo não baixado | fundo listrado + ícone de sincronização + “Offline” | “Este arquivo ainda não está neste equipamento.” |
| Falha de carregamento | Arquivo devia estar disponível | contorno tracejado turquesa/guará + ícone de alerta + “Falha” | “Não foi possível abrir agora. Tente outra obra.” |
| Não publicado | Existe só na administração | contorno pontilhado + “Em preparação” (somente na administração) | não é exibido ao visitante |

Informação técnica (códigos, caminhos, tentativas) aparece apenas nos registros do Dashboard. Estado nunca depende só de cor.

## 10. Inatividade

Valores iniciais: **120 s** sem interação; **20 s** de aviso final; **qualquer toque cancela imediatamente**; sem interação, volta ao início. Configurável por app e por equipamento. O temporizador é **pausado** durante vídeo, áudio e leitura de documento em andamento; **reiniciado** a cada toque, rolagem ou tecla; **ignorado** em apps passivos (Mídias Automatizadas). Ao encerrar a sessão, o contexto do visitante anterior (busca, filtros, obra aberta, posição) é limpo.

## 11. Legibilidade e contraste — metodologia única

Métrica de decisão: **pior caso na área ocupada pela legenda** (não luminância média).

1. Renderizar o ladrilho **sem legenda**, com o degradê aplicado.
2. Medir apenas o retângulo realmente ocupado pelo bloco de texto (margens 18 px à esquerda, 46 px à direita, 14 px da base; altura do bloco por tipo).
3. Calcular a luminância relativa de **cada pixel** desse retângulo e tomar o **maior valor (pixel mais claro)**.
4. Razão = (L_texto + 0,05) / (L_pior pixel + 0,05), com texto #F1ECE0 (meta a 88 %).
5. O percentil 99 é reportado apenas como informação; o critério é o pior pixel.
6. Imagens de luminâncias distintas: todas as 9 imagens de demonstração, todos os gabaritos 1–9 e todos os ladrilhos (405 combinações por modo).
7. O degradê é parte do sistema: o platô de 68 % garante piso analítico para um pixel branco puro de **6.06:1** (título).
8. Estados interativos: foco (anel) e seleção (barra) ficam fora da área de texto; o recuo de imagens secundárias age só na camada de imagem e eleva a razão.

Critérios WCAG 2.2 referenciados (sem declarar conformidade): 1.4.3 contraste (mínimo), 1.4.11 contraste de componentes não textuais, 2.4.7 foco visível, 2.4.11 foco não obscurecido (mínimo), 2.5.8 tamanho do alvo (mínimo).

| Modo | Combinações | Pior título | Pior meta (88 %) | Mín. p99 (info) | Mín. média (info) |
|---|---|---|---|---|---|
| cover | 405 | 6.02:1 | 4.77:1 | 6.39:1 | 6.73:1 |
| contain | 405 | 6.17:1 | 4.89:1 | 6.42:1 | 7.12:1 |
| cover-dim | 9 | 10.56:1 | 8.37:1 | 10.69:1 | 10.94:1 |

Com imagens **sintéticas de demonstração**. Resultado não é garantia para o acervo real; repetir com imagens reais (P-04). A medição de Entrega 1 usava o percentil 99 e gradiente menor; o gradiente foi corrigido (platô) por falhar no pior pixel em ladrilhos pequenos sobre imagens muito claras.

## 12. Mídias Automatizadas e Sala Afonso Schmidt

Módulo compartilhado. Horizontal (TV do Espaço Expositivo e demais equipamentos passivos, 1920×1080 referência) e vertical (Sala Afonso Schmidt, 1080×1920 referência). Composições: foto, vídeo (com legendas), texto curatorial, depoimento, citação, poema, documento, abertura institucional, moldura institucional. Leitura a distância: imagens grandes, poucos elementos simultâneos, sem mosaicos densos, texto mínimo de 44 px (tipografia signage). Regras: reprodução contínua; sem controles do visitante; transições suaves (800 ms); durações configuráveis; reprodução offline; continuidade em perda de conexão; avanço automático em falha de mídia; moldura institucional quando não há conteúdo válido; atualização segura da playlist (aplicar só ao fim do item/ciclo). Diferenças configuráveis por equipamento: orientação, resolução de referência, durações, playlist alvo, transição, tipografia de distância.

**Sala Afonso Schmidt:** uma TV vertical, sem tablet, sem toque, sem navegação do visitante; programação automática definida pela curadoria; instalação audiovisual museográfica (não slides). Exemplos: foto histórica com texto, depoimento em vídeo, poema, citação, documento histórico, texto biográfico, identificação institucional.

## 13. Dashboard Administrativo

Mesma identidade, foco em eficiência: sem mosaicos assimétricos em tabelas ou formulários; poucas bordas e cartões; hierarquia tipográfica clara; superfícies neutras; estados operacionais claros; menu lateral discreto **claro** (não petróleo); variantes clara e escura. Largura do menu 248 px; linha de tabela 44 px; altura de controle 40 px.

Telas: acesso (login, recuperação de senha, erro, sessão expirada); visão geral; conteúdos (lista, busca, filtros, criar, editar, arquivar, excluir, upload, prévia); gestão por núcleo; exposições (em preparação, publicada, arquivada; obras, artistas, categorias, ordem, imagem principal, enquadramento cover/contain, prévia); playlists (cadastro, ordem, duração, orientação, equipamento-alvo, prévia, publicar, versão ativa); equipamentos (identificação, app, estado, última comunicação, última sincronização, versão do conteúdo, falhas, configurações); publicação e sincronização (estados separados; 7 estados de sincronização); estatísticas (anônimas e agregadas; sem identificação pessoal; indicadores da primeira versão × futuros); configurações (geral, acesso, preferências, inatividade, reprodução, sistema). Estados: carregando, sem registros, erro de conexão, falha de upload, publicando, confirmação de exclusão, alterações não salvas, sucesso, sem permissão.

## 14. Offline

Todos os apps operam offline com conteúdo e fontes locais. Itens não baixados exibem o estado “indisponível offline”. Atualizações de conteúdo são aplicadas de forma segura, sem interromper a sessão. A estratégia técnica de cache é responsabilidade do desenvolvimento (P-11).

## 15. Equipamentos e aplicativos

| Equipamento | App responsável | Orientação | Interação | Resolução de referência | Componentes reutilizados | Dependência de configuração | Offline |
|---|---|---|---|---|---|---|---|
| Corredor — Núcleo Guará | Mídias Automatizadas | Horizontal* | Passiva | a confirmar | Módulo de Mídias Automatizadas | Playlist por equipamento | Sim |
| Museu da Indústria — Linha do Tempo | Linha do Tempo | a confirmar | Toque | a confirmar | Eixo, mosaico, ficha, visualizador | Conteúdo publicado | Sim |
| Museu da Indústria — Transformação Ambiental | Mídias Automatizadas | a confirmar | Passiva (salvo interação definida) | a confirmar | Módulo de Mídias Automatizadas | Playlist | Sim |
| Museu da Indústria — Sala de Vídeo | Mídias Automatizadas | Horizontal* | Passiva | a confirmar | Módulo de Mídias Automatizadas | Playlist | Sim |
| Museu da Indústria — Futuro & Perspectivas | Futuro & Perspectivas | a confirmar | Toque | a confirmar | Mosaico, ficha, visualizador, gráficos | Conteúdo publicado | Sim |
| Sala Afonso Schmidt | Mídias Automatizadas (vertical) | Vertical | Passiva, sem toque | 1080×1920 (referência de projeto) | Módulo de Mídias Automatizadas | Playlist vertical | Sim |
| Espaço Expositivo — Painel Touch | Espaço Expositivo | a confirmar | Toque | 1920×1080 (referência) | Mosaico, ficha, visualizador, player | Exposição publicada | Sim |
| Espaço Expositivo — TV | Mídias Automatizadas (horizontal) | Horizontal | Passiva | 1920×1080 (referência) | Módulo de Mídias Automatizadas | Playlist | Sim |
| Biblioteca | Biblioteca Digital | a confirmar | Toque + teclado | 1920×1080 / 1366×768 (referência) | Busca, mosaico, lista, leitor, teclado | Acervo publicado | Sim |
| Administração | Dashboard Administrativo | Horizontal | Mouse/teclado | 1440×900 / 1366×768 (referência) | Tabelas, formulários, indicadores | Firebase (a definir pelo desenvolvimento) | Parcial (rascunho local) |

`a confirmar` = informação não fornecida; nenhuma especificação de hardware foi inventada. `*` hipótese provisória.

## 16. Acessibilidade

Matriz completa em “CCC — Validação e Homologação”. Princípios: contraste pelo método da seção 11; alvos de toque ≥ 48 px (≥ 64 px no uso público); foco visível (anel duplo); navegação por teclado; movimento reduzido; legendas e transcrição em vídeo/áudio; alternativas textuais; controles com rótulo; estados não só por cor; leitura em várias resoluções; uso nos equipamentos instalados.

## 17. Pacote compartilhado do DS

Organização sugerida (decisão final do desenvolvimento): `packages/ds-tokens` (JSON → CSS variables), `packages/ds-components` (CSS Modules, React/TypeScript), `apps/*`. Testes com Vitest e React Testing Library para comportamento (seleção, retorno com contexto, inatividade, busca), não para pixel. Protótipos deste DS não são código homologado.

## 18. Espaço Expositivo — escopo do MVP (sem Firebase nem Dashboard)

**Componentes mínimos compartilhados:** Botão, Controle de ícone, Alternador/abas de categoria, Mosaico + Imagem interativa + Legenda, Paginação de conjuntos, Ficha editorial, Visualizador de imagem, Player de áudio/vídeo, Modal/Aviso de inatividade, Indicadores de foco e seleção, Estados (sem imagem, offline, falha), Módulo de Mídias Automatizadas (TV). **Conteúdo:** arquivo local de demonstração (JSON + imagens) identificado como demonstração. **Navegação:** Abertura → Catálogo → Ficha → Visualizador; Catálogo ↔ Sobre/Artista/Galeria audiovisual; inatividade volta à Abertura. **Responsivo:** 1920×1080 (referência), 1366×768, 1280×800. **Offline:** tudo local. **Critérios de aceite visuais:** margens 60 px, intervalo 10 px, legendas pelo método da seção 11, foco visível. **Funcionais:** um toque abre a ficha; voltar preserva exposição, categoria, conjunto, obra e posição; último toque vence; inatividade 120 s + 20 s; contexto limpo ao fim.

## 19. Restrições de implementação

Sem Tailwind. Sem conteúdo histórico inventado. Nenhum resultado de teste foi inventado. WCAG 2.2 AA não é declarada. Valores marcados como hipótese estão na matriz de pendências.

## 20. Pendências e hipóteses

| ID | Tipo | Descrição | Ação | Prioridade |
|---|---|---|---|---|
| P-01 | Hipótese provisória | Recuo de imagens secundárias: opacidade 0,55 aplicada só à camada de imagem | Validar em tela real; ajustar entre 0,45 e 0,7 | Baixa |
| P-02 | Hipótese provisória | Duração padrão de imagem em Mídias Automatizadas: 20 s | Definir com a curadoria por tipo de conteúdo | Média |
| P-03 | Decisão técnica | Teclado virtual próprio × nativo do SO (recomendação: próprio) | Decisão final do desenvolvimento após teste no equipamento | Alta |
| P-04 | Hipótese provisória | Platô da legenda em 68 % de opacidade e fade de 56 px | Reconferir com imagens reais do acervo | Alta |
| P-05 | Hipótese provisória | Alvos de toque da Linha do Tempo (72 px) e da Biblioteca (64 px) | Teste de toque em painel real | Alta |
| P-06 | Hipótese provisória | Número de itens por resolução (8 / 6 / 5 / 4) | Teste em 1366×768, 1280×800, 1080×1920 | Média |
| P-07 | Hipótese provisória | Tempos de movimento aprovados são referências | Refinar após testes de desempenho em hardware | Média |
| P-08 | Informação ausente | Hardware, resolução e orientação reais de cada equipamento | Levantamento de equipamentos instalados | Alta |
| P-09 | Informação ausente | Eixos, horizontes e cenários reais do Futuro & Perspectivas | Conteúdo da curadoria | Alta |
| P-10 | Informação ausente | Perfis e permissões do Dashboard | Definição de gestão | Média |
| P-11 | Informação ausente | Estratégia técnica de cache/offline e atualização segura | Arquitetura (Claude Code) | Alta |
| P-12 | Informação ausente | Textos curatoriais, créditos e legendas de vídeo | Curadoria | Alta |
