import { MOSAIC_TEMPLATE_IDS, MOSAIC_TEMPLATES, computeMosaicLayout } from '@ccc/design-tokens';
import type { TileSizeClass } from '@ccc/design-tokens';
import type { FocalPoint, ImageFit } from '@ccc/types';
import { computeImagePlacement } from '@ccc/ui';
import {
  CAPTION_SHADE,
  PLATEAU_OPACITY,
  captionTextRect,
  measureCaptionContrast,
  relativeLuminance,
} from './contrast.ts';
import type { CaptionContrast } from './contrast.ts';

/**
 * Medição de contraste das legendas no navegador (Handoff §11): rasteriza o ladrilho SEM legenda,
 * aplica o degradê, mede o retângulo do texto e toma o pixel mais claro.
 * Requer canvas; por isso roda no harness (`mosaic.html`) e não no Vitest/jsdom.
 */

export interface MeasureImage {
  id: string;
  url: string;
  width: number;
  height: number;
  fit: ImageFit;
  focalPoint?: FocalPoint;
}

export interface MeasureCombination extends CaptionContrast {
  templateId: number;
  tileIndex: number;
  sizeClass: TileSizeClass;
  imageId: string;
  mode: 'cover' | 'contain';
  tileWidth: number;
  tileHeight: number;
}

export interface ModeSummary {
  mode: 'cover' | 'contain';
  combinations: number;
  worstTitle: number;
  worstMeta: number;
  minP99Title: number;
  titleBelow45: number;
  metaBelow45: number;
  worst: MeasureCombination;
}

export interface ContrastReport {
  generatedWith: string;
  areaWidth: number;
  images: { id: string; meanLuminance: number }[];
  modes: ModeSummary[];
}

const BLOCK_HEIGHT: Record<TileSizeClass, number> = { hero: 142, medium: 74, small: 66 };
const BG_NO_IMAGE = '#262C2E';

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(new Error(`Falha ao carregar ${url}`));
    };
    img.src = url;
  });
}

function drawTile(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  source: MeasureImage,
  mode: 'cover' | 'contain',
  w: number,
  h: number,
  sizeClass: TileSizeClass,
): void {
  ctx.fillStyle = BG_NO_IMAGE;
  ctx.fillRect(0, 0, w, h);
  const p = computeImagePlacement(source.width, source.height, w, h, mode, source.focalPoint);
  ctx.drawImage(img, p.x, p.y, p.width, p.height);
  // Degradê: altura = mín(ladrilho; bloco + 14 + 10 + 56); platô de 68 % e fade de 56 px (ADR-004).
  const gh = Math.min(h, BLOCK_HEIGHT[sizeClass] + 14 + 10 + 56);
  const top = h - gh;
  const [r, g, b] = CAPTION_SHADE;
  const grad = ctx.createLinearGradient(0, h, 0, top);
  const plateauEnd = Math.max(0, Math.min(1, (gh - 56) / gh));
  grad.addColorStop(0, `rgba(${String(r)},${String(g)},${String(b)},${String(PLATEAU_OPACITY)})`);
  grad.addColorStop(
    plateauEnd,
    `rgba(${String(r)},${String(g)},${String(b)},${String(PLATEAU_OPACITY)})`,
  );
  grad.addColorStop(1, `rgba(${String(r)},${String(g)},${String(b)},0)`);
  ctx.fillStyle = grad;
  ctx.fillRect(0, top, w, gh);
}

function meanLuminance(img: HTMLImageElement): number {
  const canvas = document.createElement('canvas');
  canvas.width = 48;
  canvas.height = 36;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D indisponível.');
  ctx.drawImage(img, 0, 0, 48, 36);
  const data = ctx.getImageData(0, 0, 48, 36).data;
  let sum = 0;
  for (let i = 0; i < data.length; i += 4) {
    sum += relativeLuminance([data[i] ?? 0, data[i + 1] ?? 0, data[i + 2] ?? 0]);
  }
  return sum / (data.length / 4);
}

/** Escolhe até `count` imagens com luminâncias médias bem distribuídas (da mais escura à mais clara). */
export function pickDistinctImages(
  candidates: readonly (MeasureImage & { mean: number })[],
  count: number,
): (MeasureImage & { mean: number })[] {
  const sorted = [...candidates].sort((a, b) => a.mean - b.mean);
  if (sorted.length <= count) return sorted;
  const picked: (MeasureImage & { mean: number })[] = [];
  for (let k = 0; k < count; k += 1) {
    const item = sorted[Math.round((k * (sorted.length - 1)) / (count - 1))];
    if (item) picked.push(item);
  }
  return picked;
}

/**
 * Mede todos os gabaritos 1–9 × todos os ladrilhos × imagens × cover/contain (1920×1080).
 * Com 9 imagens são 405 combinações por modo (Handoff §11, item 6).
 */
export async function runContrastReport(
  candidates: readonly MeasureImage[],
  imageCount = 9,
): Promise<ContrastReport> {
  const loaded = await Promise.all(
    candidates.map(async (c) => {
      const img = await loadImage(c.url);
      return { source: c, img, mean: meanLuminance(img) };
    }),
  );
  const chosen = pickDistinctImages(
    loaded.map((l) => ({ ...l.source, mean: l.mean })),
    imageCount,
  );
  const byId = new Map(loaded.map((l) => [l.source.id, l.img]));

  const results: MeasureCombination[] = [];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Canvas 2D indisponível.');

  for (const templateId of MOSAIC_TEMPLATE_IDS) {
    const layout = computeMosaicLayout(MOSAIC_TEMPLATES[templateId], 1800);
    for (const tile of layout.tiles) {
      const w = Math.round(tile.rect.w);
      const h = Math.round(tile.rect.h);
      canvas.width = w;
      canvas.height = h;
      for (const source of chosen) {
        const img = byId.get(source.id);
        if (!img) continue;
        for (const mode of ['cover', 'contain'] as const) {
          drawTile(ctx, img, source, mode, w, h, tile.sizeClass);
          const data = ctx.getImageData(0, 0, w, h).data;
          const rect = captionTextRect(w, h, BLOCK_HEIGHT[tile.sizeClass]);
          const contrast = measureCaptionContrast(data, w, rect);
          results.push({
            ...contrast,
            templateId,
            tileIndex: tile.index,
            sizeClass: tile.sizeClass,
            imageId: source.id,
            mode,
            tileWidth: w,
            tileHeight: h,
          });
        }
      }
    }
  }

  const modes: ModeSummary[] = (['cover', 'contain'] as const).map((mode) => {
    const subset = results.filter((r) => r.mode === mode);
    const worst = subset.reduce((a, b) => (b.titleRatio < a.titleRatio ? b : a));
    return {
      mode,
      combinations: subset.length,
      worstTitle: Math.min(...subset.map((r) => r.titleRatio)),
      worstMeta: Math.min(...subset.map((r) => r.metaRatio)),
      minP99Title: Math.min(...subset.map((r) => r.p99TitleRatio)),
      titleBelow45: subset.filter((r) => r.titleRatio < 4.5).length,
      metaBelow45: subset.filter((r) => r.metaRatio < 4.5).length,
      worst,
    };
  });

  return {
    generatedWith: 'canvas 2D, 1920×1080 (área 1800×750), imagens de demonstração',
    areaWidth: 1800,
    images: chosen.map((c) => ({ id: c.id, meanLuminance: c.mean })),
    modes,
  };
}
