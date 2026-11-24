import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { ExhibitionRepository } from '@ccc/data-access';
import type { Artwork, Exhibition } from '@ccc/types';
import { MosaicLab } from './MosaicLab';

function artwork(n: number, image: boolean): Artwork {
  const id = `obra-${String(n)}`;
  return {
    id,
    kind: n % 3 === 0 ? 'map' : 'photo',
    title: `Obra ${String(n)}`,
    categoryId: 'fotografias',
    personIds: [],
    description: 'Descrição.',
    dateLabel: null,
    sourceLabel: null,
    creditLabel: null,
    image: image
      ? { assetId: `a/${id}`, width: 1600, height: 900, alt: `Alt ${id}`, fit: 'cover' }
      : null,
    playback: null,
    order: n,
    published: true,
  };
}

function repository(): ExhibitionRepository {
  const exhibition: Exhibition = {
    schemaVersion: 1,
    id: 'demo',
    title: 'Exposição de teste',
    subtitle: 'Subtítulo de teste',
    summary: 'Resumo.',
    demo: true,
    cover: null,
    about: { paragraphs: ['Texto.'], credits: [] },
    categories: [{ id: 'fotografias', label: 'Fotografias' }],
    people: [],
    artworks: Array.from({ length: 9 }, (_, i) => artwork(i + 1, i !== 1)),
  };
  return {
    listExhibitions: () =>
      Promise.resolve({
        schemaVersion: 1,
        defaultExhibitionId: 'demo',
        exhibitions: [{ id: 'demo', title: 'Exposição de teste', path: 'demo/exhibition.json' }],
      }),
    getContentVersion: () => Promise.resolve('teste'),
    loadExhibition: () => Promise.resolve(exhibition),
    resolveAssetUrl: (assetId) =>
      Promise.resolve({ status: 'available', url: `/x/${assetId}.svg` }),
  };
}

describe('MosaicLab', () => {
  it('abre com o template 8, mostra o slot e identifica-se como ferramenta de desenvolvimento', async () => {
    render(<MosaicLab repository={repository()} />);
    expect(screen.getByRole('heading', { name: /Laboratório do mosaico/ })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /^Obra \d/ })).toHaveLength(8);
    });
    expect(screen.getByText('Exposição de teste', { selector: 'p' })).toBeInTheDocument();
  });

  it('a obra sem imagem aparece com o estado "sem imagem"', async () => {
    render(<MosaicLab repository={repository()} />);
    const tile = await screen.findByRole('button', { name: /Obra 2\. Fotografia\. Sem imagem/ });
    expect(tile).toHaveAttribute('data-state', 'no-image');
  });

  it('trocar o template muda o número de ladrilhos e remove o slot quando o template não tem', async () => {
    const user = userEvent.setup();
    render(<MosaicLab repository={repository()} />);
    await screen.findAllByRole('button', { name: /^Obra \d/ });
    await user.selectOptions(screen.getByLabelText('Template'), '9');
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /^Obra \d/ })).toHaveLength(9);
    });
    expect(screen.queryByText(/Amostra de slot/)).toBeNull();
    expect(screen.getByText(/Template sem slot interno/)).toBeInTheDocument();
  });

  it('avisa quando o template excede os itens simultâneos do perfil de tablet', async () => {
    const user = userEvent.setup();
    render(<MosaicLab repository={repository()} />);
    await screen.findAllByRole('button', { name: /^Obra \d/ });
    await user.selectOptions(screen.getByLabelText('Resolução'), '1280x800');
    expect(await screen.findByRole('status')).toHaveTextContent(/comporta até 5 itens/);
  });

  it('um toque seleciona a obra (aria-current) e o segundo toque desfaz', async () => {
    const user = userEvent.setup();
    render(<MosaicLab repository={repository()} />);
    const first = await screen.findByRole('button', { name: /^Obra 1\./ });
    await user.click(first);
    expect(first).toHaveAttribute('aria-current', 'true');
    await user.click(first);
    expect(first).not.toHaveAttribute('aria-current');
  });

  it('aplica o tema escolhido ao documento', async () => {
    const user = userEvent.setup();
    render(<MosaicLab repository={repository()} />);
    await screen.findAllByRole('button', { name: /^Obra \d/ });
    await user.selectOptions(screen.getByLabelText('Tema'), 'papel');
    expect(document.documentElement.dataset['theme']).toBe('papel');
  });

  it('mostra a mensagem de erro quando o conteúdo não carrega', async () => {
    const broken: ExhibitionRepository = {
      ...repository(),
      listExhibitions: () => Promise.reject(new Error('sem conexão')),
    };
    render(<MosaicLab repository={broken} />);
    const alert = await screen.findByRole('alert');
    expect(within(alert).getByText(/sem conexão/)).toBeInTheDocument();
  });
});
