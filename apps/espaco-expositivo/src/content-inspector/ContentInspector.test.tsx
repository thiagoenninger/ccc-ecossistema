import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import type { ExhibitionRepository } from '@ccc/data-access';
import type { AssetResolution, Artwork, Exhibition } from '@ccc/types';
import { ContentInspector } from './ContentInspector';

function artwork(id: string, withImage: boolean): Artwork {
  return {
    id,
    kind: 'photo',
    title: `Obra ${id}`,
    categoryId: 'fotografias',
    personIds: [],
    description: 'Descrição.',
    dateLabel: null,
    sourceLabel: null,
    creditLabel: null,
    image: withImage
      ? { assetId: `a/${id}`, width: 1600, height: 900, alt: `Alt ${id}`, fit: 'cover' }
      : null,
    playback: null,
    order: 0,
    published: true,
  };
}

function exhibition(id: string, title: string, works: Artwork[]): Exhibition {
  return {
    schemaVersion: 1,
    id,
    title,
    subtitle: null,
    summary: 'Resumo.',
    demo: true,
    cover: null,
    about: { paragraphs: ['Texto.'], credits: [] },
    categories: [{ id: 'fotografias', label: 'Fotografias' }],
    people: [],
    artworks: works,
  };
}

function fakeRepository(
  overrides: Partial<ExhibitionRepository> = {},
  resolve: (id: string) => AssetResolution = (id) => ({ status: 'available', url: `/x/${id}.svg` }),
): ExhibitionRepository {
  const data: Record<string, Exhibition> = {
    um: exhibition('um', 'Exposição Um', [artwork('o1', true), artwork('o2', false)]),
    dois: exhibition('dois', 'Exposição Dois', [artwork('p1', true)]),
  };
  return {
    listExhibitions: () =>
      Promise.resolve({
        schemaVersion: 1,
        defaultExhibitionId: 'um',
        exhibitions: [
          { id: 'um', title: 'Exposição Um', path: 'um/exhibition.json' },
          { id: 'dois', title: 'Exposição Dois', path: 'dois/exhibition.json' },
        ],
      }),
    getContentVersion: () => Promise.resolve('teste.1'),
    loadExhibition: (id) => {
      const found = data[id];
      return found ? Promise.resolve(found) : Promise.reject(new Error('não encontrada'));
    },
    resolveAssetUrl: (id) => Promise.resolve(resolve(id)),
    ...overrides,
  };
}

describe('ContentInspector', () => {
  it('mostra a versão do conteúdo e a exposição padrão com suas obras', async () => {
    render(<ContentInspector repository={fakeRepository()} />);

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Exposição Um' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Versão do conteúdo: teste.1')).toBeInTheDocument();
    const works = within(screen.getByRole('list', { name: 'Obras' })).getAllByRole('listitem');
    expect(works).toHaveLength(2);
    expect(await screen.findByAltText('Alt o1')).toHaveAttribute('src', '/x/a/o1.svg');
    expect(screen.getByText('Sem imagem')).toBeInTheDocument();
  });

  it('troca de exposição apenas com dados, sem recarregar a página', async () => {
    const user = userEvent.setup();
    render(<ContentInspector repository={fakeRepository()} />);
    await screen.findByRole('heading', { name: 'Exposição Um' });

    await user.click(screen.getByRole('button', { name: 'Exposição Dois' }));

    expect(
      await screen.findByRole('heading', { level: 2, name: 'Exposição Dois' }),
    ).toBeInTheDocument();
    expect(
      within(screen.getByRole('list', { name: 'Obras' })).getAllByRole('listitem'),
    ).toHaveLength(1);
    expect(screen.getByRole('button', { name: 'Exposição Dois' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  });

  it('exibe os estados de arquivo indisponível em texto', async () => {
    const repository = fakeRepository({}, () => ({
      status: 'offline-unavailable',
      reason: 'sem arquivo',
    }));
    render(<ContentInspector repository={repository} />);

    expect(await screen.findByText('Offline')).toBeInTheDocument();
  });

  it('informa o erro quando a exposição não pode ser aberta', async () => {
    const repository = fakeRepository({
      loadExhibition: () => Promise.reject(new Error('conteúdo inválido')),
    });
    render(<ContentInspector repository={repository} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('conteúdo inválido');
  });

  it('informa o erro quando o índice não pode ser lido', async () => {
    const repository = fakeRepository({
      listExhibitions: () => Promise.reject(new Error('sem rede')),
    });
    render(<ContentInspector repository={repository} />);

    expect(await screen.findByRole('alert')).toHaveTextContent('sem rede');
  });
});
