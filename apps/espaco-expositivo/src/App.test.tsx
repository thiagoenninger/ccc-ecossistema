import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App (esqueleto E01)', () => {
  it('exibe o título principal da aplicação', () => {
    render(<App />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Espaço Expositivo' }),
    ).toBeInTheDocument();
  });

  it('expõe a região principal para tecnologias assistivas', () => {
    render(<App />);

    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('informa que a identidade visual é provisória', () => {
    render(<App />);

    expect(screen.getByText(/Esqueleto técnico da Etapa E01/)).toBeInTheDocument();
  });
});
