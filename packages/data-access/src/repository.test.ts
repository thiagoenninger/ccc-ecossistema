import { describe, expect, it, vi } from 'vitest';
import type { ContentManifest, Exhibition } from '@ccc/types';
import { RepositoryError, createLocalRepository } from './index.ts';
import type { JsonFetcher } from './index.ts';

const SHA = 'b'.repeat(64);

type RawArtwork = Record<string, unknown>;

function buildExhibition(id: string, workCount: number, overrides: Partial<RawArtwork>[] = []) {
  const artworks: RawArtwork[] = Array.from({ length: workCount }, (_, i) => ({
    id: `obra-${String(i + 1).padStart(2, '0')}`,
    kind: 'photo',
    title: `Obra ${String(i + 1)}`,
    categoryId: 'fotografias',
    personIds: [],
    description: 'Descrição.',
    dateLabel: null,
    sourceLabel: null,
    creditLabel: null,
    image: {
      assetId: `${id}/obra-${String(i + 1).padStart(2, '0')}`,
      width: 1200,
      height: 800,
      alt: 'Texto alternativo',
    },
    playback: null,
    order: i,
    published: true,
    ...overrides[i],
  }));
  return {
    schemaVersion: 1,
    id,
    title: `Exposição ${id}`,
    subtitle: null,
    summary: 'Resumo.',
    demo: true,
    cover: null,
    about: { paragraphs: ['Texto.'], credits: [] },
    categories: [{ id: 'fotografias', label: 'Fotografias' }],
    people: [],
    artworks,
  };
}

function buildManifest(ids: string[], extra: Partial<ContentManifest['assets'][number]>[] = []) {
  return {
    schemaVersion: 1,
    contentVersion: '2026.11.16-teste.1',
    generatedAt: '2026-11-16T12:00:00Z',
    assets: ids.map((id, i) => ({
      id,
      path: `${id}.svg`,
      mimeType: 'image/svg+xml',
      bytes: 100,
      sha256: SHA,
      published: true,
      ...extra[i],
    })),
  };
}

function assetIds(exhibitionId: string, count: number): string[] {
  return Array.from(
    { length: count },
    (_, i) => `${exhibitionId}/obra-${String(i + 1).padStart(2, '0')}`,
  );
}

function memoryFetcher(files: Record<string, unknown>): JsonFetcher & ReturnType<typeof vi.fn> {
  return vi.fn((url: string) => {
    if (url in files) return Promise.resolve(files[url]);
    return Promise.reject(new Error(`HTTP 404 ao ler ${url}`));
  });
}

function standardFiles(): Record<string, unknown> {
  return {
    '/content/index.json': {
      schemaVersion: 1,
      defaultExhibitionId: 'um',
      exhibitions: [
        { id: 'um', title: 'Um', path: 'um/exhibition.json' },
        { id: 'tres', title: 'Três', path: 'tres/exhibition.json' },
        { id: 'oito', title: 'Oito', path: 'oito/exhibition.json' },
      ],
    },
    '/content/manifest.json': buildManifest([
      ...assetIds('um', 1),
      ...assetIds('tres', 3),
      ...assetIds('oito', 8),
    ]),
    '/content/um/exhibition.json': buildExhibition('um', 1),
    '/content/tres/exhibition.json': buildExhibition('tres', 3),
    '/content/oito/exhibition.json': buildExhibition('oito', 8),
  };
}

describe('createLocalRepository — carregamento', () => {
  it('lista as exposições e informa a padrão', async () => {
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(standardFiles()),
    });

    const index = await repository.listExhibitions();

    expect(index.defaultExhibitionId).toBe('um');
    expect(index.exhibitions.map((e) => e.id)).toEqual(['um', 'tres', 'oito']);
  });

  it('carrega exposições com 1, 3 e 8 obras sem alterar código (apenas dados)', async () => {
    const repository = createLocalRepository({
      baseUrl: '/content',
      fetchJson: memoryFetcher(standardFiles()),
    });

    const counts: Record<string, number> = {};
    for (const entry of (await repository.listExhibitions()).exhibitions) {
      const exhibition: Exhibition = await repository.loadExhibition(entry.id);
      counts[entry.id] = exhibition.artworks.length;
    }

    expect(counts).toEqual({ um: 1, tres: 3, oito: 8 });
  });

  it('aceita baseUrl com ou sem barra final', async () => {
    const files = standardFiles();
    for (const baseUrl of ['/content', '/content/']) {
      const repository = createLocalRepository({ baseUrl, fetchJson: memoryFetcher(files) });
      await expect(repository.getContentVersion()).resolves.toBe('2026.11.16-teste.1');
    }
  });

  it('entrega apenas obras publicadas, ordenadas por order', async () => {
    const files = standardFiles();
    files['/content/tres/exhibition.json'] = buildExhibition('tres', 3, [
      { order: 2 },
      { published: false },
      { order: 0 },
    ]);
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });

    const exhibition = await repository.loadExhibition('tres');

    expect(exhibition.artworks.map((a) => a.id)).toEqual(['obra-03', 'obra-01']);
  });

  it('usa o identificador como desempate na ordenação', async () => {
    const files = standardFiles();
    files['/content/tres/exhibition.json'] = buildExhibition('tres', 3, [
      { order: 1 },
      { order: 1 },
      { order: 0 },
    ]);
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });

    const exhibition = await repository.loadExhibition('tres');

    expect(exhibition.artworks.map((a) => a.id)).toEqual(['obra-03', 'obra-01', 'obra-02']);
  });

  it('reaproveita índice, manifesto e exposições já lidos', async () => {
    const fetchJson = memoryFetcher(standardFiles());
    const repository = createLocalRepository({ baseUrl: '/content/', fetchJson });

    await repository.loadExhibition('um');
    await repository.loadExhibition('um');
    await repository.listExhibitions();
    await repository.getContentVersion();

    const urls = fetchJson.mock.calls.map((call) => call[0] as string);
    expect(urls.sort()).toEqual([
      '/content/index.json',
      '/content/manifest.json',
      '/content/um/exhibition.json',
    ]);
  });
});

