import { createHash } from 'node:crypto';
import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import type {
  Artwork,
  ContentIndex,
  ContentManifest,
  Exhibition,
  ImageRef,
  ManifestAsset,
  Person,
} from '@ccc/types';
import {
  checkExhibitionIntegrity,
  validateContentIndex,
  validateExhibition,
  validateManifest,
} from '@ccc/types';
import { renderArt } from './art.ts';
import type { ArtSpec, Motif, Palette } from './art.ts';
import { EXHIBITIONS, SIZES, artSpecFor } from './catalog.ts';
import type { ExhibitionSeed, PersonSeed, SizeKey } from './catalog.ts';

/**
 * Gera o conteúdo de DEMONSTRAÇÃO em `public/content/` (ADR-009).
 *   node scripts/demo-content/generate.ts          → grava os arquivos
 *   node scripts/demo-content/generate.ts --check  → falha se os arquivos gravados divergirem
 * A saída é determinística: mesma entrada, mesmos bytes (inclusive a data do manifesto).
 */

const CONTENT_VERSION = '2026.11.16-demo.1';
const GENERATED_AT = '2026-11-16T00:00:00Z';
const OUTPUT_ROOT = resolve(import.meta.dirname, '../../public/content');

const LICENSES = `# Conteúdo de demonstração — origem e licenças

Esta pasta contém **conteúdo fictício de demonstração** (ADR-009). Ele existe apenas para desenvolver e testar o aplicativo.

- **Imagens:** geradas por programa (\`scripts/demo-content\`), de forma procedural. Não há fotografias, obras, mapas ou documentos de terceiros.
- **Textos, títulos, nomes e créditos:** marcadores inventados para teste. Não representam pessoas, fatos ou instituições reais.
- **Licença de uso:** sem direitos de terceiros. A licença de distribuição do repositório será definida pelo titular (pendência N-24).
- **Substituição:** antes da apresentação institucional, troque esta pasta por acervo real, com autorização e documentação de licença por obra (pendência N-04).

Para regenerar: \`npm run content:generate -w @ccc/espaco-expositivo\`. Para conferir: \`npm run content:check -w @ccc/espaco-expositivo\`.
`;

type FileMap = Map<string, string>;

