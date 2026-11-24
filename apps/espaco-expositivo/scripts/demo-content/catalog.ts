import type { ArtSpec, Motif, Palette } from './art.ts';

/**
 * Dados editoriais das exposições de DEMONSTRAÇÃO (ADR-009). Todo o conteúdo é fictício:
 * títulos, textos e créditos são marcadores, e as imagens são procedurais.
 */

export type WorkKind = 'photo' | 'document' | 'map';

export const SIZES = {
  h43: { width: 1600, height: 1200 },
  h32: { width: 1500, height: 1000 },
  h169: { width: 1600, height: 900 },
  pano: { width: 1800, height: 720 },
  v34: { width: 1200, height: 1600 },
  v23: { width: 1000, height: 1500 },
  square: { width: 1200, height: 1200 },
  a4p: { width: 1131, height: 1600 },
  a4l: { width: 1600, height: 1131 },
} as const;

export type SizeKey = keyof typeof SIZES;

export interface WorkSeed {
  slug: string;
  title: string;
  kind: WorkKind;
  categoryId: string;
  motif: Motif;
  palette: Palette;
  size: SizeKey;
  personIds: string[];
  fit: 'cover' | 'contain';
  focal: { x: number; y: number } | null;
  dateLabel: string | null;
  sourceLabel: string | null;
  description?: string;
}

export interface PersonSeed {
  id: string;
  name: string;
  biography: string;
  portrait: { palette: Palette; seed: number } | null;
}

export interface ExhibitionSeed {
  id: string;
  title: string;
  subtitle: string | null;
  summary: string;
  cover: { motif: Motif; palette: Palette; size: SizeKey };
  aboutParagraphs: string[];
  categories: { id: string; label: string }[];
  people: PersonSeed[];
  /** Na ordem de exibição. */
  works: WorkSeed[];
}

const LONG_DESCRIPTION = [
  'Descrição de demonstração. O texto longo rola nesta coluna, sem diminuir a fonte, e a imagem permanece visível.',
  'Segundo parágrafo de demonstração, usado para verificar a quebra de linhas, o espaçamento entre parágrafos e a rolagem da coluna de leitura. Nenhuma informação deste texto é histórica: ele existe apenas para testar a interface.',
  'Terceiro parágrafo de demonstração. A coluna de leitura da ficha deve manter cerca de 62 caracteres por linha, corpo de 24 px e entrelinha de 40 px, sem reduzir a fonte quando o texto é longo e sem cobrir a imagem.',
  'Quarto parágrafo de demonstração, mais curto.',
].join('\n\n');

const SHORT_DESCRIPTION =
  'Descrição de demonstração. Imagem procedural criada para testar o mosaico, a legenda e a ficha.';

function work(
  seed: Omit<WorkSeed, 'fit' | 'focal' | 'dateLabel' | 'sourceLabel' | 'personIds'> &
    Partial<WorkSeed>,
): WorkSeed {
  return {
    fit: seed.kind === 'photo' ? 'cover' : 'contain',
    focal: null,
    dateLabel: 'Data a definir',
    sourceLabel: 'Fonte a definir',
    personIds: [],
    ...seed,
  };
}

const PEOPLE_MAIN: PersonSeed[] = [
  {
    id: 'autoria-a',
    name: 'Autoria de demonstração A',
    biography:
      'Biografia curta de demonstração, com formação e atuação a definir pela curadoria. Texto fictício usado para testar a tela de artista.',
    portrait: { palette: 'mist', seed: 9101 },
  },
  {
    id: 'autoria-b',
    name: 'Autoria de demonstração B',
    biography:
      'Biografia de demonstração. Esta pessoa não possui retrato, para testar o estado "sem imagem".',
    portrait: null,
  },
  {
    id: 'autoria-c',
    name: 'Autoria de demonstração C',
    biography:
      'Biografia de demonstração mais longa, para verificar a rolagem da coluna de texto. Texto fictício, sem relação com pessoas reais. Parágrafo único, sem informações históricas.',
    portrait: { palette: 'sepia', seed: 9102 },
  },
  {
    id: 'acervo-institucional',
    name: 'Acervo institucional (demonstração)',
    biography: 'Origem institucional fictícia, usada nos documentos de demonstração.',
    portrait: null,
  },
];

