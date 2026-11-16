import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './App';

describe('App (fundação visual E02)', () => {
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

  it('informa que a fundação visual está aplicada', () => {
    render(<App />);

    expect(screen.getByText(/Fundação visual da Etapa E02/)).toBeInTheDocument();
  });
});
