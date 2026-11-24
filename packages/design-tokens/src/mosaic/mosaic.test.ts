import { describe, expect, it } from 'vitest';
import { computeMosaicLayout, viewportProfile } from './layout.ts';
import type { MosaicRect, MosaicTemplate } from './templates.ts';
import {
  heroShare,
  MOSAIC_AREA,
  MOSAIC_GAP,
  MOSAIC_TEMPLATE_IDS,
  MOSAIC_TEMPLATES,
  templateForCount,
} from './templates.ts';

const ALL: readonly MosaicTemplate[] = MOSAIC_TEMPLATE_IDS.map((id) => MOSAIC_TEMPLATES[id]);

function inside(rect: MosaicRect, w: number, h: number, eps = 1e-6): boolean {
  return (
    rect.x >= -eps && rect.y >= -eps && rect.x + rect.w <= w + eps && rect.y + rect.h <= h + eps
  );
}

/** Distância entre dois retângulos (0 se se sobrepõem em ambos os eixos). */
function separation(a: MosaicRect, b: MosaicRect): { dx: number; dy: number } {
  const dx = Math.max(b.x - (a.x + a.w), a.x - (b.x + b.w));
  const dy = Math.max(b.y - (a.y + a.h), a.y - (b.y + b.h));
  return { dx, dy };
}

describe('templates 1–9 (Handoff §5.2)', () => {
  it('expõe nove templates cujo número de ladrilhos é o próprio identificador', () => {
    expect(MOSAIC_TEMPLATE_IDS).toHaveLength(9);
    for (const t of ALL) {
      expect(t.tiles).toHaveLength(t.id);
      expect(t.count).toBe(t.id);
    }
  });

  it('mantém todos os ladrilhos e slots dentro da área 1800×750', () => {
    for (const t of ALL) {
      for (const tile of t.tiles) expect(inside(tile, MOSAIC_AREA.w, MOSAIC_AREA.h)).toBe(true);
      if (t.slot) expect(inside(t.slot, MOSAIC_AREA.w, MOSAIC_AREA.h)).toBe(true);
    }
  });

  it('não tem sobreposição e respeita o intervalo de 10 px entre ladrilhos e slot', () => {
    for (const t of ALL) {
      const rects = t.slot ? [...t.tiles, t.slot] : [...t.tiles];
      for (let i = 0; i < rects.length; i += 1) {
        for (let j = i + 1; j < rects.length; j += 1) {
          const { dx, dy } = separation(rects[i] as MosaicRect, rects[j] as MosaicRect);
          // Sem sobreposição: separados em pelo menos um eixo; e, se separados, a distância mínima é o intervalo.
          expect(
            Math.max(dx, dy),
            `template ${String(t.id)} (${String(i)},${String(j)})`,
          ).toBeGreaterThanOrEqual(MOSAIC_GAP);
        }
      }
    }
  });

  it('o herói é o primeiro ladrilho e é o maior de cada template com 3+ obras', () => {
    for (const t of ALL.filter((x) => x.id >= 3)) {
      const areas = t.tiles.map((tile) => tile.w * tile.h);
      expect(Math.max(...areas)).toBe(areas[0]);
    }
  });

  it('reproduz a participação do herói do Handoff §5.1', () => {
    const expected: Record<number, number> = {
      1: 0.889,
      2: 0.611,
      3: 0.478,
      4: 0.5,
      5: 0.277,
      6: 0.239,
      7: 0.218,
      8: 0.218,
      9: 0.218,
    };
    for (const t of ALL) {
      expect(heroShare(t)).toBeCloseTo(expected[t.id] as number, 3);
    }
  });

  it('T9 respeita o herói mínimo de 20 %', () => {
    expect(heroShare(MOSAIC_TEMPLATES[9])).toBeGreaterThanOrEqual(0.2);
  });

  it('slots editoriais (C-05): só existem onde há área livre', () => {
    const withSlot = ALL.filter((t) => t.slot !== null).map((t) => t.id);
    expect(withSlot).toEqual([3, 5, 6, 7, 8]);
    expect(MOSAIC_TEMPLATES[8].slot).toEqual({ x: 990, y: 470, w: 810, h: 280 });
  });

  it('ocupação: ladrilhos e slot cobrem ao menos 90 % da área nos templates com slot', () => {
    for (const t of ALL.filter((x) => x.slot)) {
      const covered =
        t.tiles.reduce((s, r) => s + r.w * r.h, 0) + (t.slot ? t.slot.w * t.slot.h : 0);
      expect(covered / (MOSAIC_AREA.w * MOSAIC_AREA.h)).toBeGreaterThan(0.9);
    }
  });

  it('templateForCount escolhe o gabarito pelo número de obras e rejeita valores fora de 1–9', () => {
    expect(templateForCount(5).id).toBe(5);
    expect(() => templateForCount(0)).toThrow(RangeError);
    expect(() => templateForCount(10)).toThrow(RangeError);
    expect(() => templateForCount(2.5)).toThrow(RangeError);
  });
});

