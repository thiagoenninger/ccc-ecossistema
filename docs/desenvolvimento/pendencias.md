# Controle de pendências

Atualizado em 16/11/2026 (após a aprovação da E03 e a entrega da E04).
Legenda de tipo: Hipótese provisória · Informação ausente · Decisão técnica · Ressalva · Conflito.

## Pendências do Design System (P-01…P-12) e ressalvas do prompt

| ID   | Descrição                                     | Tipo               | Resolver em                                        | Impacto | Impede implementação? | Resolução prevista                        |
| ---- | --------------------------------------------- | ------------------ | -------------------------------------------------- | ------- | --------------------- | ----------------------------------------- |
| P-01 | Opacidade 0,55 do recuo (só camada de imagem) | Hipótese           | Implementada na E04; revalidar em hardware         | Baixo   | Não                   | Token ajustável 0,45–0,7                  |
| P-02 | Duração de imagem em Mídias (20 s)            | Hipótese           | E10 + curadoria                                    | Médio   | Não                   | Configurável por tipo                     |
| P-03 | Teclado próprio × nativo                      | Decisão técnica    | E31                                                | Alto    | Não (Fase 7)          | Protótipo + teste no equipamento          |
| P-04 | Platô 68 % / fade 56 px com acervo real       | Hipótese           | Medido na E04 (sintético); E09/E38 (real)          | Alto    | Não                   | Medição reutilizável em `mosaic.html`     |
| P-05 | Alvos 72/64 px                                | Hipótese           | E09 (parcial); E38 (hardware)                      | Alto    | Não                   | Teste de toque real                       |
| P-06 | Itens por resolução (8/6/5/4)                 | Hipótese           | E05                                                | Médio   | Não                   | Validar 1366×768 e 1280×800               |
| P-07 | Tempos de movimento                           | Hipótese           | E06; E39                                           | Médio   | Não                   | Tokens; refinar em hardware               |
| P-08 | Hardware/resolução/orientação reais           | Informação ausente | Antes da E13 (ideal: antes da E09)                 | Alto    | Não p/ MVP            | **Levantamento com você**                 |
| P-09 | Conteúdo de Futuro & Perspectivas             | Informação ausente | Fase 8                                             | Alto    | Não                   | Curadoria                                 |
| P-10 | Perfis do Dashboard                           | Informação ausente | E19                                                | Médio   | Não                   | Definição de gestão                       |
| P-11 | Estratégia offline/cache                      | Informação ausente | **E13**                                            | Alto    | Não p/ MVP            | ADR com spike                             |
| P-12 | Textos curatoriais, créditos, legendas        | Informação ausente | Pré-apresentação                                   | Alto    | Não                   | Dados demo rotulados                      |
| A    | Mosaicos: proporções e configurações          | Ressalva           | **E04 (resolvida; aguarda validação)**             | Alto    | Não                   | C-01, C-04, C-05, C-06 (ADR-003, ADR-014) |
| B    | Degradê e contraste das legendas              | Ressalva           | **E04 (implementada e medida; aguarda validação)** | Alto    | Não                   | C-03 / ADR-004; medição na E04            |
| C    | Temporizadores                                | Ressalva           | E07                                                | Médio   | Não                   | C-07, C-08 / ADR-005                      |
| D    | Temas do Dashboard                            | Ressalva           | E19                                                | Baixo   | Não                   | C-09                                      |

## Pendências identificadas no planejamento v1.0 (N-01…N-13)

Situação atualizada: N-01, N-02 e N-03 foram **resolvidas** (ver tabela v1.1 abaixo). Decisões aprovadas em 16/11/2026: C-01, C-03 e C-04 (ADR-003 e ADR-004) e C-10 (ADR-010).

| ID   | Descrição                                                                                  | Origem               | Prioridade | Etapa                    | Resolução proposta                                                                                                  |
| ---- | ------------------------------------------------------------------------------------------ | -------------------- | ---------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| N-01 | Plano Técnico original não acessado                                                        | Esta análise         | Média      | Antes da E13 (ideal: já) | Você me envia o arquivo                                                                                             |
| N-02 | Versão de Node/npm/terminal local                                                          | §4.3                 | Alta       | E01                      | D-02                                                                                                                |
| N-03 | TS 7 incompatível com typescript-eslint                                                    | §4.2                 | Alta       | E01                      | ADR-002                                                                                                             |
| N-04 | Imagens de demonstração e licenças                                                         | Prompt §10.3         | Alta       | E03                      | Parcialmente atendida na E03 (imagens procedurais, ADR-013); fotos reais e licenças pendentes antes da apresentação |
| N-05 | Slots editoriais por template (C-05)                                                       | Handoff              | Alta       | E04                      | **Resolvida na E04** (aprovada em 16/11/2026; ADR-014)                                                              |
| N-06 | Mínimo de 230 px × templates (C-04)                                                        | Handoff              | Baixa      | E04                      | **Resolvida** (ADR-003; critério de 150 px para tablets na ADR-014)                                                 |
| N-07 | Balanceamento de 10+ obras por conjunto                                                    | Handoff §5 (omissão) | Média      | E05                      | §6.3                                                                                                                |
| N-08 | Adaptação dos templates a tablets (C-06)                                                   | Handoff              | Alta       | E04/E05                  | **Resolvida na E04** (escala proporcional; aprovada em 16/11/2026; ADR-014). Tela real e paginação na E05           |
| N-09 | TV no MVP (C-10)                                                                           | Handoff §18 × prompt | Média      | Agora                    | D-08                                                                                                                |
| N-10 | Regras de teto de inatividade (C-08)                                                       | Prompt               | Média      | E07                      | §6.4                                                                                                                |
| N-11 | Categoria "Mapas" aparece no catálogo demo do PDF; definir tipos de obra/mídia do contrato | PDF p. 38            | Média      | E03                      | **Resolvida na E03** (WorkKind: photo, document, map, audio, video; ADR-013)                                        |
| N-12 | Critérios online/offline de equipamento, deduplicação e retenção de eventos                | Prompt §6.6–6.7      | Média      | E17/E23                  | Heartbeat configurável; limiares na ADR da fase                                                                     |
| N-13 | Navegador/SO do painel (define uso de APIs modernas)                                       | P-08                 | Alta       | Antes da E09             | Levantamento                                                                                                        |

