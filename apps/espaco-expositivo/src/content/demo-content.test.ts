// @vitest-environment node
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { describe, expect, it } from 'vitest';
import { createLocalRepository } from '@ccc/data-access';
import type { Artwork, ContentIndex, ContentManifest, Exhibition } from '@ccc/types';
import {
  checkExhibitionIntegrity,
  validateContentIndex,
  validateExhibition,
  validateManifest,
} from '@ccc/types';
import { buildDemoContent } from '../../scripts/demo-content/generate.ts';

/**
 * Valida o conteúdo de demonstração versionado em `public/content`: contratos, integridade dos
 * arquivos, cobertura de casos de teste (formatos, títulos, categorias) e carga pelo repositório.
 */

const ROOT = resolve(import.meta.dirname, '../../public/content');

function readJson(path: string): unknown {
  return JSON.parse(readFileSync(join(ROOT, path), 'utf-8')) as unknown;
}

function must<T>(result: { ok: true; value: T } | { ok: false; issues: unknown[] }): T {
  if (!result.ok) {
    throw new Error(`Contrato inválido: ${JSON.stringify(result.issues)}`);
  }
  return result.value;
}

const index: ContentIndex = must(validateContentIndex(readJson('index.json')));
const manifest: ContentManifest = must(validateManifest(readJson('manifest.json')));
const exhibitions: Exhibition[] = index.exhibitions.map((entry) =>
  must(validateExhibition(readJson(entry.path))),
);

function listFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory)) {
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) {
      files.push(...listFiles(full));
    } else {
      files.push(relative(ROOT, full).split(sep).join('/'));
    }
  }
  return files;
}

function orientation(artwork: Artwork): 'horizontal' | 'vertical' | 'quadrada' | null {
  const image = artwork.image;
  if (!image) return null;
  if (image.width === image.height) return 'quadrada';
  return image.width > image.height ? 'horizontal' : 'vertical';
}

describe('contratos do conteúdo de demonstração', () => {
  it('declara duas exposições e uma exposição padrão existente', () => {
    expect(index.exhibitions.map((e) => e.id)).toEqual([
      'cubatao-em-imagens',
      'memorias-de-oficina',
    ]);
    expect(index.exhibitions.some((e) => e.id === index.defaultExhibitionId)).toBe(true);
  });

  it('não tem referências quebradas entre as exposições e o manifesto', () => {
    for (const exhibition of exhibitions) {
      expect(checkExhibitionIntegrity(exhibition, manifest), exhibition.id).toEqual([]);
    }
  });

  it('marca todas as exposições como demonstração e rotula os créditos das obras', () => {
    for (const exhibition of exhibitions) {
      expect(exhibition.demo).toBe(true);
      for (const artwork of exhibition.artworks) {
        expect(artwork.creditLabel, artwork.id).toMatch(/demonstração/i);
      }
    }
  });
});

describe('arquivos do manifesto', () => {
  it('cada arquivo existe, com o tamanho e o SHA-256 declarados', () => {
    for (const asset of manifest.assets) {
      const full = join(ROOT, asset.path);
      expect(existsSync(full), asset.path).toBe(true);
      const bytes = readFileSync(full);
      expect(bytes.length, asset.path).toBe(asset.bytes);
      expect(createHash('sha256').update(bytes).digest('hex'), asset.path).toBe(asset.sha256);
    }
  });

  it('não há arquivos sobrando fora do manifesto (além dos dados e da licença)', () => {
    const declared = new Set(manifest.assets.map((a) => a.path));
    const allowed = new Set([
      'index.json',
      'manifest.json',
      'LICENCAS.md',
      ...index.exhibitions.map((e) => e.path),
    ]);
    for (const file of listFiles(ROOT)) {
      expect(declared.has(file) || allowed.has(file), file).toBe(true);
    }
  });

  it('todas as imagens são SVG procedurais com aviso de demonstração', () => {
    for (const asset of manifest.assets) {
      expect(asset.mimeType).toBe('image/svg+xml');
      const text = readFileSync(join(ROOT, asset.path), 'utf-8');
      expect(text).toContain('DEMONSTRAÇÃO');
      expect(text).not.toMatch(/https?:\/\/(?!www\.w3\.org)/);
    }
  });

  it('o conteúdo versionado é idêntico ao gerado pelo script (determinismo)', () => {
    const generated = buildDemoContent();
    for (const [path, content] of generated) {
      expect(readFileSync(join(ROOT, path), 'utf-8'), path).toBe(content);
    }
    expect(listFiles(ROOT).sort()).toEqual([...generated.keys()].sort());
  });
});

