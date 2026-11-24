import { describe, expect, it } from 'vitest';
import { computeImagePlacement, cropFraction, objectPosition } from './placement.ts';

describe('computeImagePlacement', () => {
  it('cover: preenche o ladrilho e centraliza o recorte por padrão', () => {
    // imagem 1600×1200 em ladrilho 640×460 → escala 0,4 (largura), altura 480 → sobra 20 px em cada lado
    const p = computeImagePlacement(1600, 1200, 640, 460, 'cover');
    expect(p.width).toBeCloseTo(640, 6);
    expect(p.height).toBeCloseTo(480, 6);
    expect(p.x).toBeCloseTo(0, 6);
    expect(p.y).toBeCloseTo(-10, 6);
  });

  it('cover: o ponto focal desloca o recorte', () => {
    const top = computeImagePlacement(1600, 1200, 640, 460, 'cover', { x: 0.5, y: 0 });
    const bottom = computeImagePlacement(1600, 1200, 640, 460, 'cover', { x: 0.5, y: 1 });
    expect(top.y).toBeCloseTo(0, 6);
    expect(bottom.y).toBeCloseTo(-20, 6);
  });

  it('contain: nunca corta nem distorce e centraliza', () => {
    const p = computeImagePlacement(1200, 1600, 640, 460, 'contain');
    expect(p.height).toBeCloseTo(460, 6);
    expect(p.width).toBeCloseTo(345, 6);
    expect(p.x).toBeCloseTo((640 - 345) / 2, 6);
    expect(p.y).toBeCloseTo(0, 6);
    expect(p.width / p.height).toBeCloseTo(1200 / 1600, 6);
  });

  it('contain ignora o ponto focal', () => {
    const a = computeImagePlacement(1200, 1600, 640, 460, 'contain', { x: 0, y: 0 });
    const b = computeImagePlacement(1200, 1600, 640, 460, 'contain');
    expect(a).toEqual(b);
  });

  it('rejeita dimensões inválidas', () => {
    expect(() => computeImagePlacement(0, 10, 10, 10, 'cover')).toThrow(RangeError);
    expect(() => computeImagePlacement(10, 10, 10, -1, 'contain')).toThrow(RangeError);
  });
});

describe('cropFraction', () => {
  it('é 0 em contain e positivo em cover quando as proporções diferem', () => {
    expect(cropFraction(1200, 1600, 640, 460, 'contain')).toBe(0);
    expect(cropFraction(1200, 1600, 640, 460, 'cover')).toBeGreaterThan(0.4);
    expect(cropFraction(1600, 1200, 640, 480, 'cover')).toBeCloseTo(0, 6);
  });
});

describe('objectPosition', () => {
  it('formata o ponto focal em porcentagem e limita a 0–100 %', () => {
    expect(objectPosition(undefined)).toBe('50% 50%');
    expect(objectPosition({ x: 0.25, y: 0.8 })).toBe('25% 80%');
    expect(objectPosition({ x: -1, y: 2 })).toBe('0% 100%');
  });
});