/** FNV-1a de 32 bits: semente estável a partir do identificador do arquivo. */
function seedFrom(text: string): number {
  let hash = 0x811c9dc5;
  for (const char of text) {
    hash ^= char.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

const ALT_MOTIF: Record<Motif, string> = {
  skyline: 'silhuetas de chaminés e colinas',
  facade: 'fachada clara de um edifício',
  letter: 'página de texto manuscrito',
  ledger: 'página de livro-caixa com colunas',
  map: 'mapa com curvas de nível, rio e quadras',
};

const ALT_PALETTE: Record<Palette, string> = {
  dusk: 'ao entardecer, em tons de laranja e violeta',
  mist: 'em tons de cinza, com névoa',
  blue: 'em tons de azul',
  night: 'à noite, em tons muito escuros',
  sepia: 'em tons de sépia',
  paper: 'sobre papel claro',
  aged: 'sobre papel envelhecido',
  clean: 'sobre fundo claro',
  blueprint: 'em azul de planta técnica',
};

function altFor(motif: Motif, palette: Palette): string {
  return `Imagem procedural de demonstração: ${ALT_MOTIF[motif]}, ${ALT_PALETTE[palette]}.`;
}

interface Builder {
  files: FileMap;
  assets: ManifestAsset[];
}

function addImage(
  builder: Builder,
  exhibitionId: string,
  slug: string,
  spec: ArtSpec,
): { assetId: string; width: number; height: number; alt: string } {
  const assetId = `${exhibitionId}/${slug}`;
  const path = `${exhibitionId}/images/${slug}.svg`;
  const svg = renderArt({ ...spec, seed: seedFrom(assetId) });
  builder.files.set(path, svg);
  builder.assets.push({
    id: assetId,
    path,
    mimeType: 'image/svg+xml',
    bytes: Buffer.byteLength(svg, 'utf-8'),
    sha256: createHash('sha256').update(svg, 'utf-8').digest('hex'),
    published: true,
  });
  return {
    assetId,
    width: spec.width,
    height: spec.height,
    alt: altFor(spec.motif, spec.palette),
  };
}

function buildPerson(builder: Builder, exhibitionId: string, seed: PersonSeed): Person {
  let portrait: ImageRef | null = null;
  if (seed.portrait) {
    const size: SizeKey = 'square';
    const spec = artSpecFor({ motif: 'skyline', palette: seed.portrait.palette, size }, 0);
    const image = addImage(builder, exhibitionId, `retrato-${seed.id}`, spec);
    portrait = { ...image, alt: 'Imagem procedural de demonstração usada como retrato.' };
  }
  return { id: seed.id, name: seed.name, biography: seed.biography, portrait };
}

function buildExhibition(builder: Builder, seed: ExhibitionSeed): Exhibition {
  const cover = addImage(builder, seed.id, 'capa', artSpecFor(seed.cover, 0));
  const people = seed.people.map((person) => buildPerson(builder, seed.id, person));
  const artworks: Artwork[] = seed.works.map((work, order) => {
    const image = addImage(
      builder,
      seed.id,
      work.slug,
      artSpecFor({ motif: work.motif, palette: work.palette, size: work.size }, 0),
    );
    const ref: ImageRef = { ...image, fit: work.fit };
    if (work.focal) {
      ref.focalPoint = work.focal;
    }
    return {
      id: work.slug,
      kind: work.kind,
      title: work.title,
      categoryId: work.categoryId,
      personIds: work.personIds,
      description: work.description ?? 'Descrição de demonstração.',
      dateLabel: work.dateLabel,
      sourceLabel: work.sourceLabel,
      creditLabel: 'Imagem procedural de demonstração',
      image: ref,
      playback: null,
      order,
      published: true,
    };
  });
  return {
    schemaVersion: 1,
    id: seed.id,
    title: seed.title,
    subtitle: seed.subtitle,
    summary: seed.summary,
    demo: true,
    cover: { ...cover, fit: 'cover' },
    about: {
      paragraphs: seed.aboutParagraphs,
      credits: [
        { role: 'Curadoria', name: 'a definir' },
        { role: 'Realização', name: 'a definir' },
      ],
    },
    categories: seed.categories,
    people,
    artworks,
  };
}

function json(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/** Monta todos os arquivos em memória e valida os contratos antes de devolver. */
export function buildDemoContent(): FileMap {
  const builder: Builder = { files: new Map(), assets: [] };
  const exhibitions = EXHIBITIONS.map((seed) => buildExhibition(builder, seed));

  const manifest: ContentManifest = {
    schemaVersion: 1,
    contentVersion: CONTENT_VERSION,
    generatedAt: GENERATED_AT,
    assets: builder.assets,
  };
  const first = EXHIBITIONS[0];
  if (!first) {
    throw new Error('Nenhuma exposição de demonstração definida.');
  }
  const index: ContentIndex = {
    schemaVersion: 1,
    defaultExhibitionId: first.id,
    exhibitions: EXHIBITIONS.map((seed) => ({
      id: seed.id,
      title: seed.title,
      path: `${seed.id}/exhibition.json`,
    })),
  };

  const problems: string[] = [];
  const manifestResult = validateManifest(manifest);
  if (!manifestResult.ok) {
    problems.push(...manifestResult.issues.map((i) => `manifest ${i.path}: ${i.message}`));
  }
  const indexResult = validateContentIndex(index);
  if (!indexResult.ok) {
    problems.push(...indexResult.issues.map((i) => `index ${i.path}: ${i.message}`));
  }
  for (const exhibition of exhibitions) {
    const result = validateExhibition(exhibition);
    if (!result.ok) {
      problems.push(...result.issues.map((i) => `${exhibition.id} ${i.path}: ${i.message}`));
    }
    problems.push(
      ...checkExhibitionIntegrity(exhibition, manifest).map(
        (i) => `${exhibition.id} ${i.path}: ${i.message}`,
      ),
    );
    builder.files.set(`${exhibition.id}/exhibition.json`, json(exhibition));
  }
  if (problems.length > 0) {
    throw new Error(`Conteúdo de demonstração inválido:\n${problems.join('\n')}`);
  }

  builder.files.set('index.json', json(index));
  builder.files.set('manifest.json', json(manifest));
  builder.files.set('LICENCAS.md', LICENSES);
  return builder.files;
}

function listFiles(root: string): string[] {
  if (!existsSync(root)) {
    return [];
  }
  const result: string[] = [];
  const walk = (directory: string): void => {
    for (const entry of readdirSync(directory)) {
      const full = join(directory, entry);
      if (statSync(full).isDirectory()) {
        walk(full);
      } else {
        result.push(relative(root, full).split(sep).join('/'));
      }
    }
  };
  walk(root);
  return result.sort();
}

function main(): void {
  const files = buildDemoContent();

  if (process.argv.includes('--check')) {
    const onDisk = listFiles(OUTPUT_ROOT);
    const expected = [...files.keys()].sort();
    const problems: string[] = [];
    for (const path of expected) {
      const full = join(OUTPUT_ROOT, path);
      if (!existsSync(full)) {
        problems.push(`ausente: ${path}`);
      } else if (readFileSync(full, 'utf-8') !== files.get(path)) {
        problems.push(`diferente: ${path}`);
      }
    }
    for (const path of onDisk) {
      if (!files.has(path)) {
        problems.push(`sobrando: ${path}`);
      }
    }
    if (problems.length > 0) {
      console.error('Conteúdo de demonstração desatualizado. Execute: npm run content:generate');
      for (const problem of problems.slice(0, 20)) {
        console.error(` - ${problem}`);
      }
      process.exit(1);
    }
    console.log(`Conteúdo de demonstração em dia (${String(files.size)} arquivos).`);
    return;
  }

  if (!OUTPUT_ROOT.endsWith(`${sep}public${sep}content`)) {
    throw new Error(`Pasta de saída inesperada: ${OUTPUT_ROOT}`);
  }
  rmSync(OUTPUT_ROOT, { recursive: true, force: true });
  for (const [path, content] of files) {
    const full = join(OUTPUT_ROOT, path);
    mkdirSync(dirname(full), { recursive: true });
    writeFileSync(full, content, 'utf-8');
  }
  console.log(`Gerados ${String(files.size)} arquivos em ${OUTPUT_ROOT}`);
}

// `SIZES` é reexportado apenas para facilitar inspeção em testes.
export { SIZES };

if (process.argv[1] && resolve(process.argv[1]) === resolve(import.meta.filename)) {
  main();
}
