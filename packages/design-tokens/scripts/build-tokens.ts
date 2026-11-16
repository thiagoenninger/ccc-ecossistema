import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { generateTokens, renderCatalogModule } from '../src/build/generate.ts';
import type { OfficialTokens } from '../src/build/generate.ts';

/**
 * CLI: `node scripts/build-tokens.ts`          → gera src/generated/*
 *      `node scripts/build-tokens.ts --check`  → falha se os arquivos gerados estiverem desatualizados
 */
const packageRoot = resolve(import.meta.dirname, '..');
const officialPath = resolve(packageRoot, '../../docs/design-system/design-tokens.json');
const cssPath = resolve(packageRoot, 'src/generated/tokens.css');
const catalogPath = resolve(packageRoot, 'src/generated/catalog.ts');

const official = JSON.parse(readFileSync(officialPath, 'utf-8')) as OfficialTokens;
const { css, catalog } = generateTokens(official);
const outputs = [
  { path: cssPath, content: css },
  { path: catalogPath, content: renderCatalogModule(catalog) },
];

if (process.argv.includes('--check')) {
  const stale = outputs.filter(
    ({ path, content }) => !existsSync(path) || readFileSync(path, 'utf-8') !== content,
  );
  if (stale.length > 0) {
    console.error('Arquivos gerados desatualizados. Execute: npm run tokens:build');
    for (const { path } of stale) {
      console.error(` - ${path}`);
    }
    process.exit(1);
  }
  console.log('Tokens em dia: arquivos gerados correspondem ao design-tokens.json.');
} else {
  for (const { path, content } of outputs) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content, 'utf-8');
    console.log(`Gerado: ${path}`);
  }
}
