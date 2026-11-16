# CCC — Validação e Homologação

Nada aqui declara conformidade. “Especificado” não significa “validado”. Resultados de teste inexistentes não foram inventados.

## 1. Legenda de situação

**Documentado** (especificado no DS) · **Avaliado em protótipo** (medido nos protótipos deste PDF) · **Depende da implementação** · **Exige hardware real**.

## 2. Matriz de acessibilidade

| Critério | Situação | Observação |
|---|---|---|
| Contraste de legenda (WCAG 1.4.3 referenciado) | Avaliado em protótipo | Pior pixel na área da legenda, imagens sintéticas: título ≥ 6.02:1; meta ≥ 4.77:1. Acervo real pendente. |
| Contraste de componentes (1.4.11) | Documentado | Bordas e anéis definidos; medir na implementação |
| Tamanho de alvo (2.5.8) | Documentado | 48 px mínimo; 64–80 px adotados; testar com toque real |
| Foco visível (2.4.7, 2.4.11) | Documentado / Depende da implementação | Anel duplo definido; não obscurecido por sobreposições |
| Navegação por teclado | Depende da implementação | Ordem lógica e atalhos |
| Movimento reduzido | Documentado | Fusões de 120–200 ms |
| Legendas em vídeo | Documentado | Conteúdo de legendas depende da curadoria |
| Transcrições | Documentado | Conteúdo da curadoria |
| Alternativas textuais | Depende da implementação | Campo obrigatório no Dashboard |
| Identificação de controles | Documentado | Rótulo textual ou acessível |
| Estado não só por cor | Avaliado em protótipo | Texto + ícone + forma |
| Leitura em várias resoluções | Avaliado em protótipo | 1920×1080, 1366×768, 1280×800, 1080×1920 (referências, não hardware) |
| Uso em equipamento instalado | Exige hardware real | Distância, brilho, reflexos, toque |

## 3. Validação visual

Protótipos renderizados com imagens de demonstração; revisão visual de todas as telas e estados feita na geração. Pendente: revisão em tela física e com acervo real.

## 4. Validação funcional

Especificada, não executada: seleção imediata, retorno com contexto, Galeria↔Lista, busca (parcial/acento), inatividade, playlist segura. Execução por testes automatizados (Vitest/RTL) na implementação.

## 5. Desempenho

Não medido. Metas: animar só transform/opacity; ≤ 2 camadas grandes; decodificar imagens antes de animar; medir em cada equipamento (P-07).

## 6. Offline

Especificado; teste real pendente: carga com rede cortada; arquivos não baixados; atualização segura.

## 7. Testes em equipamentos reais

Pendentes: toque (alvos 64/72/80 px), legibilidade a distância, brilho, teclado virtual próprio × nativo, reprodução vertical.

## 8. Conteúdo e curadoria

Pendentes: textos, créditos, legendas, transcrições, eixos/cenários, enquadramento (cover/contain) por obra.

## 9. Hipóteses e pendências registradas

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
