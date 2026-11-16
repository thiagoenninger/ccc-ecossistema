import { useEffect, useRef, useState } from 'react';
import { THEMES, tokenCatalog } from '@ccc/design-tokens';
import type { ThemeName } from '@ccc/design-tokens';
import styles from './TokenReference.module.css';

/**
 * Página de referência dos tokens (apenas desenvolvimento: `tokens.html`, fora do build de produção).
 * Mostra os tokens reais lidos do CSS gerado; não duplica valores no código.
 */

const THEME_LABEL: Record<ThemeName, string> = {
  galeria: 'Galeria (escuro)',
  papel: 'Papel (claro)',
};

const SEMANTIC_GROUPS = [
  'surface',
  'text',
  'brand',
  'border',
  'state',
  'header',
  'sidebar',
] as const;

function groupOf(name: string): string {
  const first = name.split('-')[0] ?? name;
  return (SEMANTIC_GROUPS as readonly string[]).includes(first) ? first : 'outros';
}

function useComputedValue(cssVarName: string): [React.RefObject<HTMLElement | null>, string] {
  const ref = useRef<HTMLElement | null>(null);
  const [value, setValue] = useState('');
  useEffect(() => {
    if (ref.current) {
      setValue(getComputedStyle(ref.current).getPropertyValue(cssVarName).trim());
    }
  }, [cssVarName]);
  return [ref, value];
}

function Swatch({ cssVarName, label }: { cssVarName: string; label: string }) {
  const [ref, value] = useComputedValue(cssVarName);
  return (
    <li className={styles.swatch} ref={ref as React.RefObject<HTMLLIElement>}>
      <span
        className={styles.chip}
        style={{ background: `var(${cssVarName})` }}
        aria-hidden="true"
      />
      <span className={styles.swatchText}>
        <span className={styles.token}>{label}</span>
        <span className={styles.value}>{value}</span>
      </span>
    </li>
  );
}

function ThemePanel({ theme }: { theme: ThemeName }) {
  const groups = new Map<string, string[]>();
  for (const name of tokenCatalog.colorSemantic) {
    const g = groupOf(name);
    groups.set(g, [...(groups.get(g) ?? []), name]);
  }
  return (
    <section className={styles.panel} data-theme={theme} aria-label={`Tema ${THEME_LABEL[theme]}`}>
      <h3 className={styles.panelTitle}>{THEME_LABEL[theme]}</h3>
      <p className={styles.sample}>
        Cultura, memória e território — amostra de texto primário sobre a superfície da página.
      </p>
      <p className={styles.sampleSecondary}>Texto secundário · legendas e metadados.</p>
      {[...groups.entries()].map(([group, names]) => (
        <div key={group}>
          <h4 className={styles.groupTitle}>{group}</h4>
          <ul className={styles.swatches}>
            {names.map((n) => (
              <Swatch key={n} cssVarName={`--color-${n}`} label={n} />
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}

function FocusAndSelection() {
  return (
    <div className={styles.demoRow}>
      <button type="button" className={`${styles.demoButton} ${styles.focusDemo}`}>
        Anel de foco (duplo)
      </button>
      <div className={styles.selectedDemo}>
        <span>Barra de seleção âmbar 4px</span>
      </div>
    </div>
  );
}

function CaptionGradientDemo() {
  return (
    <div className={styles.captionRow}>
      {(['hero', 'medium', 'small'] as const).map((size) => (
        <figure key={size} className={styles.tile} data-size={size}>
          <div className={styles.captionGradient} data-size={size}>
            <p className={styles.captionTitle}>Legenda {size}</p>
            <p className={styles.captionMeta}>Autoria · Ano</p>
          </div>
          <figcaption className={styles.tileLabel}>demonstração — {size}</figcaption>
        </figure>
      ))}
    </div>
  );
}

export function TokenReference() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Galeria Contemporânea · v{tokenCatalog.version}</p>
        <h1 className={styles.title}>Referência de tokens</h1>
        <p className={styles.lead}>
          Página de desenvolvimento (Marco M0). Valores lidos do CSS gerado a partir do
          design-tokens.json oficial.
        </p>
      </header>

      <section aria-labelledby="sec-primitives">
        <h2 id="sec-primitives" className={styles.sectionTitle}>
          Paleta primitiva
        </h2>
        <ul className={styles.swatches}>
          {tokenCatalog.colorPrimitive.map((n) => (
            <Swatch key={n} cssVarName={`--color-${n}`} label={n} />
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-themes">
        <h2 id="sec-themes" className={styles.sectionTitle}>
          Cores semânticas por tema
        </h2>
        <div className={styles.panels}>
          {THEMES.map((t) => (
            <ThemePanel key={t} theme={t} />
          ))}
        </div>
      </section>

      <section aria-labelledby="sec-type">
        <h2 id="sec-type" className={styles.sectionTitle}>
          Escala tipográfica ({tokenCatalog.typeStyles.length} estilos)
        </h2>
        <ul className={styles.typeList}>
          {tokenCatalog.typeStyles.map((s) => (
            <li key={s.name} className={styles.typeRow}>
              <span className={styles.typeMeta}>
                {s.name} · {s.size}/{s.line} · {s.weight}
              </span>
              <span style={{ font: `var(--type-${s.name})` }}>
                Cubatão: memória, território e futuro
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="sec-scales">
        <h2 id="sec-scales" className={styles.sectionTitle}>
          Espaçamento, raios, bordas, toque, movimento, breakpoints e camadas
        </h2>
        <div className={styles.scales}>
          <ScaleList title="Espaçamento" prefix="space" names={tokenCatalog.space} />
          <ScaleList title="Raios" prefix="radius" names={tokenCatalog.radius} />
          <ScaleList title="Bordas" prefix="border" names={tokenCatalog.border} />
          <ScaleList title="Opacidade" prefix="opacity" names={tokenCatalog.opacity} />
          <ScaleList title="Toque" prefix="touch" names={tokenCatalog.touch} />
          <ScaleList title="Movimento" prefix="motion" names={tokenCatalog.motion} />
          <ScaleList title="Easing" prefix="ease" names={tokenCatalog.ease} />
          <ScaleList title="Breakpoints" prefix="breakpoint" names={tokenCatalog.breakpoint} />
          <ScaleList title="Camadas (z)" prefix="z" names={tokenCatalog.z} />
        </div>
      </section>

      <section aria-labelledby="sec-states">
        <h2 id="sec-states" className={styles.sectionTitle}>
          Foco e seleção
        </h2>
        <FocusAndSelection />
      </section>

      <section aria-labelledby="sec-caption">
        <h2 id="sec-caption" className={styles.sectionTitle}>
          Degradê de legenda (metodologia do Handoff, ADR-004)
        </h2>
        <CaptionGradientDemo />
      </section>
    </main>
  );
}

function ScaleList({ title, prefix, names }: { title: string; prefix: string; names: string[] }) {
  return (
    <div>
      <h3 className={styles.groupTitle}>{title}</h3>
      <ul className={styles.scaleList}>
        {names.map((n) => (
          <ScaleItem key={n} cssVarName={`--${prefix}-${n}`} />
        ))}
      </ul>
    </div>
  );
}

function ScaleItem({ cssVarName }: { cssVarName: string }) {
  const [ref, value] = useComputedValue(cssVarName);
  return (
    <li ref={ref as React.RefObject<HTMLLIElement>} className={styles.scaleItem}>
      <span className={styles.token}>{cssVarName}</span>
      <span className={styles.value}>{value}</span>
    </li>
  );
}