export const EXHIBITION_MAIN: ExhibitionSeed = {
  id: 'cubatao-em-imagens',
  title: 'Cubatão em imagens',
  subtitle: 'Exposição de demonstração',
  summary: 'Exposição de demonstração. Texto curatorial a definir.',
  cover: { motif: 'skyline', palette: 'dusk', size: 'h169' },
  aboutParagraphs: [
    'Texto curatorial de demonstração. A coluna de leitura tem até 62 caracteres por linha, corpo 24 px e entrelinha 40 px.',
  ],
  categories: [
    { id: 'fotografias', label: 'Fotografias' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'mapas', label: 'Mapas' },
  ],
  people: PEOPLE_MAIN,
  works: [
    work({
      slug: 'operarios-no-turno-da-manha',
      title: 'Operários no turno da manhã',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'mist',
      size: 'h43',
      personIds: ['autoria-a'],
      focal: { x: 0.5, y: 0.62 },
      description: LONG_DESCRIPTION,
    }),
    work({
      slug: 'praca-central-em-dia-de-festa',
      title: 'Praça central em dia de festa',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'blue',
      size: 'h32',
      personIds: ['autoria-b'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'planta-da-vila-e-dos-primeiros-bairros',
      title: 'Planta da vila e dos primeiros bairros',
      kind: 'map',
      categoryId: 'mapas',
      motif: 'map',
      palette: 'paper',
      size: 'h43',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'fachada-caiada-ao-meio-dia',
      title: 'Fachada caiada ao meio-dia',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'facade',
      palette: 'clean',
      size: 'square',
      personIds: ['autoria-c'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'vista-da-serra-a-partir-do-patio',
      title: 'Vista da serra a partir do pátio',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'dusk',
      size: 'h169',
      personIds: ['autoria-a', 'autoria-b'],
      focal: { x: 0.4, y: 0.65 },
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'carta-de-administracao-sobre-a-vila',
      title: 'Carta de administração sobre a vila',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'letter',
      palette: 'paper',
      size: 'a4p',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'patio-ao-anoitecer',
      title: 'Pátio ao anoitecer',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'night',
      size: 'h43',
      personIds: ['autoria-b'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'detalhe-de-ferramenta-de-oficina',
      title: 'Detalhe de ferramenta de oficina',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'sepia',
      size: 'square',
      personIds: ['autoria-c'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'chamines-ao-entardecer',
      title: 'Chaminés ao entardecer',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'dusk',
      size: 'v34',
      personIds: ['autoria-a'],
      focal: { x: 0.5, y: 0.7 },
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'livro-caixa-pagina-14',
      title: 'Livro-caixa (página 14)',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'ledger',
      palette: 'aged',
      size: 'a4l',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'panorama-da-vila-operaria',
      title:
        'Fotografia panorâmica da vila operária vista do alto da colina ao entardecer, com as chaminés ao fundo',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'dusk',
      size: 'pano',
      personIds: ['autoria-a'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'cartaz-de-convocacao',
      title: 'Cartaz de convocação para a assembleia',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'letter',
      palette: 'clean',
      size: 'v23',
      personIds: [],
      dateLabel: null,
      sourceLabel: null,
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'rua-estreita-depois-da-chuva',
      title: 'Rua estreita depois da chuva',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'blue',
      size: 'v23',
      personIds: ['autoria-b'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'mapa-de-curvas-de-nivel-da-serra',
      title: 'Mapa de curvas de nível da serra',
      kind: 'map',
      categoryId: 'mapas',
      motif: 'map',
      palette: 'paper',
      size: 'v34',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'turno-da-tarde',
      title: 'Turno da tarde',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'mist',
      size: 'h32',
      personIds: ['autoria-a'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'recibo-de-pagamento',
      title: 'Recibo de pagamento',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'ledger',
      palette: 'paper',
      size: 'h32',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'nevoeiro-sobre-a-serra',
      title: 'Nevoeiro sobre a serra',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'mist',
      size: 'h169',
      personIds: ['autoria-c'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'ata-da-reuniao',
      title: 'Ata da reunião',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'letter',
      palette: 'aged',
      size: 'a4p',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'caldeira',
      title: 'Caldeira',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'sepia',
      size: 'v34',
      personIds: ['autoria-c'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'carta-de-arruamento',
      title: 'Carta de arruamento',
      kind: 'map',
      categoryId: 'mapas',
      motif: 'map',
      palette: 'blueprint',
      size: 'h169',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'retrato-coletivo-da-equipe',
      title: 'Retrato coletivo da equipe de manutenção em frente à oficina principal',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'sepia',
      size: 'h43',
      personIds: ['autoria-a', 'autoria-c'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'planilha-de-turnos',
      title: 'Planilha de turnos',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'ledger',
      palette: 'clean',
      size: 'a4l',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'bilhete',
      title: 'Bilhete',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'letter',
      palette: 'paper',
      size: 'square',
      personIds: [],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'regulamento-interno-da-oficina',
      title: 'Regulamento interno da oficina de manutenção e conduta dos trabalhadores',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'letter',
      palette: 'aged',
      size: 'v34',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
  ],
};

export const EXHIBITION_SMALL: ExhibitionSeed = {
  id: 'memorias-de-oficina',
  title: 'Memórias de oficina',
  subtitle: 'Exposição de demonstração',
  summary: 'Segunda exposição de demonstração, com poucas obras. Texto curatorial a definir.',
  cover: { motif: 'skyline', palette: 'sepia', size: 'h169' },
  aboutParagraphs: [
    'Segundo texto curatorial de demonstração. Esta exposição existe para provar que o aplicativo troca de exposição apenas com dados, sem alterar código.',
  ],
  categories: [
    { id: 'fotografias', label: 'Fotografias' },
    { id: 'documentos', label: 'Documentos' },
    { id: 'mapas', label: 'Mapas' },
  ],
  people: [
    {
      id: 'autoria-d',
      name: 'Autoria de demonstração D',
      biography: 'Biografia curta de demonstração para a segunda exposição.',
      portrait: { palette: 'blue', seed: 9103 },
    },
    {
      id: 'acervo-institucional',
      name: 'Acervo institucional (demonstração)',
      biography: 'Origem institucional fictícia, usada nos documentos de demonstração.',
      portrait: null,
    },
  ],
  works: [
    work({
      slug: 'bancada-ao-fim-do-dia',
      title: 'Bancada ao fim do dia',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'sepia',
      size: 'h43',
      personIds: ['autoria-d'],
      description: LONG_DESCRIPTION,
    }),
    work({
      slug: 'ferramentas-penduradas',
      title: 'Ferramentas penduradas',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'mist',
      size: 'v34',
      personIds: ['autoria-d'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'planta-da-oficina',
      title: 'Planta da oficina',
      kind: 'map',
      categoryId: 'mapas',
      motif: 'map',
      palette: 'blueprint',
      size: 'h32',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'telhado-e-chamine',
      title: 'Telhado e chaminé',
      kind: 'photo',
      categoryId: 'fotografias',
      motif: 'skyline',
      palette: 'blue',
      size: 'square',
      personIds: ['autoria-d'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'ordem-de-servico',
      title: 'Ordem de serviço',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'letter',
      palette: 'paper',
      size: 'a4p',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
    work({
      slug: 'registro-de-pecas',
      title: 'Registro de peças',
      kind: 'document',
      categoryId: 'documentos',
      motif: 'ledger',
      palette: 'aged',
      size: 'a4l',
      personIds: ['acervo-institucional'],
      description: SHORT_DESCRIPTION,
    }),
  ],
};

export const EXHIBITIONS: ExhibitionSeed[] = [EXHIBITION_MAIN, EXHIBITION_SMALL];

export function artSpecFor(
  seed: { motif: Motif; palette: Palette; size: SizeKey },
  seedNumber: number,
): ArtSpec {
  const { width, height } = SIZES[seed.size];
  return { motif: seed.motif, palette: seed.palette, width, height, seed: seedNumber };
}
