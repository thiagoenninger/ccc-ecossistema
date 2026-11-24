/**
 * Templates de mosaico 1–9 (Handoff Técnico §5.1 e §5.2).
 *
 * As coordenadas são normativas (ADR-003) e estão no espaço de referência 1920×1080.
 * Aqui elas são convertidas para o espaço da própria área do mosaico (1800×750, origem em 0,0)
 * para que o layout seja independente da margem e do cabeçalho de cada tela.
 *
 * Slots editoriais e adaptação a tablets: decisões C-05 e C-06 (ADR-014).
 */

/** Retângulo no espaço da área do mosaico (px de referência, origem no canto superior esquerdo). */
export interface MosaicRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export type MosaicTemplateId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export interface MosaicTemplate {
  readonly id: MosaicTemplateId;
  readonly name: string;
  /** Número de obras que o gabarito acomoda (igual a `tiles.length`). */
  readonly count: number;
  /** Ladrilhos; o primeiro é sempre o herói. */
  readonly tiles: readonly MosaicRect[];
  /**
   * Slot editorial (C-05): retângulo livre reservado a título da exposição e paginação.
   * `null` quando a grade ocupa toda a área; nesse caso a paginação vai para a faixa abaixo da grade.
   */
  readonly slot: MosaicRect | null;
}

/** Área do mosaico em 1920×1080 (Handoff §5): x 60–1860, y 150–900. */
export const MOSAIC_AREA = { x: 60, y: 150, w: 1800, h: 750 } as const;

/** Intervalo entre ladrilhos (px). */
export const MOSAIC_GAP = 10;

/** Margem lateral por largura de referência (Handoff §5.5). */
export const MOSAIC_MARGIN_BY_WIDTH = { 1920: 60, 1366: 36, 1280: 32 } as const;

/** Ladrilho com menor lado abaixo deste valor (px de referência) usa o bloco de texto "pequeno". */
export const SMALL_TILE_THRESHOLD = 250;

/** Converte coordenadas de tela (1920×1080) para o espaço da área do mosaico. */
function r(x: number, y: number, w: number, h: number): MosaicRect {
  return { x: x - MOSAIC_AREA.x, y: y - MOSAIC_AREA.y, w, h };
}

export const MOSAIC_TEMPLATES: Readonly<Record<MosaicTemplateId, MosaicTemplate>> = {
  1: {
    id: 1,
    name: 'Obra única',
    count: 1,
    tiles: [r(160, 150, 1600, 750)],
    slot: null,
  },
  2: {
    id: 2,
    name: 'Duas obras',
    count: 2,
    tiles: [r(60, 150, 1100, 750), r(1170, 150, 690, 750)],
    slot: null,
  },
  3: {
    id: 3,
    name: 'Três obras',
    count: 3,
    tiles: [r(60, 150, 860, 750), r(930, 150, 470, 750), r(1410, 150, 450, 360)],
    slot: r(1410, 520, 450, 380),
  },
  4: {
    id: 4,
    name: 'Quatro obras',
    count: 4,
    tiles: [
      r(60, 150, 900, 750),
      r(970, 150, 440, 370),
      r(970, 530, 440, 370),
      r(1420, 150, 440, 750),
    ],
    slot: null,
  },
  5: {
    id: 5,
    name: 'Cinco obras',
    count: 5,
    tiles: [
      r(60, 150, 780, 480),
      r(850, 150, 380, 480),
      r(1240, 150, 310, 235),
      r(1240, 395, 310, 235),
      r(1560, 150, 300, 480),
    ],
    slot: r(60, 640, 1800, 260),
  },
  6: {
    id: 6,
    name: 'Seis obras',
    count: 6,
    tiles: [
      r(60, 150, 700, 460),
      r(770, 150, 360, 460),
      r(1140, 150, 360, 225),
      r(1140, 385, 360, 225),
      r(1510, 150, 350, 460),
      r(60, 620, 700, 280),
    ],
    slot: r(770, 620, 1090, 280),
  },
  7: {
    id: 7,
    name: 'Sete obras',
    count: 7,
    tiles: [
      r(60, 150, 640, 460),
      r(710, 150, 330, 460),
      r(1050, 150, 420, 280),
      r(1050, 440, 420, 170),
      r(1480, 150, 380, 460),
      r(60, 620, 480, 280),
      r(550, 620, 490, 280),
    ],
    slot: r(1050, 620, 810, 280),
  },
  8: {
    id: 8,
    name: 'Oito obras',
    count: 8,
    tiles: [
      r(60, 150, 640, 460),
      r(710, 150, 330, 460),
      r(1050, 150, 420, 280),
      r(1050, 440, 420, 170),
      r(1480, 150, 380, 230),
      r(1480, 390, 380, 220),
      r(60, 620, 420, 280),
      r(490, 620, 550, 280),
    ],
    slot: r(1050, 620, 810, 280),
  },
  9: {
    id: 9,
    name: 'Nove obras',
    count: 9,
    tiles: [
      r(60, 150, 640, 460),
      r(710, 150, 280, 225),
      r(710, 385, 280, 225),
      r(1000, 150, 280, 460),
      r(1290, 150, 280, 225),
      r(1290, 385, 280, 225),
      r(1580, 150, 280, 460),
      r(60, 620, 900, 280),
      r(970, 620, 890, 280),
    ],
    slot: null,
  },
};

export const MOSAIC_TEMPLATE_IDS: readonly MosaicTemplateId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

/** Gabarito correspondente ao número de obras do conjunto (1–9). */
export function templateForCount(count: number): MosaicTemplate {
  if (!Number.isInteger(count) || count < 1 || count > 9) {
    throw new RangeError(`O mosaico comporta de 1 a 9 obras; recebido: ${String(count)}.`);
  }
  return MOSAIC_TEMPLATES[count as MosaicTemplateId];
}

/** Participação do herói na área do mosaico (0–1). */
export function heroShare(template: MosaicTemplate): number {
  const hero = template.tiles[0];
  if (!hero) {
    throw new Error(`Template ${String(template.id)} sem ladrilhos.`);
  }
  return (hero.w * hero.h) / (MOSAIC_AREA.w * MOSAIC_AREA.h);
}
