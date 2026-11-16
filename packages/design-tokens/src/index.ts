import type { ThemeName } from './build/generate.ts';
import { THEME_NAMES } from './build/generate.ts';

export { tokenCatalog } from './generated/catalog.ts';
export type { TokenCatalog } from './build/generate.ts';
export type { ThemeName };

export const THEMES: readonly ThemeName[] = THEME_NAMES;

/** Tema padrão das aplicações museográficas (Decisões Vigentes: Galeria). */
export const DEFAULT_THEME: ThemeName = 'galeria';

export function isThemeName(value: unknown): value is ThemeName {
  return typeof value === 'string' && (THEME_NAMES as readonly string[]).includes(value);
}

/** Nome da variável CSS de um token (ex.: `cssVar('color-text-primary')` → `var(--color-text-primary)`). */
export function cssVar(tokenName: string): string {
  return `var(--${tokenName})`;
}
