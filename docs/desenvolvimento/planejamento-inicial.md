# CCC — Planejamento Inicial (Análise, Arquitetura, MVP e Roadmap) — v1.1

**Projeto:** Plataforma Digital Interativa — Centro Cultural de Cubatão
**Design System:** Galeria Contemporânea v2.0
**Data:** 16/11/2026
**Versão:** 1.1 — **aprovado pelo desenvolvedor em 16/11/2026** (ver §15, atualização v1.1)
**Nota:** as seções 0 a 14 preservam o texto da v1.0 (proposta). Onde algo mudou após a aprovação, a §15 prevalece.

---

## 0. Limitações desta análise (leia primeiro)

| Item                                                         | Situação                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Plano Técnico (`Plano_Tecnico_Cubatao_v2.docx`)              | **Não acessado na v1.0. Acessado na v1.1** (ver §15.2). Nada nas seções 0–14 derivava dele.                                                                                                                                                                                                                                                     |
| PDF do Design System (59 páginas)                            | Texto das 59 páginas lido integralmente. Referências visuais: rasterizei e **examinei apenas as páginas 4, 17, 38 e 39** (direção de arte, wireframes dos templates, abertura/catálogo, ficha/visualizador). As demais telas (Linha do Tempo, Biblioteca, Mídias, Dashboard, estados) serão examinadas visualmente na etapa que as implementar. |
| Handoff, Tokens JSON, Migração, Decisões Vigentes, Validação | Lidos integralmente.                                                                                                                                                                                                                                                                                                                            |
| Versões de pacotes                                           | Consultadas no registro npm em 16/11/2026. **Ainda não foram instaladas juntas**; a compatibilidade real só é confirmada na Etapa 01.                                                                                                                                                                                                           |
| Hardware real                                                | Nenhuma informação (pendência P-08 do próprio DS).                                                                                                                                                                                                                                                                                              |

---

## 1. Inventário dos documentos

| #   | Documento                                  | Acesso integral                                | Finalidade                                        | Principais informações                                                                                                                                                                                             | Inconsistências / pendências                                                                          |
| --- | ------------------------------------------ | ---------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------- |
| 01  | Design System Definitivo v2.0 (PDF, 59 p.) | Texto: sim. Imagens: parcial (4 de 59 páginas) | Aparência, composição, componentes, telas por app | 21 seções; 9 templates de mosaico; telas do Espaço Expositivo (abertura, catálogo 8, ficha, visualizador, sobre, artista, galeria audiovisual, TV, aviso de inatividade); matriz de equipamentos; matriz P-01…P-12 | Ver §3.3 (C-01…C-12)                                                                                  |
| 02  | Handoff Técnico (.md)                      | Sim                                            | Especificação implementável                       | Cores/tipografia, coordenadas dos templates (1920×1080), movimento, componentes, estados, inatividade, método de contraste, escopo do MVP (§18)                                                                    | Gradiente diverge do JSON (C-02); §18 inclui TV no MVP (C-10)                                         |
| 03  | design-tokens.json                         | Sim                                            | Base de tokens                                    | Cores primitivas e semânticas (Galeria/Papel), tipografia, espaçamento, toque, movimento, inatividade, z-index                                                                                                     | **Não contém as coordenadas dos templates** (só área, gap, margem); gradiente em % diverge do Handoff |
| 04  | Migração v1→v2 (.md)                       | Sim                                            | Evitar padrões descontinuados                     | Lista de preservados/modificados/descontinuados/novos                                                                                                                                                              | Sem conflito. Serve de lista de proibições                                                            |
| 05  | Decisões Vigentes (.md)                    | Sim                                            | Matriz de decisões funcionais                     | 16 áreas; "prevalece a coluna Decisão vigente"                                                                                                                                                                     | "Menu lateral claro" vs tokens com sidebar escura no tema Galeria (C-09)                              |
| 06  | Validação e Homologação (.md)              | Sim                                            | Critérios, matriz de acessibilidade, P-01…P-12    | Nada validado em hardware; contraste medido só com imagens sintéticas                                                                                                                                              | Pendências abertas (ver §13)                                                                          |
| 07  | Plano Técnico original (.docx)             | **Não**                                        | Arquitetura funcional inicial                     | —                                                                                                                                                                                                                  | Solicito uma versão alternativa                                                                       |

---

## 2. Entendimento do projeto

Seis aplicações sobre uma fundação visual comum (Galeria Contemporânea), mantidas por uma pessoa: **Espaço Expositivo** (painel touch, primeiro a entregar), **Linha do Tempo** (5 capítulos, tablets independentes), **Futuro & Perspectivas**, **Biblioteca Digital**, **Mídias Automatizadas** (módulo único para TVs, inclusive a Sala Afonso Schmidt vertical e a TV do Espaço Expositivo) e **Dashboard Administrativo**.

Requisitos transversais: offline-first obrigatório; fontes e conteúdo locais; atualização segura com preservação da última versão válida; separação entre código, conteúdo, configuração do equipamento e eventos; métricas anônimas; WCAG 2.2 AA como meta (sem declarar conformidade).

O Espaço Expositivo é orientado por dados: uma nova exposição não pode exigir mudança de código. Isso define o contrato de dados desde o primeiro dia.

---

## 3. Matriz de requisitos

### 3.1 Requisitos confirmados (instruções do projeto + documentos oficiais)

| ID   | Requisito                                                                                                                               | Fonte                  |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------- |
| R-01 | Monorepo npm Workspaces; React + TS + Vite; CSS Modules + CSS Variables; sem Tailwind/pnpm/Yarn/TanStack Query                          | Instruções §4          |
| R-02 | Tema Galeria padrão (museográficas); Papel variante; Dashboard com ambos                                                                | Handoff §2, Instruções |
| R-03 | Fontes locais (Source Serif 4, IBM Plex Sans, IBM Plex Sans Condensed), sem CDN                                                         | Handoff §4             |
| R-04 | Mosaicos por templates predefinidos 1–9, sem algoritmo dinâmico; margem 60 px, intervalo 10 px; máx. 8 por conjunto (Espaço Expositivo) | Handoff §5             |
| R-05 | Modos cover/contain configuráveis por conteúdo; raio 0 no acervo                                                                        | Handoff §5.4           |
| R-06 | Selecionar obra e abrir ficha = um toque; retorno preserva exposição, categoria, conjunto, obra e posição                               | Handoff §7.2           |
| R-07 | Animar só `transform`/`opacity`; FLIP; `decode()` antes de animar; máx. 2 camadas grandes; último toque vence                           | Handoff §6             |
| R-08 | Inatividade: 120 s total, aviso de 20 s incluídos, qualquer toque cancela, limpa contexto                                               | Instruções §4.5.C      |
| R-09 | Estados de conteúdo: sem imagem, indisponível offline, falha, não publicado; mensagens públicas curtas                                  | Handoff §9             |
| R-10 | Sala Afonso Schmidt: TV vertical passiva via Mídias Automatizadas                                                                       | Decisões Vigentes      |
| R-11 | Dados do MVP fora dos componentes React; conteúdo de demonstração identificado como tal                                                 | Prompt §10.3           |
| R-12 | Nenhum conteúdo histórico inventado                                                                                                     | PDF §1                 |

### 3.2 Recomendações técnicas (minhas, sujeitas à sua aprovação)

