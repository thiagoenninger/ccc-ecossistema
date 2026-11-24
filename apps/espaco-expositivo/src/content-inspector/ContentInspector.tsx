import { useEffect, useState } from 'react';
import type { ExhibitionRepository } from '@ccc/data-access';
import type { AssetResolution, ContentIndex, Exhibition, ImageRef } from '@ccc/types';
import styles from './ContentInspector.module.css';

/**
 * Ferramenta de desenvolvimento (`content.html`, fora do build de produção): lista as exposições
 * publicadas e mostra cada obra com seus metadados, usando apenas o ExhibitionRepository.
 */

interface Keyed<T> {
  key: string;
  value: T | Error;
}

function toError(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

const STATUS_LABEL: Record<Exclude<AssetResolution['status'], 'available'>, string> = {
  'offline-unavailable': 'Offline',
  failed: 'Falha',
  unpublished: 'Em preparação',
};

function AssetImage({ repository, image }: { repository: ExhibitionRepository; image: ImageRef }) {
  const [resolved, setResolved] = useState<Keyed<AssetResolution> | null>(null);

  useEffect(() => {
    let cancelled = false;
    repository
      .resolveAssetUrl(image.assetId)
      .then((value) => {
        if (!cancelled) setResolved({ key: image.assetId, value });
      })
      .catch((reason: unknown) => {
        if (!cancelled) setResolved({ key: image.assetId, value: toError(reason) });
      });
    return () => {
      cancelled = true;
    };
  }, [repository, image.assetId]);

  const current = resolved?.key === image.assetId ? resolved.value : null;
  if (current === null) {
    return <div className={styles.placeholder}>Carregando…</div>;
  }
  if (current instanceof Error || current.status !== 'available') {
    const label = current instanceof Error ? 'Falha' : STATUS_LABEL[current.status];
    return <div className={styles.placeholder}>{label}</div>;
  }
  return (
    <img
      className={styles.image}
      src={current.url}
      alt={image.alt}
      width={image.width}
      height={image.height}
      style={{
        objectFit: image.fit ?? 'cover',
        objectPosition: image.focalPoint
          ? `${String(image.focalPoint.x * 100)}% ${String(image.focalPoint.y * 100)}%`
          : undefined,
      }}
    />
  );
}

function orientation(image: ImageRef): string {
  if (image.width === image.height) return 'quadrada';
  return image.width > image.height ? 'horizontal' : 'vertical';
}

function ExhibitionView({
  repository,
  exhibition,
}: {
  repository: ExhibitionRepository;
  exhibition: Exhibition;
}) {
  const countByCategory = exhibition.categories.map((category) => ({
    category,
    count: exhibition.artworks.filter((artwork) => artwork.categoryId === category.id).length,
  }));
  return (
    <section aria-labelledby="exhibition-title">
      <h2 id="exhibition-title" className={styles.exhibitionTitle}>
        {exhibition.title}
      </h2>
      <p className={styles.summary}>
        {exhibition.summary} · {exhibition.artworks.length} obras
        {exhibition.demo ? ' · DEMONSTRAÇÃO' : ''}
      </p>
      <ul className={styles.categories} aria-label="Categorias">
        {countByCategory.map(({ category, count }) => (
          <li key={category.id}>
            {category.label} ({count})
          </li>
        ))}
      </ul>
      <ul className={styles.grid} aria-label="Obras">
        {exhibition.artworks.map((artwork) => (
          <li key={artwork.id} className={styles.work}>
            <div className={styles.frame}>
              {artwork.image ? (
                <AssetImage repository={repository} image={artwork.image} />
              ) : (
                <div className={styles.placeholder}>Sem imagem</div>
              )}
            </div>
            <p className={styles.workTitle}>{artwork.title}</p>
            <p className={styles.workMeta}>
              {artwork.kind}
              {artwork.image
                ? ` · ${orientation(artwork.image)} · ${String(artwork.image.width)}×${String(artwork.image.height)} · ${artwork.image.fit ?? 'sem fit'}`
                : ''}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ContentInspector({ repository }: { repository: ExhibitionRepository }) {
  const [index, setIndex] = useState<Keyed<ContentIndex> | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loaded, setLoaded] = useState<Keyed<Exhibition> | null>(null);

  useEffect(() => {
    let cancelled = false;
    repository
      .listExhibitions()
      .then((value) => {
        if (!cancelled) setIndex({ key: 'index', value });
      })
      .catch((reason: unknown) => {
        if (!cancelled) setIndex({ key: 'index', value: toError(reason) });
      });
    repository
      .getContentVersion()
      .then((value) => {
        if (!cancelled) setVersion(value);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [repository]);

  const indexValue = index?.value;
  const availableIndex = indexValue && !(indexValue instanceof Error) ? indexValue : null;
  const activeId = selectedId ?? availableIndex?.defaultExhibitionId ?? null;

  useEffect(() => {
    if (activeId === null) return undefined;
    let cancelled = false;
    repository
      .loadExhibition(activeId)
      .then((value) => {
        if (!cancelled) setLoaded({ key: activeId, value });
      })
      .catch((reason: unknown) => {
        if (!cancelled) setLoaded({ key: activeId, value: toError(reason) });
      });
    return () => {
      cancelled = true;
    };
  }, [repository, activeId]);

  const current = loaded?.key === activeId ? loaded.value : null;

  return (
    <main className={styles.page}>
      <header>
        <p className={styles.eyebrow}>Ferramenta de desenvolvimento</p>
        <h1 className={styles.title}>Conteúdo de demonstração</h1>
        <p className={styles.summary}>
          {version ? `Versão do conteúdo: ${version}` : 'Lendo a versão do conteúdo…'}
        </p>
      </header>

      {indexValue instanceof Error ? (
        <p role="alert" className={styles.error}>
          Não foi possível ler o índice: {indexValue.message}
        </p>
      ) : null}

      {availableIndex ? (
        <div className={styles.picker} role="group" aria-label="Exposição">
          {availableIndex.exhibitions.map((entry) => (
            <button
              key={entry.id}
              type="button"
              className={styles.pickerButton}
              aria-pressed={entry.id === activeId}
              onClick={() => {
                setSelectedId(entry.id);
              }}
            >
              {entry.title}
            </button>
          ))}
        </div>
      ) : null}

      {current instanceof Error ? (
        <p role="alert" className={styles.error}>
          Não foi possível abrir a exposição: {current.message}
        </p>
      ) : null}
      {current && !(current instanceof Error) ? (
        <ExhibitionView repository={repository} exhibition={current} />
      ) : null}
      {activeId !== null && current === null ? <p>Carregando exposição…</p> : null}
    </main>
  );
}
