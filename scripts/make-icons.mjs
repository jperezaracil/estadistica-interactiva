// Renders the app icons (PNG) from a single SVG source. Run: node scripts/make-icons.mjs
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = 'public/icons';
mkdirSync(OUT, { recursive: true });

// Bell curve with the right tail shaded, on a deep ink-blue square.
function iconSvg({ size = 512, pad = 0, radius = 0 } = {}) {
  const s = size;
  const inner = s - 2 * pad;
  const x0 = pad + inner * 0.14, x1 = pad + inner * 0.86;
  const base = pad + inner * 0.74, peak = pad + inner * 0.24;
  const n = 80, pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n, z = (t - 0.5) * 6;
    const y = base - (base - peak) * Math.exp(-z * z / 2);
    pts.push([x0 + t * (x1 - x0), y]);
  }
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join('');
  const cut = 0.74;
  const tail = pts.filter(([x]) => x >= x0 + cut * (x1 - x0));
  const tailPath = `M${tail[0][0].toFixed(1)} ${base}` + tail.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join('') + `L${tail.at(-1)[0].toFixed(1)} ${base}Z`;
  const sw = Math.max(2, inner * 0.035);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${s}" height="${s}" viewBox="0 0 ${s} ${s}">
  <rect width="${s}" height="${s}" rx="${radius}" fill="#1E2B4A"/>
  <path d="${tailPath}" fill="#6FA3EF"/>
  <line x1="${x0}" y1="${base}" x2="${x1}" y2="${base}" stroke="#F5F3EE" stroke-opacity="0.35" stroke-width="${sw * 0.6}" stroke-linecap="round"/>
  <path d="${line}" fill="none" stroke="#F5F3EE" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;
}

const jobs = [
  ['icon-192.png', 192, iconSvg({ size: 192 })],
  ['icon-512.png', 512, iconSvg({ size: 512 })],
  ['maskable-512.png', 512, iconSvg({ size: 512, pad: 64 })],
  ['apple-touch-icon.png', 180, iconSvg({ size: 180 })],
];
for (const [name, size, svg] of jobs) {
  await sharp(Buffer.from(svg)).resize(size, size).png().toFile(`${OUT}/${name}`);
}
writeFileSync('public/favicon.svg', iconSvg({ size: 64, radius: 14 }));
console.log('icons written');
