import { useLayoutEffect, useState } from 'react';
import type { RefObject } from 'react';

/** Mede a largura de um elemento e acompanha mudanças (ResizeObserver quando disponível). */
export function useElementWidth(ref: RefObject<HTMLElement | null>, override?: number): number {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    if (override !== undefined) return undefined;
    const element = ref.current;
    if (!element) return undefined;
    const measure = (): void => {
      // clientWidth ignora transformações (escala de pré-visualização), ao contrário de getBoundingClientRect.
      setWidth(element.clientWidth);
    };
    measure();
    if (typeof ResizeObserver === 'undefined') return undefined;
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
    };
  }, [ref, override]);

  return override ?? width;
}
