/**
 * Imagens procedurais de demonstração (ADR-009): SVG determinístico gerado a partir de uma semente.
 * Sem filtros SVG (rápido em tablets), sem texto, sem material de terceiros. Mesma entrada = mesmo arquivo.
 */

export type Motif = 'skyline' | 'facade' | 'letter' | 'ledger' | 'map';

export type Palette =
  'dusk' | 'mist' | 'blue' | 'night' | 'sepia' | 'paper' | 'aged' | 'clean' | 'blueprint';

export interface ArtSpec {
  motif: Motif;
  palette: Palette;
  width: number;
  height: number;
  seed: number;
}

type Random = () => number;

/** Gerador pseudoaleatório determinístico (mulberry32). */
function createRandom(seed: number): Random {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Arredonda para uma casa decimal e devolve texto curto. */
function n(value: number): string {
  return String(Math.round(value * 10) / 10);
}

function between(random: Random, min: number, max: number): number {
  return min + random() * (max - min);
}

interface SkyPalette {
  sky: [string, string, string];
  far: string;
  near: string;
  ink: string;
  ground: string;
  glow: string;
}

const SKY: Record<'dusk' | 'mist' | 'blue' | 'night' | 'sepia', SkyPalette> = {
  dusk: {
    sky: ['#E9A46A', '#B98A93', '#6F5F8C'],
    far: '#6B5E86',
    near: '#3F3A52',
    ink: '#1F1D2B',
    ground: '#14141C',
    glow: '#FFD9A0',
  },
  mist: {
    sky: ['#D8D8D6', '#9AA0A2', '#5C6366'],
    far: '#7C8386',
    near: '#4A5154',
    ink: '#1B1F21',
    ground: '#101314',
    glow: '#F2F2F0',
  },
  blue: {
    sky: ['#C7D8E4', '#8AA6BC', '#56728A'],
    far: '#5F7C93',
    near: '#3A5266',
    ink: '#1E2B36',
    ground: '#121B22',
    glow: '#EAF2F8',
  },
  night: {
    sky: ['#26303A', '#161C22', '#0C0F12'],
    far: '#161C22',
    near: '#0F1317',
    ink: '#07090B',
    ground: '#050607',
    glow: '#3A4650',
  },
  sepia: {
    sky: ['#EADCC0', '#C9AE86', '#8E7352'],
    far: '#8E7352',
    near: '#5E4B35',
    ink: '#2B2118',
    ground: '#1B140E',
    glow: '#FFF1D6',
  },
};

interface PaperPalette {
  bg: string;
  ink: string;
  accent: string;
  line: string;
  water: string;
}

const PAPER: Record<'paper' | 'aged' | 'clean' | 'blueprint', PaperPalette> = {
  paper: { bg: '#E9E1CC', ink: '#4A4034', accent: '#B5532B', line: '#6B5E45', water: '#8FA9B5' },
  aged: { bg: '#D9C9A5', ink: '#3E3426', accent: '#8E3B22', line: '#6A5A3C', water: '#8C9FA6' },
  clean: { bg: '#F6F3EC', ink: '#3A3F42', accent: '#9E3D22', line: '#7C8386', water: '#9DB4BE' },
  blueprint: {
    bg: '#17303D',
    ink: '#8CB8C9',
    accent: '#F5960E',
    line: '#8CB8C9',
    water: '#2D5566',
  },
};

function skyPalette(palette: Palette): SkyPalette {
  if (
    palette === 'dusk' ||
    palette === 'mist' ||
    palette === 'blue' ||
    palette === 'night' ||
    palette === 'sepia'
  ) {
    return SKY[palette];
  }
  return SKY.mist;
}

function paperPalette(palette: Palette): PaperPalette {
  if (palette === 'paper' || palette === 'aged' || palette === 'clean' || palette === 'blueprint') {
    return PAPER[palette];
  }
  return PAPER.paper;
}

function grain(random: Random, width: number, height: number, count: number): string {
  const cells: string[] = [];
  for (let i = 0; i < count; i += 1) {
    const color = random() < 0.5 ? '#000' : '#fff';
    const x = n(random() * width);
    const y = n(random() * height);
    const opacity = String(Math.round(between(random, 4, 13)) / 100);
    cells.push(
      `<rect x="${x}" y="${y}" width="2" height="2" fill="${color}" opacity="${opacity}"/>`,
    );
  }
  return cells.join('');
}

function vignette(id: string, strength: number): string {
  return `<radialGradient id="${id}" cx="50%" cy="50%" r="75%"><stop offset="55%" stop-color="#000" stop-opacity="0"/><stop offset="100%" stop-color="#000" stop-opacity="${String(strength)}"/></radialGradient>`;
}

function ridge(
  random: Random,
  width: number,
  baseY: number,
  amplitude: number,
  bottom: number,
): string {
  const steps = 24;
  const phaseA = random() * Math.PI * 2;
  const phaseB = random() * Math.PI * 2;
  const points: string[] = [`0,${n(bottom)}`];
  for (let i = 0; i <= steps; i += 1) {
    const x = (width * i) / steps;
    const y =
      baseY +
      Math.sin((i / steps) * Math.PI * 2 * 1.3 + phaseA) * amplitude +
      Math.sin((i / steps) * Math.PI * 2 * 3.1 + phaseB) * amplitude * 0.45 +
      (random() - 0.5) * amplitude * 0.35;
    points.push(`${n(x)},${n(y)}`);
  }
  points.push(`${n(width)},${n(bottom)}`);
  return points.join(' ');
}

function skyline(spec: ArtSpec, random: Random): string {
  const { width, height } = spec;
  const p = skyPalette(spec.palette);
  const horizon = height * between(random, 0.64, 0.72);
  const parts: string[] = [];

  parts.push(
    `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.sky[2]}"/><stop offset="0.55" stop-color="${p.sky[1]}"/><stop offset="1" stop-color="${p.sky[0]}"/></linearGradient>` +
      `<radialGradient id="glow" cx="${n(between(random, 0.3, 0.7))}" cy="0.78" r="0.55"><stop offset="0" stop-color="${p.glow}" stop-opacity="0.75"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></radialGradient>` +
      `<linearGradient id="haze" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.glow}" stop-opacity="0"/><stop offset="0.6" stop-color="${p.glow}" stop-opacity="0.32"/><stop offset="1" stop-color="${p.glow}" stop-opacity="0"/></linearGradient>` +
      vignette('vig', 0.5) +
      `</defs>`,
  );
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="url(#sky)"/>`);
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="url(#glow)"/>`);

  const clouds = 3 + Math.floor(random() * 3);
  for (let i = 0; i < clouds; i += 1) {
    parts.push(
      `<ellipse cx="${n(random() * width)}" cy="${n(height * between(random, 0.12, 0.5))}" rx="${n(width * between(random, 0.12, 0.3))}" ry="${n(height * between(random, 0.025, 0.06))}" fill="${p.glow}" opacity="${n(between(random, 0.12, 0.3))}"/>`,
    );
  }

  parts.push(
    `<polygon points="${ridge(random, width, horizon - height * 0.07, height * 0.035, horizon + 4)}" fill="${p.far}"/>`,
  );
  parts.push(
    `<polygon points="${ridge(random, width, horizon - height * 0.015, height * 0.02, horizon + 4)}" fill="${p.near}"/>`,
  );
  parts.push(
    `<rect y="${n(horizon - height * 0.1)}" width="${String(width)}" height="${n(height * 0.2)}" fill="url(#haze)"/>`,
  );

  const count = 5 + Math.floor(random() * 6);
  for (let i = 0; i < count; i += 1) {
    const x =
      width * (0.07 + (0.86 * i) / (count - 1)) + between(random, -width * 0.02, width * 0.02);
    const w = width * between(random, 0.012, 0.026);
    const top = horizon - height * between(random, 0.14, 0.4);
    const base = horizon + 6;
    parts.push(
      `<polygon points="${n(x)},${n(base)} ${n(x + w)},${n(base)} ${n(x + w * 0.82)},${n(top)} ${n(x + w * 0.18)},${n(top)}" fill="${p.ink}"/>`,
    );
    parts.push(
      `<rect x="${n(x + w * 0.08)}" y="${n(top - height * 0.012)}" width="${n(w * 0.84)}" height="${n(height * 0.012)}" fill="${p.ink}"/>`,
    );
  }

  parts.push(
    `<rect y="${n(horizon + height * 0.025)}" width="${String(width)}" height="${n(height - horizon - height * 0.025)}" fill="${p.ground}"/>`,
  );
  parts.push(
    `<rect y="${n(horizon)}" width="${String(width)}" height="${n(height * 0.025)}" fill="${p.ink}"/>`,
  );

  if (spec.palette === 'mist' || spec.palette === 'sepia') {
    for (let i = 0; i < 14; i += 1) {
      const x = random() * width;
      parts.push(
        `<rect x="${n(x)}" width="${n(between(random, 1, 3))}" height="${String(height)}" fill="#fff" opacity="${n(between(random, 0.05, 0.16))}"/>`,
      );
    }
  }
  parts.push(grain(random, width, height, 220));
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="url(#vig)"/>`);
  return parts.join('');
}

function facade(spec: ArtSpec, random: Random): string {
  const { width, height } = spec;
  const parts: string[] = [];
  parts.push(
    `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBFAF6"/><stop offset="1" stop-color="#ECE9E0"/></linearGradient>` +
      `<radialGradient id="glare" cx="0.75" cy="0.15" r="0.6"><stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`,
  );
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="url(#sky)"/>`);
  const left = width * 0.08;
  const right = width * 0.92;
  const roofY = height * 0.28;
  const wallTop = height * 0.34;
  const ground = height * 0.9;
  parts.push(
    `<polygon points="${n(left - width * 0.02)},${n(wallTop)} ${n(width / 2)},${n(roofY)} ${n(right + width * 0.02)},${n(wallTop)}" fill="#D2CCBF"/>`,
  );
  parts.push(
    `<rect x="${n(left)}" y="${n(wallTop)}" width="${n(right - left)}" height="${n(ground - wallTop)}" fill="#F5F2EB"/>`,
  );
  parts.push(
    `<rect x="${n(right - width * 0.1)}" y="${n(wallTop)}" width="${n(width * 0.1)}" height="${n(ground - wallTop)}" fill="#000" opacity="0.05"/>`,
  );
  const cols = 4;
  const rows = 2;
  for (let r = 0; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      const w = width * 0.1;
      const h = height * 0.13;
      const x = left + (right - left) * ((c + 0.5) / cols) - w / 2;
      const y = wallTop + height * 0.07 + r * height * 0.22;
      parts.push(
        `<rect x="${n(x - 5)}" y="${n(y - 5)}" width="${n(w + 10)}" height="${n(h + 10)}" fill="#E4DFD2"/>`,
      );
      parts.push(`<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="#C9C4B6"/>`);
    }
  }
  const doorW = width * 0.12;
  parts.push(
    `<rect x="${n(width / 2 - doorW / 2)}" y="${n(ground - height * 0.22)}" width="${n(doorW)}" height="${n(height * 0.22)}" fill="#B9B3A3"/>`,
  );
  parts.push(
    `<rect y="${n(ground)}" width="${String(width)}" height="${n(height - ground)}" fill="#DDD8CC"/>`,
  );
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="url(#glare)"/>`);
  parts.push(grain(random, width, height, 90));
  return parts.join('');
}

