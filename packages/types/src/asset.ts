/** Identificador estável de um arquivo (imagem, vídeo, áudio, legenda). Ex.: `cubatao-em-imagens/obra-01`. */
export type AssetId = string;

/**
 * Estado de um arquivo para quem o consome (ADR-007).
 * - `available`: pronto para uso (há URL).
 * - `offline-unavailable`: o registro existe, mas o arquivo ainda não está neste equipamento.
 * - `failed`: o arquivo devia estar disponível e não pôde ser resolvido.
 * - `unpublished`: existe só na administração; nunca deve ser exibido ao visitante.
 */
export type AssetStatus = 'available' | 'offline-unavailable' | 'failed' | 'unpublished';

export type UnavailableAssetStatus = Exclude<AssetStatus, 'available'>;

export type AssetResolution =
  { status: 'available'; url: string } | { status: UnavailableAssetStatus; reason: string };

/** Entrada do manifesto de conteúdo: descreve um arquivo e permite verificar sua integridade. */
export interface ManifestAsset {
  id: AssetId;
  /** Caminho relativo à raiz do conteúdo (nunca absoluto, nunca com `..`). */
  path: string;
  mimeType: string;
  bytes: number;
  /** SHA-256 em hexadecimal minúsculo (64 caracteres). */
  sha256: string;
  published: boolean;
}

/** Manifesto versionado de uma publicação de conteúdo. */
export interface ContentManifest {
  schemaVersion: 1;
  /** Versão do conteúdo (ex.: `2026.11.16-demo.1`). Muda quando qualquer arquivo ou dado muda. */
  contentVersion: string;
  /** Instante de geração, ISO 8601. */
  generatedAt: string;
  assets: ManifestAsset[];
}

export interface ContentIndexEntry {
  id: string;
  title: string;
  /** Caminho do `exhibition.json`, relativo à raiz do conteúdo. */
  path: string;
}

/** Lista de exposições publicadas em um equipamento. Trocar de exposição = alterar este arquivo e os dados. */
export interface ContentIndex {
  schemaVersion: 1;
  defaultExhibitionId: string;
  exhibitions: ContentIndexEntry[];
}
