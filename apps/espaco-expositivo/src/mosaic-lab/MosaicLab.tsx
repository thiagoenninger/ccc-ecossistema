import { useEffect, useMemo, useState } from 'react';
import type { ExhibitionRepository } from '@ccc/data-access';
import { MOSAIC_TEMPLATES, MOSAIC_TEMPLATE_IDS, viewportProfile } from '@ccc/design-tokens';
import type { MosaicTemplateId, ThemeName } from '@ccc/design-tokens';
import type { Artwork, Exhibition, ImageFit, WorkKind } from '@ccc/types';
import { Mosaic } from '@ccc/ui';
import type { MosaicItem, TileContentState } from '@ccc/ui';
import { runContrastReport } from './measure.ts';
import type { ContrastReport, MeasureImage } from './measure.ts';
import styles from './MosaicLab.module.css';

/**
 * Harness de desenvolvimento (`mosaic.html`, fora do build de produção): permite ver os templates
 * 1–9 nas resoluções de referência, alternar temas, enquadramento, estados e recuo, e medir o
 * contraste das legendas pelo método do Handoff §11. Não é uma tela do produto.
 */

const VIEWPORTS = [
  { id: '1920x1080', width: 1920, height: 1080, top: 150 },
  { id: '1366x768', width: 1366, height: 768, top: 104 },
  { id: '1280x800', width: 1280, height: 800, top: 112 },
] as const;

type ViewportId = (typeof VIEWPORTS)[number]['id'];
type FitMode = 'contract' | ImageFit;
type StateMode = 'none' | 'no-image' | 'offline' | 'failed' | 'unpublished';

const KIND_LABEL: Record<WorkKind, string> = {
  photo: 'Fotografia',
  document: 'Documento',
  map: 'Mapa',
  audio: 'Áudio',
  video: 'Vídeo',
};

interface LoadedWork {
  artwork: Artwork;
  url: string | null;
  status: TileContentState;
}

/** Estado inicial opcional pela URL (ex.: `?template=6&viewport=1366x768&theme=papel`), útil para capturas. */
function queryParam(name: string): string | null {
  return new URLSearchParams(window.location.search).get(name);
}

function oneOf<T extends string>(value: string | null, allowed: readonly T[], fallback: T): T {
  return allowed.find((candidate) => candidate === value) ?? fallback;
}

function toError(reason: unknown): Error {
  return reason instanceof Error ? reason : new Error(String(reason));
}

async function loadWorks(
  repository: ExhibitionRepository,
  exhibition: Exhibition,
): Promise<LoadedWork[]> {
  return Promise.all(
    exhibition.artworks.map(async (artwork): Promise<LoadedWork> => {
      if (!artwork.image) return { artwork, url: null, status: 'no-image' };
      const resolution = await repository.resolveAssetUrl(artwork.image.assetId);
      if (resolution.status === 'available') {
        return { artwork, url: resolution.url, status: 'ready' };
      }
      const status: TileContentState =
        resolution.status === 'offline-unavailable'
          ? 'offline'
          : resolution.status === 'unpublished'
            ? 'unpublished'
            : 'failed';
      return { artwork, url: null, status };
    }),
  );
}

function buildItems(works: readonly LoadedWork[], fit: FitMode, forced: StateMode): MosaicItem[] {
  return works.map(({ artwork, url, status }, index) => {
    // O estado forçado vale para as obras de índice ímpar (alterna com ladrilhos normais).
    const state: TileContentState =
      forced !== 'none' && index % 2 === 1 ? (forced === 'no-image' ? 'no-image' : forced) : status;
    const image = artwork.image;
    return {
      id: artwork.id,
      tile: {
        title: artwork.title,
        meta: KIND_LABEL[artwork.kind],
        state,
        ...(url !== null && state === 'ready' ? { imageUrl: url } : {}),
        fit: fit === 'contract' ? (image?.fit ?? 'cover') : fit,
        ...(image?.focalPoint ? { focalPoint: image.focalPoint } : {}),
      },
    };
  });
}