| ID     | Recomendação                                                                                                                                             |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REC-01 | Pacotes internos consumidos como **código-fonte TypeScript** (sem build por pacote); apps compilam tudo via Vite                                         |
| REC-02 | **TypeScript 6.0.x**, não 7.x (ver ADR-002 proposto, §4)                                                                                                 |
| REC-03 | MVP **sem React Router**: navegação por estado (`useReducer` + Context), pois kiosk não precisa de URL/botão voltar do navegador                         |
| REC-04 | Sem Zustand no MVP; introduzir quando houver estado realmente compartilhado entre árvores (Dashboard/offline)                                            |
| REC-05 | Fontes via pacotes `@fontsource/*` (OFL-1.1; arquivos woff2 empacotados pelo Vite, funcionam offline) em vez de binários versionados                     |
| REC-06 | Dados de templates de mosaico em **arquivo derivado do Handoff §5.2**, com testes geométricos (sem sobreposição, dentro da área, % do herói)             |
| REC-07 | Animações com Web Animations API/CSS próprios (FLIP), sem biblioteca                                                                                     |
| REC-08 | Contratos de dados e de resolução de arquivos (`resolveAssetUrl`) já abstratos no MVP, para trocar por IndexedDB/Cache Storage depois                    |
| REC-09 | Teclado virtual próprio (alinhado ao DS), decisão final só após teste no hardware (P-03)                                                                 |
| REC-10 | Teste de ponta a ponta (Playwright) apenas na Fase 9, salvo necessidade antes; para capturas de tela da validação visual uso o navegador do meu ambiente |

### 3.3 Divergências e inconsistências encontradas (não resolvidas silenciosamente)

| ID   | Documentos                                                                     | Divergência                                                                                                                                                                                                                                      | Impacto                                  | Recomendação                                                                                                                                                                                                                                                       | Precisa de aprovação?              |
| ---- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| C-01 | Handoff §5.3 × §5.1/5.2                                                        | Regra "herói 28–45 %" não é satisfeita por **nenhum** template 3–8. Calculado a partir das coordenadas (herói ÷ 1800×750): T3 = 47,8 %; T4 = 50,0 %; T5 = 27,7 %; T6 = 23,9 %; T7 = T8 = 21,8 %. (T1 = 88,9 %, T2 = 61,1 %, T9 = 21,8 %.)        | Alto se alguém "corrigir" por percentual | Templates e coordenadas são normativos; a regra geral fica como orientação para novos templates. Já alinhado com a ressalva A do prompt                                                                                                                            | Sim (registro em ADR)              |
| C-02 | Handoff §5.1 (linha T3)                                                        | A coluna "Restrições" do T3 diz "Herói 56 %", mas a tabela e as coordenadas dão 47,8 %                                                                                                                                                           | Baixo                                    | Usar coordenadas (47,8 %); registrar erro de texto                                                                                                                                                                                                                 | Informativo                        |
| C-03 | Handoff §3.3 × JSON `caption-gradient`                                         | Handoff: platô 68 % cobrindo bloco de texto + 10 px, fade linear de 56 px; altura = mín(ladrilho; bloco+14+10+56). JSON: 4 paradas percentuais (0 → .86; .38 → .68; .74 → .30; 1 → 0), mais um teto `max 250 px / 64 %`                          | Alto (legibilidade, P-04)                | Seguir a metodologia do Handoff (ressalva B). Criar token complementar em px (`caption-gradient.plateau-opacity`, `.plateau-margin`, `.fade-length`, alturas de bloco 142/74/66) **sem editar** o JSON original. Validar com script que replica o §11 (pior pixel) | Sim (ADR)                          |
| C-04 | Handoff §8 (Imagem interativa: "mín. 230 px de lado") × §5.2                   | Vários ladrilhos dos templates têm lado menor que 230 px em 1920×1080: T8 (1050,440,420,**170**) e (1480,390,380,**220**); T6 (1140,150,360,**225**) e (1140,385,360,**225**); T9 (280×**225**)                                                  | Médio                                    | Os templates prevalecem; "230" passa a ser meta, não restrição. Registrar                                                                                                                                                                                          | Sim                                |
| C-05 | Handoff §5.2                                                                   | Vários templates **não preenchem** a área 1800×750: T3 deixa livre (1410–1860, 520–900); T5 ocupa só y 150–630; T6/T7/T8 deixam livre a base à direita. Só a página 38 do PDF (T8) mostra que esse espaço abriga título da exposição e paginação | Médio                                    | Definir "slot editorial" por template (retângulo reservado para título/paginação). Só o T8 está documentado visualmente; os demais serão propostos com base nas páginas de poucos itens e aprovados por você antes de consolidar o componente                      | Sim                                |
| C-06 | Handoff §5.5 × §5.2                                                            | Coordenadas existem só para 1920×1080. Para 1366×768 e 1280×800 só há nº de itens, margem e T6 como padrão                                                                                                                                       | Alto para a validação responsiva         | Escrever cada template como grade CSS em unidades proporcionais derivadas das coordenadas; para tablets usar o template do nº de itens (5 → T5, 6 → T6) com margens 36/32 px. Validar visualmente e ajustar                                                        | Sim (proposta antes de consolidar) |
| C-07 | Instruções §4.5.C × Handoff §10                                                | Handoff pode ser lido como 120 s + 20 s de aviso (=140 s). O prompt define 120 s totais (aviso aos 100 s)                                                                                                                                        | Médio                                    | Seguir o prompt; registrar em ADR                                                                                                                                                                                                                                  | Já decidido; registrar             |
| C-08 | Handoff §10 × Instruções §4.5.C                                                | Handoff pausa o timer durante mídia/leitura **sem limite**; o prompt proíbe sessão abandonada indefinida                                                                                                                                         | Alto                                     | Regra de teto proposta em §6.4                                                                                                                                                                                                                                     | Sim                                |
| C-09 | Decisões Vigentes (menu lateral claro) × JSON (`sidebar-bg` Galeria `#101314`) | "Menu claro" vs tema escuro com menu escuro                                                                                                                                                                                                      | Baixo agora (Fase 5)                     | O prompt esclarece: a proibição é do petróleo como fundo; os dois temas existem                                                                                                                                                                                    | Já esclarecido                     |
| C-10 | Handoff §18 (MVP inclui "Módulo de Mídias — TV") × Prompt §5.4/§10.2/Fase 3    | O Handoff coloca a TV no MVP; o prompt a posiciona na Fase 3                                                                                                                                                                                     | Médio (prazo)                            | **Excluir a TV do MVP**; entregar na Fase 3. Justificativa: é outro app/superfície, não é necessária para demonstrar o painel touch                                                                                                                                | Sim                                |
| C-11 | JSON `opacity.scrim` (0,72) × `surface-scrim` Galeria (`#0C0E0FD6` ≈ 0,84)     | Dois valores de scrim para o mesmo conceito no tema Galeria                                                                                                                                                                                      | Baixo                                    | Usar os valores semânticos por tema; ignorar `opacity.scrim`                                                                                                                                                                                                       | Informativo                        |
| C-12 | Handoff §17 × Prompt §9                                                        | Nomes de pacotes: `ds-tokens`/`ds-components` vs `design-tokens`/`ui`                                                                                                                                                                            | Nenhum                                   | Prevalece o prompt                                                                                                                                                                                                                                                 | Já decidido                        |

### 3.4 Hipóteses, pendências de curadoria e de hardware

Ver matriz completa em §13. Resumo: hardware real (P-08), conteúdos curatoriais (P-09, P-12), perfis do Dashboard (P-10) e estratégia offline (P-11) são **informações ausentes**, não decisões; P-01, P-02, P-04, P-05, P-06, P-07 são hipóteses a validar.

---

## 4. Avaliação arquitetural (um único desenvolvedor)

### 4.1 O que está bem desenhado

- Monorepo com workspaces nativos: reduz atrito de manutenção e permite evolução coordenada.
- Separação entre código, conteúdo, configuração e eventos: é exatamente a separação que sustenta offline seguro.
- Mídias Automatizadas como app único configurável: evita multiplicar builds por TV.
- MVP sem Firebase, com contratos compatíveis: correto.

### 4.2 Pontos de atenção e correções propostas