describe('cobertura de casos de teste — "Cubatão em imagens"', () => {
  const main = exhibitions.find((e) => e.id === 'cubatao-em-imagens');
  if (!main) throw new Error('Exposição principal ausente');

  it('tem 24 obras publicadas, na ordem, sem posições repetidas', () => {
    expect(main.artworks).toHaveLength(24);
    expect(main.artworks.every((a) => a.published)).toBe(true);
    expect(new Set(main.artworks.map((a) => a.order)).size).toBe(24);
  });

  it('inclui fotografias, documentos e mapas, e cada categoria é usada', () => {
    const kinds = new Set(main.artworks.map((a) => a.kind));
    expect(kinds).toEqual(new Set(['photo', 'document', 'map']));
    for (const category of main.categories) {
      expect(
        main.artworks.some((a) => a.categoryId === category.id),
        category.id,
      ).toBe(true);
    }
  });

  it('inclui imagens horizontais, verticais, quadradas e panorâmica', () => {
    const found = new Set(main.artworks.map(orientation));
    expect(found.has('horizontal')).toBe(true);
    expect(found.has('vertical')).toBe(true);
    expect(found.has('quadrada')).toBe(true);
    expect(main.artworks.some((a) => a.image && a.image.width / a.image.height >= 2.4)).toBe(true);
  });

  it('inclui títulos curtos e títulos longos', () => {
    expect(main.artworks.some((a) => a.title.length <= 12)).toBe(true);
    expect(main.artworks.some((a) => a.title.length >= 80)).toBe(true);
  });

  it('documentos e mapas usam contain; fotografias usam cover', () => {
    for (const artwork of main.artworks) {
      const expected = artwork.kind === 'photo' ? 'cover' : 'contain';
      expect(artwork.image?.fit, artwork.id).toBe(expected);
    }
  });

  it('toda imagem tem texto alternativo descritivo', () => {
    for (const artwork of main.artworks) {
      expect(artwork.image?.alt.length ?? 0, artwork.id).toBeGreaterThan(20);
    }
  });

  it('cobre estados de dados: sem retrato, sem autoria, sem data e descrição longa', () => {
    expect(main.people.some((p) => p.portrait === null)).toBe(true);
    expect(main.people.some((p) => p.portrait !== null)).toBe(true);
    expect(main.artworks.some((a) => a.personIds.length === 0)).toBe(true);
    expect(main.artworks.some((a) => a.personIds.length >= 2)).toBe(true);
    expect(main.artworks.some((a) => a.dateLabel === null)).toBe(true);
    expect(main.artworks.some((a) => a.description.length > 400)).toBe(true);
  });

  it('inclui imagens muito claras e muito escuras para os testes de contraste da E04', () => {
    const palettes = readFileSync(
      join(ROOT, 'cubatao-em-imagens/images/fachada-caiada-ao-meio-dia.svg'),
      'utf-8',
    );
    const dark = readFileSync(
      join(ROOT, 'cubatao-em-imagens/images/patio-ao-anoitecer.svg'),
      'utf-8',
    );
    expect(palettes).toContain('#FBFAF6');
    expect(dark).toContain('#0C0F12');
  });
});

describe('segunda exposição — poucas obras', () => {
  it('tem 6 obras, mistura de categorias, e carrega sem alterar código', () => {
    const small = exhibitions.find((e) => e.id === 'memorias-de-oficina');
    expect(small?.artworks).toHaveLength(6);
    expect(new Set(small?.artworks.map((a) => a.kind))).toEqual(
      new Set(['photo', 'document', 'map']),
    );
  });
});

describe('carga pelo repositório local (aceite da E03)', () => {
  const repository = createLocalRepository({
    baseUrl: '/content/',
    fetchJson: (url) => {
      const path = url.replace(/^\/content\//, '');
      return Promise.resolve(JSON.parse(readFileSync(join(ROOT, path), 'utf-8')) as unknown);
    },
  });

  it('carrega as duas exposições do índice e resolve todas as imagens', async () => {
    const list = await repository.listExhibitions();
    const counts: Record<string, number> = {};
    for (const entry of list.exhibitions) {
      const exhibition = await repository.loadExhibition(entry.id);
      counts[entry.id] = exhibition.artworks.length;
      for (const artwork of exhibition.artworks) {
        if (artwork.image) {
          const resolution = await repository.resolveAssetUrl(artwork.image.assetId);
          expect(resolution.status, artwork.id).toBe('available');
        }
      }
    }
    expect(counts).toEqual({ 'cubatao-em-imagens': 24, 'memorias-de-oficina': 6 });
  });

  it('informa a versão do conteúdo do manifesto', async () => {
    await expect(repository.getContentVersion()).resolves.toBe(manifest.contentVersion);
  });
});
