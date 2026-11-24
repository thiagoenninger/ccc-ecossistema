import type { MosaicRect, MosaicTemplate } from './templates.ts';
import { MOSAIC_AREA, MOSAIC_GAP, SMALL_TILE_THRESHOLD } from './templates.ts';

/** Classe de tamanho do ladrilho: define o bloco de texto da legenda (Handoff §3.3). */
export type TileSizeClass = 'hero' | 'medium' | 'small';

export interface LayoutTile {
  readonly index: number;
  /** Retângulo em px, relativo ao canto superior esquerdo da área do mosaico. */
  readonly rect: MosaicRect;
  readonly sizeClass: TileSizeClass;
}

export interface MosaicLayout {
  /** Fator de escala em relação à área de referência (1800 px de largura). */
  readonly scale: number;
  readonly width: number;
  readonly height: number;
  readonly tiles: readonly LayoutTile[];
  readonly slot: MosaicRect | null;
}

export type ViewportProfileName = 'wide' | 'compact' | 'tablet';

/** Perfil de projeto por largura de tela (Handoff §5.5; valores são referências, pendência P-06/P-08). */
export interface ViewportProfile {
  readonly name: ViewportProfileName;
  /** Resolução de referência do perfil. */
  readonly reference: string;
  readonly margin: number;
  /** Itens simultâneos (Espaço Expositivo e Futuro). */
  readonly maxItems: number;
  /** Itens simultâneos na Biblioteca Digital (modo Galeria). */
  readonly maxItemsLibrary: number;
}

const PROFILES: Readonly<Record<ViewportProfileName, ViewportProfile>> = {
  wide: { name: 'wide', reference: '1920×1080', margin: 60, maxItems: 8, maxItemsLibrary: 9 },
  compact: { name: 'compact', reference: '1366×768', margin: 36, maxItems: 6, maxItemsLibrary: 6 },
  tablet: { name: 'tablet', reference: '1280×800', margin: 32, maxItems: 5, maxItemsLibrary: 5 },
};

/** Escolhe o perfil de projeto mais próximo da largura da tela (C-06). */
export function viewportProfile(viewportWidth: number): ViewportProfile {
  if (viewportWidth >= 1600) return PROFILES.wide;
  if (viewportWidth >= 1300) return PROFILES.compact;
  return PROFILES.tablet;
}

function scaleRect(rect: MosaicRect, scale: number, shrink: number): MosaicRect {
  return {
    x: rect.x * scale,
    y: rect.y * scale,
    w: rect.w * scale - shrink,
    h: rect.h * scale - shrink,
  };
}

/**
 * Calcula o layout em pixels de um template para uma largura de área.
 *
 * As coordenadas de referência são escaladas proporcionalmente (C-06) e o intervalo entre
 * ladrilhos é mantido em 10 px: cada retângulo perde `gap − gap × escala` na largura e na altura.
 * Em escala 1 (1800 px) o resultado é idêntico às coordenadas do Handoff §5.2.
 * Acima da escala 1 o intervalo cresce proporcionalmente (nunca fica menor que 10 px).
 */
export function computeMosaicLayout(template: MosaicTemplate, areaWidth: number): MosaicLayout {
  if (!(areaWidth > 0)) {
    throw new RangeError(`Largura da área do mosaico inválida: ${String(areaWidth)}.`);
  }
  const scale = areaWidth / MOSAIC_AREA.w;
  const shrink = Math.max(0, MOSAIC_GAP - MOSAIC_GAP * scale);
  const tiles = template.tiles.map((ref, index): LayoutTile => {
    const sizeClass: TileSizeClass =
      index === 0 ? 'hero' : Math.min(ref.w, ref.h) < SMALL_TILE_THRESHOLD ? 'small' : 'medium';
    return { index, rect: scaleRect(ref, scale, shrink), sizeClass };
  });
  return {
    scale,
    width: areaWidth,
    height: MOSAIC_AREA.h * scale,
    tiles,
    slot: template.slot ? scaleRect(template.slot, scale, shrink) : null,
  };
}
