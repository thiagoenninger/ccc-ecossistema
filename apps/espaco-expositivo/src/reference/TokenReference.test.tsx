import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { tokenCatalog } from '@ccc/design-tokens';
import { TokenReference } from './TokenReference';

describe('TokenReference', () => {
  it('exibe o título e a versão do Design System', () => {
    render(<TokenReference />);

    expect(
      screen.getByRole('heading', { level: 1, name: 'Referência de tokens' }),
    ).toBeInTheDocument();
    expect(screen.getByText(new RegExp(`v${tokenCatalog.version}`))).toBeInTheDocument();
  });

  it('renderiza os dois temas lado a lado com o atributo data-theme', () => {
    render(<TokenReference />);

    const galeria = screen.getByRole('region', { name: /Galeria/ });
    const papel = screen.getByRole('region', { name: /Papel/ });
    expect(galeria).toHaveAttribute('data-theme', 'galeria');
    expect(papel).toHaveAttribute('data-theme', 'papel');
  });

  it('lista todas as cores primitivas e semânticas em cada tema', () => {
    render(<TokenReference />);

    const primitives = screen.getByRole('region', { name: 'Paleta primitiva' });
    expect(within(primitives).getAllByRole('listitem')).toHaveLength(
      tokenCatalog.colorPrimitive.length,
    );
    const galeria = screen.getByRole('region', { name: /Galeria/ });
    expect(within(galeria).getAllByRole('listitem')).toHaveLength(
      tokenCatalog.colorSemantic.length,
    );
  });

  it('lista todos os estilos tipográficos', () => {
    render(<TokenReference />);

    const type = screen.getByRole('region', { name: /Escala tipográfica/ });
    expect(within(type).getAllByRole('listitem')).toHaveLength(tokenCatalog.typeStyles.length);
  });

  it('rotula o degradê de legenda como demonstração', () => {
    render(<TokenReference />);

    expect(screen.getAllByText(/demonstração —/)).toHaveLength(3);
  });
});
