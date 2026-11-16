import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { generateTokens, renderCatalogModule, THEME_NAMES } from './build/generate.ts';
import type { OfficialTokens } from './build/generate.ts';
import complementary from './source/complementary-tokens.json' with { type: 'json' };
import { DEFAULT_THEME, THEMES, isThemeName, tokenCatalog } from './index.ts';

const packageRoot = resolve(import.meta.dirname, '..');
const read = (path: string): string => readFileSync(resolve(packageRoot, path), 'utf-8');

const official = JSON.parse(
  readFileSync(resolve(packageRoot, '../../docs/design-system/design-tokens.json'), 'utf-8'),
) as OfficialTokens;
const { css } = generateTokens(official);

/** Extrai o corpo de um bloco CSS pelo seletor. */
function block(source: string, selector: string): string {
  const start = source.indexOf(`${selector.replace(', ', ',\n')} {`);
  expect(start, `bloco ${selector} existe`).toBeGreaterThanOrEqual(0);
  return source.slice(start, source.indexOf('\n}', start));
}

function declaredNames(body: string): string[] {
  return [...body.matchAll(/^\s*(--[\w-]+):/gm)].map((m) => m[1] as string);
}

describe('arquivos gerados', () => {
  it('tokens.css versionado é idêntico ao regenerado a partir do JSON oficial', () => {
    expect(read('src/generated/tokens.css')).toBe(css);
  });

  it('catalog.ts versionado é idêntico ao regenerado', () => {
    expect(read('src/generated/catalog.ts')).toBe(
      renderCatalogModule(generateTokens(official).catalog),
    );
  });

  it('não possui nomes de variáveis duplicados em um mesmo bloco', () => {
    for (const selector of [":root, [data-theme='galeria']", "[data-theme='papel']"]) {
      const names = declaredNames(block(css, selector));
      expect(new Set(names).size).toBe(names.length);
    }
  });
});

describe('paridade JSON oficial ↔ CSS', () => {
  it('toda cor primitiva vira --color-<nome> com o mesmo valor', () => {
    for (const [name, value] of Object.entries(official.color.primitive)) {
      expect(css).toContain(`--color-${name}: ${value};`);
    }
  });

  it('cada tema define exatamente o mesmo conjunto de cores semânticas', () => {
    const galeria = declaredNames(block(css, ":root, [data-theme='galeria']")).filter((n) =>
      Object.keys(official.color.semantic).some((k) => n === `--color-${k}`),
    );
    const papel = declaredNames(block(css, "[data-theme='papel']")).filter((n) =>
      Object.keys(official.color.semantic).some((k) => n === `--color-${k}`),
    );
    expect(papel.sort()).toEqual(galeria.sort());
    expect(galeria.length).toBeGreaterThan(0);
  });

  it('valores semânticos de cada tema correspondem ao JSON', () => {
    const galeria = block(css, ":root, [data-theme='galeria']");
    const papel = block(css, "[data-theme='papel']");
    for (const [name, themes] of Object.entries(official.color.semantic)) {
      expect(galeria).toContain(`--color-${name}: ${themes.galeria};`);
      expect(papel).toContain(`--color-${name}: ${themes.papel};`);
    }
  });

  it('temas declaram color-scheme (Galeria escuro, Papel claro)', () => {
    expect(block(css, ":root, [data-theme='galeria']")).toContain('color-scheme: dark;');
    expect(block(css, "[data-theme='papel']")).toContain('color-scheme: light;');
  });

  it('as 33 escalas tipográficas (ou todas as do JSON) existem com tamanho, linha e peso', () => {
    const styles = Object.entries(official.typography.styles);
    expect(styles.length).toBeGreaterThan(0);
    for (const [name, s] of styles) {
      expect(css).toContain(`--type-${name}-size: ${s.fontSize}px;`);
      expect(css).toContain(`--type-${name}-line: ${s.lineHeight}px;`);
      expect(css).toContain(`--type-${name}-weight: ${s.fontWeight};`);
    }
  });

  it('pilhas de fontes são idênticas às do JSON oficial', () => {
    for (const [name, stack] of Object.entries(official.typography.families)) {
      expect(css).toContain(`--font-${name}: ${stack};`);
    }
  });

  it('espaçamentos, raios, bordas, toque e z-index correspondem ao JSON', () => {
    for (const [k, v] of Object.entries(official.spacing))
      expect(css).toContain(`--space-${k}: ${v}`);
    for (const [k, v] of Object.entries(official.touch))
      expect(css).toContain(`--touch-${k}: ${v}px;`);
    for (const [k, v] of Object.entries(official.z)) expect(css).toContain(`--z-${k}: ${v};`);
    for (const [k, v] of Object.entries(official.motion.duration))
      expect(css).toContain(`--motion-${k}: ${v}ms;`);
  });

  it('mosaico expõe área, gap e margem do JSON', () => {
    expect(css).toContain('--mosaic-gap: 10px;');
    expect(css).toContain('--mosaic-margin: 60px;');
    expect(css).toContain('--mosaic-area-w: 1800px;');
    expect(css).toContain('--mosaic-area-h: 750px;');
  });
});

