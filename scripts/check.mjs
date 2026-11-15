// Compact multi-path geometry check: node scripts/check.mjs <path> [<path> ...]
import { execFileSync } from 'node:child_process';

const paths = process.argv.slice(2);
const LIVE = 'https://medisdesign.com';
const LOCAL = 'http://127.0.0.1:4180';

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
  return JSON.stringify({
    docH: document.documentElement.scrollHeight,
    footerH: (document.querySelector('footer') || {}).offsetHeight || 0,
    sections: secs.map((s) => { const r = s.getBoundingClientRect(); return Math.round(r.height); }),
    h1: (document.querySelector('main h1') || {}).innerText?.slice(0, 40) || null,
    imgs: document.querySelectorAll('main img').length,
    broken: [...document.querySelectorAll('main img')].filter((i) => i.complete && i.naturalWidth === 0).length,
  });
})();
`;

function measure(url) {
  ab(['set', 'viewport', '1440', '900']);
  ab(['open', url]);
  const raw = ab(['eval', '--stdin'], SCRIPT).trim();
  return JSON.parse(JSON.parse(raw));
}

for (const p of paths) {
  let live, local;
  try {
    live = measure(LIVE + p);
  } catch (e) {
    console.log(`${p}  LIVE ERROR ${e.message.slice(0, 80)}`);
    continue;
  }
  try {
    local = measure(LOCAL + p);
  } catch (e) {
    console.log(`${p}  LOCAL ERROR ${e.message.slice(0, 80)}`);
    continue;
  }

  const dh = local.docH - live.docH;
  const bad = [];
  const n = Math.max(live.sections.length, local.sections.length);
  for (let i = 0; i < n; i++) {
    const a = live.sections[i];
    const b = local.sections[i];
    if (a === undefined || b === undefined || Math.abs(a - b) > 2) bad.push(`s${i}:${a ?? '–'}→${b ?? '–'}`);
  }
  const imgNote = local.broken ? ` broken=${local.broken}` : '';
  console.log(
    `${p.padEnd(46)} docH ${String(live.docH).padStart(5)}→${String(local.docH).padEnd(5)} Δ${String(dh).padStart(5)}  footer ${live.footerH}→${local.footerH}  sections Δ: ${bad.length ? bad.slice(0, 6).join(' ') : 'none'}${imgNote}`,
  );
}
