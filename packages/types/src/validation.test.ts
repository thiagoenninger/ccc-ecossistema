import { describe, expect, it } from 'vitest';
import type { ContentManifest } from './asset.ts';
import {
  checkExhibitionIntegrity,
  validateContentIndex,
  validateExhibition,
  validateManifest,
} from './validation.ts';

const SHA = 'a'.repeat(64);

function rawExhibition(): Record<string, unknown> {
  return {
    schemaVersion: 1,
    id: 'exposicao-teste',
    title: 'Exposição de teste',
    subtitle: null,
    summary: 'Resumo.',
    demo: true,
    cover: { assetId: 'teste/capa', width: 1600, height: 900, alt: 'Capa' },
    about: { paragraphs: ['Texto.'], credits: [{ role: 'Curadoria', name: 'A definir' }] },
    categories: [{ id: 'fotografias', label: 'Fotografias' }],
    people: [{ id: 'pessoa-a', name: 'Pessoa A', biography: 'Biografia.', portrait: null }],
    artworks: [
      {
        id: 'obra-01',
        kind: 'photo',
        title: 'Obra 1',
        categoryId: 'fotografias',
        personIds: ['pessoa-a'],
        description: 'Descrição.',
        dateLabel: null,
        sourceLabel: null,
        creditLabel: 'Crédito',
        image: {
          assetId: 'teste/obra-01',
          width: 1200,
          height: 800,
          alt: 'Texto alternativo',
          focalPoint: { x: 0.5, y: 0.4 },
          fit: 'cover',
        },
        playback: null,
        order: 0,
        published: true,
      },
    ],
  };
}

function manifest(): ContentManifest {
  const asset = (id: string, mimeType = 'image/svg+xml') => ({
    id,
    path: `${id}.svg`,
    mimeType,
    bytes: 10,
    sha256: SHA,
    published: true,
  });
  return {
    schemaVersion: 1,
    contentVersion: 'teste.1',
    generatedAt: '2026-11-16T12:00:00Z',
    assets: [asset('teste/capa'), asset('teste/obra-01')],
  };
}

function issuesOf(raw: unknown): string[] {
  const result = validateExhibition(raw);
  return result.ok ? [] : result.issues.map((i) => `${i.path}: ${i.message}`);
}

describe('validateExhibition', () => {
  it('aceita uma exposição válida', () => {
    const result = validateExhibition(rawExhibition());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.value.artworks[0]?.image?.focalPoint).toEqual({ x: 0.5, y: 0.4 });
    }
  });

  it('rejeita entradas que não são objetos', () => {
    expect(issuesOf(null)).toContain('$: deve ser um objeto');
    expect(issuesOf([])).toContain('$: deve ser um objeto');
    expect(issuesOf('texto')).toContain('$: deve ser um objeto');
  });

  it('rejeita versão de esquema desconhecida', () => {
    const raw = { ...rawExhibition(), schemaVersion: 2 };
    expect(issuesOf(raw).join('\n')).toContain('$.schemaVersion');
  });

  it('aponta título ausente e id fora do padrão', () => {
    const raw = { ...rawExhibition(), title: ' ', id: 'Id Inválido' };
    const issues = issuesOf(raw).join('\n');
    expect(issues).toContain('$.title');
    expect(issues).toContain('$.id');
  });

  it('exige null explícito para imagem ausente', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    delete artworks[0]?.['image'];
    expect(issuesOf(raw).join('\n')).toContain('$.artworks[0].image: campo obrigatório');
  });

  it('aceita obra sem imagem (image: null)', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    if (artworks[0]) artworks[0]['image'] = null;
    expect(validateExhibition(raw).ok).toBe(true);
  });

  it('exige texto alternativo e dimensões positivas', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    if (artworks[0]) {
      artworks[0]['image'] = { assetId: 'teste/obra-01', width: 0, height: 800, alt: '' };
    }
    const issues = issuesOf(raw).join('\n');
    expect(issues).toContain('image.width');
    expect(issues).toContain('image.alt');
  });

  it('rejeita ponto focal fora de 0–1 e fit inválido', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    if (artworks[0]) {
      artworks[0]['image'] = {
        assetId: 'teste/obra-01',
        width: 10,
        height: 10,
        alt: 'a',
        focalPoint: { x: 1.2, y: 0.5 },
        fit: 'fill',
      };
    }
    const issues = issuesOf(raw).join('\n');
    expect(issues).toContain('focalPoint');
    expect(issues).toContain('image.fit');
  });

  it('rejeita tipo de obra desconhecido', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    if (artworks[0]) artworks[0]['kind'] = 'escultura';
    expect(issuesOf(raw).join('\n')).toContain('$.artworks[0].kind');
  });

  it('exige playback para vídeo e o proíbe para foto', () => {
    const video = rawExhibition();
    const videoWorks = video['artworks'] as Record<string, unknown>[];
    if (videoWorks[0]) videoWorks[0]['kind'] = 'video';
    expect(issuesOf(video).join('\n')).toContain('exigem playback');

    const photo = rawExhibition();
    const photoWorks = photo['artworks'] as Record<string, unknown>[];
    if (photoWorks[0]) {
      photoWorks[0]['playback'] = {
        assetId: 'teste/video',
        durationSeconds: 10,
        captionsAssetId: null,
      };
    }
    expect(issuesOf(photo).join('\n')).toContain('não devem ter playback');
  });

  it('aceita vídeo com playback válido', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    if (artworks[0]) {
      artworks[0]['kind'] = 'video';
      artworks[0]['playback'] = {
        assetId: 'teste/video',
        durationSeconds: 74,
        captionsAssetId: 'teste/legenda',
      };
    }
    expect(validateExhibition(raw).ok).toBe(true);
  });

  it('rejeita referências a categoria e pessoa inexistentes', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    if (artworks[0]) {
      artworks[0]['categoryId'] = 'mapas';
      artworks[0]['personIds'] = ['pessoa-x'];
    }
    const issues = issuesOf(raw).join('\n');
    expect(issues).toContain('categoria inexistente: mapas');
    expect(issues).toContain('pessoa inexistente: pessoa-x');
  });

  it('rejeita identificadores duplicados', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    if (artworks[0]) artworks.push({ ...artworks[0] });
    expect(issuesOf(raw).join('\n')).toContain('identificador duplicado: obra-01');
  });

  it('exige ordem inteira não negativa e flag de publicação', () => {
    const raw = rawExhibition();
    const artworks = raw['artworks'] as Record<string, unknown>[];
    if (artworks[0]) {
      artworks[0]['order'] = -1;
      artworks[0]['published'] = 'sim';
    }
    const issues = issuesOf(raw).join('\n');
    expect(issues).toContain('order');
    expect(issues).toContain('published');
  });

  it('relata todos os problemas de uma vez, com caminho', () => {
    const raw = { ...rawExhibition(), title: '', summary: '' };
    const issues = issuesOf(raw);
    expect(issues.length).toBeGreaterThanOrEqual(2);
  });
});