function textLines(
  random: Random,
  p: PaperPalette,
  x: number,
  y: number,
  w: number,
  lineHeight: number,
  lines: number,
): string {
  const rows: string[] = [];
  let paragraphLeft = 4 + Math.floor(random() * 4);
  for (let i = 0; i < lines; i += 1) {
    paragraphLeft -= 1;
    const last = paragraphLeft === 0;
    const share = last ? between(random, 0.3, 0.6) : between(random, 0.86, 1);
    rows.push(
      `<rect x="${n(x)}" y="${n(y + i * lineHeight)}" width="${n(w * share)}" height="${n(lineHeight * 0.42)}" fill="${p.ink}" opacity="${n(between(random, 0.5, 0.78))}"/>`,
    );
    if (last) {
      paragraphLeft = 4 + Math.floor(random() * 4);
      i += 1;
    }
  }
  return rows.join('');
}

function letter(spec: ArtSpec, random: Random): string {
  const { width, height } = spec;
  const p = paperPalette(spec.palette);
  const parts: string[] = [];
  parts.push(
    `<defs>${vignette('age', 0.28)}<linearGradient id="fold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="0.5" stop-color="#000" stop-opacity="0.07"/><stop offset="1" stop-color="#000" stop-opacity="0"/></linearGradient></defs>`,
  );
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="${p.bg}"/>`);
  const margin = Math.min(width, height) * 0.11;
  const textWidth = width - margin * 2;
  parts.push(
    `<rect x="${n(margin)}" y="${n(margin)}" width="${n(textWidth * 0.55)}" height="${n(height * 0.03)}" fill="${p.ink}" opacity="0.85"/>`,
  );
  parts.push(
    `<rect x="${n(margin)}" y="${n(margin + height * 0.05)}" width="${n(textWidth * 0.3)}" height="${n(height * 0.014)}" fill="${p.ink}" opacity="0.6"/>`,
  );
  const lineHeight = height * 0.027;
  const lines = Math.floor((height - margin * 3.2 - height * 0.12) / lineHeight);
  parts.push(textLines(random, p, margin, margin + height * 0.11, textWidth, lineHeight, lines));
  const sealX = width - margin - Math.min(width, height) * 0.09;
  const sealY = height - margin - Math.min(width, height) * 0.07;
  const sealR = Math.min(width, height) * 0.06;
  parts.push(
    `<circle cx="${n(sealX)}" cy="${n(sealY)}" r="${n(sealR)}" fill="none" stroke="${p.accent}" stroke-width="5" opacity="0.7"/>`,
  );
  parts.push(
    `<circle cx="${n(sealX)}" cy="${n(sealY)}" r="${n(sealR * 0.68)}" fill="none" stroke="${p.accent}" stroke-width="3" opacity="0.6"/>`,
  );
  parts.push(
    `<path d="M${n(margin)} ${n(height - margin)} q ${n(width * 0.06)} ${n(-height * 0.05)} ${n(width * 0.12)} 0 t ${n(width * 0.12)} 0" fill="none" stroke="${p.ink}" stroke-width="4" opacity="0.7"/>`,
  );
  for (let i = 0; i < 3; i += 1) {
    parts.push(
      `<circle cx="${n(random() * width)}" cy="${n(random() * height)}" r="${n(Math.min(width, height) * between(random, 0.03, 0.09))}" fill="#7A5A2B" opacity="${n(between(random, 0.05, 0.1))}"/>`,
    );
  }
  parts.push(
    `<rect x="${n(width * 0.46)}" width="${n(width * 0.08)}" height="${String(height)}" fill="url(#fold)"/>`,
  );
  parts.push(grain(random, width, height, 120));
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="url(#age)"/>`);
  return parts.join('');
}

