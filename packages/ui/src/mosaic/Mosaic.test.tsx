import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MOSAIC_TEMPLATES } from '@ccc/design-tokens';
import { Mosaic } from './Mosaic.tsx';
import type { MosaicItem } from './Mosaic.tsx';

function items(n: number): MosaicItem[] {
  return Array.from({ length: n }, (_, i) => ({
    id: `obra-${String(i + 1)}`,
    tile: {
      title: `Obra ${String(i + 1)}`,
      meta: 'Fotografia',
      imageUrl: `/img-${String(i + 1)}.svg`,
    },
  }));
}

function px(value: string): number {
  return Number.parseFloat(value);
}

describe('Mosaic', () => {
  it('escolhe o gabarito pelo número de obras e posiciona os ladrilhos (T8 em 1800 px)', () => {
    render(<Mosaic items={items(8)} width={1800} label="Obras da exposição" />);
    const group = screen.getByRole('group', { name: 'Obras da exposição' });
    const tiles = screen.getAllByRole('button');
    expect(tiles).toHaveLength(8);
    expect(group.style.height).toBe('750px');
    const hero = MOSAIC_TEMPLATES[8].tiles[0];
    const first = tiles[0];
    expect(first).toBeDefined();
    expect(px((first as HTMLElement).style.left)).toBe(hero?.x);
    expect(px((first as HTMLElement).style.width)).toBe(hero?.w);
    expect(first).toHaveAttribute('data-size', 'hero');
  });

  it.each([1, 2, 3, 4, 5, 6, 7, 8, 9])('renderiza %i obra(s) sem sobreposição', (n) => {
    render(<Mosaic items={items(n)} width={1294} />);
    const rects = screen.getAllByRole('button').map((el) => ({
      x: px(el.style.left),
      y: px(el.style.top),
      w: px(el.style.width),
      h: px(el.style.height),
    }));
    expect(rects).toHaveLength(n);
    for (let i = 0; i < rects.length; i += 1) {
      for (let j = i + 1; j < rects.length; j += 1) {
        const a = rects[i];
        const b = rects[j];
        if (!a || !b) throw new Error('retângulo ausente');
        const overlapX = a.x < b.x + b.w && b.x < a.x + a.w;
        const overlapY = a.y < b.y + b.h && b.y < a.y + a.h;
        expect(overlapX && overlapY).toBe(false);
      }
    }
  });

  it('um clique em um ladrilho informa o id da obra', () => {
    const onSelect = vi.fn();
    render(<Mosaic items={items(3)} width={1800} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: /Obra 2/ }));
    expect(onSelect).toHaveBeenCalledWith('obra-2');
  });

  it('seleção e recuo: só as demais obras recuam, a selecionada mostra a barra', () => {
    render(<Mosaic items={items(4)} width={1800} selectedId="obra-2" recedeOthers />);
    const tiles = screen.getAllByRole('button');
    expect(tiles.map((t) => t.getAttribute('data-receded'))).toEqual([
      'true',
      'false',
      'true',
      'true',
    ]);
    expect(tiles[1]).toHaveAttribute('aria-current', 'true');
  });

  it('sem seleção, nada recua mesmo com recedeOthers', () => {
    render(<Mosaic items={items(4)} width={1800} recedeOthers />);
    for (const tile of screen.getAllByRole('button'))
      expect(tile).toHaveAttribute('data-receded', 'false');
  });

  it('slot editorial: aparece só em templates com slot (C-05)', () => {
    const { rerender, container } = render(
      <Mosaic items={items(8)} width={1800} slot={<p>Cubatão em imagens</p>} />,
    );
    const slot = container.querySelector<HTMLElement>('[data-mosaic-slot]');
    expect(slot).not.toBeNull();
    expect(slot).toHaveTextContent('Cubatão em imagens');
    expect(px(slot?.style.left ?? '')).toBe(990);
    expect(px(slot?.style.width ?? '')).toBe(810);

    rerender(<Mosaic items={items(9)} width={1800} slot={<p>Cubatão em imagens</p>} />);
    expect(container.querySelector('[data-mosaic-slot]')).toBeNull();
  });

  it('densidade compacta chega às legendas', () => {
    const { container } = render(<Mosaic items={items(6)} width={1294} density="compact" />);
    const captions = container.querySelectorAll('[data-caption-size]');
    expect(captions).toHaveLength(6);
    const nonHero = Array.from(captions).filter(
      (c) => c.getAttribute('data-caption-size') !== 'hero',
    );
    expect(nonHero.every((c) => /compact/.test(c.className))).toBe(true);
  });

  it('sem obras renderiza só a área; mais de 9 obras é erro de programação', () => {
    render(<Mosaic items={[]} width={1800} label="vazio" />);
    expect(screen.getByRole('group', { name: 'vazio' })).toBeEmptyDOMElement();
    expect(() => render(<Mosaic items={items(10)} width={1800} />)).toThrow(RangeError);
  });

  it('mantém a ordem do DOM igual à ordem das obras (ordem de foco)', () => {
    render(<Mosaic items={items(5)} width={1800} />);
    expect(screen.getAllByRole('button').map((b) => b.getAttribute('aria-label'))).toEqual([
      'Obra 1. Fotografia',
      'Obra 2. Fotografia',
      'Obra 3. Fotografia',
      'Obra 4. Fotografia',
      'Obra 5. Fotografia',
    ]);
  });
});
