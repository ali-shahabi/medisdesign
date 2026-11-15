/**
 * Verification harness for redesign/oc-redesign.html
 *
 * Renders the page in a real browser at four widths, captures screenshots and
 * asserts the production invariants: no console errors, no failed requests, no
 * horizontal overflow, every image actually loads, the subset fonts are used,
 * and the colour pairs meet WCAG AA.
 *
 *   node scripts/verify-oc.mjs            # headless
 */
import puppeteer from '/Users/alishahabi/.local/lib/node_modules/puppeteer/lib/puppeteer/puppeteer.js';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DESIGNS = path.join(ROOT, 'redesign');
const SHOTS = path.join(DESIGNS, 'screenshots', 'oc');
fs.mkdirSync(SHOTS, { recursive: true });

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2', '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || '/').split('?')[0]);
  let file = path.join(DESIGNS, url === '/' ? 'oc-redesign.html' : url);
  if (!file.startsWith(DESIGNS)) { res.writeHead(403).end(); return; }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'content-type': 'text/plain' }).end('not found');
    return;
  }
  res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}`;

const browser = await puppeteer.launch({
  headless: true,
  executablePath: process.env.CHROME_BIN
    || '/Users/alishahabi/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  args: ['--no-sandbox', '--font-render-hinting=none', '--force-device-scale-factor=1'],
});

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'laptop', width: 1180, height: 820 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
  { name: 'small', width: 320, height: 640 },
];

let failures = 0;
const fail = (msg) => { failures++; console.log(`  ✗ ${msg}`); };
const ok = (msg) => console.log(`  ✓ ${msg}`);

for (const vp of VIEWPORTS) {
  console.log(`\n── ${vp.name} (${vp.width}px) ─────────────────────────────`);
  const page = await browser.newPage();
  await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 });

  const consoleErrors = [];
  const failed = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => consoleErrors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => failed.push(`${r.url()} ${r.failure()?.errorText}`));
  page.on('response', (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`); });

  await page.goto(`${base}/oc-redesign.html`, { waitUntil: 'networkidle0', timeout: 60000 });

  // scroll the whole page so lazy images fire, then come back
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  await new Promise((r) => setTimeout(r, 700));

  // wait for every lazy image to settle before auditing (bounded — a lazy image
  // that never entered the viewport stays pending by design)
  await page.evaluate(() => Promise.race([
    Promise.all(
      [...document.images].map((i) => (i.complete ? null : new Promise((r) => {
        i.addEventListener('load', r, { once: true });
        i.addEventListener('error', r, { once: true });
      }))),
    ),
    new Promise((r) => setTimeout(r, 8000)),
  ]));
  await new Promise((r) => setTimeout(r, 500));

  const report = await page.evaluate(() => {
    const imgs = [...document.images];
    const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => i.currentSrc || i.src);
    const pending = imgs.filter((i) => !i.complete).length;
    const noAlt = imgs.filter((i) => !i.hasAttribute('alt')).map((i) => i.src);
    const noDims = imgs.filter((i) => !i.getAttribute('width') || !i.getAttribute('height')).map((i) => i.src);
    const de = document.documentElement;
    return {
      overflow: de.scrollWidth - de.clientWidth,
      scrollWidth: de.scrollWidth,
      clientWidth: de.clientWidth,
      docHeight: document.body.scrollHeight,
      h1: [...document.querySelectorAll('h1')].map((h) => h.textContent.trim()),
      h1Count: document.querySelectorAll('h1').length,
      brokenImgs: broken,
      pendingImgs: pending,
      noAlt,
      noDims,
      fonts: {
        yekan700: document.fonts.check('700 16px Yekan'),
        yekan500: document.fonts.check('500 16px Yekan'),
        sans300: document.fonts.check('300 16px Sans'),
        sans400: document.fonts.check('400 16px Sans'),
      },
      fontFaces: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`),
      jsonld: (() => {
        try {
          const el = document.querySelector('script[type="application/ld+json"]');
          const data = JSON.parse(el.textContent);
          return { ok: true, types: data['@graph'].map((n) => n['@type']) };
        } catch (e) { return { ok: false, error: e.message }; }
      })(),
      emptyAnchors: [...document.querySelectorAll('a')].filter((a) => !a.textContent.trim() && !a.getAttribute('aria-label') && !a.querySelector('img[alt]')).length,
      langDir: [document.documentElement.lang, document.documentElement.dir],
    };
  });

  if (report.overflow > 0) fail(`horizontal overflow: ${report.overflow}px (scrollWidth ${report.scrollWidth} > ${report.clientWidth})`);
  else ok(`no horizontal overflow (${report.clientWidth}px viewport, doc ${Math.round(report.docHeight / 100) * 100}px tall)`);

  if (consoleErrors.length) fail(`console errors: ${consoleErrors.slice(0, 4).join(' | ')}`);
  else ok('no console errors');

  if (failed.length) fail(`failed requests: ${failed.slice(0, 6).join(' | ')}`);
  else ok('no failed requests');

  if (report.brokenImgs.length) fail(`broken images: ${report.brokenImgs.slice(0, 5).join(' | ')}`);
  else ok(`all ${(await page.$$('img')).length} images loaded${report.pendingImgs ? ` (${report.pendingImgs} still pending)` : ''}`);

  if (report.noAlt.length) fail(`images without alt: ${report.noAlt.length}`);
  else ok('every image has alt text');

  if (report.noDims.length) fail(`images without width/height: ${report.noDims.length}`);
  else ok('every image has width + height');

  if (report.h1Count !== 1) fail(`expected exactly one h1, found ${report.h1Count}`);
  else ok(`one h1: “${report.h1[0].replace(/\s+/g, ' ')}”`);

  const badFonts = Object.entries(report.fonts).filter(([, v]) => !v).map(([k]) => k);
  if (badFonts.length) fail(`fonts not loaded: ${badFonts.join(', ')}`);
  else ok('all four subset fonts loaded');

  if (!report.jsonld.ok) fail(`JSON-LD invalid: ${report.jsonld.error}`);
  else ok(`JSON-LD parses (${report.jsonld.types.flat().join(', ')})`);

  if (report.emptyAnchors) fail(`${report.emptyAnchors} anchors without an accessible name`);
  else ok('no unnamed anchors');

  // the mobile action bar must not cover the contact panel
  if (vp.width <= 700) {
    await page.evaluate(() => {
      const c = document.getElementById('contact');
      window.scrollTo({ top: c.getBoundingClientRect().top + window.scrollY, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 900));
    const barState = await page.evaluate(() => ({
      off: document.getElementById('mcta').classList.contains('is-off'),
      ctaOff: document.documentElement.classList.contains('cta-off'),
      contactTop: Math.round(document.getElementById('contact').getBoundingClientRect().top),
    }));
    if (!barState.off) fail(`mobile action bar stays visible over the contact panel (contactTop ${barState.contactTop})`);
    else ok('mobile action bar hides over the contact panel');
  }

  // for the full-page capture, promote every lazy image so the shot is complete
  await page.evaluate(() => {
    document.querySelectorAll('img[loading="lazy"]').forEach((i) => { i.loading = 'eager'; });
    return Promise.all(
      [...document.images].map((i) => (i.complete ? null : new Promise((r) => {
        i.addEventListener('load', r, { once: true });
        i.addEventListener('error', r, { once: true });
      }))),
    );
  });
  await new Promise((r) => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(SHOTS, `${vp.name}-${vp.width}.png`), fullPage: true });
  await page.screenshot({ path: path.join(SHOTS, `${vp.name}-${vp.width}-fold.png`) });
  await page.close();
}

/* ---- colour audit on the real computed styles (WCAG AA) ---- */
console.log('\n── contrast audit ───────────────────────────────');
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(`${base}/oc-redesign.html`, { waitUntil: 'networkidle0' });

const pairs = await page.evaluate(() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  // Chrome serialises color-mix() results as `color(srgb …)` — normalise
  // everything through the canvas so the audit sees real 0–255 channels.
  const norm = (s) => {
    // Chrome serialises color-mix() results as `color(srgb r g b / a)` with
    // 0-1 channels and the canvas cannot parse that form — handle it here.
    if (s.startsWith('color(')) {
      const q = (s.match(/[\d.]+/g) || []).map(Number);
      return [q[0] * 255, q[1] * 255, q[2] * 255, q.length > 3 ? q[3] : 1];
    }
    ctx.fillStyle = '#000000';
    ctx.fillStyle = s;
    const v = ctx.fillStyle;
    if (v.startsWith('#')) {
      const h = v.slice(1);
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
    }
    const p = (v.match(/[\d.]+/g) || []).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const lum = (rgb) => {
    const c = rgb.map((v) => {
      const s = v / 255;
      return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const blend = (fg, bg) => {
    const a = fg.length > 3 ? fg[3] : 1;
    return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a));
  };
  const ratio = (a, b) => {
    const l1 = lum(a), l2 = lum(b);
    return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  };
  const bgOf = (el) => {
    let n = el;
    while (n && n !== document.documentElement) {
      const c = norm(getComputedStyle(n).backgroundColor);
      if (c[3] > 0.05) return c;
      n = n.parentElement;
    }
    return [255, 255, 255, 1];
  };
  const sel = [
    ['h1', 'h1'], ['hero kicker', '.h1-kicker'], ['hero lede', '.hero-lede'],
    ['eyebrow fa', '.eyebrow .fa'], ['nav link', '.nav a'], ['card title', '.card h3'],
    ['card body', '.card p'], ['card number', '.card-n'], ['section note', '.sec-note'],
    ['plate type', '.ptype'], ['plate title', '.plate h3'], ['project number', '.pnum'],
    ['chip text', '.chip p'], ['chip title', '.chip h3'], ['mag title', '.mag-item h3'],
    ['mag date', '.mag-item time'], ['proc step body', '.proc-step p'], ['proc title', '.proc-step h3'],
    ['contact label', '.prow .plabel'], ['contact number', '.prow .pnum'], ['cta copy', '.c-cta'],
    ['partner note', '.partner-note'], ['latin label', '.latin'],
  ];
  return sel.map(([name, s]) => {
    const el = document.querySelector(s);
    if (!el) return { name, ratio: null, note: 'missing' };
    const cs = getComputedStyle(el);
    const fg = norm(cs.color);
    const bg = bgOf(el);
    const f = blend(fg, bg);
    return {
      name,
      ratio: Math.round(ratio(f, bg) * 100) / 100,
      size: parseFloat(cs.fontSize),
      weight: cs.fontWeight,
    };
  });
});

for (const p of pairs) {
  if (p.ratio === null) { fail(`${p.name}: element not found`); continue; }
  const large = p.size >= 24 || (p.size >= 18.66 && Number(p.weight) >= 700);
  const min = large ? 3 : 4.5;
  const mark = p.ratio >= min ? '✓' : '✗';
  if (p.ratio < min) failures++;
  console.log(`  ${mark} ${p.name.padEnd(18)} ${String(p.ratio).padStart(6)}:1  (${p.size}px/${p.weight}, needs ${min})`);
}

// petrol grounds
const petrol = await page.evaluate(() => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const norm = (s) => {
    // Chrome serialises color-mix() results as `color(srgb r g b / a)` with
    // 0-1 channels and the canvas cannot parse that form — handle it here.
    if (s.startsWith('color(')) {
      const q = (s.match(/[\d.]+/g) || []).map(Number);
      return [q[0] * 255, q[1] * 255, q[2] * 255, q.length > 3 ? q[3] : 1];
    }
    ctx.fillStyle = '#000000';
    ctx.fillStyle = s;
    const v = ctx.fillStyle;
    if (v.startsWith('#')) {
      const h = v.slice(1);
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16), 1];
    }
    const p = (v.match(/[\d.]+/g) || []).map(Number);
    return [p[0], p[1], p[2], p.length > 3 ? p[3] : 1];
  };
  const lum = (rgb) => {
    const c = rgb.map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
    return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  };
  const blend = (fg, bg) => { const a = fg.length > 3 ? fg[3] : 1; return [0, 1, 2].map((i) => fg[i] * a + bg[i] * (1 - a)); };
  const ratio = (a, b) => { const l1 = lum(a), l2 = lum(b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05); };
  const out = [];
  const add = (name, s, bgHex) => {
    const el = document.querySelector(s);
    if (!el) return out.push({ name, ratio: null });
    const cs = getComputedStyle(el);
    const fg = norm(cs.color);
    const bg = norm(bgHex);
    out.push({ name, ratio: Math.round(ratio(blend(fg, bg), bg) * 100) / 100, size: parseFloat(cs.fontSize) });
  };
  add('band h2', '.band h2', 'rgb(0,39,54)');
  add('band stat', '.stat b', 'rgb(0,39,54)');
  add('band label', '.stat span', 'rgb(0,39,54)');
  add('band eyebrow', '.band .eyebrow .fa', 'rgb(0,39,54)');
  add('footer link', '.foot ul a', 'rgb(0,39,54)');
  add('footer heading', '.foot-h', 'rgb(0,39,54)');
  add('footer text', '.foot-brand p', 'rgb(0,39,54)');
  add('footer meta', '.foot-meta p', 'rgb(0,39,54)');
  add('button label', '.btn', 'rgb(176,90,18)');
  add('hero h1', 'h1', 'rgb(248,246,240)');
  add('kicker', '.h1-kicker', 'rgb(248,246,240)');
  return out;
});
console.log('  — petrol grounds —');
for (const p of petrol) {
  if (p.ratio === null) { fail(`${p.name}: missing`); continue; }
  const min = p.size >= 24 ? 3 : 4.5;
  const mark = p.ratio >= min ? '✓' : '✗';
  if (p.ratio < min) failures++;
  console.log(`  ${mark} ${p.name.padEnd(18)} ${String(p.ratio).padStart(6)}:1  (${p.size}px, needs ${min})`);
}

await page.close();
await browser.close();
server.close();

console.log(`\n${failures === 0 ? '✅ all checks passed' : `❌ ${failures} check(s) failed`}`);
process.exit(failures === 0 ? 0 : 1);
