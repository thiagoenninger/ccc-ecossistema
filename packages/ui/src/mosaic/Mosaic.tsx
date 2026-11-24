import { useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import { computeMosaicLayout, templateForCount } from '@ccc/design-tokens';
import { ArtworkTile } from '../artwork-tile/ArtworkTile.tsx';
import type { ArtworkTileProps } from '../artwork-tile/ArtworkTile.tsx';
import type { CaptionDensity } from '../caption/Caption.tsx';
import { useElementWidth } from './useElementWidth.ts';
import styles from './Mosaic.module.css';

export type MosaicTile = Omit<
  ArtworkTileProps,
  'size' | 'density' | 'selected' | 'receded' | 'onSelect' | 'style'
>;

export interface MosaicItem {
  id: string;
  tile: MosaicTile;
}

export interface MosaicProps {
  /** De 1 a 9 itens; o gabarito é escolhido pelo número de itens (sem algoritmo dinâmico). */
  items: readonly MosaicItem[];
  selectedId?: string | null;
  /** Com uma obra selecionada, recua só a imagem das demais (P-01). */
  recedeOthers?: boolean;
  /** `compact` nos tablets (C-06). */
  density?: CaptionDensity;
  onSelect?: (id: string) => void;
  /** Conteúdo do slot editorial (título da exposição e paginação), quando o template tem slot (C-05). */
  slot?: ReactNode;
  /** Rótulo acessível do conjunto de obras. */
  label?: string;
  /** Largura em px; se ausente, é medida a partir do elemento. */
  width?: number;
}

/**
 * Mosaico: distribui as obras em gabaritos predefinidos 1–9, em escala proporcional à largura.
 * A ordem do DOM é a ordem das obras (herói primeiro), o que define a ordem de foco por teclado.
 */
export function Mosaic({
  items,
  selectedId = null,
  recedeOthers = false,
  density = 'standard',
  onSelect,
  slot,
  label = 'Obras',
  width,
}: MosaicProps) {
  const ref = useRef<HTMLDivElement>(null);
  const measured = useElementWidth(ref, width);

  const template = items.length > 0 ? templateForCount(items.length) : null;
  const layout = useMemo(
    () => (template && measured > 0 ? computeMosaicLayout(template, measured) : null),
    [template, measured],
  );

  const rootStyle = {
    ...(width !== undefined ? { width: `${String(width)}px` } : {}),
    ...(layout ? { height: `${String(layout.height)}px` } : {}),
  };

  return (
    <div ref={ref} className={styles.mosaic} style={rootStyle} role="group" aria-label={label}>
      {layout
        ? items.map((item, index) => {
            const placed = layout.tiles[index];
            if (!placed) return null;
            const isSelected = selectedId === item.id;
            return (
              <ArtworkTile
                key={item.id}
                {...item.tile}
                size={placed.sizeClass}
                density={density}
                selected={isSelected}
                receded={recedeOthers && selectedId !== null && !isSelected}
                {...(onSelect ? { onSelect: () => onSelect(item.id) } : {})}
                style={{
                  left: `${String(placed.rect.x)}px`,
                  top: `${String(placed.rect.y)}px`,
                  width: `${String(placed.rect.w)}px`,
                  height: `${String(placed.rect.h)}px`,
                }}
              />
            );
          })
        : null}
      {layout?.slot && slot !== undefined && slot !== null ? (
        <div
          className={styles.slot}
          data-mosaic-slot=""
          style={{
            left: `${String(layout.slot.x)}px`,
            top: `${String(layout.slot.y)}px`,
            width: `${String(layout.slot.w)}px`,
            height: `${String(layout.slot.h)}px`,
          }}
        >
          {slot}
        </div>
      ) : null}
    </div>
  );
}