describe('computeMosaicLayout', () => {
  it('em escala 1 devolve exatamente as coordenadas do Handoff (T8)', () => {
    const layout = computeMosaicLayout(MOSAIC_TEMPLATES[8], 1800);
    expect(layout.scale).toBe(1);
    expect(layout.height).toBe(750);
    expect(layout.tiles[0]?.rect).toEqual({ x: 0, y: 0, w: 640, h: 460 });
    expect(layout.tiles[7]?.rect).toEqual({ x: 430, y: 470, w: 550, h: 280 });
    expect(layout.slot).toEqual({ x: 990, y: 470, w: 810, h: 280 });
  });

  it('classifica herói, médio e pequeno', () => {
    const t8 = computeMosaicLayout(MOSAIC_TEMPLATES[8], 1800).tiles.map((t) => t.sizeClass);
    expect(t8).toEqual(['hero', 'medium', 'medium', 'small', 'small', 'small', 'medium', 'medium']);
    const t1 = computeMosaicLayout(MOSAIC_TEMPLATES[1], 1800).tiles.map((t) => t.sizeClass);
    expect(t1).toEqual(['hero']);
  });

  it('mantém o intervalo de 10 px e os ladrilhos dentro da área em larguras de tablet', () => {
    for (const width of [1294, 1216, 1800, 1920]) {
      for (const t of ALL) {
        const layout = computeMosaicLayout(t, width);
        const rects = layout.slot
          ? [...layout.tiles.map((x) => x.rect), layout.slot]
          : layout.tiles.map((x) => x.rect);
        for (const rect of rects)
          expect(inside(rect, layout.width, layout.height, 1e-6)).toBe(true);
        for (let i = 0; i < rects.length; i += 1) {
          for (let j = i + 1; j < rects.length; j += 1) {
            const { dx, dy } = separation(rects[i] as MosaicRect, rects[j] as MosaicRect);
            expect(Math.max(dx, dy)).toBeGreaterThanOrEqual(MOSAIC_GAP - 1e-6);
          }
        }
      }
    }
  });

  it('altura proporcional: 1800×750', () => {
    expect(computeMosaicLayout(MOSAIC_TEMPLATES[6], 1294).height).toBeCloseTo(
      (1294 * 750) / 1800,
      6,
    );
  });

  it('rejeita largura inválida', () => {
    expect(() => computeMosaicLayout(MOSAIC_TEMPLATES[6], 0)).toThrow(RangeError);
    expect(() => computeMosaicLayout(MOSAIC_TEMPLATES[6], Number.NaN)).toThrow(RangeError);
  });

  it('critério de tablet (C-06): menor lado ≥ 150 px nos templates permitidos pelo perfil', () => {
    const cases = [
      { viewport: 1366, margin: 36 },
      { viewport: 1280, margin: 32 },
    ];
    for (const { viewport, margin } of cases) {
      const profile = viewportProfile(viewport);
      expect(profile.margin).toBe(margin);
      for (const t of ALL.filter((x) => x.id <= profile.maxItems)) {
        const layout = computeMosaicLayout(t, viewport - 2 * profile.margin);
        for (const tile of layout.tiles) {
          expect(
            Math.min(tile.rect.w, tile.rect.h),
            `T${String(t.id)} @${String(viewport)}`,
          ).toBeGreaterThanOrEqual(150);
        }
      }
    }
  });
});

describe('viewportProfile (Handoff §5.5)', () => {
  it('mapeia larguras para perfis, margens e itens simultâneos', () => {
    expect(viewportProfile(1920)).toMatchObject({
      name: 'wide',
      margin: 60,
      maxItems: 8,
      maxItemsLibrary: 9,
    });
    expect(viewportProfile(1366)).toMatchObject({ name: 'compact', margin: 36, maxItems: 6 });
    expect(viewportProfile(1280)).toMatchObject({ name: 'tablet', margin: 32, maxItems: 5 });
    expect(viewportProfile(1600).name).toBe('wide');
    expect(viewportProfile(1299).name).toBe('tablet');
  });
});
