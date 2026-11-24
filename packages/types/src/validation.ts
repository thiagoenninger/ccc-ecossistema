import type {
  AssetId,
  ContentIndex,
  ContentIndexEntry,
  ContentManifest,
  ManifestAsset,
} from './asset.ts';
import type {
  Artwork,
  Category,
  Credit,
  Exhibition,
  ExhibitionAbout,
  FocalPoint,
  ImageFit,
  ImageRef,
  Person,
  Playback,
  WorkKind,
} from './exhibition.ts';
import { WORK_KINDS } from './work-kinds.ts';

/**
 * Validadores de contrato escritos à mão (sem biblioteca): o conjunto de contratos é pequeno e o
 * ganho de uma dependência de validação não compensa agora. Cada validador recebe `unknown`
 * (JSON lido do disco ou da rede) e devolve o valor tipado ou a lista completa de problemas.
 */

export interface ValidationIssue {
  /** Caminho do campo, ex.: `artworks[3].image.width`. */
  path: string;
  message: string;
}

export type ValidationResult<T> = { ok: true; value: T } | { ok: false; issues: ValidationIssue[] };

type JsonObject = Record<string, unknown>;

interface Context {
  issues: ValidationIssue[];
}

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ASSET_ID = /^[a-z0-9]+(?:[a-z0-9_-]*[a-z0-9])?(?:\/[a-z0-9]+(?:[a-z0-9_-]*[a-z0-9])?)*$/;
const SHA256 = /^[0-9a-f]{64}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/;

function report(context: Context, path: string, message: string): void {
  context.issues.push({ path, message });
}

function finish<T>(context: Context, value: T): ValidationResult<T> {
  return context.issues.length === 0 ? { ok: true, value } : { ok: false, issues: context.issues };
}

function asObject(context: Context, value: unknown, path: string): JsonObject | null {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    return value as JsonObject;
  }
  report(context, path, 'deve ser um objeto');
  return null;
}

function readText(context: Context, source: JsonObject, key: string, path: string): string {
  const value = source[key];
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  report(context, `${path}.${key}`, 'deve ser um texto não vazio');
  return '';
}

/** Texto opcional: `null` é válido; ausente não é (o contrato exige `null` explícito). */
function readNullableText(
  context: Context,
  source: JsonObject,
  key: string,
  path: string,
): string | null {
  const value = source[key];
  if (value === null) {
    return null;
  }
  if (typeof value === 'string' && value.trim() !== '') {
    return value;
  }
  report(context, `${path}.${key}`, 'deve ser um texto não vazio ou null');
  return null;
}

function readSlug(context: Context, source: JsonObject, key: string, path: string): string {
  const value = readText(context, source, key, path);
  if (value !== '' && !SLUG.test(value)) {
    report(context, `${path}.${key}`, 'deve conter apenas minúsculas, números e hífens');
  }
  return value;
}

function readBoolean(context: Context, source: JsonObject, key: string, path: string): boolean {
  const value = source[key];
  if (typeof value === 'boolean') {
    return value;
  }
  report(context, `${path}.${key}`, 'deve ser verdadeiro ou falso');
  return false;
}

function readInteger(
  context: Context,
  source: JsonObject,
  key: string,
  path: string,
  minimum: number,
): number {
  const value = source[key];
  if (typeof value === 'number' && Number.isInteger(value) && value >= minimum) {
    return value;
  }
  report(
    context,
    `${path}.${key}`,
    `deve ser um número inteiro maior ou igual a ${String(minimum)}`,
  );
  return minimum;
}

function readArray(context: Context, source: JsonObject, key: string, path: string): unknown[] {
  const value = source[key];
  if (Array.isArray(value)) {
    return value as unknown[];
  }
  report(context, `${path}.${key}`, 'deve ser uma lista');
  return [];
}

function readAssetId(context: Context, source: JsonObject, key: string, path: string): AssetId {
  const value = readText(context, source, key, path);
  if (value !== '' && !ASSET_ID.test(value)) {
    report(context, `${path}.${key}`, 'identificador de arquivo inválido');
  }
  return value;
}

function checkUnique(context: Context, ids: string[], path: string): void {
  const seen = new Set<string>();
  for (const id of ids) {
    if (id !== '' && seen.has(id)) {
      report(context, path, `identificador duplicado: ${id}`);
    }
    seen.add(id);
  }
}

function readFocalPoint(
  context: Context,
  source: JsonObject,
  path: string,
): FocalPoint | undefined {
  const raw = source['focalPoint'];
  if (raw === undefined) {
    return undefined;
  }
  const point = asObject(context, raw, `${path}.focalPoint`);
  if (!point) {
    return undefined;
  }
  const x = point['x'];
  const y = point['y'];
  const valid = (n: unknown): n is number => typeof n === 'number' && n >= 0 && n <= 1;
  if (!valid(x) || !valid(y)) {
    report(context, `${path}.focalPoint`, 'x e y devem estar entre 0 e 1');
    return undefined;
  }
  return { x, y };
}

