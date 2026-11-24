import type { TileSizeClass } from '@ccc/design-tokens';
import styles from './Caption.module.css';

export type CaptionDensity = 'standard' | 'compact';

export interface CaptionProps {
  title: string;
  /** Tipo e crédito, em uma linha (ex.: "Fotografia · Histórica"). */
  meta: string;
  size: TileSizeClass;
  /** `compact` (tablets): título de ladrilhos não heróis com mínimo de 20 px (C-06). */
  density?: CaptionDensity;
}

/**
 * Legenda sobre imagem: degradê com platô de 68 % (ADR-004) e texto sobre o bloco.
 * O degradê pertence ao ladrilho e nunca reduz a opacidade da imagem ou do texto.
 * Decorativa para tecnologias assistivas: o nome acessível vem do ladrilho.
 */
export function Caption({ title, meta, size, density = 'standard' }: CaptionProps) {
  const className = [styles.caption, styles[size], density === 'compact' ? styles.compact : '']
    .filter(Boolean)
    .join(' ');
  return (
    <div className={className} data-caption-size={size} aria-hidden="true">
      <div className={styles.shade} />
      <div className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.meta}>{meta}</span>
      </div>
      <svg className={styles.arrow} viewBox="0 0 24 24" width="20" height="20" focusable="false">
        <path
          d="M4 12h15m-6-6 6 6-6 6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="square"
        />
      </svg>
    </div>
  );
}
