import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { TileSizeClass } from '@ccc/design-tokens';
import type { FocalPoint, ImageFit } from '@ccc/types';
import { objectPosition } from '../image/placement.ts';
import { Caption } from '../caption/Caption.tsx';
import type { CaptionDensity } from '../caption/Caption.tsx';
import { CONTENT_STATE_COPY, ContentStateArt } from './ContentStateArt.tsx';
import type { TileContentState } from './ContentStateArt.tsx';
import styles from './ArtworkTile.module.css';

export interface ArtworkTileProps {
  title: string;
  /** Tipo e crédito em uma linha, já formatados (ex.: "Fotografia · Histórica"). */
  meta: string;
  size: TileSizeClass;
  density?: CaptionDensity;
  /** Estado de conteúdo vindo dos dados; o ladrilho também passa a `failed` se a imagem não carregar. */
  state?: TileContentState;
  imageUrl?: string;
  fit?: ImageFit;
  focalPoint?: FocalPoint;
  /** Obra selecionada: barra âmbar de 4 px na base (nunca só cor: a barra é uma forma). */
  selected?: boolean;
  /** Recuo de imagem secundária: reduz só a camada de imagem (P-01); título e controles ficam a 100 %. */
  receded?: boolean;
  /** Um único toque: a seleção e a abertura da ficha são tratadas por quem usa o componente (E05/E06). */
  onSelect?: () => void;
  style?: CSSProperties;
}

/**
 * Imagem interativa (ladrilho de obra): imagem, legenda, estados de conteúdo, foco e seleção.
 * É um botão nativo: foco por teclado, Enter/Espaço e toque funcionam sem código adicional.
 */
export function ArtworkTile({
  title,
  meta,
  size,
  density = 'standard',
  state = 'ready',
  imageUrl,
  fit = 'cover',
  focalPoint,
  selected = false,
  receded = false,
  onSelect,
  style,
}: ArtworkTileProps) {
  // Guarda a URL que falhou: se a URL mudar, a nova tentativa começa limpa.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const hasImage = state === 'ready' && imageUrl !== undefined && imageUrl !== '';
  const effectiveState: TileContentState = !hasImage
    ? state === 'ready'
      ? 'no-image'
      : state
    : failedUrl === imageUrl
      ? 'failed'
      : 'ready';

  const stateMessage =
    effectiveState === 'ready' ? null : CONTENT_STATE_COPY[effectiveState].message;
  const accessibleName = [title, meta, stateMessage]
    .filter((part) => part !== null && part !== '')
    .join('. ');

  const className = [styles.tile, receded ? styles.receded : ''].filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={className}
      style={style}
      aria-label={accessibleName}
      aria-current={selected ? 'true' : undefined}
      data-state={effectiveState}
      data-size={size}
      data-selected={selected ? 'true' : 'false'}
      data-receded={receded ? 'true' : 'false'}
      onClick={onSelect}
    >
      <span className={styles.media}>
        {effectiveState === 'ready' ? (
          <img
            className={styles.image}
            src={imageUrl}
            alt=""
            draggable={false}
            decoding="async"
            style={{ objectFit: fit, objectPosition: objectPosition(focalPoint) }}
            onError={() => {
              setFailedUrl(imageUrl ?? null);
            }}
          />
        ) : (
          <ContentStateArt state={effectiveState} />
        )}
      </span>
      <Caption title={title} meta={meta} size={size} density={density} />
      {selected ? <span className={styles.bar} data-selected-bar="" aria-hidden="true" /> : null}
    </button>
  );
}
