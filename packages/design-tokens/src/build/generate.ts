import complementary from '../source/complementary-tokens.json' with { type: 'json' };

/**
 * Gera o CSS (variáveis) e o catálogo TypeScript a partir do JSON oficial do Design System
 * e dos tokens complementares. Funções puras: sem acesso a arquivos (o CLI cuida de E/S).
 */

export const THEME_NAMES = ['galeria', 'papel'] as const;
export type ThemeName = (typeof THEME_NAMES)[number];

type JsonObject = Record<string, unknown>;

export interface OfficialTokens {
  version: string;
  color: {
    primitive: Record<string, string>;
    semantic: Record<string, Record<ThemeName, string>>;
  } & JsonObject;
  typography: {
    families: Record<string, string>;
    styles: Record<
      string,
      { fontSize: number; lineHeight: number; fontWeight: number; family: string }
    >;
    letterSpacing: Record<string, string>;
  } & JsonObject;
  spacing: Record<string, string>;
  radius: Record<string, number | string>;
  border: Record<string, number>;
  opacity: Record<string, number>;
  motion: { duration: Record<string, number>; easing: Record<string, string> };
  touch: Record<string, number>;
  mosaic: {
    area: Record<string, number | string>;
    gap: number;
    margin: number;
    'max-items-per-set': Record<string, number>;
    'hero-area-share': Record<string, number>;
    'caption-gradient-height': Record<string, number>;
  };
  inactivity: Record<string, number | string>;
  breakpoint: Record<string, number>;
  z: Record<string, number>;
}

export interface TokenCatalog {
  version: string;
  themes: readonly ThemeName[];
  colorPrimitive: string[];
  colorSemantic: string[];
  fontFamilies: string[];
  typeStyles: {
    name: string;
    family: string;
    size: number;
    line: number;
    weight: number;
  }[];
  space: string[];
  radius: string[];
  border: string[];
  opacity: string[];
  motion: string[];
  ease: string[];
  touch: string[];
  breakpoint: string[];
  z: string[];
}

export interface GeneratedTokens {
  css: string;
  catalog: TokenCatalog;
}

const px = (value: number): string => (value === 0 ? '0' : `${String(value)}px`);

type Declaration = readonly [name: string, value: string];

function declarations(
  prefix: string,
  entries: Record<string, string | number>,
  unit: 'px' | 'ms' | '',
): Declaration[] {
  return Object.entries(entries).map(([key, raw]) => {
    const value =
      typeof raw === 'number'
        ? unit === 'px'
          ? px(raw)
          : unit === 'ms'
            ? `${String(raw)}ms`
            : String(raw)
        : raw;
    return [`--${prefix}-${key}`, value] as const;
  });
}

function block(selector: string, decls: readonly Declaration[], comment?: string): string {
  const lines = decls.map(([name, value]) => `  ${name}: ${value};`);
  const head = comment ? `/* ${comment} */\n` : '';
  return `${head}${selector} {\n${lines.join('\n')}\n}\n`;
}

function assertNoDuplicates(all: readonly Declaration[]): void {
  const seen = new Set<string>();
  for (const [name] of all) {
    if (seen.has(name)) {
      throw new Error(`Token duplicado na geração: ${name}`);
    }
    seen.add(name);
  }
}

