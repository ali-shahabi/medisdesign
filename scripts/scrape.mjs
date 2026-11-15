// Scrape medisdesign.com into local JSON + raw HTML
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = 'https://medisdesign.com';
const OUT = path.resolve('scripts/raw');
const HTML_DIR = path.join(OUT, 'html');

const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function get(url, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'fa-IR,fa;q=0.9,en;q=0.8' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.text();
    } catch (e) {
      if (i === tries - 1) throw e;
      await sleep(1200 * (i + 1));
    }
  }
}

async function getJson(url) {
  const txt = await get(url);
  return JSON.parse(txt);
}

async function mkdirp(p) {
  await fs.mkdir(p, { recursive: true });
}

/** extract <main id="page-content">...</main> from full html */
function extractMain(html) {
  const start = html.indexOf('<main id="page-content"');
  if (start === -1) return null;
  const openEnd = html.indexOf('>', start) + 1;
  const close = html.indexOf('</main>', openEnd);
  if (close === -1) return null;
  return html.slice(openEnd, close);
}

function extractHead(html) {
  const head = html.slice(0, html.indexOf('</head>') + 7);
  const pick = (re) => {
    const m = head.match(re);
    return m ? m[1].trim() : null;
  };
  return {
    title: pick(/<title>([^<]*)<\/title>/s),
    canonical: pick(/<link rel="canonical" href="([^"]*)"/),
    description: pick(/<meta name="description" content="([^"]*)"/),
    ogImage: pick(/<meta property="og:image" content="([^"]*)"/),
    robots: pick(/<meta name='robots' content='([^']*)'/),
  };
}

function slugify(url) {
  const u = new URL(url);
  return decodeURIComponent(u.pathname).replace(/^\/+|\/+$/g, '').replace(/\//g, '--') || 'home';
}

async function main() {
  await mkdirp(HTML_DIR);

  console.log('→ REST collections');
  const [pages, posts, categories, tags] = await Promise.all([
    getJson(`${BASE}/wp-json/wp/v2/pages?per_page=100&orderby=id&order=asc`),
    getJson(`${BASE}/wp-json/wp/v2/posts?per_page=100&orderby=id&order=asc`),
    getJson(`${BASE}/wp-json/wp/v2/categories?per_page=100`),
    getJson(`${BASE}/wp-json/wp/v2/tags?per_page=100`),
  ]);

  // users endpoint is locked down (403); derive authors from post payloads + author archives
  let users = [];
  try {
    users = await getJson(`${BASE}/wp-json/wp/v2/users?per_page=100`);
  } catch {
    const authorSlugs = new Set(['mahdi-moradlu', 'postman']);
    try {
      const sm = await get(`${BASE}/author-sitemap.xml`);
      for (const m of sm.matchAll(/<loc>([^<]*\/author\/([^<]*?)\/)<\/loc>/g)) authorSlugs.add(m[2]);
    } catch {}
    users = [...authorSlugs].map((slug, i) => ({ id: 900 + i, slug, name: slug, link: `${BASE}/author/${slug}/` }));
    console.log(`   users endpoint 403 → derived ${users.length} author archive(s)`);
  }

  await fs.writeFile(path.join(OUT, 'pages.json'), JSON.stringify(pages, null, 2));
  await fs.writeFile(path.join(OUT, 'posts.json'), JSON.stringify(posts, null, 2));
  await fs.writeFile(path.join(OUT, 'categories.json'), JSON.stringify(categories, null, 2));
  await fs.writeFile(path.join(OUT, 'tags.json'), JSON.stringify(tags, null, 2));
  await fs.writeFile(path.join(OUT, 'users.json'), JSON.stringify(users, null, 2));

  console.log(`   pages=${pages.length} posts=${posts.length} cats=${categories.length} tags=${tags.length} users=${users.length}`);

  // Build URL list: every page + every post + category/tag/author archives
  const targets = [];
  for (const p of pages) targets.push({ kind: 'page', id: p.id, link: p.link, slug: p.slug, title: p.title?.rendered ?? '' });
  for (const p of posts) targets.push({ kind: 'post', id: p.id, link: p.link, slug: p.slug, title: p.title?.rendered ?? '' });
  for (const c of categories) targets.push({ kind: 'category', id: c.id, link: c.link, slug: c.slug, title: c.name });
  for (const t of tags) targets.push({ kind: 'tag', id: t.id, link: t.link, slug: t.slug, title: t.name });
  for (const u of users) targets.push({ kind: 'author', id: u.id, link: `${BASE}/author/${u.slug}/`, slug: u.slug, title: u.name });

  console.log(`→ fetching ${targets.length} pages`);

  const manifest = [];
  for (const t of targets) {
    const file = `${t.kind}-${slugify(t.link)}.html`;
    let html = null;
    try {
      html = await get(t.link);
    } catch (e) {
      console.log(`   ! ${t.link} ${e.message}`);
      manifest.push({ ...t, file: null, error: String(e.message) });
      continue;
    }
    const main = extractMain(html);
    const head = extractHead(html);
    await fs.writeFile(path.join(HTML_DIR, file), html);

    manifest.push({
      ...t,
      file,
      head,
      hasMain: Boolean(main),
      mainLength: main ? main.length : 0,
      bodyClass: (html.match(/<body class="([^"]*)"/) || [])[1] || '',
    });
    console.log(`   ✓ ${t.kind} ${new URL(t.link).pathname} (${html.length}b)`);
    await sleep(350);
  }

  await fs.writeFile(path.join(OUT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  // shared chrome from the homepage
  const home = await get(`${BASE}/`);
  await fs.writeFile(path.join(OUT, 'home-full.html'), home);

  const headerStart = home.indexOf('<header');
  const headerEnd = home.indexOf('</header>');
  await fs.writeFile(path.join(OUT, 'header.html'), home.slice(headerStart, headerEnd + 9));

  const footerStart = home.indexOf('<footer');
  const footerEnd = home.indexOf('</footer>');
  await fs.writeFile(path.join(OUT, 'footer.html'), home.slice(footerStart, footerEnd + 9));

  const headEnd = home.indexOf('</head>');
  await fs.writeFile(path.join(OUT, 'head.html'), home.slice(0, headEnd));

  console.log('✓ done');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
