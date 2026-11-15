// Compare geometry between the live site and the local clone for a given path.
// Usage: node scripts/compare.mjs <livePath> [viewportWidth]
import { execFileSync } from 'node:child_process';

const livePath = process.argv[2] || '/';
const width = Number(process.argv[3] || 1440);
const LIVE = 'https://medisdesign.com';
const LOCAL = 'http://127.0.0.1:4180';

const SESSION = process.env.AGENT_BROWSER_SESSION || 'medis-2b3639223cdc';

function ab(args, input) {
  return execFileSync('agent-browser', args, {
    input,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, AGENT_BROWSER_SESSION: SESSION },
  });
}

const SCRIPT = `
(() => {
  const R = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return {
      x: Math.round(r.left), y: Math.round(r.top + window.scrollY),
      w: Math.round(r.width), h: Math.round(r.height),
      fs: cs.fontSize, lh: cs.lineHeight, fw: cs.fontWeight, ff: cs.fontFamily.split(',')[0].replace(/"/g,''),
      color: cs.color, bg: cs.backgroundColor, radius: cs.borderRadius,
    };
  };
  const q = (s) => document.querySelector(s);
  const out = {
    docHeight: document.documentElement.scrollHeight,
    bodyBg: getComputedStyle(document.body).backgroundColor,
    header: R(q('header')),
    logo: R(q('header img')),
    navLinks: [...document.querySelectorAll('header nav ul li a')].slice(0, 8).map((a) => ({ t: a.textContent.trim().slice(0, 14), ...R(a) })),
    h1: R(q('main h1')),
    heroImg: R(q('main img')),
    sections: [...document.querySelectorAll('main section')].slice(0, 30).map((s) => R(s)),
    firstBanner: R(q('.w-ibanner, .banner')),
    footer: R(q('footer')),
    footerHeight: (q('footer') || {}).offsetHeight || 0,
    canvasMb: q('.l-canvas, .canvas') ? getComputedStyle(q('.l-canvas, .canvas')).marginBottom : null,
  };
  out.sections = out.sections.map((s) => (s ? { y: s.y, h: s.h, w: s.w, bg: s.bg } : null));
  return JSON.stringify(out);
})();
`;

function measure(url) {
  ab(['set', 'viewport', String(width), '900']);
  ab(['open', url]);
  const raw = ab(['eval', '--stdin'], SCRIPT).trim();
  JSON.parse(raw); // validate
  return JSON.parse(JSON.parse(raw));
}

const live = measure(LIVE + livePath);
const local = measure(LOCAL + livePath);

function fmt(v) {
  return v === null || v === undefined ? '—' : typeof v === 'object' ? JSON.stringify(v) : String(v);
}

const rows = [];
const push = (label, a, b) => {
  const same = JSON.stringify(a) === JSON.stringify(b);
  rows.push({ label, live: fmt(a), clone: fmt(b), ok: same ? '✓' : '✗' });
};

push('docHeight', live.docHeight, local.docHeight);
push('bodyBg', live.bodyBg, local.bodyBg);
push('header h', live.header?.h, local.header?.h);
push('logo w/h', `${live.logo?.w}x${live.logo?.h}`, `${local.logo?.w}x${local.logo?.h}`);
push('h1 fs/lh/fw', `${live.h1?.fs}/${live.h1?.lh}/${live.h1?.fw}`, `${local.h1?.fs}/${local.h1?.lh}/${local.h1?.fw}`);
push('hero img w/h', `${live.heroImg?.w}x${live.heroImg?.h}`, `${local.heroImg?.w}x${local.heroImg?.h}`);
push('banner w/h/r', `${live.firstBanner?.w}x${live.firstBanner?.h} r=${live.firstBanner?.radius}`, `${local.firstBanner?.w}x${local.firstBanner?.h} r=${local.firstBanner?.radius}`);
push('footer h', live.footerHeight, local.footerHeight);
push('canvas margin-bottom', live.canvasMb, local.canvasMb);

console.log('\n=== ' + livePath + ' @' + width + ' ===');
for (const r of rows) {
  const flag = r.ok === '✓' ? '  ' : '!!';
  console.log(`${flag} ${r.label.padEnd(20)} live=${r.live.padEnd(28)} clone=${r.clone}`);
}

console.log('\n--- nav links (x, y, fs) ---');
const n = Math.max(live.navLinks.length, local.navLinks.length);
for (let i = 0; i < n; i++) {
  const a = live.navLinks[i];
  const b = local.navLinks[i];
  console.log(`  ${String(a?.t ?? '—').padEnd(16)} live x=${String(a?.x).padStart(4)} fs=${a?.fs}  |  clone x=${String(b?.x).padStart(4)} fs=${b?.fs}`);
}

console.log('\n--- section boxes (y, h) ---');
const sn = Math.max(live.sections.length, local.sections.length);
for (let i = 0; i < sn; i++) {
  const a = live.sections[i];
  const b = local.sections[i];
  if (!a && !b) continue;
  const dh = a && b ? b.h - a.h : null;
  console.log(`  s${String(i).padStart(2)} live y=${String(a?.y).padStart(5)} h=${String(a?.h).padStart(4)}  |  clone y=${String(b?.y).padStart(5)} h=${String(b?.h).padStart(4)}  Δh=${dh}`);
}