1. **Compatibilidade de TypeScript.** `typescript` 7.0.2 é a versão mais recente no npm, mas `typescript-eslint` 8.72.2 declara suporte `>=4.8.4 <6.1.0`. **Proposta (ADR-002, aprovada e validada na E01):** fixar TypeScript **6.0.3**. Reavaliar quando typescript-eslint suportar 7.x. Fixar a versão evita lint quebrado ou peer-deps forçadas.
2. **Pacotes internos sem build.** Compilar cada pacote (`tsc` + `dist`) cria ordem de build e cache a manter. Proposta: `exports` apontando para `src/`, consumidos pelo Vite. Custo: apps precisam transpilar os pacotes (aceitável). Se um dia um pacote for publicado ou usado por Cloud Functions, adicionamos build só nele.
3. **Offline em navegador é o maior risco técnico** (ver §7). A decisão não precisa ser tomada agora, mas o **MVP não pode assumir** que `fetch` direto a URLs resolve os arquivos. Por isso `resolveAssetUrl`/repositório assíncrono entram desde a Etapa 03.
4. **Quatro comportamentos "offline" distintos** (servidor local sem internet; app instalável offline; persistência local de conteúdo; sincronização remota). O MVP cobre apenas o primeiro. Cada um terá critério de aceite próprio.
5. **Tokens: JSON como fonte, CSS como derivado.** Proposta: script `tokens:build` gera `tokens.css` (commitado) e um teste/`tokens:check` falha se o CSS divergir do JSON. Não há dependência (script Node).
6. **Complementos aos tokens** (gradiente em px, alturas de bloco de legenda, templates de mosaico) ficam em arquivos próprios do pacote; o JSON oficial permanece intacto em `docs/design-system/`.
7. **Validação de dados:** começar com validadores TypeScript escritos à mão para o contrato de exposição. Avaliar Zod apenas se a validação ficar extensa (Fase 4, com Firestore).

### 4.3 Versões propostas (consultadas no npm em 16/11/2026, **ainda não testadas em conjunto**)

| Item                                               | Versão                                                                                                                       | Observação                                       |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| Node.js                                            | 22.12+ (v1.0). **v1.1: ambiente do desenvolvedor = 24.21.0; `engines` = `^22.22.2 \|\| ^24.15.0 \|\| >=26`**                 | Restrição real vem do jsdom 31 e do Vitest 5     |
| npm                                                | 10.9.x (v1.0). **v1.1: ambiente do desenvolvedor = 11.19.0**                                                                 | Usar `npm ci` com `package-lock.json`            |
| React / React DOM                                  | 19.3.1                                                                                                                       |                                                  |
| TypeScript                                         | **6.0.x** (6.0.3)                                                                                                            | ADR-002                                          |
| Vite                                               | 8.3.8                                                                                                                        |                                                  |
| @vitejs/plugin-react                               | 6.3.0                                                                                                                        | peer `vite ^8`                                   |
| Vitest                                             | 5.1.0                                                                                                                        |                                                  |
| @testing-library/react                             | 16.3.3                                                                                                                       |                                                  |
| @testing-library/jest-dom / user-event / jsdom     | 7.0.1 / 14.6.12 / 31.0.1                                                                                                     |                                                  |
| ESLint / typescript-eslint                         | 10.15.0 / 8.72.2                                                                                                             |                                                  |
| Prettier                                           | 3.10.1                                                                                                                       |                                                  |
| Fontes                                             | `@fontsource/source-serif-4` 5.3.1, `@fontsource/ibm-plex-sans` 5.3.0, `@fontsource/ibm-plex-sans-condensed` 5.3.0 (OFL-1.1) |                                                  |
| React Router / Zustand / Recharts / Firebase / idb | 7.18.5 / 5.1.0 / 3.10.1 / 13.3.0 / 8.0.4                                                                                     | **Não entram no MVP**; listados só para registro |

Todas as versões serão fixadas exatamente após o teste de instalação, build e testes na Etapa 01.

---

## 5. Estrutura do monorepo

Começa pequena e cresce conforme necessidade real.

```text
ccc-ecossistema/
├── apps/
│   └── espaco-expositivo/            # Etapa 01 (esqueleto) → MVP
├── packages/
│   ├── design-tokens/                # Etapa 02
│   ├── ui/                           # Etapa 04 em diante (cresce por demanda)
│   ├── types/                        # Etapa 03
│   └── data-access/                  # Etapa 03 (contrato + implementação local)
├── docs/
│   ├── design-system/                # os 6 documentos oficiais (você commita)
│   ├── arquitetura/
│   ├── decisoes/                     # ADRs
│   └── desenvolvimento/
│       ├── roadmap.md
│       ├── progresso.md
│       ├── pendencias.md
│       └── etapas/etapa-01.md …
├── CLAUDE.md                         # após a aprovação deste plano
├── README.md
├── package.json                      # workspaces: ["apps/*", "packages/*"]
├── package-lock.json
├── tsconfig.base.json
├── eslint.config.js
├── .prettierrc
├── .nvmrc
└── .gitignore
```

**Criados depois, quando houver necessidade concreta:** `packages/utils` (quando duas apps repetirem uma função), `packages/offline` (Fase 4), demais `apps/*` (na sua fase).

**Responsabilidades:**

- `design-tokens`: JSON→CSS Variables, temas, fontes, tokens complementares, dados dos templates de mosaico e seus testes geométricos.
- `ui`: componentes React compartilhados (Botão, Controle de ícone, Mosaico, Imagem interativa, Legenda, Paginação, Ficha, Visualizador, Modal, Aviso de inatividade, Estados, Player). Só entram quando uma app precisar.
- `types`: contratos (Exposição, Obra, Pessoa, Categoria, Mídia, Manifesto de conteúdo, Estado de arquivo, Evento de uso, Configuração de equipamento).
- `data-access`: interface `ExhibitionRepository` + implementação local (JSON). Firebase entra aqui na Fase 4 sem tocar nos componentes.

**Regra de dependência:** `apps → ui → design-tokens/types`; `apps → data-access → types`. Nunca o inverso. Sem ciclos.

**Scripts da raiz (planejados):** `npm run dev:expo`, `build:expo`, `test`, `typecheck`, `lint`, `format`, `tokens:build`, `tokens:check`.

---

## 6. Estratégia de implementação do Design System

### 6.1 Tokens e temas

- JSON oficial permanece em `docs/design-system/design-tokens.json`; cópia de trabalho no pacote com **teste de paridade** (cada token do pacote = token do JSON).
- CSS Variables em `:root` (tokens primitivos) e `[data-theme="galeria"|"papel"]` (semânticos). Tema Galeria padrão no Espaço Expositivo.
- Sem valores visuais fixos em componentes: tudo via `var(--…)`.
- Nomes: `--color-surface-page`, `--space-4`, `--motion-ficha-open`, `--touch-comfort`, etc.

### 6.2 Tipografia

`@fontsource` com subconjunto latino (necessário para acentos do português) e os pesos usados (400/500/600). Pilhas conforme DS. Teste de que nenhuma requisição externa de fonte existe no build.

### 6.3 Mosaicos

- Templates 1–9 como dados (`x, y, w, h`, papel herói/médio/pequeno, slot editorial) em 1920×1080.
- Renderização por **CSS Grid/posicionamento proporcional** a partir desses dados, sem algoritmo de distribuição. Conjuntos desiguais balanceados (9→5+4, 12→6+6, 15→8+7). **Não documentado:** 10, 11, 13, 14, 16+ → proposta: dividir em partes de tamanho máximo 8 com a diferença mínima entre conjuntos (ex.: 10→5+5; 11→6+5; 13→7+6; 14→7+7; 16→8+8; 17→6+6+5). Aguardo aprovação.
- Testes de geometria: dentro da área, sem sobreposição, intervalo de 10 px, % do herói idêntico ao documentado.
- cover/contain + `object-position` (ponto focal) por obra.
- Template 9 fica no pacote, mas não é usado pelo Espaço Expositivo (máx. 8).

### 6.4 Regras propostas para as ressalvas do prompt

**Ressalva A (mosaicos):** ver C-01, C-04, C-05, C-06. Apresento a proposta do componente (grade + slots editoriais) com capturas **antes** de consolidar (parte da Etapa 04).