function readImage(context: Context, raw: unknown, path: string): ImageRef | null {
  const source = asObject(context, raw, path);
  if (!source) {
    return null;
  }
  const image: ImageRef = {
    assetId: readAssetId(context, source, 'assetId', path),
    width: readInteger(context, source, 'width', path, 1),
    height: readInteger(context, source, 'height', path, 1),
    alt: readText(context, source, 'alt', path),
  };
  const focalPoint = readFocalPoint(context, source, path);
  if (focalPoint) {
    image.focalPoint = focalPoint;
  }
  const fit = source['fit'];
  if (fit !== undefined) {
    if (fit === 'cover' || fit === 'contain') {
      image.fit = fit satisfies ImageFit;
    } else {
      report(context, `${path}.fit`, 'deve ser "cover" ou "contain"');
    }
  }
  return image;
}

function readNullableImage(
  context: Context,
  source: JsonObject,
  key: string,
  path: string,
): ImageRef | null {
  const raw = source[key];
  if (raw === null) {
    return null;
  }
  if (raw === undefined) {
    report(context, `${path}.${key}`, 'campo obrigatório (use null quando não houver imagem)');
    return null;
  }
  return readImage(context, raw, `${path}.${key}`);
}

function readPlayback(
  context: Context,
  source: JsonObject,
  key: string,
  path: string,
): Playback | null {
  const raw = source[key];
  if (raw === null) {
    return null;
  }
  if (raw === undefined) {
    report(context, `${path}.${key}`, 'campo obrigatório (use null quando não houver mídia)');
    return null;
  }
  const playbackPath = `${path}.${key}`;
  const playback = asObject(context, raw, playbackPath);
  if (!playback) {
    return null;
  }
  const duration = playback['durationSeconds'];
  if (typeof duration !== 'number' || !(duration > 0)) {
    report(context, `${playbackPath}.durationSeconds`, 'deve ser um número maior que zero');
  }
  const captions = playback['captionsAssetId'];
  if (captions !== null && typeof captions !== 'string') {
    report(context, `${playbackPath}.captionsAssetId`, 'deve ser um identificador ou null');
  }
  return {
    assetId: readAssetId(context, playback, 'assetId', playbackPath),
    durationSeconds: typeof duration === 'number' ? duration : 0,
    captionsAssetId: typeof captions === 'string' ? captions : null,
  };
}

function readStringList(context: Context, source: JsonObject, key: string, path: string): string[] {
  const items = readArray(context, source, key, path);
  const result: string[] = [];
  items.forEach((item, index) => {
    if (typeof item === 'string' && item.trim() !== '') {
      result.push(item);
    } else {
      report(context, `${path}.${key}[${String(index)}]`, 'deve ser um texto não vazio');
    }
  });
  return result;
}

function readPerson(context: Context, raw: unknown, path: string): Person {
  const source = asObject(context, raw, path) ?? {};
  return {
    id: readSlug(context, source, 'id', path),
    name: readText(context, source, 'name', path),
    biography: readText(context, source, 'biography', path),
    portrait: readNullableImage(context, source, 'portrait', path),
  };
}

function readCategory(context: Context, raw: unknown, path: string): Category {
  const source = asObject(context, raw, path) ?? {};
  return {
    id: readSlug(context, source, 'id', path),
    label: readText(context, source, 'label', path),
  };
}

function readKind(context: Context, source: JsonObject, path: string): WorkKind {
  const value = source['kind'];
  const found = WORK_KINDS.find((kind) => kind === value);
  if (found) {
    return found;
  }
  report(context, `${path}.kind`, `deve ser um destes valores: ${WORK_KINDS.join(', ')}`);
  return 'photo';
}

function readArtwork(context: Context, raw: unknown, path: string): Artwork {
  const source = asObject(context, raw, path) ?? {};
  const kind = readKind(context, source, path);
  const playback = readPlayback(context, source, 'playback', path);
  const needsPlayback = kind === 'audio' || kind === 'video';
  if (needsPlayback && playback === null && source['playback'] === null) {
    report(context, `${path}.playback`, `obras do tipo ${kind} exigem playback`);
  }
  if (!needsPlayback && playback !== null) {
    report(context, `${path}.playback`, `obras do tipo ${kind} não devem ter playback`);
  }
  return {
    id: readSlug(context, source, 'id', path),
    kind,
    title: readText(context, source, 'title', path),
    categoryId: readSlug(context, source, 'categoryId', path),
    personIds: readStringList(context, source, 'personIds', path),
    description: readText(context, source, 'description', path),
    dateLabel: readNullableText(context, source, 'dateLabel', path),
    sourceLabel: readNullableText(context, source, 'sourceLabel', path),
    creditLabel: readNullableText(context, source, 'creditLabel', path),
    image: readNullableImage(context, source, 'image', path),
    playback,
    order: readInteger(context, source, 'order', path, 0),
    published: readBoolean(context, source, 'published', path),
  };
}

