// Build the typed page/route model from the scraped HTML.
import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';
import {
  rewriteHtml, cleanRichHtml, collectCustomCss, styleFor, childStyleFor, mapFonts,
  parseStyleAttr, attrsOf, textOf, localizeUrl,
} from './lib/convert.mjs';

const RAW = path.resolve('scripts/raw');
const DATA = path.resolve('data');

const manifest = JSON.parse(await fs.readFile(path.join(RAW, 'manifest.json'), 'utf8'));
const postsRest = JSON.parse(await fs.readFile(path.join(RAW, 'posts.json'), 'utf8'));
const pagesRest = JSON.parse(await fs.readFile(path.join(RAW, 'pages.json'), 'utf8'));
const catsRest = JSON.parse(await fs.readFile(path.join(RAW, 'categories.json'), 'utf8'));
const tagsRest = JSON.parse(await fs.readFile(path.join(RAW, 'tags.json'), 'utf8'));

const pageHeaders = JSON.parse(await fs.readFile(path.join(RAW, 'page-headers.json'), 'utf8'));
const headerFor = (link) => {
  const h = pageHeaders[link];
  if (!h || !h.headerClasses) return null;
  return {
    variant: h.variant || 'light',
    fixed: h.fixed,
    bg: h.bgColor || 'rgba(255,255,255,0.55)',
    color: h.textColor || 'rgb(53,65,91)',
    logo: h.logo || '/wp-content/uploads/2025/05/00695959.png',
  };
};

const byId = new Map();
for (const p of [...pagesRest, ...postsRest]) byId.set(p.id, p);

await fs.mkdir(DATA, { recursive: true });

/* ---------------------------------------------------------------- */

function sectionOf(html) {
  const start = html.indexOf('<main id="page-content"');
  const openEnd = html.indexOf('>', start) + 1;
  const close = html.indexOf('</main>', openEnd);
  return { main: html.slice(openEnd, close), after: html.slice(close) };
}

function footerOf(html) {
  const i = html.indexOf('<footer');
  if (i === -1) return '';
  const j = html.indexOf('</footer>', i);
  return html.slice(i, j + 9);
}

/* ---------------------------------------------------------------- *
 * Blocks
 * ---------------------------------------------------------------- */

import { sectionsOf, makeCtx, gridItems, gridifyArchive } from './lib/sections.mjs';


/* ---------------------------------------------------------------- *
 * Header / nav
 * ---------------------------------------------------------------- */

function buildNav(headerHtml) {
  const $ = cheerio.load(headerHtml, null, false);
  const menus = [];
  $('nav.w-nav').each((_, nav) => {
    const $nav = $(nav);
    const items = [];
    $nav.find('ul.w-nav-list.level_1 > li').each((_, li) => {
      const $li = $(li);
      const $a = $li.children('a').first();
      if (!$a.length) return;
      items.push({
        title: textOf($, $a.find('.w-nav-title')),
        href: localizeUrl($a.attr('href')),
        isCurrent: ($li.attr('class') || '').includes('current-menu-item'),
      });
    });
    menus.push({ id: ($nav.attr('class') || '').match(/ush_menu_\d+/)?.[0] || 'menu', items });
  });

  const $logo = $('.ush_image_1 img').first();
  const logo = $logo.length
    ? { src: localizeUrl($logo.attr('src')), width: Number($logo.attr('width')) || 100, height: Number($logo.attr('height')) || 100, href: localizeUrl($('.ush_image_1 a').attr('href') || '/') }
    : null;

  return { menus, logo };
}

/* ---------------------------------------------------------------- *
 * Main
 * ---------------------------------------------------------------- */

const allCss = new Map();
const perPageCss = new Map();

// first pass: collect css from every page (us_custom ids can appear on any page)
for (const m of manifest) {
  if (!m.file) continue;
  const html = await fs.readFile(path.join(RAW, 'html', m.file), 'utf8');
  const map = collectCustomCss(html);
  perPageCss.set(m.file, map);
  for (const [k, v] of map) allCss.set(k, { ...(allCss.get(k) || {}), ...v });
}
console.log(`custom css tokens: ${allCss.size}`);

const headerHtml = await fs.readFile(path.join(RAW, 'header.html'), 'utf8');
const site = { nav: buildNav(headerHtml) };
await fs.writeFile(path.join(DATA, 'site.json'), JSON.stringify(site, null, 2));
console.log('nav items:', site.nav.menus.map((m) => `${m.id}:${m.items.length}`).join(' '), 'logo:', Boolean(site.nav.logo));