**Ressalva B (gradiente de legenda):** implementar método do Handoff: altura do bloco por tipo (herói 142, médio 74, pequeno 66 px), platô 68 % até bloco + 10 px, fade linear de 56 px, altura = mín(ladrilho; bloco + 14 + 10 + 56). Medição de contraste com script que reproduz o método §11 (pior pixel) sobre as imagens de demonstração. Se algum caso falhar, ajusto parâmetros em tokens complementares e documento. Nunca reduzo opacidade do componente inteiro.

**Ressalva C (inatividade):** 120 s totais; aviso aos 100 s; tudo configurável por app/equipamento. Proposta para os casos de exceção (valores são **hipóteses a validar**):

| Situação                               | Regra proposta                                                                                                                                |
| -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Vídeo/áudio **tocando**                | Timer pausado enquanto toca; ao terminar ou pausar, o timer reinicia do zero. Se o visitante pausar e abandonar, vale o ciclo normal de 120 s |
| Vídeo/áudio em _loop_ ou duração longa | Teto de sessão de mídia = duração do item + 120 s                                                                                             |
| Leitura de documento / ficha longa     | Rolagem e toque reiniciam o timer; sem interação, **teto de 300 s** (configurável) antes do aviso final                                       |
| Visualizador ampliado                  | Pinça/arraste reiniciam; sem interação, **180 s** (configurável)                                                                              |
| Ao expirar                             | Volta à Abertura, limpa contexto, para mídia                                                                                                  |

**Ressalva D (Dashboard):** tratada na Fase 5; nada a decidir agora.

**Ressalva E:** ver matriz §13.

### 6.5 Movimento

Tokens de duração/easing do JSON. FLIP com WAAPI; `AbortController`/cancelamento para "último toque vence"; `img.decode()` antes de animar; `prefers-reduced-motion` → fusão de 120–200 ms. Medição de desempenho só é conclusiva em hardware real (P-07).

### 6.6 Acessibilidade

Foco visível (anel duplo), alvos ≥ 64 px no público, rótulos acessíveis, ordem de foco lógica, `prefers-reduced-motion`, estado nunca só por cor. Testes automáticos de roles/labels com RTL. **Contraste de legenda e alvos de toque em hardware = pendentes de validação real.**

---

## 7. Riscos e desafios técnicos

| ID    | Risco                                                                                                                                                            | Prob. | Impacto | Mitigação                                                                                                                                                                             |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RK-01 | Hardware desconhecido (SO, navegador, GPU, tela) altera o que funciona (View Transitions, quotas, gestos)                                                        | Alta  | Alto    | MVP usa só recursos amplamente suportados; levantar hardware cedo (P-08)                                                                                                              |
| RK-02 | Offline só no navegador: o navegador pode evictar Cache Storage/IndexedDB; vídeo via Service Worker exige tratar requisições `Range`; quotas e quedas de energia | Alta  | Alto    | Spike na Fase 4 em hardware real; `navigator.storage.persist()`; alternativa: **servidor/agente local no equipamento** ou _wrapper_ (Electron/WebView). Decidir por ADR com evidência |
| RK-03 | Contraste da legenda falha com acervo real (P-04)                                                                                                                | Média | Alto    | Script de medição reutilizável; parâmetros em tokens; repetir com fotos reais                                                                                                         |
| RK-04 | Desempenho de animação em tablets modestos                                                                                                                       | Média | Médio   | Só `transform/opacity`; ≤ 2 camadas grandes; imagens pré-decodificadas e dimensionadas                                                                                                |
| RK-05 | Vídeo pesado: tamanho, codecs (H.264/AAC), legendas                                                                                                              | Média | Médio   | Padrões de mídia definidos na Fase 3/4; demo com mídia leve                                                                                                                           |
| RK-06 | Segurança Firebase (regras, papéis, escrita por apps públicos)                                                                                                   | Média | Alto    | Fase 4–5 com Emulator Suite; apps públicos somente leitura                                                                                                                            |
| RK-07 | Privacidade na busca (termos digitados podem conter dados pessoais)                                                                                              | Média | Médio   | Não armazenar texto livre bruto; registrar categoria/contagem/ID do resultado aberto (decidir na Fase 4/7)                                                                            |
| RK-08 | Divergência entre meu ambiente e o seu                                                                                                                           | Média | Médio   | `npm ci`, versões fixas, `.nvmrc`, documento de etapa com comandos Windows; você me devolve saídas                                                                                    |
| RK-09 | Conteúdo/curadoria atrasada                                                                                                                                      | Alta  | Médio   | Dados de demonstração rotulados; contrato estável                                                                                                                                     |
| RK-10 | Overengineering e dispersão por um desenvolvedor                                                                                                                 | Média | Alto    | Pacotes criados sob demanda; etapas pequenas; cada etapa com aceite verificável                                                                                                       |
| RK-11 | Compatibilidade de ecossistema (TS 7 × typescript-eslint, Vite 8, Vitest 5 novos)                                                                                | Média | Médio   | ADR-002; fixar versões após Etapa 01                                                                                                                                                  |

---

## 8. Decisões necessárias

### 8.1 Imediatas (antes de começar a Etapa 01)

| ID   | Decisão                                                                                                                            | Minha recomendação                                                                                                                                       |
| ---- | ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| D-01 | Enviar o Plano Técnico original (.docx)                                                                                            | Necessário para fechar a análise documental; **não bloqueia** Etapas 01–03                                                                               |
| D-02 | Versão de Node/npm e terminal no seu Windows (PowerShell, Git Bash?)                                                               | Node 22.12+ e npm 10.9.x; documentarei comandos para PowerShell                                                                                          |
| D-03 | Aprovar **TypeScript 6.0.x** (ADR-002)                                                                                             | Aprovar                                                                                                                                                  |
| D-04 | Aprovar pacotes internos como código-fonte sem build (ADR-001)                                                                     | Aprovar                                                                                                                                                  |
| D-05 | Fontes via `@fontsource/*` (3 dependências OFL) × binários woff2 versionados por você                                              | `@fontsource`                                                                                                                                            |
| D-06 | Imagens da demonstração: (a) procedurais geradas por mim, rotuladas como demonstração; (b) fotos suas/licenciadas; (c) ambas       | **(c)**: procedurais para desenvolvimento e testes de contraste; fotos reais antes da apresentação institucional. Informe se já possui acervo licenciado |
| D-07 | MVP sem React Router; navegação por estado                                                                                         | Aprovar                                                                                                                                                  |
| D-08 | Excluir a TV do MVP (C-10)                                                                                                         | Aprovar                                                                                                                                                  |
| D-09 | Nome e organização do repositório; branch única `main` + branches curtas `feat/etapa-NN` (um desenvolvedor) e Conventional Commits | Aprovar                                                                                                                                                  |

### 8.2 Podem esperar

| Decisão                                                                                           | Quando                                     |
| ------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| Slots editoriais por template, balanceamento de 10+ obras, tablet por template (C-05, C-06, §6.3) | Dentro da Etapa 04 (proposta com capturas) |
| Regras de inatividade para mídia/leitura (§6.4)                                                   | Etapa 07                                   |
| Estratégia offline definitiva, quotas, wrapper                                                    | Fase 4 (Etapa 13)                          |
| Teclado próprio × nativo (P-03)                                                                   | Fase 7                                     |
| Perfis do Dashboard (P-10)                                                                        | Fase 5                                     |
| Critérios online/offline dos equipamentos; retenção; deduplicação                                 | Fases 4–5                                  |

---

## 9. Plano prioritário do MVP

**Objetivo:** painel touch do Espaço Expositivo navegável e fiel ao DS, com dados locais.

### 9.1 Fluxo e escopo

```text
Abertura → Catálogo (categorias, conjuntos, paginação) → Ficha → Visualizador ampliado
              ↘ Sobre a exposição ↘ Artista/participante ↘ Galeria audiovisual
Inatividade (120 s/aviso 20 s) → Abertura (contexto limpo)
```