function ledger(spec: ArtSpec, random: Random): string {
  const { width, height } = spec;
  const p = paperPalette(spec.palette);
  const parts: string[] = [];
  parts.push(`<defs>${vignette('age', 0.3)}</defs>`);
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="${p.bg}"/>`);
  const margin = Math.min(width, height) * 0.08;
  const cols = 6;
  const rows = 22;
  const tableW = width - margin * 2;
  const tableH = height - margin * 2;
  const colW = tableW / cols;
  const rowH = tableH / rows;
  parts.push(
    `<rect x="${n(margin)}" y="${n(margin)}" width="${n(tableW)}" height="${n(rowH * 1.4)}" fill="${p.ink}" opacity="0.18"/>`,
  );
  for (let r = 0; r <= rows; r += 1) {
    parts.push(
      `<line x1="${n(margin)}" x2="${n(margin + tableW)}" y1="${n(margin + r * rowH)}" y2="${n(margin + r * rowH)}" stroke="${p.line}" stroke-width="2" opacity="0.45"/>`,
    );
  }
  for (let c = 0; c <= cols; c += 1) {
    parts.push(
      `<line x1="${n(margin + c * colW)}" x2="${n(margin + c * colW)}" y1="${n(margin)}" y2="${n(margin + tableH)}" stroke="${p.line}" stroke-width="2" opacity="0.45"/>`,
    );
  }
  parts.push(
    `<line x1="${n(margin * 0.6)}" x2="${n(margin * 0.6)}" y1="0" y2="${String(height)}" stroke="${p.accent}" stroke-width="3" opacity="0.6"/>`,
  );
  for (let r = 1; r < rows; r += 1) {
    for (let c = 0; c < cols; c += 1) {
      if (random() < 0.12) continue;
      const w = colW * (c === 0 ? between(random, 0.4, 0.8) : between(random, 0.25, 0.6));
      parts.push(
        `<rect x="${n(margin + c * colW + colW * 0.12)}" y="${n(margin + r * rowH + rowH * 0.3)}" width="${n(w)}" height="${n(rowH * 0.36)}" fill="${p.ink}" opacity="${n(between(random, 0.45, 0.75))}"/>`,
      );
    }
  }
  parts.push(grain(random, width, height, 110));
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="url(#age)"/>`);
  return parts.join('');
}