function readCredit(context: Context, raw: unknown, path: string): Credit {
  const source = asObject(context, raw, path) ?? {};
  return {
    role: readText(context, source, 'role', path),
    name: readText(context, source, 'name', path),
  };
}

function readAbout(context: Context, raw: unknown, path: string): ExhibitionAbout {
  const source = asObject(context, raw, path) ?? {};
  const paragraphs = readStringList(context, source, 'paragraphs', path);
  const credits = readArray(context, source, 'credits', path).map((item, index) =>
    readCredit(context, item, `${path}.credits[${String(index)}]`),
  );
  return { paragraphs, credits };
}

/** Valida o conteúdo de um `exhibition.json`, inclusive referências internas (categorias e pessoas). */
export function validateExhibition(input: unknown): ValidationResult<Exhibition> {
  const context: Context = { issues: [] };
  const source = asObject(context, input, '$') ?? {};

  if (source['schemaVersion'] !== 1) {
    report(context, '$.schemaVersion', 'versão de esquema não suportada (esperado 1)');
  }

  const categories = readArray(context, source, 'categories', '$').map((item, index) =>
    readCategory(context, item, `$.categories[${String(index)}]`),
  );
  const people = readArray(context, source, 'people', '$').map((item, index) =>
    readPerson(context, item, `$.people[${String(index)}]`),
  );
  const artworks = readArray(context, source, 'artworks', '$').map((item, index) =>
    readArtwork(context, item, `$.artworks[${String(index)}]`),
  );

  checkUnique(
    context,
    categories.map((c) => c.id),
    '$.categories',
  );
  checkUnique(
    context,
    people.map((p) => p.id),
    '$.people',
  );
  checkUnique(
    context,
    artworks.map((a) => a.id),
    '$.artworks',
  );

  const categoryIds = new Set(categories.map((c) => c.id));
  const personIds = new Set(people.map((p) => p.id));
  artworks.forEach((artwork, index) => {
    const path = `$.artworks[${String(index)}]`;
    if (artwork.categoryId !== '' && !categoryIds.has(artwork.categoryId)) {
      report(context, `${path}.categoryId`, `categoria inexistente: ${artwork.categoryId}`);
    }
    for (const personId of artwork.personIds) {
      if (!personIds.has(personId)) {
        report(context, `${path}.personIds`, `pessoa inexistente: ${personId}`);
      }
    }
  });

  const exhibition: Exhibition = {
    schemaVersion: 1,
    id: readSlug(context, source, 'id', '$'),
    title: readText(context, source, 'title', '$'),
    subtitle: readNullableText(context, source, 'subtitle', '$'),
    summary: readText(context, source, 'summary', '$'),
    demo: readBoolean(context, source, 'demo', '$'),
    cover: readNullableImage(context, source, 'cover', '$'),
    about: readAbout(context, source['about'], '$.about'),
    categories,
    people,
    artworks,
  };
  return finish(context, exhibition);
}

function readManifestAsset(context: Context, raw: unknown, path: string): ManifestAsset {
  const source = asObject(context, raw, path) ?? {};
  const assetPath = readText(context, source, 'path', path);
  if (
    assetPath !== '' &&
    (assetPath.startsWith('/') ||
      assetPath.includes('..') ||
      assetPath.includes('\\') ||
      /^[a-z][a-z0-9+.-]*:/i.test(assetPath))
  ) {
    report(
      context,
      `${path}.path`,
      'deve ser um caminho relativo, sem "..", "\\" ou esquema (http:)',
    );
  }
  const sha256 = readText(context, source, 'sha256', path);
  if (sha256 !== '' && !SHA256.test(sha256)) {
    report(context, `${path}.sha256`, 'deve ter 64 caracteres hexadecimais minúsculos');
  }
  return {
    id: readAssetId(context, source, 'id', path),
    path: assetPath,
    mimeType: readText(context, source, 'mimeType', path),
    bytes: readInteger(context, source, 'bytes', path, 0),
    sha256,
    published: readBoolean(context, source, 'published', path),
  };
}