### 9.2 Matriz de componentes (MVP × depois)

| Componente                                                             | MVP              | Etapa  | Observação                                              |
| ---------------------------------------------------------------------- | ---------------- | ------ | ------------------------------------------------------- |
| Tokens, temas, fontes                                                  | Sim              | 02     |                                                         |
| Mosaico + Imagem interativa + Legenda                                  | Sim              | 04     | Núcleo da fidelidade visual                             |
| Estados de conteúdo (sem imagem, offline, falha)                       | Sim              | 04     | "Não publicado" só no Dashboard                         |
| Botão, Controle de ícone, Indicadores de foco/seleção                  | Sim              | 05     |                                                         |
| Abas de categoria, Paginação de conjuntos                              | Sim              | 05     |                                                         |
| Ficha editorial + transição integrada (FLIP)                           | Sim              | 06     |                                                         |
| Visualizador de imagem                                                 | Sim              | 06     | Pinça/duplo toque                                       |
| Modal + Aviso de inatividade                                           | Sim              | 07     |                                                         |
| Sobre a exposição, Artista/participante                                | Sim              | 08     | Telas de texto + imagem, baixo custo                    |
| Player de áudio/vídeo + Galeria audiovisual                            | **Sim, adiável** | 08     | Pode escorregar para pós-MVP sem quebrar a demonstração |
| Módulo de Mídias (TV do Espaço Expositivo)                             | **Não**          | Fase 3 | C-10                                                    |
| Campo de busca, Teclado, Alternador Galeria/Lista, Leitor de documento | Não              | Fase 7 | Biblioteca                                              |
| Eixo/Navegação de capítulo                                             | Não              | Fase 6 | Linha do Tempo                                          |
| Tabela admin, Formulários, Indicador operacional, Menu lateral         | Não              | Fase 5 | Dashboard                                               |

**Justificativa das exclusões:** nenhum dos excluídos é necessário para demonstrar o painel touch; todos têm fase própria.

### 9.3 Caminho crítico

E01 → E02 → E03 → E04 → E05 → E06 (**Marco M1**) → E07 → E08 → E09 (**Marco M2**).

### 9.4 Marcos

- **M0 (fim da E02):** página de referência dos tokens (cores, tipografia, temas) renderizada em Galeria e Papel.
- **M1 (fim da E06):** _demonstrável mínimo_ — catálogo em mosaico, ficha, visualizador e retorno com contexto, em 1920×1080.
- **M2 (fim da E09):** MVP institucional — telas complementares, inatividade, estados, três resoluções, validação visual documentada.

### 9.5 Critérios de aceite do MVP (resumo)

1. Visual comparado com PDF p. 38/39 por captura de tela, nos temas e resoluções aplicáveis.
2. Um toque abre a ficha; voltar preserva exposição, categoria, conjunto, obra e posição.
3. Toques rápidos: apenas o último vence, sem fila de animações.
4. Inatividade conforme R-08; contexto limpo.
5. Troca de exposição **apenas trocando o JSON/arquivos de dados** (teste automatizado com duas exposições, 1–8 obras).
6. Nenhuma requisição a fonte/CDN externa; build estático funciona sem internet.
7. `typecheck`, `lint`, `test`, `build` aprovados.
8. Itens de hardware real e WCAG listados como **pendentes**, não aprovados.

---

## 10. Roadmap

### 10.1 Fases e etapas

#### Fase 1 — Fundação tecnológica

| Campo                   | E01 — Monorepo e toolchain                                                                                                                                                       | E02 — Fundação visual (tokens)                                                                                                                                          | E03 — Contratos e dados de demonstração                                                                                                                                                                                                                                     |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Fase                    | 1                                                                                                                                                                                | 1                                                                                                                                                                       | 1                                                                                                                                                                                                                                                                           |
| Objetivo                | Repositório reproduzível com um app Vite "esqueleto"                                                                                                                             | Tokens, temas, fontes locais em CSS                                                                                                                                     | Tipos, repositório local, exposição demo, imagens demo                                                                                                                                                                                                                      |
| Dependências            | D-01…D-09 respondidas                                                                                                                                                            | E01                                                                                                                                                                     | E01 (E02 em paralelo possível)                                                                                                                                                                                                                                              |
| Escopo                  | npm Workspaces; tsconfig base (strict); ESLint 10 + typescript-eslint; Prettier; Vitest + RTL; scripts raiz; `.nvmrc`; `engines`; esqueleto `apps/espaco-expositivo`; docs/ base | Pipeline `tokens:build`/`tokens:check`; CSS Variables Galeria/Papel; `@fontsource`; tokens complementares (gradiente px, toque, touch); página de referência dos tokens | `packages/types`; `packages/data-access` (interface + JSON local + `resolveAssetUrl`); exposição demo (≥ 24 obras; horizontais, verticais, quadradas, documentos; títulos curtos/longos; categorias; artistas); imagens procedurais; `DEMONSTRAÇÃO` e licenças documentadas |
| Entregáveis             | Documento da etapa + todos os arquivos                                                                                                                                           | idem + capturas M0                                                                                                                                                      | idem                                                                                                                                                                                                                                                                        |
| Testes                  | Instalação limpa (`npm ci`), typecheck, lint, test (smoke), build                                                                                                                | Paridade JSON↔CSS; ausência de CDN; capturas dos dois temas                                                                                                             | Validadores de contrato; testes do repositório; troca de exposição                                                                                                                                                                                                          |
| Critérios de aceite     | Todos os scripts passam no meu e no seu ambiente                                                                                                                                 | Página de tokens fiel às cores/tipos do PDF p. 5–13                                                                                                                     | Duas exposições carregam sem alterar código                                                                                                                                                                                                                                 |
| Complexidade            | Baixa                                                                                                                                                                            | Média                                                                                                                                                                   | Média                                                                                                                                                                                                                                                                       |
| Esforço (Claude / você) | 2–4 h / 1–2 h                                                                                                                                                                    | 3–6 h / 1–2 h                                                                                                                                                           | 4–8 h / 1–2 h                                                                                                                                                                                                                                                               |
| Bloqueios               | Versão de Node (D-02)                                                                                                                                                            | D-05                                                                                                                                                                    | D-06                                                                                                                                                                                                                                                                        |
| Marco                   | —                                                                                                                                                                                | **M0**                                                                                                                                                                  | —                                                                                                                                                                                                                                                                           |

#### Fase 2 — MVP do Espaço Expositivo

| Campo                   | E04 — Mosaico e legenda                                                                                                                                                                                                                                                                            | E05 — Catálogo e navegação                                                                                                                 | E06 — Ficha, transição e visualizador                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Objetivo                | Componente de mosaico fiel aos templates                                                                                                                                                                                                                                                           | Abertura + catálogo com categorias e conjuntos                                                                                             | Ficha em um toque, retorno com contexto, ampliação                                                                                             |
| Dependências            | E02, E03                                                                                                                                                                                                                                                                                           | E04                                                                                                                                        | E05                                                                                                                                            |
| Escopo                  | Dados dos templates 1–9 com testes geométricos; grade proporcional; Imagem interativa; Legenda/gradiente (método Handoff); cover/contain; recuo só da camada de imagem (P-01); estados de conteúdo; harness de desenvolvimento; **proposta de slots editoriais e adaptação a tablets (C-05/C-06)** | Estado de navegação (reducer); Abertura; Catálogo T1–T8; abas de categoria; paginação balanceada; botões e foco; responsivo 1920/1366/1280 | Ficha editorial (coluna 62 ch); FLIP integrado 480 ms/retorno 360 ms; "último toque vence"; Visualizador ampliado (pinça, duplo toque, fechar) |
| Testes                  | Geometria; render por template; estados; script de contraste (método §11)                                                                                                                                                                                                                          | Navegação; contexto; paginação; categorias; teclado/foco                                                                                   | Um toque; retorno preserva contexto; interrupção de animação; zoom                                                                             |
| Critérios de aceite     | Capturas × PDF p. 17/38; contraste medido e reportado                                                                                                                                                                                                                                              | Catálogo × PDF p. 38; 3 resoluções                                                                                                         | Ficha/visualizador × PDF p. 39; **M1**                                                                                                         |
| Complexidade            | Alta                                                                                                                                                                                                                                                                                               | Média                                                                                                                                      | Alta                                                                                                                                           |
| Esforço (Claude / você) | 6–12 h / 2–4 h                                                                                                                                                                                                                                                                                     | 4–8 h / 2–3 h                                                                                                                              | 6–12 h / 2–4 h                                                                                                                                 |
| Bloqueios               | Aprovação C-05/C-06                                                                                                                                                                                                                                                                                | —                                                                                                                                          | —                                                                                                                                              |
| Marco                   | —                                                                                                                                                                                                                                                                                                  | —                                                                                                                                          | **M1**                                                                                                                                         |

