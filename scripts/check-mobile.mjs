// Mobile (390px) geometry comparison for a set of routes.
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const LIVE = 'https://medisdesign.com';
const LOCAL = 'http://127.0.0.1:4180';
const W = process.argv[2] || '390';
const paths = fs
  .readFileSync('/tmp/locs.txt', 'utf8')
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean)
  .slice(0, Number(process.argv[3] || 12));

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
  const h = document.querySelector('header');
  const lm = document.querySelector('header img');
  const lr = lm ? lm.getBoundingClientRect() : null;
  const cs = h ? getComputedStyle(h) : null;
  const secs = [...document.querySelectorAll('main section')];
  const firstInner = document.querySelector('main section .l-section-h, main section .section-inner');
  const ic = firstInner ? getComputedStyle(firstInner) : null;
  const sec0 = secs[0] ? getComputedStyle(secs[0]) : null;
  return JSON.stringify({
    docH: document.documentElement.scrollHeight,
    header: h ? { h: Math.round(h.getBoundingClientRect().height), pos: cs.position, bg: cs.backgroundColor } : null,
    logo: lr ? { w: Math.round(lr.width), h: Math.round(lr.height), x: Math.round(lr.left) } : null,
    burger: !!document.querySelector('.header-burger, .w-nav-control'),
    gutter: sec0 ? sec0.paddingLeft : null,
    innerMaxW: ic ? ic.maxWidth : null,
    sections: secs.map((s) => Math.round(s.getBoundingClientRect().height)),
  });
})();
`;

ab(['set', 'viewport', W, '844']);

function measure(url) {
  ab(['open', url]);
  ab(['eval', '--stdin'], '(async()=>{window.scrollTo(0,0);await new Promise(r=>setTimeout(r,400));return 1})()');
  const raw = ab(['eval', '--stdin'], SCRIPT).trim();
  return JSON.parse(JSON.parse(raw));
}

const out = [];
out.push(`viewport ${W}px`);
for (const p of paths) {
  try {
    const L = measure(LIVE + p);
    const C = measure(LOCAL + p);
    const dh = C.docH - L.docH;
    const bad = [];
    const n = Math.max(L.sections.length, C.sections.length);
    for (let i = 0; i < n; i++) {
      if (L.sections[i] === undefined || C.sections[i] === undefined || Math.abs(L.sections[i] - C.sections[i]) > 2) {
        bad.push(`s${i}:${L.sections[i] ?? '–'}>${C.sections[i] ?? '–'}`);
      }
    }
    out.push(
      `Δ${String(dh).padStart(5)}  live ${String(L.docH).padStart(6)} clone ${String(C.docH).padStart(6)}  ` +
        `hdr ${L.header?.h}/${C.header?.h} logo ${L.logo?.w}x${L.logo?.h}/${C.logo?.w}x${C.logo?.h} ` +
        `gut ${L.gutter}/${C.gutter}  ${p.slice(0, 34).padEnd(34)} ${bad.slice(0, 3).join(' ')}`,
    );
  } catch (e) {
    out.push(`ERR ${p} ${String(e.message).slice(0, 60)}`);
  }
}
const text = out.join('\n');
fs.writeFileSync('/tmp/mobile.txt', text);
console.log(text);
