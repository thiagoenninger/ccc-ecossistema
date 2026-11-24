import type { ReactElement } from 'react';
import styles from './ArtworkTile.module.css';

/** Estados de conteúdo de um ladrilho (Handoff §9). `ready` = imagem disponível. */
export type TileContentState = 'ready' | 'no-image' | 'offline' | 'failed' | 'unpublished';

type NonReadyState = Exclude<TileContentState, 'ready'>;

interface StateCopy {
  /** Rótulo curto visível no ladrilho. */
  label: string;
  /** Mensagem pública (ou `null` quando o estado não é exibido ao visitante). */
  message: string | null;
}

/** Textos oficiais do Handoff §9. Código e detalhes técnicos ficam só nos registros do Dashboard. */
export const CONTENT_STATE_COPY: Readonly<Record<NonReadyState, StateCopy>> = {
  'no-image': { label: 'Sem imagem', message: 'Sem imagem para esta obra.' },
  offline: { label: 'Offline', message: 'Este arquivo ainda não está neste equipamento.' },
  failed: { label: 'Falha', message: 'Não foi possível abrir agora. Tente outra obra.' },
  unpublished: { label: 'Em preparação', message: null },
};

function Icon({ state }: { state: NonReadyState }): ReactElement | null {
  const common = {
    viewBox: '0 0 24 24',
    width: 28,
    height: 28,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.75,
    strokeLinecap: 'square' as const,
    focusable: false,
    'aria-hidden': true,
  };
  switch (state) {
    case 'offline':
      return (
        <svg {...common}>
          <path d="M20 8v5h-5M4 16v-5h5M6.3 9A7 7 0 0 1 18 7.5M17.7 15A7 7 0 0 1 6 16.5" />
        </svg>
      );
    case 'failed':
      return (
        <svg {...common}>
          <path d="M12 4 3 20h18L12 4Zm0 6v5m0 2.5v.5" />
        </svg>
      );
    default:
      return null;
  }
}

/**
 * Tratamento visual de um estado de conteúdo, desenhado dentro do ladrilho.
 * Nunca depende só de cor: há rótulo textual, ícone ou padrão em todos os estados.
 */
export function ContentStateArt({ state }: { state: NonReadyState }) {
  const copy = CONTENT_STATE_COPY[state];
  return (
    <div
      className={`${styles.stateArt} ${styles[`state-${state}`]}`}
      data-content-state={state}
      aria-hidden="true"
    >
      <div className={styles.stateBody}>
        <Icon state={state} />
        <span className={styles.stateLabel}>{copy.label}</span>
      </div>
    </div>
  );
}