const pages = [];
const posts = [];
const archives = [];

for (const m of manifest) {
  if (!m.file) continue;
  const html = await fs.readFile(path.join(RAW, 'html', m.file), 'utf8');
  const ctx = makeCtx(allCss);
  const { main } = sectionOf(html);
  const footerHtml = footerOf(html);
  const $ = cheerio.load(main, null, false);
  const $f = cheerio.load(footerHtml, null, false);

  const sections = sectionsOf($, ctx, 'm');
  const footerSections = footerHtml.replace(/<\/?footer[^>]*>/g, '').trim()
    ? sectionsOf($f, ctx, 'f')
    : [];

  const rest = byId.get(m.id);
  const headerHeight = html.match(/--header-height:\s*([^;}"]+)/)?.[1]?.trim() || null;
  const logoHeight = html.match(/\.ush_image_1\s*\{[^}]*height:\s*([^;!}]+)/)?.[1]?.trim() || null;
  const stickyHeight = html.match(/--header-sticky-height:\s*([^;}"]+)/)?.[1]?.trim() || null;
  const entry = {
    header: headerFor(m.link),
    headerHeight,
    stickyHeight,
    logoHeight,
    kind: m.kind,
    id: m.id,
    path: localizeUrl(m.link).replace(/\/$/, '') || '/',
    title: m.title,
    meta: m.head || {},
    sections,
    footer: footerSections,
    bodyClass: m.bodyClass,
    excerpt: rest?.excerpt?.rendered ? cleanRichHtml(rest.excerpt.rendered) : null,
    date: rest?.date || null,
    modified: rest?.modified || null,
    featured: rest?.featured_media || null,
    categories: rest?.categories || [],
    tags: rest?.tags || [],
    authorId: rest?.author || null,
  };

  if (m.kind === 'page') pages.push(entry);
  else if (m.kind === 'post') posts.push(entry);
  else {
    const $main = cheerio.load(main, null, false);
    const items = gridItems($main, $main.root());
    const archiveSections = sections.map(gridifyArchive);
    archives.push({
      header: headerFor(m.link),
      headerHeight: html.match(/--header-height:\s*([^;}"]+)/)?.[1]?.trim() || null,
      logoHeight: html.match(/\.ush_image_1\s*\{[^}]*height:\s*([^;!}]+)/)?.[1]?.trim() || null,
      kind: m.kind,
      path: localizeUrl(m.link).replace(/\/$/, ''),
      title: m.title,
      meta: m.head || {},
      items,
      sections: archiveSections,
      footer: footerSections,
    });
  }
}

await fs.writeFile(path.join(DATA, 'archives.json'), JSON.stringify(archives, null, 2));
console.log(`archives written: ${archives.length} (${archives.map((a) => a.kind + ':' + a.items.length).join(', ')})`);
await fs.writeFile(path.join(DATA, 'pages.json'), JSON.stringify(pages, null, 2));
console.log(`pages written: ${pages.length}`);

// blog index for archives
const catsById = new Map(catsRest.map((c) => [c.id, c]));
const tagsById = new Map(tagsRest.map((t) => [t.id, t]));

const postSummaries = posts.map((p) => ({
  id: p.id,
  path: p.path,
  title: p.title,
  date: p.date,
  excerpt: p.excerpt,
  image: (() => {
    const rest = byId.get(p.id);
    return null; // filled below from featured media lookup
  })(),
  categories: p.categories.map((id) => catsById.get(id)?.slug).filter(Boolean),
  tags: p.tags.map((id) => tagsById.get(id)?.slug).filter(Boolean),
}));

await fs.writeFile(path.join(DATA, 'posts.json'), JSON.stringify(posts, null, 2));
await fs.writeFile(path.join(DATA, 'post-summaries.json'), JSON.stringify(postSummaries, null, 2));

await fs.writeFile(path.join(DATA, 'taxonomies.json'), JSON.stringify({
  categories: catsRest.map((c) => ({ id: c.id, slug: c.slug, name: c.name, count: c.count, path: localizeUrl(c.link) })),
  tags: tagsRest.map((t) => ({ id: t.id, slug: t.slug, name: t.name, count: t.count, path: localizeUrl(t.link) })),
  authors: manifest.filter((x) => x.kind === 'author').map((a) => ({ slug: a.slug, name: a.title, path: localizeUrl(a.link) })),
}, null, 2));

console.log('done');