/** Valida o manifesto de conteúdo (versão, data e arquivos com integridade). */
export function validateManifest(input: unknown): ValidationResult<ContentManifest> {
  const context: Context = { issues: [] };
  const source = asObject(context, input, '$') ?? {};
  if (source['schemaVersion'] !== 1) {
    report(context, '$.schemaVersion', 'versão de esquema não suportada (esperado 1)');
  }
  const generatedAt = readText(context, source, 'generatedAt', '$');
  if (generatedAt !== '' && !ISO_DATE.test(generatedAt)) {
    report(
      context,
      '$.generatedAt',
      'deve ser uma data ISO 8601 em UTC (ex.: 2026-11-16T12:00:00Z)',
    );
  }
  const assets = readArray(context, source, 'assets', '$').map((item, index) =>
    readManifestAsset(context, item, `$.assets[${String(index)}]`),
  );
  checkUnique(
    context,
    assets.map((a) => a.id),
    '$.assets',
  );
  checkUnique(
    context,
    assets.map((a) => a.path),
    '$.assets (caminhos)',
  );
  const manifest: ContentManifest = {
    schemaVersion: 1,
    contentVersion: readText(context, source, 'contentVersion', '$'),
    generatedAt,
    assets,
  };
  return finish(context, manifest);
}

/** Valida o índice de exposições publicadas. */
export function validateContentIndex(input: unknown): ValidationResult<ContentIndex> {
  const context: Context = { issues: [] };
  const source = asObject(context, input, '$') ?? {};
  if (source['schemaVersion'] !== 1) {
    report(context, '$.schemaVersion', 'versão de esquema não suportada (esperado 1)');
  }
  const exhibitions = readArray(context, source, 'exhibitions', '$').map(
    (item, index): ContentIndexEntry => {
      const path = `$.exhibitions[${String(index)}]`;
      const entry = asObject(context, item, path) ?? {};
      const entryPath = readText(context, entry, 'path', path);
      if (
        entryPath.startsWith('/') ||
        entryPath.includes('..') ||
        /^[a-z][a-z0-9+.-]*:/i.test(entryPath)
      ) {
        report(
          context,
          `${path}.path`,
          'deve ser um caminho relativo, sem ".." ou esquema (http:)',
        );
      }
      return {
        id: readSlug(context, entry, 'id', path),
        title: readText(context, entry, 'title', path),
        path: entryPath,
      };
    },
  );
  if (exhibitions.length === 0) {
    report(context, '$.exhibitions', 'deve conter ao menos uma exposição');
  }
  checkUnique(
    context,
    exhibitions.map((e) => e.id),
    '$.exhibitions',
  );
  const defaultExhibitionId = readSlug(context, source, 'defaultExhibitionId', '$');
  if (defaultExhibitionId !== '' && !exhibitions.some((e) => e.id === defaultExhibitionId)) {
    report(context, '$.defaultExhibitionId', `exposição inexistente: ${defaultExhibitionId}`);
  }
  const index: ContentIndex = { schemaVersion: 1, defaultExhibitionId, exhibitions };
  return finish(context, index);
}

/**
 * Confere se todos os arquivos referenciados por uma exposição existem no manifesto e têm o tipo
 * de mídia esperado (imagem para `ImageRef`; áudio/vídeo para `playback`).
 */
export function checkExhibitionIntegrity(
  exhibition: Exhibition,
  manifest: ContentManifest,
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const assets = new Map(manifest.assets.map((asset) => [asset.id, asset]));

  const checkReference = (
    assetId: AssetId,
    path: string,
    expected: 'image/' | 'audio/ ou video/' | 'text/',
  ): void => {
    const asset = assets.get(assetId);
    if (!asset) {
      issues.push({ path, message: `arquivo ausente do manifesto: ${assetId}` });
      return;
    }
    const matches =
      expected === 'image/'
        ? asset.mimeType.startsWith('image/')
        : expected === 'text/'
          ? asset.mimeType.startsWith('text/')
          : asset.mimeType.startsWith('audio/') || asset.mimeType.startsWith('video/');
    if (!matches) {
      issues.push({
        path,
        message: `tipo de arquivo inesperado (${asset.mimeType}); esperado ${expected}`,
      });
    }
  };

  if (exhibition.cover) {
    checkReference(exhibition.cover.assetId, '$.cover.assetId', 'image/');
  }
  exhibition.people.forEach((person, index) => {
    if (person.portrait) {
      checkReference(
        person.portrait.assetId,
        `$.people[${String(index)}].portrait.assetId`,
        'image/',
      );
    }
  });
  exhibition.artworks.forEach((artwork, index) => {
    const path = `$.artworks[${String(index)}]`;
    if (artwork.image) {
      checkReference(artwork.image.assetId, `${path}.image.assetId`, 'image/');
    }
    if (artwork.playback) {
      checkReference(artwork.playback.assetId, `${path}.playback.assetId`, 'audio/ ou video/');
      if (artwork.playback.captionsAssetId !== null) {
        checkReference(
          artwork.playback.captionsAssetId,
          `${path}.playback.captionsAssetId`,
          'text/',
        );
      }
    }
  });
  return issues;
}
