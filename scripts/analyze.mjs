// Analyze structure of every scraped page to find the section vocabulary / templates
import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const RAW = path.resolve('scripts/raw');
const manifest = JSON.parse(await fs.readFile(path.join(RAW, 'manifest.json'), 'utf8'));

function mainOf(html) {
  const start = html.indexOf('<main id="page-content"');
  const openEnd = html.indexOf('>', start) + 1;
  const close = html.indexOf('</main>', openEnd);
  return html.slice(openEnd, close);
}

const tagCounts = new Map();
const classCounts = new Map();
const rowsByPage = [];

for (const m of manifest) {
  if (!m.file) continue;
  const html = await fs.readFile(path.join(RAW, 'html', m.file), 'utf8');
  const main = mainOf(html);
  const $ = cheerio.load(main, null, false);

  $('*').each((_, el) => {
    const tag = el.tagName?.toLowerCase();
    if (!tag) return;
    tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    const cls = ($(el).attr('class') || '').split(/\s+/).filter(Boolean);
    for (const c of cls) classCounts.set(c, (classCounts.get(c) || 0) + 1);
  });

  // signature: per section (l-section), list of column count + inner element kinds
  const sig = [];
  $('main section.l-section, section.l-section').each((_, sec) => {
    const s = $(sec);
    const rows = s.find('.vc_row').first();
    const cols = rows.length ? rows.children('.wpb_column').length : s.find('.wpb_column').length;
    const kinds = new Set();
    rows.find('*').each((_, el2) => {
      const c = ($(el2).attr('class') || '');
      if (/wpb_text_column/.test(c)) kinds.add('text');
      if (/wpb_single_image|w-image/.test(c)) kinds.add('image');
      if (/wpb_button|btn|w-btn/.test(c)) kinds.add('button');
      if (/vc_video|w-video/.test(c)) kinds.add('video');
      if (/gallery|w-gallery|vc_gallery/.test(c)) kinds.add('gallery');
      if (/usp_|iconbox|w-iconbox/.test(c)) kinds.add('iconbox');
      if (/wpb_raw/.test(c)) kinds.add('raw');
      if (/vc_tta|accordion|tabs/.test(c)) kinds.add('accordion');
      if (/blog|post-list|w-grid/.test(c)) kinds.add('posts');
      if (/wpb_gmaps|map/.test(c)) kinds.add('map');
      if (/contact-form|wpcf7/.test(c)) kinds.add('form');
    });
    const bg = (s.attr('style') || '').match(/background[^;]*/)?.[0] || '';
    const cls = s.attr('class') || '';
    sig.push({ cols, kinds: [...kinds].sort().join('+'), height: (cls.match(/height_\w+/) || [])[0], bg: bg.slice(0, 80) });
  });
  rowsByPage.push({ kind: m.kind, url: new URL(m.link).pathname, title: m.title, sections: sig });
}

console.log('=== TAG COUNTS (main content) ===');
console.log([...tagCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40).map(([k, v]) => `${k}:${v}`).join('  '));

console.log('\n=== CLASS COUNTS (top 70) ===');
console.log([...classCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 70).map(([k, v]) => `${k}:${v}`).join('  '));

console.log('\n=== SECTION SIGNATURES ===');
for (const p of rowsByPage) {
  console.log(`\n${p.kind} ${p.url}  [${p.sections.length} sections] ${p.title.slice(0, 40)}`);
  for (const s of p.sections) console.log(`   cols=${s.cols} kinds=${s.kinds || '-'} ${s.height || ''} ${s.bg || ''}`);
}

await fs.writeFile(path.join(RAW, 'analysis.json'), JSON.stringify({ rowsByPage, tags: [...tagCounts], classes: [...classCounts] }, null, 2));
