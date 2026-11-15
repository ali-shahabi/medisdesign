// Scrape additional live routes that are not in Yoast's sitemaps
// (archive pagination, legacy permalinks, alternate contact pages).
import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import { collectCustomCss, styleFor, mapFonts, localizeUrl, cleanRichHtml } from './lib/convert.mjs';

const RAW = path.resolve('scripts/raw');
const DATA = path.resolve('data');
const SITE = 'https://medisdesign.com';
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url) {
  const res = await fetch(url, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// ---- candidates -----------------------------------------------------------
const candidates = new Set([
  '/services/',
  '/تماس-با-ما/',
  '/تماس-با-ما-2/',
  '/medismag/acoustic-absorbers-and-its-types/',
  '/medismag/bass-trap-and-its-types/',
]);

// pagination links found inside the already-scraped archive pages
const htmlDir = path.join(RAW, 'html');
for (const f of await fs.readdir(htmlDir)) {
  const html = await fs.readFile(path.join(htmlDir, f), 'utf8');
  for (const m of html.matchAll(/href="(https:\/\/medisdesign\.com\/[^"#]*\/page\/\d+\/?)"/g)) {
    candidates.add(localizeUrl(m[1]));
  }
}

console.log(`candidates: ${candidates.size}`);

// ---- reuse the converter from build-data by importing its helpers ---------
const allCss = new Map();
const files = await fs.readdir(htmlDir);
for (const f of files) {
  const html = await fs.readFile(path.join(htmlDir, f), 'utf8');
  for (const [k, v] of collectCustomCss(html)) allCss.set(k, { ...(allCss.get(k) || {}), ...v });
}

const { sectionsOf, gridifyArchive } = await import('./lib/sections.mjs');

const extras = [];
for (const p of [...candidates].sort()) {
  const url = SITE + p;
  try {
    const html = await get(url);
    const start = html.indexOf('<main id="page-content"');
    if (start === -1) {
      console.log(`  skipped (no main): ${p}`);
      continue;
    }
    const openEnd = html.indexOf('>', start) + 1;
    const close = html.indexOf('</main>', openEnd);
    const main = html.slice(openEnd, close);

    const fi = html.indexOf('<footer');
    const fj = html.indexOf('</footer>', fi);
    const footerHtml = fi > -1 ? html.slice(fi, fj + 9) : '';

    const $ = cheerio.load(main, null, false);
    const $f = cheerio.load(footerHtml.replace(/<\/?footer[^>]*>/g, ''), null, false);

    const sections = sectionsOf($, { cssMap: allCss }, 'x').map(gridifyArchive);
    const footer = footerHtml.replace(/<\/?footer[^>]*>/g, '').trim() ? sectionsOf($f, { cssMap: allCss }, 'xf') : [];

    const head = html.slice(0, html.indexOf('</head>') + 7);
    extras.push({
      kind: 'page',
      id: -1,
      path: localizeUrl(url).replace(/\/$/, ''),
      title: (head.match(/<title>([^<]*)<\/title>/)?.[1] || p).trim(),
      meta: { title: (head.match(/<title>([^<]*)<\/title>/)?.[1] || '').trim() },
      headerHeight: html.match(/--header-height:\s*([^;}"]+)/)?.[1]?.trim() || null,
      logoHeight: html.match(/\.ush_image_1\s*\{[^}]*height:\s*([^;!}]+)/)?.[1]?.trim() || null,
      sections,
      footer,
      bodyClass: '',
      excerpt: null,
      date: null,
      modified: null,
      categories: [],
      tags: [],
      authorId: null,
    });
    console.log(`  ✓ ${p} (${sections.length} sections)`);
  } catch (e) {
    console.log(`  ✗ ${p} ${e.message}`);
  }
  await sleep(400);
}

await fs.writeFile(path.join(DATA, 'extras.json'), JSON.stringify(extras, null, 2));
console.log(`extras written: ${extras.length}`);
