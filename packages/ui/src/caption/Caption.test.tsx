import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Caption } from './Caption.tsx';

describe('Caption', () => {
  it('mostra título e meta e se declara decorativa (o nome acessível vem do ladrilho)', () => {
    const { container } = render(<Caption title="Praça central" meta="Fotografia" size="medium" />);
    const root = container.firstElementChild;
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-caption-size', 'medium');
    expect(root).toHaveTextContent('Praça central');
    expect(root).toHaveTextContent('Fotografia');
  });

  it('aplica a densidade compacta só quando pedida', () => {
    const standard = render(<Caption title="A" meta="B" size="small" />).container
      .firstElementChild;
    const compact = render(<Caption title="A" meta="B" size="small" density="compact" />).container
      .firstElementChild;
    expect(standard?.className).not.toMatch(/compact/);
    expect(compact?.className).toMatch(/compact/);
  });
});
