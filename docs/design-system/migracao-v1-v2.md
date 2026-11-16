# CCC — Migração do Design System v1 para v2

A v2.0 é uma consolidação independente. Esta lista orienta o desenvolvimento a não reaproveitar o que foi substituído.

## 1. Componentes

| Situação | Itens |
|---|---|
| Preservados | Botão, Controle de ícone, Campo de busca (reformulado), Filtros, Paginação, Ficha editorial, Visualizador, Leitor de documento, Players, Tabela administrativa, Indicadores operacionais, Aviso de inatividade |
| Modificados | Mosaico (templates 1–9, cover/contain), Linha do Tempo (seleção imediata, alvos 72 px), Biblioteca (faixa ampliada, teclado), Legendas (platô de degradê), Estados de conteúdo (quatro tratamentos), Navegação do Dashboard |
| Descontinuados | Cartões com sombra e cantos; painéis sobrepostos da Linha do Tempo v1; busca em quatro cartões; menu lateral petróleo; pré-visualização com confirmação na Linha do Tempo; teto obrigatório de corte ≤ 35 %; recuo de opacidade do componente inteiro |
| Novos | Template 9; modos cover/contain; transição integrada seleção+ficha; teclado virtual; tokens de toque; metodologia única de contraste; módulo Mídias Automatizadas vertical/horizontal compartilhado |

## 2. Tokens

- **Preservados:** paleta primitiva, famílias tipográficas, espaçamentos, raios (acervo sem arredondar), z-index, breakpoints.
- **Alterados:** durações (120/280/420/480/560/360/800 ms substituem fast/base/slow/scene); easings (out/in-out/in); degradê de legenda (platô 68 %); recuo de imagem (só camada); tema padrão Galeria.
- **Novos:** `touch.*`, `mosaic.*`, `inactivity.*`, `reference-resolutions`, estilos tipográficos `tile-*`, `year-touch`, `signage-*`.

## 3. Padrões de layout substituídos

Cartões elevados → mosaicos assimétricos predefinidos; painéis empilhados → ladrilhos com legenda sobre imagem; busca em blocos → faixa de busca integrada.

## 4. Mudanças de navegação, interface e comportamento

Linha do Tempo: toque seleciona imediatamente. Espaço Expositivo: ficha abre em um toque e o retorno preserva o contexto. Biblioteca: alternador Galeria/Lista preserva contexto; teclado virtual. Mídias: último toque vence (sem fila); inatividade 120 s + 20 s.

## 5. Impactos na implementação

Trocar tokens de duração; reescrever o Mosaico com templates e modos; ajustar áreas de toque; adicionar estados de conteúdo; empacotar fontes locais; criar o módulo de Mídias; reaproveitar componentes preservados.

## 6. Requisitos funcionais preservados

Cinco capítulos e navegação livre; sincronia mosaico↔eixo; offline-first; regras de busca (parcial, sem acento, parte do título); publicação separada de sincronização; métricas anônimas; atualização segura de playlist; avanço em falha de mídia; Sala Afonso Schmidt passiva; Futuro & Perspectivas (eixos, horizontes, cenários, mídia ampliada, Para pensar).

## 7. Decisões que não devem mais ser usadas

Propostas A e B; menu lateral petróleo; confirmação de seleção na Linha do Tempo; ficha em duas etapas; corte ≤ 35 % obrigatório; recuo de opacidade do componente inteiro; fontes por CDN; mensagem “Sem registros entre 1921 e 1940…”.