| Campo                   | E07 — Inatividade e modal                                                                                                   | E08 — Telas complementares                                                                              | E09 — Fechamento do MVP                                                                                                                                                                   |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Objetivo                | Retorno automático configurável                                                                                             | Sobre, Artista, Galeria audiovisual                                                                     | Estados globais, acessibilidade, validação visual, empacotamento                                                                                                                          |
| Dependências            | E06                                                                                                                         | E06 (E07 independente)                                                                                  | E07, E08                                                                                                                                                                                  |
| Escopo                  | Hook de inatividade (120/100/20 s, configurável); Modal com foco preso; regras de mídia/leitura (§6.4); limpeza de contexto | Telas de texto/imagem; Player A/V com legendas e controles de 80 px (adiável); navegação Catálogo↔telas | Exposição vazia/offline/atualização/indisponível; revisão a11y (roles, foco, reduced-motion); capturas finais; build estático; instruções de execução/kiosk de demonstração; documentação |
| Testes                  | Timers falsos (Vitest); reset por toque/rolagem/tecla; pausa/teto de mídia                                                  | Navegação; player; estados                                                                              | Suíte completa; captura nos 3 tamanhos; checklist DS                                                                                                                                      |
| Critérios de aceite     | Comportamento R-08                                                                                                          | Telas × PDF p. 40/41                                                                                    | Critérios §9.5; **M2**                                                                                                                                                                    |
| Complexidade            | Média                                                                                                                       | Média                                                                                                   | Média                                                                                                                                                                                     |
| Esforço (Claude / você) | 4–8 h / 1–2 h                                                                                                               | 5–10 h / 2–3 h                                                                                          | 4–8 h / 3–5 h                                                                                                                                                                             |
| Bloqueios               | Aprovação das regras de teto                                                                                                | Mídia demo                                                                                              | Hardware real (opcional p/ demonstração)                                                                                                                                                  |
| Marco                   | —                                                                                                                           | —                                                                                                       | **M2**                                                                                                                                                                                    |

#### Fases 3 a 9 (detalhamento completo ao aproximar cada fase, quando houver informações de hardware e conteúdo)

| Fase               | ID      | Etapa                                                                                                                                                       | Objetivo                                                                                                        | Dep.         | Esforço Claude / você          | Bloqueios      |
| ------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | ------------ | ------------------------------ | -------------- |
| 3 Mídias           | E10     | Motor de reprodução                                                                                                                                         | Playlist, temporização, transição 800 ms, avanço em falha, moldura institucional                                | M2           | 5–9 h / 2–3 h                  | P-02, P-08     |
| 3                  | E11     | Composições horizontais                                                                                                                                     | Foto, vídeo c/ legenda, texto, citação, poema, documento; TV do Espaço Expositivo                               | E10          | 6–10 h / 2–3 h                 | Conteúdo       |
| 3                  | E12     | Vertical + Sala Afonso Schmidt + atualização segura de playlist                                                                                             | Config por equipamento; aplicar só ao fim do item/ciclo                                                         | E11          | 5–9 h / 2–3 h                  | P-08           |
| 4 Firebase/offline | E13     | **Spike e ADR de offline**                                                                                                                                  | Testar persistência, quotas, vídeo/Range, eviction em hardware real; decidir navegador × agente local × wrapper | M2, hardware | 4–8 h / 4–8 h                  | **P-08, P-11** |
| 4                  | E14     | Modelo Firestore, regras, Storage, Emulator                                                                                                                 | Coleções, versões, regras de acesso                                                                             | E13          | 6–10 h / 2–3 h                 | —              |
| 4                  | E15     | `packages/offline`: armazenamento e manifestos                                                                                                              | IndexedDB/Cache, checksums, versões ativas                                                                      | E13, E14     | 8–14 h / 3–4 h                 | —              |
| 4                  | E16     | Sincronização segura                                                                                                                                        | Download, verificação, ativação atômica, rollback                                                               | E15          | 8–14 h / 3–4 h                 | —              |
| 4                  | E17     | Eventos e heartbeat                                                                                                                                         | Fila local, deduplicação, envio, anonimato                                                                      | E14          | 5–9 h / 2–3 h                  | RK-07          |
| 4                  | E18     | Integração do Espaço Expositivo                                                                                                                             | Troca do repositório local pelo remoto/offline                                                                  | E16, E17     | 5–9 h / 2–4 h                  | —              |
| 5 Dashboard        | E19–E24 | Shell/auth/temas; conteúdos/upload; exposições; playlists; equipamentos/publicação/sincronização; estatísticas (Recharts)                                   | Administração completa                                                                                          | E14          | 40–70 h total / 15–25 h        | P-10           |
| 6 Linha do Tempo   | E25–E28 | Dados e eixo; navegação histórica; capítulos/complementos; integração                                                                                       | 5 capítulos completos por tablet                                                                                | E18          | 20–35 h / 8–14 h               | Conteúdo       |
| 7 Biblioteca       | E29–E33 | Busca (pt-BR); Galeria/Lista/filtros; teclado (P-03); leitor/players; persistência                                                                          | Acervo local pesquisável offline                                                                                | E18          | 30–50 h / 12–20 h              | P-03           |
| 8 Futuro           | E34–E37 | Eixos/cenários; indicadores/mapas; Para pensar; integração                                                                                                  | Experiência educativa                                                                                           | E18          | 20–35 h / 8–14 h               | P-09           |
| 9 Homologação      | E38–E42 | Testes integrados (Playwright se justificado); desempenho; auditoria de acessibilidade; simulações de falha offline; implantação e documentação operacional | Prontidão para operação                                                                                         | Todas        | 20–40 h / 20–40 h (+ hardware) | Hardware       |

### 10.2 Observação sobre a ordem

O Dashboard (Fase 5) vem depois de Firebase/offline porque depende do modelo de dados. Se a instituição precisar editar conteúdo antes, é possível antecipar uma versão mínima; isso alteraria o caminho crítico e exigiria sua aprovação.

---

## 11. Estimativas de esforço

**Como ler:** horas de trabalho efetivo, em duas colunas — (A) minha produção, teste e documentação; (B) sua implementação local, validação e commit. **São estimativas de planejamento, não medições; incerteza de ±40 % nas Fases 1–2 e de ±60 % ou mais nas demais** (dependem de hardware, conteúdo e decisões em aberto). Estimativas de calendário só fazem sentido com o seu ritmo de validação.