function contour(random: Random, cx: number, cy: number, radius: number): string {
  const points: string[] = [];
  const phaseA = random() * Math.PI * 2;
  const phaseB = random() * Math.PI * 2;
  const steps = 44;
  for (let i = 0; i < steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    const r =
      radius *
      (1 +
        0.16 * Math.sin(angle * 3 + phaseA) +
        0.09 * Math.sin(angle * 5 + phaseB) +
        (random() - 0.5) * 0.03);
    points.push(`${n(cx + Math.cos(angle) * r * 1.25)},${n(cy + Math.sin(angle) * r)}`);
  }
  return points.join(' ');
}

function map(spec: ArtSpec, random: Random): string {
  const { width, height } = spec;
  const p = paperPalette(spec.palette);
  const parts: string[] = [];
  parts.push(`<defs>${vignette('age', spec.palette === 'blueprint' ? 0.35 : 0.25)}</defs>`);
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="${p.bg}"/>`);
  const grid = Math.min(width, height) / 10;
  for (let x = grid; x < width; x += grid) {
    parts.push(
      `<line x1="${n(x)}" x2="${n(x)}" y1="0" y2="${String(height)}" stroke="${p.line}" stroke-width="1" opacity="0.22"/>`,
    );
  }
  for (let y = grid; y < height; y += grid) {
    parts.push(
      `<line x1="0" x2="${String(width)}" y1="${n(y)}" y2="${n(y)}" stroke="${p.line}" stroke-width="1" opacity="0.22"/>`,
    );
  }
  const centers = 2 + Math.floor(random() * 2);
  for (let c = 0; c < centers; c += 1) {
    const cx = width * between(random, 0.2, 0.8);
    const cy = height * between(random, 0.25, 0.75);
    const base = Math.min(width, height) * between(random, 0.05, 0.09);
    for (let k = 1; k <= 7; k += 1) {
      parts.push(
        `<polygon points="${contour(random, cx, cy, base * k)}" fill="none" stroke="${p.line}" stroke-width="${k % 4 === 0 ? '3' : '1.6'}" opacity="${k % 4 === 0 ? '0.55' : '0.34'}"/>`,
      );
    }
  }
  const riverY = height * between(random, 0.3, 0.7);
  const river =
    `M-20 ${n(riverY)} C ${n(width * 0.25)} ${n(riverY - height * 0.25)}, ${n(width * 0.4)} ${n(riverY + height * 0.3)}, ${n(width * 0.58)} ${n(riverY)} ` +
    `S ${n(width * 0.88)} ${n(riverY - height * 0.2)}, ${n(width + 20)} ${n(riverY + height * 0.08)}`;
  parts.push(
    `<path d="${river}" fill="none" stroke="${p.water}" stroke-width="${n(width * 0.016)}" stroke-linecap="round" opacity="0.9"/>`,
  );
  parts.push(
    `<path d="${river}" fill="none" stroke="${p.bg}" stroke-width="${n(width * 0.004)}" stroke-linecap="round" opacity="0.7"/>`,
  );
  parts.push(
    `<polyline points="${n(width * 0.08)},${n(height * 0.88)} ${n(width * 0.35)},${n(height * 0.62)} ${n(width * 0.6)},${n(height * 0.7)} ${n(width * 0.92)},${n(height * 0.4)}" fill="none" stroke="${p.accent}" stroke-width="5" stroke-dasharray="18 12" opacity="0.8"/>`,
  );
  const clusterX = width * between(random, 0.35, 0.65);
  const clusterY = height * between(random, 0.3, 0.6);
  for (let i = 0; i < 42; i += 1) {
    const w = width * between(random, 0.012, 0.03);
    const h = height * between(random, 0.012, 0.03);
    const x = clusterX + (random() - 0.5) * width * 0.34;
    const y = clusterY + (random() - 0.5) * height * 0.3;
    parts.push(
      `<rect x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}" fill="${p.accent}" fill-opacity="0.28" stroke="${p.line}" stroke-width="1.5"/>`,
    );
  }
  const compassX = width * 0.88;
  const compassY = height * 0.14;
  const compassR = Math.min(width, height) * 0.05;
  parts.push(
    `<circle cx="${n(compassX)}" cy="${n(compassY)}" r="${n(compassR)}" fill="none" stroke="${p.line}" stroke-width="3"/>`,
  );
  parts.push(
    `<polygon points="${n(compassX)},${n(compassY - compassR * 1.3)} ${n(compassX + compassR * 0.3)},${n(compassY)} ${n(compassX - compassR * 0.3)},${n(compassY)}" fill="${p.accent}"/>`,
  );
  parts.push(
    `<line x1="${n(compassX - compassR)}" x2="${n(compassX + compassR)}" y1="${n(compassY)}" y2="${n(compassY)}" stroke="${p.line}" stroke-width="3"/>`,
  );
  const inset = Math.min(width, height) * 0.03;
  parts.push(
    `<rect x="${n(inset)}" y="${n(inset)}" width="${n(width - inset * 2)}" height="${n(height - inset * 2)}" fill="none" stroke="${p.line}" stroke-width="4"/>`,
  );
  parts.push(
    `<rect x="${n(inset * 1.5)}" y="${n(inset * 1.5)}" width="${n(width - inset * 3)}" height="${n(height - inset * 3)}" fill="none" stroke="${p.line}" stroke-width="1.5"/>`,
  );
  parts.push(grain(random, width, height, 90));
  parts.push(`<rect width="${String(width)}" height="${String(height)}" fill="url(#age)"/>`);
  return parts.join('');
}

const PAINTERS: Record<Motif, (spec: ArtSpec, random: Random) => string> = {
  skyline,
  facade,
  letter,
  ledger,
  map,
};

/** Gera o arquivo SVG completo (com título e aviso de demonstração). */
export function renderArt(spec: ArtSpec): string {
  const random = createRandom(spec.seed);
  const body = PAINTERS[spec.motif](spec, random);
  const width = String(spec.width);
  const height = String(spec.height);
  return (
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<!-- DEMONSTRAÇÃO: imagem procedural gerada por scripts/demo-content (ADR-009). Sem material de terceiros; não representa fato histórico. -->\n` +
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img">` +
    `<title>Imagem procedural de demonstração</title>${body}</svg>\n`
  );
}
