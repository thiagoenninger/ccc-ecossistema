import type { FocalPoint, ImageFit } from '@ccc/types';

/** Retângulo ocupado pela imagem dentro do ladrilho (px, origem no canto do ladrilho). */
export interface ImagePlacement {
  x: number;
  y: number;
  width: number;
  height: number;
}

const CENTER: FocalPoint = { x: 0.5, y: 0.5 };

/** Valor CSS de `object-position` para um ponto focal (0–1). Sem ponto focal: centro. */
export function objectPosition(focalPoint: FocalPoint | undefined): string {
  const p = focalPoint ?? CENTER;
  const pct = (v: number): string => `${String(Math.round(clamp01(v) * 10000) / 100)}%`;
  return `${pct(p.x)} ${pct(p.y)}`;
}

function clamp01(v: number): number {
  return Math.min(1, Math.max(0, v));
}

/**
 * Calcula onde a imagem é desenhada, reproduzindo `object-fit` e `object-position`:
 * - `cover` preenche o ladrilho e pode cortar; o ponto focal decide o recorte.
 * - `contain` mostra a imagem inteira, sem distorção e sem corte, centralizada.
 *
 * Usada nos testes e na medição de contraste do harness (mesma geometria do CSS).
 */
export function computeImagePlacement(
  imageWidth: number,
  imageHeight: number,
  tileWidth: number,
  tileHeight: number,
  fit: ImageFit,
  focalPoint?: FocalPoint,
): ImagePlacement {
  if (!(imageWidth > 0 && imageHeight > 0 && tileWidth > 0 && tileHeight > 0)) {
    throw new RangeError('As dimensões da imagem e do ladrilho devem ser positivas.');
  }
  const scale =
    fit === 'cover'
      ? Math.max(tileWidth / imageWidth, tileHeight / imageHeight)
      : Math.min(tileWidth / imageWidth, tileHeight / imageHeight);
  const width = imageWidth * scale;
  const height = imageHeight * scale;
  const p = fit === 'cover' ? (focalPoint ?? CENTER) : CENTER;
  return {
    x: (tileWidth - width) * clamp01(p.x),
    y: (tileHeight - height) * clamp01(p.y),
    width,
    height,
  };
}

/** Fração da imagem que fica fora do ladrilho (0 = nada cortado). Só `cover` corta. */
export function cropFraction(
  imageWidth: number,
  imageHeight: number,
  tileWidth: number,
  tileHeight: number,
  fit: ImageFit,
): number {
  if (fit === 'contain') return 0;
  const p = computeImagePlacement(imageWidth, imageHeight, tileWidth, tileHeight, 'cover');
  return 1 - (tileWidth * tileHeight) / (p.width * p.height);
}
