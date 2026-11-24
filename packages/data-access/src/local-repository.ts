import type {
  AssetId,
  AssetResolution,
  ContentIndex,
  ContentManifest,
  Exhibition,
  ManifestAsset,
  ValidationIssue,
} from '@ccc/types';
import {
  checkExhibitionIntegrity,
  validateContentIndex,
  validateExhibition,
  validateManifest,
} from '@ccc/types';
import { RepositoryError } from './repository.ts';
import type { ExhibitionRepository } from './repository.ts';

/** Lê e interpreta um JSON. Deve lançar erro se a leitura falhar. */
export type JsonFetcher = (url: string) => Promise<unknown>;

export interface LocalRepositoryOptions {
  /** URL (ou caminho) da raiz do conteúdo, ex.: `/content/`. A barra final é opcional. */
  baseUrl: string;
  /** Substitui o `fetch` padrão (testes, outros ambientes). */
  fetchJson?: JsonFetcher;
  /**
   * Informa se o arquivo está disponível neste equipamento. Por padrão todo arquivo publicado é
   * considerado disponível; a camada offline (E13+) fornecerá a implementação real.
   */
  isAssetAvailable?: (asset: ManifestAsset) => boolean | Promise<boolean>;
}

const defaultFetchJson: JsonFetcher = async (url) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${String(response.status)} ao ler ${url}`);
  }
  return (await response.json()) as unknown;
};

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

function describeIssues(issues: ValidationIssue[]): string {
  return issues
    .slice(0, 5)
    .map((issue) => `${issue.path}: ${issue.message}`)
    .join('; ');
}

/** Guarda a promessa enquanto ela é bem-sucedida; uma falha não fica em cache (permite nova tentativa). */
function memoize<T>(load: () => Promise<T>): () => Promise<T> {
  let cached: Promise<T> | null = null;
  return () => {
    cached ??= load().catch((error: unknown) => {
      cached = null;
      throw error;
    });
    return cached;
  };
}

/**
 * Repositório que lê `index.json`, `manifest.json` e os `exhibition.json` a partir de uma raiz de
 * conteúdo local (pasta publicada junto ao aplicativo). Não conhece Firebase, IndexedDB nem React.
 */
export function createLocalRepository(options: LocalRepositoryOptions): ExhibitionRepository {
  const baseUrl = normalizeBaseUrl(options.baseUrl);
  const fetchJson = options.fetchJson ?? defaultFetchJson;
  const isAssetAvailable = options.isAssetAvailable ?? (() => true);
  const exhibitions = new Map<string, Promise<Exhibition>>();

  const read = async (relativePath: string, what: string): Promise<unknown> => {
    try {
      return await fetchJson(`${baseUrl}${relativePath}`);
    } catch (error) {
      const detail = error instanceof Error ? error.message : String(error);
      throw new RepositoryError('load-failed', `Não foi possível ler ${what}: ${detail}`);
    }
  };

  const getIndex = memoize(async (): Promise<ContentIndex> => {
    const result = validateContentIndex(await read('index.json', 'o índice de exposições'));
    if (!result.ok) {
      throw new RepositoryError(
        'invalid-content',
        `Índice de exposições inválido: ${describeIssues(result.issues)}`,
        result.issues,
      );
    }
    return result.value;
  });

  const getManifest = memoize(async (): Promise<ContentManifest> => {
    const result = validateManifest(await read('manifest.json', 'o manifesto de conteúdo'));
    if (!result.ok) {
      throw new RepositoryError(
        'invalid-content',
        `Manifesto inválido: ${describeIssues(result.issues)}`,
        result.issues,
      );
    }
    return result.value;
  });

  const fetchExhibition = async (exhibitionId: string): Promise<Exhibition> => {
    const index = await getIndex();
    const entry = index.exhibitions.find((candidate) => candidate.id === exhibitionId);
    if (!entry) {
      throw new RepositoryError('not-found', `Exposição não encontrada: ${exhibitionId}`);
    }
    const validated = validateExhibition(await read(entry.path, `a exposição ${exhibitionId}`));
    if (!validated.ok) {
      throw new RepositoryError(
        'invalid-content',
        `Exposição ${exhibitionId} inválida: ${describeIssues(validated.issues)}`,
        validated.issues,
      );
    }
    const exhibition = validated.value;
    if (exhibition.id !== entry.id) {
      throw new RepositoryError(
        'invalid-content',
        `O índice aponta ${entry.id}, mas o arquivo declara ${exhibition.id}.`,
      );
    }
    const integrity = checkExhibitionIntegrity(exhibition, await getManifest());
    if (integrity.length > 0) {
      throw new RepositoryError(
        'invalid-content',
        `Exposição ${exhibitionId} com referências inválidas: ${describeIssues(integrity)}`,
        integrity,
      );
    }
    const artworks = exhibition.artworks
      .filter((artwork) => artwork.published)
      .sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
    return { ...exhibition, artworks };
  };

  return {
    listExhibitions: getIndex,

    async getContentVersion() {
      return (await getManifest()).contentVersion;
    },

    loadExhibition(exhibitionId) {
      let pending = exhibitions.get(exhibitionId);
      if (!pending) {
        pending = fetchExhibition(exhibitionId).catch((error: unknown) => {
          exhibitions.delete(exhibitionId);
          throw error;
        });
        exhibitions.set(exhibitionId, pending);
      }
      return pending;
    },

    async resolveAssetUrl(assetId: AssetId): Promise<AssetResolution> {
      let manifest: ContentManifest;
      try {
        manifest = await getManifest();
      } catch {
        return { status: 'failed', reason: 'manifesto de conteúdo indisponível' };
      }
      const asset = manifest.assets.find((candidate) => candidate.id === assetId);
      if (!asset) {
        return { status: 'failed', reason: 'arquivo não consta no manifesto' };
      }
      if (!asset.published) {
        return { status: 'unpublished', reason: 'arquivo ainda não publicado' };
      }
      if (!(await isAssetAvailable(asset))) {
        return {
          status: 'offline-unavailable',
          reason: 'arquivo ainda não está neste equipamento',
        };
      }
      return { status: 'available', url: `${baseUrl}${encodeURI(asset.path)}` };
    },
  };
}