---

## Pendências adicionadas após a aprovação (v1.1)

| ID   | Descrição                                                                               | Origem             | Prioridade | Etapa                   | Status                                                                      |
| ---- | --------------------------------------------------------------------------------------- | ------------------ | ---------- | ----------------------- | --------------------------------------------------------------------------- |
| N-01 | Plano Técnico original não acessado                                                     | Planejamento v1.0  | Média      | —                       | **Resolvida** (arquivo recebido em 16/11/2026)                              |
| N-02 | Versão de Node/npm/terminal local                                                       | D-02               | Alta       | E01                     | **Resolvida** (Node 24.21.0; npm 11.19.0; Git 2.55.0.windows.5; PowerShell) |
| N-03 | TS 7 incompatível com typescript-eslint                                                 | ADR-002            | Alta       | E01                     | **Resolvida** (TS 6.0.3 validado)                                           |
| N-14 | Núcleo Guará: duas TVs de 32" + uma de 55"; sincronismo entre telas em aberto           | Plano Técnico §5.5 | Média      | Fase 3                  | Aberta                                                                      |
| N-15 | Parede Viva Digital da Biblioteca pode reutilizar Mídias                                | Plano Técnico §5.4 | Baixa      | Fase 3/7                | Aberta                                                                      |
| N-16 | Modelo de eventos anônimos (tipos, campos, dedup, expiração de sessão)                  | Plano Técnico §3   | Média      | E17                     | Aberta                                                                      |
| N-17 | Nomes e modelagem das coleções Firestore; manifesto com hashes                          | Plano Técnico §5.1 | Média      | E14–E16                 | Aberta                                                                      |
| N-18 | Biblioteca: tablets de leitura, limpeza de histórico, audiobooks, direitos de uso       | Plano Técnico §5.4 | Média      | Fase 7                  | Aberta                                                                      |
| N-19 | Dashboard: rascunho→revisão→publicação, agendamento, rollback, CSV, retenção            | Plano Técnico §5.2 | Média      | Fase 5                  | Aberta                                                                      |
| N-20 | Espaço Expositivo: agendamento e QR Codes (opcionais)                                   | Plano Técnico §5.3 | Baixa      | Pós-MVP                 | Aberta                                                                      |
| N-21 | Linha do Tempo: tela de espera e pré-carregamento de mídias                             | Plano Técnico §5.3 | Média      | Fase 6                  | Aberta                                                                      |
| N-22 | Watchdog do player de Mídias                                                            | Plano Técnico §5.5 | Média      | E10                     | Aberta                                                                      |
| N-23 | Formato, resolução e volume total dos vídeos                                            | Plano Técnico §5.6 | Alta       | Antes da E13            | Aberta (informação do desenvolvedor)                                        |
| N-24 | Política de licenciamento de livros, imagens, músicas e audiobooks                      | Plano Técnico §5.6 | Alta       | Fase 7 / pré-publicação | Aberta                                                                      |
| N-25 | `eslint-plugin-jsx-a11y` não suporta ESLint 10; lint de a11y JSX não adotado            | E01                | Média      | E09                     | Aberta                                                                      |
| C-13 | Biblioteca "reutiliza autenticação administrativa" × apps públicos sem privilégio admin | Plano Técnico §1   | Média      | Fase 7                  | Aberta (interpretação adotada: reutilizar infraestrutura/serviços)          |
| C-14 | Dashboard "cartões de uso" × DS "poucos cartões"                                        | Plano Técnico §5.2 | Baixa      | E19                     | Aberta                                                                      |

## Problemas conhecidos da E01