| Bloco                          | (A) Claude  | (B) Você    | Incerteza | Fatores principais                                 |
| ------------------------------ | ----------- | ----------- | --------- | -------------------------------------------------- |
| Fundação (E01–E03)             | 9–18 h      | 3–6 h       | ±40 %     | Compatibilidade das versões novas; D-06            |
| **MVP (E04–E09)**              | **25–50 h** | **12–22 h** | ±40 %     | Fidelidade visual do mosaico; aprovações C-05/C-06 |
| Mídias Automatizadas (E10–E12) | 16–28 h     | 6–9 h       | ±50 %     | Hardware das TVs; durações (P-02)                  |
| Firebase + offline (E13–E18)   | 36–64 h     | 16–26 h     | ±60 %     | Resultado do spike em hardware; quotas             |
| Dashboard (E19–E24)            | 40–70 h     | 15–25 h     | ±60 %     | Perfis (P-10); upload                              |
| Linha do Tempo                 | 20–35 h     | 8–14 h      | ±50 %     | Conteúdo                                           |
| Biblioteca Digital             | 30–50 h     | 12–20 h     | ±50 %     | Teclado; busca                                     |
| Futuro & Perspectivas          | 20–35 h     | 8–14 h      | ±50 %     | Conteúdo; mapas                                    |
| Homologação (E38–E42)          | 20–40 h     | 20–40 h     | ±60 %     | Acesso a hardware real                             |

**Projeção do MVP:** com um ciclo de validação a cada etapa, M1 tende a ocorrer em aproximadamente 1–2 semanas e M2 em 2–4 semanas de calendário após a aprovação deste plano, dependendo da sua disponibilidade para validar e responder às decisões D-01…D-09 e C-05/C-06. É uma projeção, não um compromisso.

---

## 12. Organização documental

```text
docs/
├── design-system/            # 6 documentos oficiais (somente leitura; alterações via ADR)
├── arquitetura/
│   ├── visao-geral.md
│   ├── arquitetura-tecnica.md
│   ├── estrutura-monorepo.md
│   └── fluxo-de-dados.md
├── decisoes/
│   ├── README.md             # índice
│   ├── ADR-001-monorepo-pacotes-fonte.md
│   ├── ADR-002-typescript-6.md
│   ├── ADR-003-templates-normativos.md
│   ├── ADR-004-gradiente-legenda.md
│   ├── ADR-005-inatividade.md
│   ├── ADR-006-navegacao-sem-router.md
│   └── ADR-007-contratos-offline-compativeis.md
└── desenvolvimento/
    ├── roadmap.md
    ├── progresso.md          # estados: Planejada → … → Aprovada / Bloqueada
    ├── pendencias.md
    └── etapas/etapa-NN.md    # documento completo por etapa (estrutura do prompt §13)
```

Cada etapa será entregue como um `.md` com a estrutura do prompt (arquivos integrais, comandos para Windows/VS Code, testes **reais** executados, validação visual, checklist, sugestão de commit). `CLAUDE.md` será produzido após a aprovação do plano.

---

## 13. Matriz de pendências

### 13.1 Pendências do DS (P-01…P-12) e ressalvas do prompt

| ID   | Descrição                                     | Tipo               | Resolver em                        | Impacto | Impede implementação? | Resolução prevista               |
| ---- | --------------------------------------------- | ------------------ | ---------------------------------- | ------- | --------------------- | -------------------------------- |
| P-01 | Opacidade 0,55 do recuo (só camada de imagem) | Hipótese           | E04; revalidar em hardware         | Baixo   | Não                   | Token ajustável 0,45–0,7         |
| P-02 | Duração de imagem em Mídias (20 s)            | Hipótese           | E10 + curadoria                    | Médio   | Não                   | Configurável por tipo            |
| P-03 | Teclado próprio × nativo                      | Decisão técnica    | E31                                | Alto    | Não (Fase 7)          | Protótipo + teste no equipamento |
| P-04 | Platô 68 % / fade 56 px com acervo real       | Hipótese           | E04 (sintético); E09/E38 (real)    | Alto    | Não                   | Script de contraste reutilizável |
| P-05 | Alvos 72/64 px                                | Hipótese           | E09 (parcial); E38 (hardware)      | Alto    | Não                   | Teste de toque real              |
| P-06 | Itens por resolução (8/6/5/4)                 | Hipótese           | E05                                | Médio   | Não                   | Validar 1366×768 e 1280×800      |
| P-07 | Tempos de movimento                           | Hipótese           | E06; E39                           | Médio   | Não                   | Tokens; refinar em hardware      |
| P-08 | Hardware/resolução/orientação reais           | Informação ausente | Antes da E13 (ideal: antes da E09) | Alto    | Não p/ MVP            | **Levantamento com você**        |
| P-09 | Conteúdo de Futuro & Perspectivas             | Informação ausente | Fase 8                             | Alto    | Não                   | Curadoria                        |
| P-10 | Perfis do Dashboard                           | Informação ausente | E19                                | Médio   | Não                   | Definição de gestão              |
| P-11 | Estratégia offline/cache                      | Informação ausente | **E13**                            | Alto    | Não p/ MVP            | ADR com spike                    |
| P-12 | Textos curatoriais, créditos, legendas        | Informação ausente | Pré-apresentação                   | Alto    | Não                   | Dados demo rotulados             |
| A    | Mosaicos: proporções e configurações          | Ressalva           | E04                                | Alto    | Não                   | C-01, C-04, C-05, C-06           |
| B    | Degradê e contraste das legendas              | Ressalva           | E04                                | Alto    | Não                   | C-03 / ADR-004                   |
| C    | Temporizadores                                | Ressalva           | E07                                | Médio   | Não                   | C-07, C-08 / ADR-005             |
| D    | Temas do Dashboard                            | Ressalva           | E19                                | Baixo   | Não                   | C-09                             |

### 13.2 Novas pendências identificadas

| ID   | Descrição                                                                                  | Origem               | Prioridade | Etapa                    | Resolução proposta                                               |
| ---- | ------------------------------------------------------------------------------------------ | -------------------- | ---------- | ------------------------ | ---------------------------------------------------------------- |
| N-01 | Plano Técnico original não acessado                                                        | Esta análise         | Média      | Antes da E13 (ideal: já) | Você me envia o arquivo                                          |
| N-02 | Versão de Node/npm/terminal local                                                          | §4.3                 | Alta       | E01                      | D-02                                                             |
| N-03 | TS 7 incompatível com typescript-eslint                                                    | §4.2                 | Alta       | E01                      | ADR-002                                                          |
| N-04 | Imagens de demonstração e licenças                                                         | Prompt §10.3         | Alta       | E03                      | D-06                                                             |
| N-05 | Slots editoriais por template (C-05)                                                       | Handoff              | Alta       | E04                      | Proposta com capturas                                            |
| N-06 | Mínimo de 230 px × templates (C-04)                                                        | Handoff              | Baixa      | E04                      | Registro em ADR-003                                              |
| N-07 | Balanceamento de 10+ obras por conjunto                                                    | Handoff §5 (omissão) | Média      | E05                      | §6.3                                                             |
| N-08 | Adaptação dos templates a tablets (C-06)                                                   | Handoff              | Alta       | E04/E05                  | Grade proporcional                                               |
| N-09 | TV no MVP (C-10)                                                                           | Handoff §18 × prompt | Média      | Agora                    | D-08                                                             |
| N-10 | Regras de teto de inatividade (C-08)                                                       | Prompt               | Média      | E07                      | §6.4                                                             |
| N-11 | Categoria "Mapas" aparece no catálogo demo do PDF; definir tipos de obra/mídia do contrato | PDF p. 38            | Média      | E03                      | Tipos `photo`, `document`, `map`, `audio`, `video` como proposta |
| N-12 | Critérios online/offline de equipamento, deduplicação e retenção de eventos                | Prompt §6.6–6.7      | Média      | E17/E23                  | Heartbeat configurável; limiares na ADR da fase                  |
| N-13 | Navegador/SO do painel (define uso de APIs modernas)                                       | P-08                 | Alta       | Antes da E09             | Levantamento                                                     |

---

## 14. Recomendação para início

**Primeira etapa após sua aprovação: E01 — Monorepo e toolchain**, seguida de E02 e E03 (Fase 1), para chegar ao Marco M0 e iniciar o mosaico (E04).

**Para eu começar a E01, preciso das suas respostas a:**