describe('createLocalRepository — erros', () => {
  it('lança not-found para exposição fora do índice', async () => {
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(standardFiles()),
    });

    await expect(repository.loadExhibition('inexistente')).rejects.toMatchObject({
      name: 'RepositoryError',
      code: 'not-found',
    });
  });

  it('lança load-failed quando o arquivo não pode ser lido e permite nova tentativa', async () => {
    const files = standardFiles();
    const missing = files['/content/um/exhibition.json'];
    delete files['/content/um/exhibition.json'];
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });

    await expect(repository.loadExhibition('um')).rejects.toMatchObject({ code: 'load-failed' });

    files['/content/um/exhibition.json'] = missing;
    await expect(repository.loadExhibition('um')).resolves.toMatchObject({ id: 'um' });
  });

  it('lança invalid-content com a lista de problemas', async () => {
    const files = standardFiles();
    files['/content/um/exhibition.json'] = { ...buildExhibition('um', 1), title: '' };
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });

    const error = await repository.loadExhibition('um').catch((e: unknown) => e);

    expect(error).toBeInstanceOf(RepositoryError);
    expect((error as RepositoryError).code).toBe('invalid-content');
    expect((error as RepositoryError).issues.map((i) => i.path)).toContain('$.title');
  });

  it('lança invalid-content quando o arquivo referenciado não está no manifesto', async () => {
    const files = standardFiles();
    files['/content/manifest.json'] = buildManifest(
      assetIds('tres', 3).concat(assetIds('oito', 8)),
    );
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });

    await expect(repository.loadExhibition('um')).rejects.toMatchObject({
      code: 'invalid-content',
    });
  });

  it('lança invalid-content quando o id do arquivo difere do índice', async () => {
    const files = standardFiles();
    files['/content/um/exhibition.json'] = buildExhibition('outra', 1);
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });

    await expect(repository.loadExhibition('um')).rejects.toMatchObject({
      code: 'invalid-content',
    });
  });

  it('lança invalid-content para índice e manifesto malformados', async () => {
    const files = standardFiles();
    files['/content/index.json'] = { schemaVersion: 1, defaultExhibitionId: 'x', exhibitions: [] };
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });
    await expect(repository.listExhibitions()).rejects.toMatchObject({ code: 'invalid-content' });

    const files2 = standardFiles();
    files2['/content/manifest.json'] = { schemaVersion: 1 };
    const repository2 = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files2),
    });
    await expect(repository2.getContentVersion()).rejects.toMatchObject({
      code: 'invalid-content',
    });
  });
});

describe('createLocalRepository — resolveAssetUrl', () => {
  it('devolve a URL de um arquivo disponível', async () => {
    const repository = createLocalRepository({
      baseUrl: '/content',
      fetchJson: memoryFetcher(standardFiles()),
    });

    await expect(repository.resolveAssetUrl('um/obra-01')).resolves.toEqual({
      status: 'available',
      url: '/content/um/obra-01.svg',
    });
  });

  it('informa failed para arquivo desconhecido', async () => {
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(standardFiles()),
    });

    await expect(repository.resolveAssetUrl('nao/existe')).resolves.toMatchObject({
      status: 'failed',
    });
  });

  it('informa failed (sem lançar) quando o manifesto não pode ser lido', async () => {
    const files = standardFiles();
    delete files['/content/manifest.json'];
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });

    await expect(repository.resolveAssetUrl('um/obra-01')).resolves.toMatchObject({
      status: 'failed',
    });
  });

  it('informa unpublished para arquivo não publicado', async () => {
    const files = standardFiles();
    files['/content/manifest.json'] = buildManifest(
      [...assetIds('um', 1), ...assetIds('tres', 3), ...assetIds('oito', 8)],
      [{ published: false }],
    );
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(files),
    });

    await expect(repository.resolveAssetUrl('um/obra-01')).resolves.toMatchObject({
      status: 'unpublished',
    });
  });

  it('informa offline-unavailable quando o equipamento ainda não tem o arquivo', async () => {
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(standardFiles()),
      isAssetAvailable: (asset) => asset.id !== 'um/obra-01',
    });

    await expect(repository.resolveAssetUrl('um/obra-01')).resolves.toMatchObject({
      status: 'offline-unavailable',
    });
    await expect(repository.resolveAssetUrl('tres/obra-01')).resolves.toMatchObject({
      status: 'available',
    });
  });

  it('aceita disponibilidade assíncrona', async () => {
    const repository = createLocalRepository({
      baseUrl: '/content/',
      fetchJson: memoryFetcher(standardFiles()),
      isAssetAvailable: () => Promise.resolve(false),
    });

    await expect(repository.resolveAssetUrl('um/obra-01')).resolves.toMatchObject({
      status: 'offline-unavailable',
    });
  });
});
