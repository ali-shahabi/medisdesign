// Extract per-page header chrome: background colour, logo image, header classes.
import fs from 'node:fs';
import path from 'node:path';

const RAW = path.resolve('scripts/raw');
const HTML = path.join(RAW, 'html');
const manifest = JSON.parse(fs.readFileSync(path.join(RAW, 'manifest.json'), 'utf8'));

const out = {};

function headerBgFromCss(css, modern) {
  // .l-header.bg_transparent:not(.sticky) .l-subheader.at_middle{background:...}
  const m = css.match(/\.l-header\.bg_transparent:not\(\.sticky\)\s+\.l-subheader\.at_middle\s*\{([^}]*)\}/);
  if (m) {
    const bg = m[1].match(/background\s*:\s*([^;]+)/);
    if (bg) return bg[1].trim();
  }
  const m2 = css.match(/\.l-subheader\.at_middle[^{}]*\{([^}]*)\}/);
  if (m2) {
    const bg = m2[1].match(/background\s*:\s*([^;]+)/);
    if (bg) return bg[1].trim();
  }
  return null;
}

for (const entry of manifest) {
  if (!entry.file) continue;
  const file = path.join(HTML, entry.file);
  if (!fs.existsSync(file)) continue;
  const html = fs.readFileSync(file, 'utf8');

  const headerTag = html.match(/<header[^>]*class="([^"]*)"/);
  const logo = html.match(/class="w-image ush_image_1[\s\S]{0,400}?<img[^>]*src="([^"]+)"/);
  const cssBlock = html.match(/id=['"]us-current-header-css['"]>([\s\S]*?)<\/style>/);
  const css = cssBlock ? cssBlock[1] : '';

  const cls = headerTag ? headerTag[1] : null;
  const bg = headerBgFromCss(css);
  const dark = Boolean(bg && /53\s*,\s*65\s*,\s*91/.test(bg));
  out[entry.link] = {
    path: entry.link.replace('https://medisdesign.com', ''),
    headerClasses: cls,
    logo: logo ? logo[1].replace('https://medisdesign.com', '') : null,
    headerBg: bg,
    variant: bg ? (dark ? 'dark' : 'light') : null,
    fixed: Boolean(cls && /pos_fixed/.test(cls)),
    bgColor: bg ? (dark ? 'rgba(53,65,91,0.40)' : 'rgba(255,255,255,0.55)') : null,
    textColor: dark ? '#ffffff' : 'rgb(53,65,91)',
  };
}

fs.writeFileSync(path.join(RAW, 'page-headers.json'), JSON.stringify(out, null, 2));

const rows = Object.values(out);
const bgs = new Map();
const logos = new Map();
for (const r of rows) {
  bgs.set(r.headerBg, (bgs.get(r.headerBg) || 0) + 1);
  logos.set(r.logo, (logos.get(r.logo) || 0) + 1);
}
console.log('pages:', rows.length);
console.log('\nheader backgrounds:');
for (const [k, v] of bgs) console.log(' ', v, '×', k);
console.log('\nlogos:');
for (const [k, v] of logos) console.log(' ', v, '×', k);
