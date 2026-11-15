// Sweep every route and rank the geometry differences vs the live site.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const LIVE = 'https://medisdesign.com';
const LOCAL = 'http://127.0.0.1:4180';
const paths = fs.readFileSync('/tmp/locs.txt', 'utf8').split('\n').map((s) => s.trim()).filter(Boolean);

function ab(args, input) {
  return execFileSync('agent-browser', args, {
    input,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, AGENT_BROWSER_SESSION: process.env.AGENT_BROWSER_SESSION || 'medis-2b3639223cdc' },
  });
}

const SCRIPT = `
(() => {
  const secs = [...document.querySelectorAll('main section')];
  const imgs = [...document.querySelectorAll('main img')];
  return JSON.stringify({
    docH: document.documentElement.scrollHeight,
    footerH: (document.querySelector('footer') || {}).offsetHeight || 0,
    hover: (document.querySelector('main h1') || {}).innerText || null,
    sections: secs.map((s) => { const r = s.getBoundingClientRect(); return Math.round(r.height); }),
    imgs: imgs.length,
    broken: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
  });
})();
`;

ab(['set', 'viewport', '1440', '900']);

function measure(url) {
  ab(['open', url]);
  const raw = ab(['eval', '--stdin'], SCRIPT).trim();
  return JSON.parse(JSON.parse(raw));
}

const rows = [];
for (const p of paths) {
  try {
    const L = measure(LIVE + p);
    const C = measure(LOCAL + p);
    const bad = [];
    const n = Math.max(L.sections.length, C.sections.length);
    for (let i = 0; i < n; i++) {
      const a = L.sections[i];
      const b = C.sections[i];
      if (a === undefined || b === undefined || Math.abs(a - b) > 2) bad.push(`s${i}:${a ?? '–'}>${b ?? '–'}`);
    }
    rows.push({ p, d: C.docH - L.docH, ld: L.docH, cd: C.docH, bad, imgs: [L.imgs, C.imgs], broken: C.broken });
  } catch (e) {
    rows.push({ p, error: String(e.message).slice(0, 60) });
  }
}

rows.sort((a, b) => Math.abs(b.d ?? 0) - Math.abs(a.d ?? 0));
const out = [];
out.push('ΔdocH  live    clone   path / section deltas');
for (const r of rows) {
  if (r.error) {
    out.push(`ERR    ${r.p} ${r.error}`);
    continue;
  }
  out.push(
    `${String(r.d).padStart(6)}  ${String(r.ld).padStart(6)} ${String(r.cd).padStart(6)}  ${r.p.slice(0, 52).padEnd(52)} ${r.bad.length ? r.bad.slice(0, 4).join(' ') : ''}`,
  );
}
fs.writeFileSync('/tmp/sweep.txt', out.join('\n'));
console.log(out.slice(0, 22).join('\n'));
console.log(`\n... ${rows.length} routes, written to /tmp/sweep.txt`);