describe('validateManifest', () => {
  it('aceita um manifesto válido', () => {
    expect(validateManifest(manifest()).ok).toBe(true);
  });

  it('rejeita caminhos absolutos, com ".." ou com esquema', () => {
    for (const path of ['/etc/passwd', '../fora.svg', 'https://exemplo.com/a.svg', 'a\\b.svg']) {
      const m = manifest();
      const first = m.assets[0];
      if (first) first.path = path;
      expect(validateManifest(m).ok, path).toBe(false);
    }
  });

  it('rejeita checksum inválido, data inválida e ids duplicados', () => {
    const m = manifest();
    const [first, second] = m.assets;
    if (first && second) {
      first.sha256 = 'XYZ';
      second.id = first.id;
    }
    m.generatedAt = 'ontem';
    const result = validateManifest(m);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      const text = result.issues.map((i) => i.path).join('\n');
      expect(text).toContain('sha256');
      expect(text).toContain('generatedAt');
      expect(text).toContain('$.assets');
    }
  });
});

describe('validateContentIndex', () => {
  const index = {
    schemaVersion: 1,
    defaultExhibitionId: 'a',
    exhibitions: [
      { id: 'a', title: 'A', path: 'a/exhibition.json' },
      { id: 'b', title: 'B', path: 'b/exhibition.json' },
    ],
  };

  it('aceita um índice válido', () => {
    expect(validateContentIndex(index).ok).toBe(true);
  });

  it('rejeita exposição padrão inexistente e lista vazia', () => {
    expect(validateContentIndex({ ...index, defaultExhibitionId: 'z' }).ok).toBe(false);
    expect(validateContentIndex({ ...index, exhibitions: [] }).ok).toBe(false);
  });

  it('rejeita caminhos que saem da raiz do conteúdo', () => {
    const bad = { ...index, exhibitions: [{ id: 'a', title: 'A', path: '../a.json' }] };
    expect(validateContentIndex(bad).ok).toBe(false);
  });
});

describe('checkExhibitionIntegrity', () => {
  it('não encontra problemas quando todos os arquivos existem', () => {
    const result = validateExhibition(rawExhibition());
    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(checkExhibitionIntegrity(result.value, manifest())).toEqual([]);
    }
  });

  it('aponta arquivo ausente do manifesto e tipo de arquivo inesperado', () => {
    const result = validateExhibition(rawExhibition());
    if (!result.ok) throw new Error('fixture inválida');
    const m = manifest();
    m.assets = m.assets.filter((a) => a.id !== 'teste/capa');
    const second = m.assets[0];
    if (second) second.mimeType = 'video/mp4';
    const text = checkExhibitionIntegrity(result.value, m)
      .map((i) => i.message)
      .join('\n');
    expect(text).toContain('arquivo ausente do manifesto: teste/capa');
    expect(text).toContain('tipo de arquivo inesperado');
  });
});