export function generateTokens(official: OfficialTokens): GeneratedTokens {
  const cg = complementary.captionGradient;
  const rootDecls: Declaration[] = [];

  // Cores primitivas
  const colorPrimitive = Object.keys(official.color.primitive);
  rootDecls.push(...declarations('color', official.color.primitive, ''));

  // Tipografia
  rootDecls.push(...declarations('font', official.typography.families, ''));
  rootDecls.push(...declarations('tracking', official.typography.letterSpacing, ''));
  const typeStyles = Object.entries(official.typography.styles).map(([name, s]) => ({
    name,
    family: s.family,
    size: s.fontSize,
    line: s.lineHeight,
    weight: s.fontWeight,
  }));
  for (const s of typeStyles) {
    rootDecls.push([`--type-${s.name}-family`, `var(--font-${s.family})`]);
    rootDecls.push([`--type-${s.name}-size`, px(s.size)]);
    rootDecls.push([`--type-${s.name}-line`, px(s.line)]);
    rootDecls.push([`--type-${s.name}-weight`, String(s.weight)]);
    rootDecls.push([
      `--type-${s.name}`,
      `${String(s.weight)} ${px(s.size)}/${px(s.line)} var(--font-${s.family})`,
    ]);
  }

  // Espaçamento, raio, borda, opacidade
  const radius = Object.fromEntries(
    Object.entries(official.radius).filter(
      (entry): entry is [string, number] => typeof entry[1] === 'number',
    ),
  );
  rootDecls.push(...declarations('space', official.spacing, ''));
  rootDecls.push(...declarations('radius', radius, 'px'));
  rootDecls.push(...declarations('border', official.border, 'px'));
  rootDecls.push(...declarations('opacity', official.opacity, ''));

  // Movimento
  rootDecls.push(...declarations('motion', official.motion.duration, 'ms'));
  rootDecls.push(...declarations('ease', official.motion.easing, ''));

  // Toque
  rootDecls.push(...declarations('touch', official.touch, 'px'));

  // Mosaico
  const { x, y, w, h } = official.mosaic.area as Record<string, number>;
  rootDecls.push(
    ['--mosaic-area-x', px(x ?? 0)],
    ['--mosaic-area-y', px(y ?? 0)],
    ['--mosaic-area-w', px(w ?? 0)],
    ['--mosaic-area-h', px(h ?? 0)],
    ['--mosaic-gap', px(official.mosaic.gap)],
    ['--mosaic-margin', px(official.mosaic.margin)],
  );
  rootDecls.push(...declarations('mosaic-max-items', official.mosaic['max-items-per-set'], ''));
  rootDecls.push(...declarations('mosaic-hero-share', official.mosaic['hero-area-share'], ''));
  const captionHeight = official.mosaic['caption-gradient-height'];
  rootDecls.push(
    ['--mosaic-caption-gradient-height-max', px(captionHeight['max-px'] ?? 0)],
    ['--mosaic-caption-gradient-height-max-share', String(captionHeight['max-share'] ?? 0)],
  );

  // Inatividade (somente valores numéricos)
  rootDecls.push(
    ...declarations(
      'inactivity',
      Object.fromEntries(
        Object.entries(official.inactivity).filter(([, v]) => typeof v === 'number'),
      ),
      '',
    ),
  );

  // Breakpoints (referência: variáveis CSS não funcionam em @media) e z-index
  rootDecls.push(...declarations('breakpoint', official.breakpoint, 'px'));
  rootDecls.push(...declarations('z', official.z, ''));

  // Complementares (ADR-004 e demais)
  const blockH = cg.textBlockHeight;
  rootDecls.push(
    ['--caption-gradient-rgb', cg.colorRgb],
    ['--caption-gradient-plateau-opacity', String(cg.plateauOpacity)],
    ['--caption-gradient-plateau-margin', px(cg.plateauMargin)],
    ['--caption-gradient-fade-length', px(cg.fadeLength)],
    ['--caption-gradient-base-padding', px(cg.basePadding)],
    ['--caption-text-margin-left', px(cg.textMarginLeft)],
    ['--caption-text-margin-right', px(cg.textMarginRight)],
    ['--caption-meta-opacity', String(cg.metaOpacity)],
    ['--caption-block-height-hero', px(blockH.hero)],
    ['--caption-block-height-medium', px(blockH.medium)],
    ['--caption-block-height-small', px(blockH.small)],
  );
  for (const size of ['hero', 'medium', 'small'] as const) {
    rootDecls.push([
      `--caption-gradient-height-${size}`,
      `calc(var(--caption-block-height-${size}) + var(--caption-gradient-base-padding) + var(--caption-gradient-plateau-margin) + var(--caption-gradient-fade-length))`,
    ]);
  }
  rootDecls.push(
    ['--tile-compact-title-size', px(complementary.tileCompact.titleSize)],
    ['--tile-compact-title-line', px(complementary.tileCompact.titleLine)],
    ['--focus-ring-width', px(complementary.focusRing.width)],
    ['--focus-ring-inner-color', complementary.focusRing.innerColor],
    ['--focus-ring-outer-color', `var(--color-${complementary.focusRing.outerColor})`],
    [
      '--focus-ring',
      '0 0 0 var(--focus-ring-width) var(--focus-ring-inner-color), 0 0 0 calc(var(--focus-ring-width) * 2) var(--focus-ring-outer-color)',
    ],
    ['--selected-bar-height', px(complementary.selectedBar.height)],
    ['--selected-bar-color', `var(--color-${complementary.selectedBar.color})`],
  );

  assertNoDuplicates(rootDecls);

  // Temas (cores semânticas)
  const semanticNames = Object.keys(official.color.semantic);
  const extra = complementary.semanticColors.tokens as Record<string, Record<ThemeName, string>>;
  for (const name of Object.keys(extra)) {
    if (semanticNames.includes(name)) {
      throw new Error(`Token complementar conflita com o oficial: ${name}`);
    }
  }
  const colorSemantic = [...semanticNames, ...Object.keys(extra)];

  const themeBlocks = THEME_NAMES.map((theme) => {
    const decls: Declaration[] = [['color-scheme', complementary.colorScheme[theme]]];
    for (const name of semanticNames) {
      const value = official.color.semantic[name]?.[theme];
      if (value === undefined) {
        throw new Error(`Token semântico sem valor para o tema ${theme}: ${name}`);
      }
      decls.push([`--color-${name}`, value]);
    }
    for (const [name, values] of Object.entries(extra)) {
      decls.push([`--color-${name}`, values[theme]]);
    }
    assertNoDuplicates(decls);
    const selector =
      theme === 'galeria' ? `:root,\n[data-theme='galeria']` : `[data-theme='${theme}']`;
    return block(selector, decls, `Tema ${theme}`);
  });

  const header = `/*
 * GERADO AUTOMATICAMENTE por scripts/build-tokens.ts — NÃO EDITE.
 * Fontes: docs/design-system/design-tokens.json (v${official.version}) e
 * packages/design-tokens/src/source/complementary-tokens.json (v${complementary.version}).
 * Regenerar: npm run tokens:build -w @ccc/design-tokens
 */
`;

  const css = [
    header,
    block(':root', rootDecls, 'Tokens independentes de tema'),
    ...themeBlocks,
  ].join('\n');

  const catalog: TokenCatalog = {
    version: official.version,
    themes: THEME_NAMES,
    colorPrimitive,
    colorSemantic,
    fontFamilies: Object.keys(official.typography.families),
    typeStyles,
    space: Object.keys(official.spacing),
    radius: Object.keys(radius),
    border: Object.keys(official.border),
    opacity: Object.keys(official.opacity),
    motion: Object.keys(official.motion.duration),
    ease: Object.keys(official.motion.easing),
    touch: Object.keys(official.touch),
    breakpoint: Object.keys(official.breakpoint),
    z: Object.keys(official.z),
  };

  return { css, catalog };
}

export function renderCatalogModule(catalog: TokenCatalog): string {
  return `// GERADO AUTOMATICAMENTE por scripts/build-tokens.ts — NÃO EDITE.
import type { TokenCatalog } from '../build/generate.ts';

export const tokenCatalog: TokenCatalog = ${JSON.stringify(catalog, null, 2)};
`;
}