function SlotSample({
  title,
  subtitle,
  total,
}: {
  title: string;
  subtitle: string;
  total: number;
}) {
  return (
    <div className={styles.slotSample}>
      <p className={styles.slotTitle}>{title}</p>
      <p className={styles.slotSubtitle}>
        {subtitle} · {String(total)} obras
      </p>
      <div className={styles.slotPager} aria-hidden="true">
        <span className={styles.pagerArrow}>‹</span>
        <span className={styles.pagerSegmentOn} />
        <span className={styles.pagerSegment} />
        <span className={styles.pagerSegment} />
        <span className={styles.pagerArrow}>›</span>
      </div>
      <p className={styles.slotNote}>Amostra de slot (a paginação real vem na E05)</p>
    </div>
  );
}

function ContrastPanel({ works }: { works: readonly LoadedWork[] }) {
  const [report, setReport] = useState<ContrastReport | Error | null>(null);
  const [running, setRunning] = useState(false);

  const candidates = useMemo<MeasureImage[]>(
    () =>
      works.flatMap(({ artwork, url }) =>
        artwork.image && url !== null
          ? [
              {
                id: artwork.id,
                url,
                width: artwork.image.width,
                height: artwork.image.height,
                fit: artwork.image.fit ?? 'cover',
                ...(artwork.image.focalPoint ? { focalPoint: artwork.image.focalPoint } : {}),
              },
            ]
          : [],
      ),
    [works],
  );

  const run = (): void => {
    setRunning(true);
    runContrastReport(candidates)
      .then((value) => {
        setReport(value);
      })
      .catch((reason: unknown) => {
        setReport(toError(reason));
      })
      .finally(() => {
        setRunning(false);
      });
  };

  // `?autorun=contrast` executa a medição ao abrir a página (usado na verificação automatizada).
  const autorun = new URLSearchParams(window.location.search).get('autorun') === 'contrast';
  useEffect(() => {
    if (!autorun || candidates.length === 0) return undefined;
    let cancelled = false;
    runContrastReport(candidates)
      .then((value) => {
        if (!cancelled) setReport(value);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setReport(toError(reason));
      });
    return () => {
      cancelled = true;
    };
  }, [autorun, candidates]);

  return (
    <section className={styles.panel} aria-labelledby="contrast-title">
      <h2 id="contrast-title" className={styles.panelTitle}>
        Contraste das legendas (Handoff §11)
      </h2>
      <p className={styles.hint}>
        Rasteriza o ladrilho sem legenda, aplica o degradê e toma o pixel mais claro do retângulo do
        texto. Imagens sintéticas de demonstração: o resultado não vale para o acervo real (P-04).
      </p>
      <button
        type="button"
        className={styles.button}
        onClick={run}
        disabled={running || candidates.length === 0}
      >
        {running ? 'Medindo…' : 'Medir contraste'}
      </button>
      {report instanceof Error ? <p role="alert">Falha na medição: {report.message}</p> : null}
      {report && !(report instanceof Error) ? (
        <div id="contrast-report" data-ready="true">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Modo</th>
                <th>Combinações</th>
                <th>Pior título</th>
                <th>Pior meta (88 %)</th>
                <th>Mín. p99 (info)</th>
                <th>Título &lt; 4,5</th>
                <th>Meta &lt; 4,5</th>
              </tr>
            </thead>
            <tbody>
              {report.modes.map((m) => (
                <tr key={m.mode} data-mode={m.mode}>
                  <td>{m.mode}</td>
                  <td>{m.combinations}</td>
                  <td data-field="worstTitle">{m.worstTitle.toFixed(2)}:1</td>
                  <td data-field="worstMeta">{m.worstMeta.toFixed(2)}:1</td>
                  <td data-field="minP99">{m.minP99Title.toFixed(2)}:1</td>
                  <td data-field="titleBelow">{m.titleBelow45}</td>
                  <td data-field="metaBelow">{m.metaBelow45}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.hint}>
            Imagens usadas (luminância média):{' '}
            {report.images.map((i) => `${i.id} (${i.meanLuminance.toFixed(2)})`).join(', ')}
          </p>
          <pre className={styles.json} id="contrast-json">
            {JSON.stringify(report, null, 1)}
          </pre>
        </div>
      ) : null}
    </section>
  );
}

export function MosaicLab({ repository }: { repository: ExhibitionRepository }) {
  const [exhibitionId, setExhibitionId] = useState<string | null>(null);
  const [exhibitions, setExhibitions] = useState<{ id: string; title: string }[]>([]);
  const [works, setWorks] = useState<LoadedWork[]>([]);
  const [exhibition, setExhibition] = useState<Exhibition | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const [viewportId, setViewportId] = useState<ViewportId>(() =>
    oneOf(
      queryParam('viewport'),
      VIEWPORTS.map((v) => v.id),
      '1920x1080',
    ),
  );
  const [templateId, setTemplateId] = useState<MosaicTemplateId>(() => {
    const requested = Number(queryParam('template'));
    return MOSAIC_TEMPLATE_IDS.find((id) => id === requested) ?? 8;
  });
  const [theme, setTheme] = useState<ThemeName>(() =>
    oneOf(queryParam('theme'), ['galeria', 'papel'] as const, 'galeria'),
  );
  const [fit, setFit] = useState<FitMode>(() =>
    oneOf(queryParam('fit'), ['contract', 'cover', 'contain'] as const, 'contract'),
  );
  const [forced, setForced] = useState<StateMode>(() =>
    oneOf(
      queryParam('state'),
      ['none', 'no-image', 'offline', 'failed', 'unpublished'] as const,
      'none',
    ),
  );
  const [showSlot, setShowSlot] = useState(true);
  const [recede, setRecede] = useState(() => queryParam('recede') === '1');
  const [selectedId, setSelectedId] = useState<string | null>(() => queryParam('selected'));

  useEffect(() => {
    let cancelled = false;
    repository
      .listExhibitions()
      .then((index) => {
        if (cancelled) return;
        setExhibitions(index.exhibitions.map((e) => ({ id: e.id, title: e.title })));
        setExhibitionId(index.defaultExhibitionId);
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(toError(reason));
      });
    return () => {
      cancelled = true;
    };
  }, [repository]);

  useEffect(() => {
    if (exhibitionId === null) return undefined;
    let cancelled = false;
    repository
      .loadExhibition(exhibitionId)
      .then(async (loaded) => {
        const resolved = await loadWorks(repository, loaded);
        if (cancelled) return;
        setExhibition(loaded);
        setWorks(resolved);
        setSelectedId(queryParam('selected'));
      })
      .catch((reason: unknown) => {
        if (!cancelled) setError(toError(reason));
      });
    return () => {
      cancelled = true;
    };
  }, [repository, exhibitionId]);

  useEffect(() => {
    document.documentElement.dataset['theme'] = theme;
  }, [theme]);

  const viewport = VIEWPORTS.find((v) => v.id === viewportId) ?? VIEWPORTS[0];
  const profile = viewportProfile(viewport.width);
  const template = MOSAIC_TEMPLATES[templateId];
  const maxByProfile = profile.maxItems;
  const items = useMemo(
    () => buildItems(works.slice(0, template.count), fit, forced),
    [works, template.count, fit, forced],
  );

  if (error) {
    return (
      <main className={styles.page}>
        <p role="alert">Não foi possível carregar o conteúdo: {error.message}</p>
      </main>
    );
  }

  const areaWidth = viewport.width - 2 * profile.margin;
  // `?scale=1` mostra a moldura em tamanho real (capturas); por padrão ela se ajusta à janela.
  const requestedScale = Number(queryParam('scale'));
  const scale = requestedScale > 0 ? requestedScale : Math.min(1, 1180 / viewport.width);
  const tooMany = template.count > maxByProfile;
  // `?bare=1` mostra só a moldura (capturas de tela).
  const bare = queryParam('bare') === '1';

  return (
    <main className={bare ? styles.pageBare : styles.page}>
      {bare ? null : (
        <>
          <h1 className={styles.title}>Laboratório do mosaico — ferramenta de desenvolvimento</h1>
          <p className={styles.hint}>
            Não faz parte do produto. Imagens de demonstração. Perfil de {profile.reference}: margem{' '}
            {profile.margin} px, até {maxByProfile} itens simultâneos (Handoff §5.5).
          </p>

          <div className={styles.controls} role="group" aria-label="Controles">
            <label>
              Exposição{' '}
              <select
                value={exhibitionId ?? ''}
                onChange={(e) => {
                  setExhibitionId(e.target.value);
                }}
              >
                {exhibitions.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.title}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Resolução{' '}
              <select
                value={viewportId}
                onChange={(e) => {
                  setViewportId(e.target.value as ViewportId);
                }}
              >
                {VIEWPORTS.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.width}×{v.height}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Template{' '}
              <select
                value={templateId}
                onChange={(e) => {
                  setTemplateId(Number(e.target.value) as MosaicTemplateId);
                }}
              >
                {MOSAIC_TEMPLATE_IDS.map((id) => (
                  <option key={id} value={id}>
                    {id} — {MOSAIC_TEMPLATES[id].name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Tema{' '}
              <select
                value={theme}
                onChange={(e) => {
                  setTheme(e.target.value as ThemeName);
                }}
              >
                <option value="galeria">Galeria</option>
                <option value="papel">Papel</option>
              </select>
            </label>
            <label>
              Enquadramento{' '}
              <select
                value={fit}
                onChange={(e) => {
                  setFit(e.target.value as FitMode);
                }}
              >
                <option value="contract">Conforme o conteúdo</option>
                <option value="cover">Forçar cover</option>
                <option value="contain">Forçar contain</option>
              </select>
            </label>
            <label>
              Estado nas obras ímpares{' '}
              <select
                value={forced}
                onChange={(e) => {
                  setForced(e.target.value as StateMode);
                }}
              >
                <option value="none">Nenhum</option>
                <option value="no-image">Sem imagem</option>
                <option value="offline">Offline</option>
                <option value="failed">Falha</option>
                <option value="unpublished">Em preparação</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={showSlot}
                onChange={(e) => {
                  setShowSlot(e.target.checked);
                }}
              />{' '}
              Mostrar slot
            </label>
            <label>
              <input
                type="checkbox"
                checked={recede}
                onChange={(e) => {
                  setRecede(e.target.checked);
                }}
              />{' '}
              Recuar as demais ao selecionar
            </label>
          </div>
        </>
      )}

      {tooMany && !bare ? (
        <p className={styles.warning} role="status">
          Atenção: o perfil {profile.reference} comporta até {maxByProfile} itens; o template{' '}
          {templateId} é mostrado só para estudo.
        </p>
      ) : null}

      <div
        className={styles.stageBox}
        style={{
          width: `${String(viewport.width * scale)}px`,
          height: `${String(viewport.height * scale)}px`,
        }}
      >
        <div
          className={styles.frame}
          data-viewport={viewport.id}
          style={{
            width: `${String(viewport.width)}px`,
            height: `${String(viewport.height)}px`,
            transform: `scale(${String(scale)})`,
          }}
        >
          <div
            className={styles.frameHeader}
            style={{
              left: `${String(profile.margin)}px`,
              right: `${String(profile.margin)}px`,
              top: `${String(viewport.top - 86)}px`,
            }}
          >
            <span>CENTRO CULTURAL DE CUBATÃO · ESPAÇO EXPOSITIVO</span>
            <span className={styles.demoTag}>CONTEÚDO DE EXEMPLO</span>
          </div>
          <div
            className={styles.mosaicBox}
            style={{
              left: `${String(profile.margin)}px`,
              top: `${String(viewport.top)}px`,
              width: `${String(areaWidth)}px`,
            }}
          >
            <Mosaic
              items={items}
              width={areaWidth}
              density={profile.name === 'wide' ? 'standard' : 'compact'}
              selectedId={selectedId}
              recedeOthers={recede}
              onSelect={(id) => {
                setSelectedId((current) => (current === id ? null : id));
              }}
              label={`Obras — template ${String(templateId)}`}
              slot={
                showSlot && exhibition ? (
                  <SlotSample
                    title={exhibition.title}
                    subtitle={exhibition.subtitle ?? exhibition.summary}
                    total={works.length}
                  />
                ) : null
              }
            />
          </div>
          {template.slot === null ? (
            <p
              className={styles.frameFooter}
              style={{
                left: `${String(profile.margin)}px`,
                top: `${String(viewport.top + (750 * areaWidth) / 1800 + 24)}px`,
              }}
            >
              Template sem slot interno: título e paginação ficam na faixa abaixo da grade (C-05).
            </p>
          ) : null}
        </div>
      </div>

      {bare ? null : <ContrastPanel works={works} />}
    </main>
  );
}