| ID   | Descrição                                                                                                                                                                               | Impacto                                               | Ação                                                                                                                    |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| K-01 | `npm audit` reporta 7 avisos moderados: `minimatch` (DoS via padrões glob) dentro de `typescript-eslint`. Só dependências de desenvolvimento; `npm audit --omit=dev` não reporta avisos | Baixo (ferramenta de lint, sem padrões glob externos) | Não aplicar `npm audit fix --force` (rebaixaria o typescript-eslint). Reavaliar a cada atualização do typescript-eslint |
| K-02 | Scripts da raiz não repassam argumentos extras ao Vite                                                                                                                                  | Baixo                                                 | Usar `npm run dev -w @ccc/espaco-expositivo -- --port 5174`                                                             |
| K-03 | Nada foi executado em Windows nem em PowerShell pelo Claude (ambiente Linux)                                                                                                            | Médio                                                 | Validação local obrigatória no checklist da etapa                                                                       |

## Problemas conhecidos da E02

| ID   | Descrição                                                                                                              | Impacto | Ação                                                                                                  |
| ---- | ---------------------------------------------------------------------------------------------------------------------- | ------- | ----------------------------------------------------------------------------------------------------- |
| K-04 | `surface-tile-no-image` não tem valor para o tema Papel no JSON; adotado `#262C2E` (hipótese, ADR-012)                 | Baixo   | Revalidado visualmente na E04 nos dois temas; permanece hipótese até a sua validação                  |
| K-05 | Peso 400 da IBM Plex Sans Condensed é empacotado, mas não consta como usado nos estilos do DS (~20 kB)                 | Baixo   | Remover se continuar sem uso na E09                                                                   |
| K-06 | Contraste dos pares de cores semânticas de texto não foi medido automaticamente (apenas conferência visual)            | Médio   | Legendas medidas na E04 (K-14); pares semânticos pendentes. WCAG 2.2 AA não é declarado como conforme |
| K-07 | Conferência visual feita em Chrome headless/Linux; renderização de fontes e cores no Windows e em tablet real pendente | Médio   | Validação local (checklist) e hardware (P-08)                                                         |

## Problemas conhecidos e pendências da E03

| ID   | Descrição                                                                                                                                                            | Impacto | Ação                                                                               |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---------------------------------------------------------------------------------- |
| K-08 | Imagens de demonstração são SVG procedurais; fotografias reais (JPEG/WebP) exigirão derivados por tamanho e revisão do tratamento de imagem                          | Médio   | Decidir na fase de conteúdo/offline; E04 testa contraste rasterizando no navegador |
| K-09 | O build de produção inclui `content/` (~0,8 MB de demonstração)                                                                                                      | Baixo   | Substituir por acervo real antes da apresentação institucional (N-04, N-24)        |
| K-10 | Sem mídia de demonstração (vídeo/áudio): formato, resolução e volume em aberto (N-23); o contrato (`playback`, legendas) está pronto, a galeria audiovisual é da E08 | Baixo   | Informação do desenvolvedor antes da E08/E13                                       |
| N-26 | Tipos de "Evento de uso" e "Configuração de equipamento" não foram criados na E03 (modelo de eventos em aberto, N-16)                                                | Baixo   | Definir na E17 junto ao modelo de eventos                                          |
| K-11 | Validadores escritos à mão: manutenção manual se os contratos crescerem                                                                                              | Baixo   | Reavaliar biblioteca de validação na Fase 4 (modelo Firestore)                     |

## Problemas conhecidos e pendências da E04

| ID   | Descrição                                                                                                                                                                                              | Impacto | Ação                                                                                               |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------- |
| K-12 | O piso analítico do título (pixel branco puro sob o platô de 68 %) recalculado é **6,02:1**; o Handoff §11 e o PDF dizem 6,06:1. Diferença pequena; a metodologia e o platô não mudam                  | Baixo   | Registrar a divergência; não alterar os documentos oficiais sem sua autorização                    |
| K-13 | A paginação muda de posição entre conjuntos com templates diferentes (slot × faixa abaixo da grade); por exemplo 9 obras → 5+4                                                                         | Médio   | Teste de toque em equipamento real (P-05); reavaliar paginação fixa se atrapalhar                  |
| K-14 | Contraste medido só com imagens sintéticas e por canvas (réplica do CSS: mesmas constantes e geometria). Não vale para o acervo real e não é declaração de conformidade WCAG                           | Alto    | Repetir com acervo real (P-04) e conferir no equipamento                                           |
| K-15 | Hipóteses da E04: classe "pequeno" com menor lado de referência < 250 px; menor lado ≥ 150 px nos tablets; valores de moldura (topo da grade, cabeçalho e rodapé) por resolução                        | Médio   | Validar em 1366×768 e 1280×800 reais (P-06, P-08) e na E05                                         |
| K-16 | A plataforma de entrega de arquivos do Claude acrescenta metadados de proveniência (C2PA) a SVG e PNG enviados, o que alterou os SVGs de demonstração e fez o `content:check` falhar no Windows na E03 | Médio   | Processo: arquivos gerados por script são regenerados no seu ambiente (`npm run content:generate`) |
| K-17 | Os laudos do `mosaic.html` (medição por canvas) só rodam no navegador; o Vitest cobre as funções puras, não a rasterização                                                                             | Baixo   | Executar a medição no Chrome do seu ambiente (checklist da etapa)                                  |
