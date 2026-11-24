/**
 * Contraste de legendas pelo método único do Handoff §11 (pior caso na área do texto).
 * Funções puras sobre pixels sRGB (0–255); a rasterização do ladrilho fica em `measure.ts`.
 */

export type Rgb = readonly [number, number, number];

/** Texto da legenda sobre mídia (`color-text-on-media`). */
export const CAPTION_TEXT: Rgb = [0xf1, 0xec, 0xe0];

/** Cor-base do degradê (`--caption-gradient-rgb`) e opacidade do platô (ADR-004). */
export const CAPTION_SHADE: Rgb = [8, 10, 11];
export const PLATEAU_OPACITY = 0.68;
export const META_OPACITY = 0.88;

function channelToLinear(value: number): number {
  const c = value / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/** Luminância relativa (WCAG 2.x). */
export function relativeLuminance(rgb: Rgb): number {
  return (
    0.2126 * channelToLinear(rgb[0]) +
    0.7152 * channelToLinear(rgb[1]) +
    0.0722 * channelToLinear(rgb[2])
  );
}

/** Razão de contraste entre duas luminâncias: (L_texto + 0,05) / (L_fundo + 0,05), com L_texto ≥ L_fundo. */
export function contrastFromLuminance(textLuminance: number, backgroundLuminance: number): number {
  const lighter = Math.max(textLuminance, backgroundLuminance);
  const darker = Math.min(textLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Compõe `top` com opacidade `alpha` sobre `bottom`. */
export function compositeOver(top: Rgb, alpha: number, bottom: Rgb): Rgb {
  return [
    top[0] * alpha + bottom[0] * (1 - alpha),
    top[1] * alpha + bottom[1] * (1 - alpha),
    top[2] * alpha + bottom[2] * (1 - alpha),
  ];
}

export interface CaptionContrast {
  /** Luminância do pixel mais claro da área do texto (critério de decisão). */
  worstLuminance: number;
  /** Percentil 99 da luminância (apenas informativo). */
  p99Luminance: number;
  /** Razão do título (texto a 100 %) contra o pior pixel. */
  titleRatio: number;
  /** Razão do título contra o percentil 99 (apenas informativo). */
  p99TitleRatio: number;
  /** Razão da meta (texto a 88 %) contra o pior pixel. */
  metaRatio: number;
}

/** Retângulo (px) dentro do ladrilho. */
export interface PixelRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * Mede o contraste da legenda: percorre os pixels RGBA do retângulo do texto, toma o mais claro
 * e calcula as razões do título e da meta (texto a 88 % composto sobre esse pixel).
 */
export function measureCaptionContrast(
  rgba: Uint8ClampedArray | readonly number[],
  imageWidth: number,
  rect: PixelRect,
): CaptionContrast {
  const x0 = Math.max(0, Math.floor(rect.x));
  const y0 = Math.max(0, Math.floor(rect.y));
  const x1 = Math.min(imageWidth, Math.ceil(rect.x + rect.w));
  const rows = Math.floor(rgba.length / 4 / imageWidth);
  const y1 = Math.min(rows, Math.ceil(rect.y + rect.h));
  if (x1 <= x0 || y1 <= y0) {
    throw new RangeError('Retângulo de medição vazio ou fora da imagem.');
  }

  const luminances: number[] = [];
  let worst = -1;
  let worstPixel: Rgb = [0, 0, 0];
  for (let y = y0; y < y1; y += 1) {
    for (let x = x0; x < x1; x += 1) {
      const i = (y * imageWidth + x) * 4;
      const px: Rgb = [rgba[i] ?? 0, rgba[i + 1] ?? 0, rgba[i + 2] ?? 0];
      const l = relativeLuminance(px);
      luminances.push(l);
      if (l > worst) {
        worst = l;
        worstPixel = px;
      }
    }
  }
  luminances.sort((a, b) => a - b);
  const p99 =
    luminances[Math.min(luminances.length - 1, Math.floor(luminances.length * 0.99))] ?? worst;
  const textL = relativeLuminance(CAPTION_TEXT);
  const metaL = relativeLuminance(compositeOver(CAPTION_TEXT, META_OPACITY, worstPixel));
  return {
    worstLuminance: worst,
    p99Luminance: p99,
    titleRatio: contrastFromLuminance(textL, worst),
    p99TitleRatio: contrastFromLuminance(textL, p99),
    metaRatio: contrastFromLuminance(metaL, worst),
  };
}

/** Piso analítico do título: pixel branco puro sob o platô (Handoff §11, item 7). */
export function analyticTitleFloor(): number {
  const underPlateau = compositeOver(CAPTION_SHADE, PLATEAU_OPACITY, [255, 255, 255]);
  return contrastFromLuminance(relativeLuminance(CAPTION_TEXT), relativeLuminance(underPlateau));
}

/** Retângulo do bloco de texto dentro do ladrilho (margens 18 / 46 / 14 px; altura por tamanho). */
export function captionTextRect(
  tileWidth: number,
  tileHeight: number,
  blockHeight: number,
  margins = { left: 18, right: 46, bottom: 14 },
): PixelRect {
  const h = Math.min(blockHeight, tileHeight - margins.bottom);
  return {
    x: margins.left,
    y: tileHeight - margins.bottom - h,
    w: tileWidth - margins.left - margins.right,
    h,
  };
}