describe('tokens complementares (ADR-004: metodologia do Handoff)', () => {
  it('gradiente: platô 68%, margem 10px, esmaecimento 56px, preenchimento 14px', () => {
    expect(css).toContain('--caption-gradient-plateau-opacity: 0.68;');
    expect(css).toContain('--caption-gradient-plateau-margin: 10px;');
    expect(css).toContain('--caption-gradient-fade-length: 56px;');
    expect(css).toContain('--caption-gradient-base-padding: 14px;');
  });

  it('blocos de legenda: 142 / 74 / 66 px → alturas de gradiente 222 / 154 / 146 px', () => {
    expect(css).toContain('--caption-block-height-hero: 142px;');
    expect(css).toContain('--caption-block-height-medium: 74px;');
    expect(css).toContain('--caption-block-height-small: 66px;');
    expect(142 + 14 + 10 + 56).toBe(222);
    expect(74 + 14 + 10 + 56).toBe(154);
    expect(66 + 14 + 10 + 56).toBe(146);
  });

  it('anel de foco duplo e barra de seleção âmbar 4px', () => {
    expect(css).toContain('--focus-ring-inner-color: rgb(8 10 11 / 0.85);');
    expect(css).toContain('--focus-ring-outer-color: var(--color-turquesa-400);');
    expect(css).toContain('--selected-bar-height: 4px;');
    expect(css).toContain('--selected-bar-color: var(--color-ambar-500);');
  });

  it('surface-tile-no-image existe nos dois temas', () => {
    expect(block(css, ":root, [data-theme='galeria']")).toContain('--color-surface-tile-no-image');
    expect(block(css, "[data-theme='papel']")).toContain('--color-surface-tile-no-image');
  });

  it('arquivo complementar declara versão', () => {
    expect(complementary.version).toBeTruthy();
  });
});

describe('fontes locais (ADR-008)', () => {
  const fontsCss = read('src/fonts.css');
  const urls = [...fontsCss.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1] as string);

  it('referencia apenas arquivos woff2 de pacotes @fontsource, sem URLs externas', () => {
    expect(urls.length).toBeGreaterThanOrEqual(9);
    for (const url of urls) {
      expect(url).toMatch(/^@fontsource\/[\w-]+\/files\/[\w-]+\.woff2$/);
      expect(url).not.toMatch(/https?:/);
    }
  });

  it('todos os arquivos de fonte referenciados existem em node_modules', () => {
    for (const url of urls) {
      const candidates = [
        resolve(packageRoot, 'node_modules', url),
        resolve(packageRoot, '../../node_modules', url),
      ];
      expect(candidates.some(existsSync), url).toBe(true);
    }
  });

  it('as famílias declaradas em @font-face aparecem nas pilhas do JSON oficial', () => {
    const families = new Set(
      [...fontsCss.matchAll(/font-family:\s*'([^']+)'/g)].map((m) => m[1] as string),
    );
    const stacks = Object.values(official.typography.families).join(' ');
    for (const f of families) expect(stacks).toContain(f);
  });

  it('nenhum CSS gerado contém URLs externas', () => {
    expect(css).not.toMatch(/https?:\/\//);
  });
});

describe('API pública', () => {
  it('expõe temas e tema padrão Galeria', () => {
    expect(THEMES).toEqual(THEME_NAMES);
    expect(DEFAULT_THEME).toBe('galeria');
  });

  it('isThemeName valida entradas', () => {
    expect(isThemeName('papel')).toBe(true);
    expect(isThemeName('galeria')).toBe(true);
    expect(isThemeName('claro')).toBe(false);
    expect(isThemeName(undefined)).toBe(false);
  });

  it('catálogo reflete a versão e os estilos do JSON oficial', () => {
    expect(tokenCatalog.version).toBe(official.version);
    expect(tokenCatalog.typeStyles).toHaveLength(Object.keys(official.typography.styles).length);
  });
});
