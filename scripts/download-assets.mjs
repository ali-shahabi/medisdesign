// Download every referenced asset into public/ preserving the original URL path
import fs from 'node:fs/promises';
import path from 'node:path';
import { createWriteStream } from 'node:fs';
import { Readable } from 'node:stream';

const SITE = 'https://medisdesign.com';
const PUBLIC = path.resolve('public');
const RAW = path.resolve('scripts/raw');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

const urls = new Set();

function add(u) {
  if (!u) return;
  u = u.trim().replace(/^['"]|['"]$/g, '');
  if (u.startsWith('data:')) return;
  if (u.startsWith('//')) u = 'https:' + u;
  if (u.startsWith(SITE)) u = u.slice(SITE.length);
  if (!u.startsWith('/')) return;
  if (!/\.(png|jpe?g|webp|gif|svg|avif|ico|woff2?|ttf|eot|mp4|webm|pdf)$/i.test(u)) return;
  // skip thumbnails of images if we already have the full one? keep all: srcset needs them
  urls.add(u.split('?')[0]);
}

const files = await fs.readdir(path.join(RAW, 'html'));
const all = [];
for (const f of files) all.push(await fs.readFile(path.join(RAW, 'html', f), 'utf8'));
for (const extra of ['home-full.html', 'head.html', 'footer.html', 'header.html']) {
  try {
    all.push(await fs.readFile(path.join(RAW, extra), 'utf8'));
  } catch {}
}

for (const html of all) {
  // src / href / poster
  for (const m of html.matchAll(/(?:src|href|poster)=["']([^"']+)["']/g)) add(m[1]);
  // srcset
  for (const m of html.matchAll(/srcset=["']([^"']+)["']/g)) {
    for (const part of m[1].split(',')) add(part.trim().split(/\s+/)[0]);
  }
  // css url()
  for (const m of html.matchAll(/url\(([^)]+)\)/g)) add(m[1].replace(/['"]/g, ''));
  // data-* backgrounds in wpbakery
  for (const m of html.matchAll(/background(?:-image)?\s*:\s*url\(([^)]+)\)/g)) add(m[1].replace(/['"]/g, ''));
}

console.log(`unique assets: ${urls.size}`);

async function download(urlPath) {
  const dest = path.join(PUBLIC, urlPath);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  try {
    const st = await fs.stat(dest);
    if (st.size > 0) return 'skip';
  } catch {}

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(SITE + urlPath, { headers: { 'User-Agent': UA, Referer: SITE + '/' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await new Promise((resolve, reject) => {
        const ws = createWriteStream(dest);
        Readable.fromWeb(res.body).pipe(ws).on('finish', resolve).on('error', reject);
      });
      return 'ok';
    } catch (e) {
      if (attempt === 2) return `fail:${e.message}`;
      await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
    }
  }
}

const list = [...urls].sort();
let ok = 0, skip = 0, fail = 0;
const failures = [];
const CONCURRENCY = 8;
let i = 0;
async function worker() {
  while (i < list.length) {
    const idx = i++;
    const u = list[idx];
    const r = await download(u);
    if (r === 'ok') ok++;
    else if (r === 'skip') skip++;
    else {
      fail++;
      failures.push({ u, r });
      console.log(`   ✗ ${u} ${r}`);
    }
    if ((ok + skip + fail) % 25 === 0) console.log(`   … ${ok + skip + fail}/${list.length}`);
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\n✓ assets: ok=${ok} skip=${skip} fail=${fail}`);
await fs.writeFile(path.join(RAW, 'assets-manifest.json'), JSON.stringify({ total: list.length, ok, skip, fail, failures }, null, 2));
