import { describe, expect, it } from 'vitest';
import {
  analyticTitleFloor,
  captionTextRect,
  compositeOver,
  contrastFromLuminance,
  measureCaptionContrast,
  relativeLuminance,
} from './contrast.ts';

function solid(w: number, h: number, rgb: [number, number, number]): Uint8ClampedArray {
  const data = new Uint8ClampedArray(w * h * 4);
  for (let i = 0; i < w * h; i += 1) {
    data.set([rgb[0], rgb[1], rgb[2], 255], i * 4);
  }
  return data;
}

describe('relativeLuminance e contraste', () => {
  it('branco = 1, preto = 0 e razão 21:1 entre eles', () => {
    expect(relativeLuminance([255, 255, 255])).toBeCloseTo(1, 6);
    expect(relativeLuminance([0, 0, 0])).toBe(0);
    expect(contrastFromLuminance(1, 0)).toBeCloseTo(21, 6);
  });

  it('é simétrica (a ordem dos argumentos não importa)', () => {
    expect(contrastFromLuminance(0.1, 0.8)).toBeCloseTo(contrastFromLuminance(0.8, 0.1), 12);
  });

  it('compositeOver mistura linearmente', () => {
    expect(compositeOver([0, 0, 0], 0.5, [255, 255, 255])).toEqual([127.5, 127.5, 127.5]);
  });
});

describe('piso analítico do título (Handoff §11, item 7)', () => {
  it('fica entre 6,0 e 6,1: pixel branco sob o platô de 68 %', () => {
    const floor = analyticTitleFloor();
    expect(floor).toBeGreaterThan(6.0);
    expect(floor).toBeLessThan(6.1);
  });
});

describe('measureCaptionContrast', () => {
  it('em fundo uniforme, o pior pixel é o próprio fundo', () => {
    const data = solid(100, 40, [20, 20, 20]);
    const m = measureCaptionContrast(data, 100, { x: 10, y: 5, w: 50, h: 20 });
    expect(m.worstLuminance).toBeCloseTo(relativeLuminance([20, 20, 20]), 9);
    expect(m.titleRatio).toBeGreaterThan(m.metaRatio);
    expect(m.titleRatio).toBeGreaterThan(10);
  });

  it('um único pixel claro dentro do retângulo domina o resultado; fora dele, não', () => {
    const data = solid(100, 40, [10, 10, 10]);
    const inside = (20 * 100 + 30) * 4;
    data.set([255, 255, 255, 255], inside);
    const dominated = measureCaptionContrast(data, 100, { x: 10, y: 5, w: 50, h: 30 });
    expect(dominated.worstLuminance).toBeCloseTo(1, 6);
    expect(dominated.titleRatio).toBeLessThan(1.5);

    const outside = measureCaptionContrast(data, 100, { x: 40, y: 5, w: 50, h: 10 });
    expect(outside.worstLuminance).toBeCloseTo(relativeLuminance([10, 10, 10]), 9);
  });

  it('p99 nunca excede o pior pixel', () => {
    const data = solid(60, 30, [30, 40, 50]);
    data.set([200, 200, 200, 255], 4 * 100);
    const m = measureCaptionContrast(data, 60, { x: 0, y: 0, w: 60, h: 30 });
    expect(m.p99Luminance).toBeLessThanOrEqual(m.worstLuminance);
    expect(m.p99TitleRatio).toBeGreaterThanOrEqual(m.titleRatio);
  });

  it('rejeita retângulo vazio', () => {
    expect(() =>
      measureCaptionContrast(solid(10, 10, [0, 0, 0]), 10, { x: 20, y: 0, w: 5, h: 5 }),
    ).toThrow(RangeError);
  });
});

describe('captionTextRect', () => {
  it('aplica as margens 18 / 46 / 14 px do Handoff', () => {
    expect(captionTextRect(640, 460, 142)).toEqual({ x: 18, y: 304, w: 576, h: 142 });
  });

  it('limita a altura ao ladrilho quando ele é baixo', () => {
    const rect = captionTextRect(420, 170, 142);
    expect(rect.h).toBe(142);
    expect(rect.y).toBe(14);
    const tiny = captionTextRect(300, 100, 142);
    expect(tiny.h).toBe(86);
    expect(tiny.y).toBe(0);
  });
});
