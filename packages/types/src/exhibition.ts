import type { AssetId } from './asset.ts';

export type ImageFit = 'cover' | 'contain';

/** Ponto focal da imagem, em proporção (0 a 1) da largura e da altura. Usado com `object-position`. */
export interface FocalPoint {
  x: number;
  y: number;
}

/** Referência a uma imagem. O texto alternativo é obrigatório (acessibilidade). */
export interface ImageRef {
  assetId: AssetId;
  width: number;
  height: number;
  alt: string;
  focalPoint?: FocalPoint;
  /** Preferência de enquadramento; ausente = decisão do componente. */
  fit?: ImageFit;
}

/** Tipos de obra/mídia (proposta N-11). `audio` e `video` exigem `playback`. */
export type WorkKind = 'photo' | 'document' | 'map' | 'audio' | 'video';

export interface Playback {
  assetId: AssetId;
  durationSeconds: number;
  captionsAssetId: AssetId | null;
}

export interface Person {
  id: string;
  name: string;
  biography: string;
  /** `null` = sem retrato (estado "sem imagem"). */
  portrait: ImageRef | null;
}

export interface Category {
  id: string;
  label: string;
}

export interface Artwork {
  id: string;
  kind: WorkKind;
  title: string;
  categoryId: string;
  personIds: string[];
  description: string;
  /** Texto livre (ex.: "c. 1950"). `null` = a definir. */
  dateLabel: string | null;
  sourceLabel: string | null;
  creditLabel: string | null;
  /** `null` = sem imagem (estado "sem imagem"). */
  image: ImageRef | null;
  /** Obrigatório para `audio` e `video`; `null` nos demais. */
  playback: Playback | null;
  /** Posição na exposição (0, 1, 2…), usada para ordenar os conjuntos. */
  order: number;
  /** `false` = existe só na administração e não é exibido ao visitante. */
  published: boolean;
}

export interface Credit {
  role: string;
  name: string;
}

export interface ExhibitionAbout {
  paragraphs: string[];
  credits: Credit[];
}

export interface Exhibition {
  schemaVersion: 1;
  id: string;
  title: string;
  subtitle: string | null;
  /** Texto curto da abertura. */
  summary: string;
  /** `true` = conteúdo fictício de demonstração (ADR-009). */
  demo: boolean;
  cover: ImageRef | null;
  about: ExhibitionAbout;
  categories: Category[];
  people: Person[];
  artworks: Artwork[];
}
