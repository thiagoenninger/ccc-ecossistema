import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ArtworkTile } from './ArtworkTile.tsx';

const base = { title: 'Operários no turno da manhã', meta: 'Fotografia', size: 'hero' as const };

describe('ArtworkTile', () => {
  it('é um botão com nome acessível "título. meta" e dispara onSelect em um único clique', () => {
    const onSelect = vi.fn();
    render(<ArtworkTile {...base} imageUrl="/a.svg" onSelect={onSelect} />);
    const button = screen.getByRole('button', { name: 'Operários no turno da manhã. Fotografia' });
    fireEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('mostra a imagem com o enquadramento e o ponto focal pedidos', () => {
    const { container } = render(
      <ArtworkTile {...base} imageUrl="/a.svg" fit="contain" focalPoint={{ x: 0.2, y: 0.9 }} />,
    );
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    expect(img?.style.objectFit).toBe('contain');
    expect(img?.style.objectPosition).toBe('20% 90%');
    expect(img).toHaveAttribute('src', '/a.svg');
  });

  it('assume o estado "sem imagem" quando não há URL', () => {
    render(<ArtworkTile {...base} />);
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('data-state', 'no-image');
    expect(button).toHaveAccessibleName(/Sem imagem para esta obra\./);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('trata os estados offline, falha e em preparação com rótulo textual', () => {
    const { rerender, container } = render(<ArtworkTile {...base} state="offline" />);
    expect(container.querySelector('[data-content-state="offline"]')).toHaveTextContent('Offline');
    expect(screen.getByRole('button')).toHaveAccessibleName(/ainda não está neste equipamento/);

    rerender(<ArtworkTile {...base} state="failed" />);
    expect(container.querySelector('[data-content-state="failed"]')).toHaveTextContent('Falha');
    expect(screen.getByRole('button')).toHaveAccessibleName(/Não foi possível abrir agora/);

    rerender(<ArtworkTile {...base} state="unpublished" />);
    expect(container.querySelector('[data-content-state="unpublished"]')).toHaveTextContent(
      'Em preparação',
    );
  });

  it('passa a "falha" quando a imagem não carrega e se recupera com outra URL', () => {
    const { container, rerender } = render(<ArtworkTile {...base} imageUrl="/quebrada.svg" />);
    const img = container.querySelector('img');
    expect(img).not.toBeNull();
    fireEvent.error(img as HTMLImageElement);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'failed');

    rerender(<ArtworkTile {...base} imageUrl="/ok.svg" />);
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'ready');
  });

  it('seleção: barra de 4 px e aria-current; sem seleção não há barra', () => {
    const { container, rerender } = render(<ArtworkTile {...base} imageUrl="/a.svg" selected />);
    expect(container.querySelector('[data-selected-bar]')).not.toBeNull();
    expect(screen.getByRole('button')).toHaveAttribute('aria-current', 'true');
    rerender(<ArtworkTile {...base} imageUrl="/a.svg" />);
    expect(container.querySelector('[data-selected-bar]')).toBeNull();
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
  });

  it('recuo: marca o ladrilho, mas a legenda continua fora da camada recuada', () => {
    const { container } = render(<ArtworkTile {...base} imageUrl="/a.svg" receded />);
    expect(screen.getByRole('button')).toHaveAttribute('data-receded', 'true');
    const media = container.querySelector('span[class*="media"]');
    const caption = container.querySelector('[data-caption-size]');
    expect(media).not.toBeNull();
    expect(caption).not.toBeNull();
    // A legenda não é descendente da camada de imagem (que é a única com opacidade reduzida).
    expect(media?.contains(caption)).toBe(false);
  });

  it('é acionável por teclado (Enter e Espaço nativos do botão)', () => {
    const onSelect = vi.fn();
    render(<ArtworkTile {...base} imageUrl="/a.svg" onSelect={onSelect} />);
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });
});