1. **D-01** — Envio do Plano Técnico `.docx` (não bloqueia E01–E03).
2. **D-02** — Versão de Node e terminal no Windows.
3. **D-03 a D-09** — Aprovação (ou ajuste) das recomendações da §8.1.
4. Confirmação de que posso usar o caminho `docs/design-system/` para os documentos oficiais (você realiza o commit dos arquivos).

Nada será implementado até sua aprovação explícita.

---

## 15. Atualização v1.1 (16/11/2026) — aprovação e informações novas

### 15.1 Aprovações registradas

O desenvolvedor aprovou o planejamento inicial, a arquitetura e o roadmap, e as decisões abaixo (formalizadas em ADRs em `docs/decisoes/`).

| ID   | Decisão                                                                                    | Resultado                                                                                                     | ADR     |
| ---- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------- |
| D-01 | Plano Técnico anexado                                                                      | Recebido e analisado (§15.2)                                                                                  | —       |
| D-02 | Ambiente: Windows 11, VS Code, PowerShell; Node 24.21.0; npm 11.19.0; Git 2.55.0.windows.5 | Registrado; `engines` e `.nvmrc` ajustados                                                                    | ADR-001 |
| D-03 | TypeScript 6.0.x, mediante validação                                                       | **Aprovado e validado na E01** (6.0.3; typecheck, lint tipado, testes e build aprovados em Node 24 e Node 22) | ADR-002 |
| D-04 | Pacotes internos como código-fonte, sem build                                              | Aprovado; viabilidade comprovada em experimento descartável na E01                                            | ADR-001 |
| D-05 | Fontes via `@fontsource/*`                                                                 | Aprovado (implementação na E02)                                                                               | ADR-008 |
| D-06 | Imagens de demonstração: opção C (procedurais + fotos licenciadas)                         | Aprovado (implementação na E03)                                                                               | ADR-009 |
| D-07 | Navegação por estado, sem React Router, no MVP                                             | Aprovado                                                                                                      | ADR-006 |
| D-08 | TV do Espaço Expositivo fora do MVP (Fase 3)                                               | Aprovado                                                                                                      | ADR-010 |
| D-09 | Git: `main` + branches `feat/etapa-NN`; Conventional Commits                               | Aprovado                                                                                                      | ADR-011 |
| C-01 | Coordenadas dos templates prevalecem sobre regras percentuais                              | Aprovado                                                                                                      | ADR-003 |
| C-03 | Metodologia de gradiente do Handoff prevalece sobre o JSON                                 | Aprovado                                                                                                      | ADR-004 |
| C-04 | Dimensões dos templates prevalecem sobre o mínimo de 230 px                                | Aprovado                                                                                                      | ADR-003 |
| —    | Documentos oficiais em `docs/design-system/`                                               | Aprovado                                                                                                      | ADR-001 |

As demais decisões (C-05, C-06, balanceamento de 10+ obras, regras de inatividade, offline, teclado etc.) permanecem para as respectivas etapas.

### 15.2 Análise do Plano Técnico (v2.0, novembro de 2026)

O documento **confirma** a arquitetura e o roadmap aprovados e já incorpora este planejamento. Não encontrei conflito com o Design System que impeça o início. Informações novas ou que exigem registro:

| ID   | Informação / divergência                                                                                                                                                                                                                                                                                                                | Etapa                   |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------- |
| N-14 | Núcleo Guará: duas TVs de 32" (Antes/Depois) + uma de 55" (vídeos); **sincronismo entre telas é questão aberta** e pode exigir solução própria                                                                                                                                                                                          | Fase 3 (E10–E12)        |
| N-15 | "Parede Viva Digital" da Biblioteca pode reutilizar Mídias Automatizadas                                                                                                                                                                                                                                                                | Fase 3/7                |
| N-16 | Modelo de eventos sugerido: `session_started`, `content_opened`, `media_started`, `media_completed`, `navigation_used`, `session_ended`, `sync_error`; campos `eventId`, `stationId`, `moduleId`, `contentId?`, `sessionId` anônimo, `timestamp`, tipo, versão do app; dedup por `eventId`; regra de expiração de sessões interrompidas | E17                     |
| N-17 | Coleções sugeridas (nomes sujeitos a validação): `modules`, `contents`, `mediaAssets`, `exhibitions`, `collections`, `stations`, `releases`, `events`, `analyticsDaily`; manifesto por publicação com hashes; limpeza de versões antigas só após a nova estar íntegra                                                                   | E14–E16                 |
| N-18 | Biblioteca: tablets de leitura com limpeza do histórico local ao encerrar; audiobooks com capítulos; **direitos de uso e licenciamento** a verificar antes de publicar                                                                                                                                                                  | Fase 7                  |
| N-19 | Dashboard: fluxo rascunho → revisão → publicação, agendamento opcional, rollback, confirmação de download pelas estações, exportação CSV, retenção configurável                                                                                                                                                                         | Fase 5                  |
| N-20 | Espaço Expositivo: agendamento e QR Codes opcionais, sujeitos a validação                                                                                                                                                                                                                                                               | Pós-MVP                 |
| N-21 | Linha do Tempo: tela de espera, pré-carregamento de mídias                                                                                                                                                                                                                                                                              | Fase 6                  |
| N-22 | Mídias: watchdog "a avaliar"                                                                                                                                                                                                                                                                                                            | E10                     |
| N-23 | Formato, resolução e volume total dos vídeos (dimensiona armazenamento e tráfego)                                                                                                                                                                                                                                                       | **Antes da E13**        |
| N-24 | Política de licenciamento de livros, imagens, músicas e audiobooks                                                                                                                                                                                                                                                                      | Fase 7 / pré-publicação |
| N-25 | `eslint-plugin-jsx-a11y` 6.10.2 só declara suporte até ESLint 9; o projeto usa ESLint 10. Lint de acessibilidade JSX não foi adotado. Alternativas: aguardar suporte; avaliar axe-core em testes na E09                                                                                                                                 | E09                     |
| C-13 | Plano §1 diz que a Biblioteca "reutiliza autenticação administrativa". Apps públicos **não** podem ter privilégios administrativos (instruções do projeto). Interpretação adotada: reutilizar a **infraestrutura e os serviços**, não a autenticação de administrador                                                                   | Fase 7 (confirmar)      |
| C-14 | Plano §5.2 (Dashboard "cartões de uso") × DS ("poucos cartões"). Tensão menor                                                                                                                                                                                                                                                           | E19                     |

### 15.3 Versões definitivas (validadas na E01)

Instaladas com versões exatas, `package-lock.json` gerado com Node 24.21.0/npm 11.19.0 e verificadas também com Node 22.23.4/npm 10.9.9.

| Pacote                                               | Versão                            | Onde                     |
| ---------------------------------------------------- | --------------------------------- | ------------------------ |
| typescript                                           | 6.0.3                             | raiz                     |
| eslint / @eslint/js                                  | 10.15.0 / 10.0.1                  | raiz                     |
| typescript-eslint                                    | 8.72.2                            | raiz                     |
| eslint-plugin-react-hooks                            | 7.1.1                             | raiz                     |
| globals                                              | 17.14.0                           | raiz                     |
| prettier                                             | 3.10.1                            | raiz                     |
| vitest                                               | 5.1.0                             | raiz                     |
| jsdom                                                | 31.0.1                            | raiz                     |
| @testing-library/dom / react / jest-dom / user-event | 10.4.2 / 16.3.3 / 7.0.1 / 14.6.12 | raiz                     |
| @types/node                                          | 24.19.2                           | raiz                     |
| react / react-dom                                    | 19.3.1                            | `apps/espaco-expositivo` |
| vite                                                 | 8.3.8                             | `apps/espaco-expositivo` |
| @vitejs/plugin-react                                 | 6.3.0                             | `apps/espaco-expositivo` |
| @types/react / @types/react-dom                      | 19.3.0 / 19.3.0                   | `apps/espaco-expositivo` |
