/* Generates the flat multi-page spark site inside redesign/ from index.html chrome. */
import fs from 'node:fs';

const ROOT = '/Users/alishahabi/Projects/medisdesign';
const DIR = ROOT + '/redesign';
const idx = fs.readFileSync(DIR + '/index.html', 'utf8');
const POSTS = JSON.parse(fs.readFileSync(ROOT + '/data/posts.json', 'utf8'));

/* ---------------------------------------------------------------- helpers */
const slice = (a, b, from = 0) => {
  const i = idx.indexOf(a, from);
  const j = idx.indexOf(b, i);
  if (i < 0 || j < 0) throw new Error('marker not found: ' + a);
  return idx.slice(i, j);
};
const fa = (n) => String(n).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[d]);
const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8H4"/><path d="M8 4 4 8l4 4"/></svg>';
const UP = '<svg viewBox="0 0 16 16" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"><path d="M8 13V3"/><path d="M3.5 7.5 8 3l4.5 4.5"/></svg>';
const link = (href, label) => `<a class="link" href="${href}">${label}${ARROW}</a>`;
const faDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian', { day: 'numeric', month: 'long', year: 'numeric' });
const isoDay = (d) => new Date(d).toISOString().slice(0, 10);

const mark = (n) => `<div class="mark" aria-hidden="true"><svg class="rings" viewBox="-500 -500 1000 1000"><use href="#contour" x="-500" y="-500" width="1000" height="1000"/></svg><b>${n}</b></div>`;
const field = (cls, drift, turn) => `<div class="field ${cls}" data-drift="${drift}" data-turn="${turn}" aria-hidden="true"><svg viewBox="-500 -500 1000 1000"><use href="#contour" x="-500" y="-500" width="1000" height="1000"/></svg></div>`;

const pic = ({ webp, jpg, w, h, alt, sizes }) =>
  `<picture>${webp ? `<source type="image/webp" srcset="${webp}" sizes="${sizes}">` : ''}<img src="${jpg}" width="${w}" height="${h}" loading="lazy" decoding="async" alt="${alt}"></picture>`;

const secHead = ({ n, en, faLabel, id, h2, note }) => `<div class="sec-bar">
  <div class="sec-head reveal">
    ${mark(n)}
    <div class="sec-title">
      <p class="eyebrow"><span class="latin" lang="en">${en}</span><span class="rule" aria-hidden="true"></span><span class="fa">${faLabel}</span></p>
      <h2 id="${id}">${h2}</h2>
    </div>
  </div>
  ${note ? `<p class="sec-note reveal">${note}</p>` : ''}
</div>`;

const section = ({ cls = 'sec', id, label, inner }) =>
  `<section class="${cls}"${id ? ` id="${id}"` : ''} aria-labelledby="${label}"><div class="wrap">${inner}</div></section>`;

/* ------------------------------------------------------------------ chrome */
const DEFS = slice('<svg class="svg-defs"', '<header class="mast">').trimEnd();
const MAST_RAW = idx.slice(idx.indexOf('<header class="mast">'), idx.indexOf('</dialog>') + '</dialog>'.length);
const FOOT_RAW = slice('<footer class="foot"', '<div class="mcta"').trimEnd();
const BAR_RAW = slice('<div class="mcta"', '<script>\n(function').trimEnd();
const JS_RAW = idx.slice(idx.lastIndexOf('<script>\n(function'), idx.lastIndexOf('</script>') + '</script>'.length);
const ORG_RAW = idx.slice(idx.indexOf('<script type="application/ld+json">') + '<script type="application/ld+json">'.length, idx.indexOf('</script>', idx.indexOf('<script type="application/ld+json">')));
const ORG_JSON = JSON.parse(ORG_RAW);
ORG_JSON['@graph'] = ORG_JSON['@graph'].filter((n) => (Array.isArray(n['@type']) ? !n['@type'].includes('WebPage') : n['@type'] !== 'WebPage'));
const ORG_LD = '<script type="application/ld+json">\n' + JSON.stringify(ORG_JSON, null, 2) + '\n</script>';

const ROUTES = {
  '/': 'index.html',
  '/projects/': 'projects.html',
  '/محصولات-آکوستیک-دکوراتیو/': 'products.html',
  '/خدمات-سالن-همایش/': 'services.html',
  '/مجله-تخصصی-سالن-های-همایش/': 'magazine.html',
  '/catalog/': 'catalog.html',
  '/madis-design-about-us/': 'about.html',
  '/contact-us-medis-design/': 'contact.html',
  '/سند-راهبردی-میداس/': 'strategy.html',
  '/خط-مشی-مدیس/': 'policy.html',
  '/سیاست-حفظ-حریم-خصوصی/': 'privacy.html',
  '/بنیاد-علوی/': 'project-alavi.html',
  '/سینمای-داتین/': 'project-datin-cinema.html',
  '/ساختمان-مرکزی-بیمه-دی/': 'project-dey.html',
  '/عایق-صوتی/': 'article-sound-insulation.html',
  '/آکوستیک/': 'article-acoustics.html',
  '/diffuser-panels/': 'magazine.html',
  '/bass-trap-and-its-types/': 'magazine.html',
  '/طراحی-آکوستیک-معماری/': 'service-architecture.html',
  '/محصولات-اکوستیکی-چوب/': 'service-execution.html',
  '/طراحی-آکوستیک-صنعتی/': 'service-industrial.html',
  '/سینما-و-سالن-های-همایش/': 'service-halls.html',
  '/طراحی-و-اجرای-الکتروآکوستیک/': 'service-electroacoustic.html',
};

function relink(html, self) {
  let out = html;
  for (const [from, to] of Object.entries(ROUTES)) out = out.split(`href="${from}"`).join(`href="${to}"`);
  if (self !== 'index.html') {
    out = out.split('href="#contact"').join('href="contact.html"');
    out = out.split('href="#top"').join('href="#top"');
  }
  return out;
}

function chrome(self, navFile) {
  let html = relink(MAST_RAW, self);
  /* the mast is copied from index.html, which already marks the home link */
  html = html.split(' aria-current="page"').join('');
  if (navFile) {
    const target = `href="${navFile}"`;
    html = html.split(`<a ${target}`).join(`<a ${target} aria-current="page"`);
  }
  return `${DEFS}\n\n${html}`;
}

function tail(self, progress) {
  let foot = relink(FOOT_RAW, self);
  let bar = relink(BAR_RAW, self);
  return `${foot}\n\n${bar}\n\n${JS_RAW}`;
}

/* -------------------------------------------------------------------- head */
function head({ title, desc, slug, og, extraLd }) {
  const url = `https://medisdesign.com/${slug}`;
  const org = ORG_LD;
  const pageLd = `{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "${url}#webpage",
  "url": "${url}",
  "name": ${JSON.stringify(title)},
  "description": ${JSON.stringify(desc)},
  "inLanguage": "fa-IR",
  "isPartOf": {"@id": "https://medisdesign.com/#website"},
  "about": {"@id": "https://medisdesign.com/#organization"}
}`;
  const ogTags = og
    ? `<meta property="og:image" content="https://medisdesign.com/${og}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`
    : `<meta property="og:image" content="https://medisdesign.com/assets/brand/og-1200x630.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">`;

  return `<!doctype html>
<html lang="fa-IR" dir="rtl" data-design="spark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#F8F6F0">
<meta name="color-scheme" content="light">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta name="author" content="گروه مهندسی مدیس">
<link rel="canonical" href="${url}">
<link rel="manifest" href="site.webmanifest">
<link rel="icon" type="image/png" sizes="32x32" href="assets/brand/favicon-32.png">
<link rel="apple-touch-icon" sizes="180x180" href="assets/brand/favicon-180.png">
<meta name="apple-mobile-web-app-title" content="مدیس">
<meta name="format-detection" content="telephone=no">
<meta property="og:type" content="website">
<meta property="og:locale" content="fa_IR">
<meta property="og:site_name" content="گروه مهندسی مدیس">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
${ogTags}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<link rel="preload" href="assets/fonts/oc/yekan-700.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/oc/sans-300.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="assets/css/spark.css">
${org}
<script type="application/ld+json">
${pageLd}
</script>${extraLd || ''}
<script>if(!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.classList.add('motion')}</script>
</head>`;
}

/* -------------------------------------------------------------------- hero */
function crumbs(parts) {
  const items = parts.map((p, i) => (i === parts.length - 1
    ? `<span aria-current="page">${p[0]}</span>`
    : `<a href="${p[1]}">${p[0]}</a>`));
  return `<nav class="crumbs" aria-label="مسیر صفحه">${items.join('<i aria-hidden="true">/</i>')}</nav>`;
}

function pageHero({ crumb, en, faLabel, h1, lede, actions = '', tags = '', art = '', narrow = false }) {
  return `<section class="page-hero" id="top" aria-labelledby="page-h">
  ${field('page-field', '0.04', '0.004')}
  <div class="wrap page-hero-in">
    <div class="ph-copy${narrow ? ' narrow' : ''}${art ? '' : ' full'}">
      ${crumbs(crumb)}
      <p class="eyebrow" style="margin-top:22px">
        <span class="latin" lang="en">${en}</span><span class="rule" aria-hidden="true"></span><span class="fa">${faLabel}</span>
      </p>
      <h1 id="page-h">${h1}</h1>
      ${lede ? `<p class="lede">${lede}</p>` : ''}
      ${tags}
      ${actions ? `<div class="ph-actions">${actions}</div>` : ''}
    </div>
    ${art ? `<div class="ph-art">${art}</div>` : ''}
  </div>
</section>`;
}

/* --------------------------------------------------------------------- cta */
function ctaBlock({ n = '', h2 = 'در تماس باشید', en = 'dialogue', faLabel = 'تماس', text = 'ما در تمام مراحل پروژه کنار شما هستیم …!', more = '' }) {
  return `<section class="sec tight" aria-labelledby="cta-h-${n || 'x'}">
  <div class="wrap">
    <div class="panel reveal">
      ${field('panel-field', '-0.02', '0.003')}
      <div class="panel-in">
        <div class="c-main">
          <div class="sec-head">
            ${n ? mark(n) : ''}
            <div class="sec-title">
              <p class="eyebrow"><span class="latin" lang="en">${en}</span><span class="rule" aria-hidden="true"></span><span class="fa">${faLabel}</span></p>
              <h2 id="cta-h-${n || 'x'}">${h2}</h2>
            </div>
          </div>
          <p class="c-cta">${text}</p>
          <div class="ph-actions">
            <a class="btn" href="contact.html">شروع گفت‌وگو</a>
            <a class="link" href="tel:+982126413369">۰۲۱-۲۶۴۱۳۳۶۹${ARROW}</a>
          </div>
          ${more}
        </div>
        <div class="c-side">
          <span class="latin" lang="en">central office</span>
          <div class="c-address" style="margin-top:0;padding-top:0;border-top:0">
            <p>تهران، خیابان شریعتی، خیابان ظفر، پلاک ۱۶۸، واحد ۹</p>
          </div>
          <div class="c-address">
            <span class="lbl">کارخانه</span>
            <p>شهرک صنعتی صفادشت، بلوار فروردین، پلاک ۳۱۰</p>
          </div>
          <a class="c-site" href="https://medisdesign.com">medisdesign.com</a>
        </div>
      </div>
    </div>
  </div>
</section>`;
}

/* -------------------------------------------------------------------- data */
const SERVICES = [
  {
    file: 'service-architecture.html', n: '۰۱', img: 1, title: 'طراحی آکوستیک معماری',
    short: 'طراحی و آنالیز آکوستیکی انواع فضاهای معماری؛ ساختمان‌های فرهنگی، اداری، مسکونی، هتل، مسجد، بیمارستان و …',
    full: 'طراحی و آنالیز آکوستیکی انواع فضاهای معماری از جمله ساختمان‌های فرهنگی، اداری، مسکونی، هتل، مسجد، بیمارستان و …',
    alt: 'فضای داخلی با پوشش‌های آکوستیک روی دیوار',
    ico: '<path d="M4 20V7l8-4 8 4v13"/><path d="M9 20v-5a3 3 0 0 1 6 0v5"/>',
  },
  {
    file: 'service-execution.html', n: '۰۲', img: 2, title: 'اجرای آکوستیک معماری',
    short: 'اجرای پوشش‌های دکوراتیو آکوستیک سقف، کف و دیوار؛ کاهش انتقال صدا و مدت زمان ماندگاری صدا.',
    full: 'اجرای پوشش‌های دکوراتیو آکوستیک سقف، کف و دیوار، کاهش انتقال صدای دیوارهای داخلی، کاهش صدای نوفه محیط و مدت زمان ماندگاری صدا.',
    alt: 'اجرای پوشش آکوستیک روی دیوار و سقف',
    ico: '<path d="M4 8h16"/><path d="M4 16h16"/><path d="M4 12c4 0 4-2.6 8-2.6s4 2.6 8 2.6"/>',
  },
  {
    file: 'service-industrial.html', n: '۰۳', img: 3, title: 'طراحی آکوستیک صنعتی',
    short: 'طراحی، آنالیز و اجرای آکوستیک محیط‌های صنعتی؛ کارخانه‌ها و کارگاه‌های تولیدی، برای کاهش صداهای زیان‌آور.',
    full: 'طراحی، آنالیز و اجرای آکوستیکی محیط‌های صنعتی از جمله کارخانه و کارگاه‌های صنعتی و تولیدی برای کاهش صداهای زیان‌آور محیط.',
    alt: 'سالن صنعتی با سازه‌های فلزی و تیرهای سقف',
    ico: '<path d="M3 20V9l6 3.5V9l6 3.5V6h6v14z"/><path d="M7 20v-3h2v3"/>',
  },
  {
    file: 'service-halls.html', n: '۰۴', img: 4, title: 'سینما و سالن‌های همایش',
    short: 'طراحی و اجرای تخصصی سالن‌های سینما، همایش، تئاتر، کنفرانس، سالن‌های چندمنظوره و فضاهای فرهنگی.',
    full: 'طراحی و اجرای تخصصی سالن‌های سینما، سینمای خانگی، سالن‌های همایش، تئاتر، کنفرانس، سالن‌های چندمنظوره و سالن‌های فرهنگی و اجتماعات.',
    alt: 'سالن کنسرت با پوشش چوبی و نورپردازی گرم',
    ico: '<path d="M3 7h18v8H3z"/><path d="M4 18c5 2 11 2 16 0"/>',
  },
  {
    file: 'service-electroacoustic.html', n: '۰۵', img: 5, title: 'طراحی و اجرای الکتروآکوستیک',
    short: 'طراحی و اجرای سیستم‌های صوتی سالن‌های همایش، سینما، جلسات، رستوران، هتل و سیستم‌های خانگی.',
    full: 'طراحی و اجرای انواع سیستم‌های صوتی سالن‌های همایش، سینما، کنفرانس، جلسات، رستوران و هتل و سیستم‌های صوتی خانگی.',
    alt: 'میز کنترل صوتی و تجهیزات الکتروآکوستیک',
    ico: '<path d="M4 14.5v-5h4L13 6v12l-5-3.5H4z"/><path d="M16.5 9.4a3.6 3.6 0 0 1 0 5.2"/>',
  },
  {
    file: 'service-decorative.html', n: '۰۶', img: 6, title: 'محصولات آکوستیک ـ دکوراتیو',
    short: 'طراحی و ساخت جاذب‌ها، پخش‌کننده‌ها، رفلکتورها، بیس‌ترپ‌ها و پوشش‌های دکوراتیو آکوستیکی دیوار.',
    full: 'طراحی و ساخت محصولات آکوستیکی شامل جاذب‌های صدا، پخش‌کننده‌های صدا، رفلکتورهای صدا، بیس‌ترپ و دیفیوزرها و پوشش‌های دکوراتیو آکوستیکی دیوارها.',
    alt: 'پوشش آکوستیک چوبی روی دیوار سالن',
    ico: '<path d="M3 20h18"/><path d="M4 20V11M8 20V6M12 20v-6M16 20V8M20 20v-4"/>',
  },
];

const PROJECTS = [
  { file: 'project-alavi.html', name: 'سالن بنیاد علوی', type: 'سالن اجتماعات', img: 7 },
  { file: 'project-baharestan.html', name: 'سالن همایش شهرک صنعتی بهارستان', type: 'سالن همایش', img: 1 },
  { file: 'project-araz.html', name: 'سالن هتل آراز', type: 'سالن همایش هتل', img: 4 },
  { file: 'project-datin-cinema.html', name: 'سالن سینمای داتین', type: 'سالن سینما', img: 5 },
  { file: 'project-datin-conference.html', name: 'سالن کنفرانس داتین', type: 'سالن کنفرانس', img: 8 },
  { file: 'project-mosque.html', name: 'مسجد امام حسن مجتبی', type: 'فضای مذهبی', img: 2 },
  { file: 'project-dey.html', name: 'ساختمان مرکزی بیمه دی', type: 'ساختمان اداری', img: 3 },
  { file: 'project-kimiafam.html', name: 'سالن کنفرانس کیمیا فام', type: 'سالن کنفرانس', img: 6 },
];

const PRODUCTS = [
  { id: 'absorbers', title: 'جاذب‌های صدا', line: 'کنترل بازگشت صدا و زمان ماندگاری', img: 1, alt: 'رندر پنل جاذب صدا' },
  { id: 'diffusers', title: 'دیفیوزرها', line: 'پخش یکنواخت انرژی صوتی در فضا', img: 2, alt: 'رندر پنل دیفیوزر' },
  { id: 'bass-traps', title: 'بیس‌ترپ', line: 'کنترل فرکانس‌های پایین در گوشه‌ها', img: 3, alt: 'رندر پنل بیس‌ترپ' },
  { id: 'decorative', title: 'پوشش‌های دکوراتیو', line: 'سقف، کف و دیوار با نمای آکوستیک', img: 4, alt: 'رندر پنل پوشش دکوراتیو آکوستیک' },
];

const CATALOGUES = [
  'کاتالوگ معرفی مدیس دیزاین',
  'کاتالوگ آکوستیک معماری',
  'کاتالوگ اجرای الکترو آکوستیک',
  'کاتالوگ محصولات آکوستیک – دکوراتیو',
];

const CATALOG_SCOPE = [
  { title: 'مشاوره تخصصی رایگان', items: ['بررسی و مشاوره تخصصی رایگان پروژه شما', 'مشاوره در زمینه طراحی معماری و آکوستیک', 'مشاوره قبل از طراحی'] },
  { title: 'طراحی و خلق ایده', items: ['طراحی و ایده‌پردازی معماری', 'طراحی و آنالیز دو بعدی و سه بعدی', 'شبیه‌سازی المان‌های پروژه'] },
  { title: 'طراحی معماری', items: ['طراحی با نرم‌افزارهای مرتبط و تخصصی', 'ترسیم دیتیل‌های اجرایی و شرح دستور اجرا', 'طراحی معماری و دکوراسیون سه‌بعدی', 'طراحی و نقشه‌کشی سازه و تاسیسات'] },
  { title: 'طراحی آکوستیک و الکتروآکوستیک', items: ['مدل‌سازی سه‌بعدی طبق نقشه معماری', 'شبیه‌سازی آکوستیکی توسط نرم‌افزار تخصصی', 'طراحی و شبیه‌سازی الکتروآکوستیکی', 'انتخاب متریال و سیستم‌های صوتی طبق استاندارد'] },
  { title: 'طراحی تاسیسات الکتریکی', items: ['تهیه مدارک و مستندات طبق طراحی', 'طراحی و ترسیم نقشه‌های الکتریکال بر اساس استاندارد', 'اجرای تاسیسات الکتریکی طبق نقشه‌های تاییدشده'] },
  { title: 'طراحی و اجرای دکوراسیون داخلی', items: ['طراحی با نرم‌افزارهای مرتبط و تخصصی', 'ترسیم دیتیل‌های اجرایی و رندرهای سه‌بعدی', 'طراحی دکوراسیون ویژه سازمانی و خانگی', 'جهیزات صحنه و سن، سیستم‌های نوری، صوتی و بصری'] },
];

/* articles */
function postByTitle(title) {
  return POSTS.find((p) => (p.title || '').replace(/\u200c/g, '').trim() === title);
}
function bodyHtml(post) {
  const out = [];
  const walk = (blocks) => {
    for (const b of blocks || []) {
      if (b.type === 'richtext' || b.type === 'text') {
        let h = (b.html || '').trim();
        if (h) out.push(h);
      } else if (b.type === 'image' && b.src) {
        out.push(`@@IMG:${b.src}@@${b.alt || ''}`);
      }
      if (b.blocks) walk(b.blocks);
      if (b.columns) b.columns.forEach((c) => walk(c.blocks));
    }
  };
  for (const s of post.sections || []) for (const r of s.rows || []) for (const c of r.columns || []) walk(c.blocks);
  let html = out.join('\n').replace(/@@IMG:[^\n]*/g, '').replace(/^زمان مطاله.*$/gm, '');
  html = html
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>/g, '')
    .replace(/<p[^>]*>\s*زمان مطاله\s*:[\s\S]*?<\/p>/g, '')
    .replace(/\s*style="[^"]*"/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/g, (m, inner) => (inner.replace(/<[^>]+>/g, '').trim().length > 110 ? `<p>${inner}</p>` : `<h3>${inner}</h3>`))
    .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/g, (m, inner) => (inner.replace(/<[^>]+>/g, '').trim().length > 110 ? `<p>${inner}</p>` : `<h2>${inner}</h2>`))
    .replace(/<br\s*\/?>/g, '</p><p>')
    .replace(/<img[^>]*>/g, '')
    .replace(/<figure[^>]*>[\s\S]*?<\/figure>/g, '')
    .replace(/<p>\s*<\/p>/g, '');
  return html;
}

const ARTICLES = [
  { file: 'article-acoustics.html', title: 'آکوستیک', img: 'assets/img/articles/acoustics.webp', imgW: 624, imgH: 422, alt: 'نمودار انتشار و جذب صدا در فضا', intro: 'آکوستیک به بررسی دانش صدا، ایجاد، پخش، انتقال و کنترل آن می‌پردازد.' },
  { file: 'article-sound-insulation.html', title: 'عایق صوتی و نقش آن در صنعت ساختمان', img: 'assets/img/articles/insulation.jpg', imgW: 1920, imgH: 1080, alt: 'سالن صنعتی بزرگ با سازهٔ فلزی', intro: 'عایق صوتی یکی از بهترین راه‌ها برای کاهش صداهای مزاحم و ناخوشایند در ساختمان‌ها است.' },
  { file: 'article-fire-coating.html', title: 'پوشش های ضد حریق', img: 'assets/img/articles/fire-coating.webp', imgW: 1600, imgH: 1200, alt: 'پوشش ضد حریق روی سازه', intro: 'پوشش ضد حریق به عنوان عایق‌های نسوز، نقش مهمی در حفاظت سازه‌ها در برابر آتش ایفا می‌کنند.' },
  { file: 'article-acoustic-architecture.html', title: 'طراحی آکوستیک معماری', img: 'assets/img/service-01.jpg', imgW: 1800, imgH: 1100, alt: 'فضای داخلی با پوشش‌های آکوستیک روی دیوار', intro: 'صدایی که ناخواسته باشد، نوفه یا سر و صدا نامیده می‌شود؛ طراحی آکوستیک، پاسخ به همان نوفه است.' },
];

/* journal list — real titles, deduped, no logo/project posts */
const JOURNAL = (() => {
  const skip = /^(آیکن|موسسه خیریه|بنیاد علوی|ساختمان مرکزی بیمه دی|سینمای داتین)/;
  const seen = new Set();
  const rows = [];
  for (const p of POSTS) {
    const t = (p.title || '').replace(/\u200c/g, '').replace(/\s+/g, ' ').trim();
    if (!t || skip.test(t) || seen.has(t)) continue;
    seen.add(t);
    rows.push({ title: t, date: p.date });
  }
  return rows.sort((a, b) => new Date(b.date) - new Date(a.date));
})();

/* ------------------------------------------------------------------- builds */
const pages = [];
const emit = (file, obj) => pages.push({ ...obj, file });

/* --- projects index --- */
{
  const plates = PROJECTS.map((p, i) => {
    const size = i === 0 ? 'half' : i === 1 ? 'half' : 'third';
    return `<figure class="plate ${size} reveal"${i ? ` style="--d:${(i % 4) * 0.05}s"` : ''}>
      <a class="ph" href="${p.file}">
        ${pic({ webp: `assets/img/project-0${p.img}-400.webp 400w, assets/img/project-0${p.img}-800.webp 800w`, jpg: `assets/img/project-0${p.img}.jpg`, w: 1710, h: 960, alt: `${p.name}، ${p.type}`, sizes: '(max-width: 700px) 92vw, (max-width: 1180px) 46vw, 640px' })}
      </a>
      <figcaption>
        <span class="latin" lang="en">${p.type === 'سالن سینما' ? 'cinema' : p.type === 'فضای مذهبی' ? 'worship' : p.type === 'ساختمان اداری' ? 'office' : 'hall'}</span>
        <h3>${p.name}</h3>
      </figcaption>
    </figure>`;
  }).join('\n');

  emit('projects.html', {
    file: 'projects.html', navFile: 'projects.html',
    title: 'پروژه‌ها | گروه مهندسی مدیس',
    desc: 'آرشیو پروژه‌های گروه مهندسی مدیس؛ سالن‌های همایش، سینما، کنفرانس، مسجد و ساختمان اداری.',
    slug: 'projects/',
    crumb: [['صفحه اصلی', 'index.html'], ['پروژه‌ها']],
    en: 'selected works', faLabel: 'پروژه‌ها',
    h1: 'پروژه‌های ما',
    lede: '۴۲ پروژه تکمیل شده؛ سالن، سینما، مسجد، ساختمان اداری و فضای فرهنگی. هشت نمونه از آرشیو، با تصویر و نوع فضا.',
    actions: `${link('contact.html', 'گفت‌وگو دربارهٔ پروژه')}`,
    body: `
${section({ id: 'archive', label: 'archive-h', cls: 'sec tight', inner: `
  ${secHead({ n: '۰۱', en: 'archive', faLabel: 'آرشیو', id: 'archive-h', h2: 'نمونه‌های اجرا شده', note: 'هر پروژه با نام و نوع فضا؛ بدون سال، متراژ یا ظرفیتی که در منبع نیامده است.' })}
  <div class="plates">${plates}
    <div class="plate-cta reveal">
      <b>پروژه‌ای در ذهن دارید؟</b>
      <p>۴۲ پروژه تکمیل شده؛ اگر فضای شما در این فهرست نیست، گفت‌وگو را از همین‌جا شروع کنیم.</p>
      <a class="link" href="contact.html">درخواست مشاوره${ARROW}</a>
    </div>
  </div>
` })}
${statsBand('۰۲')}
${ctaBlock({ n: '۰۳', h2: 'پروژهٔ مشابهی در نظر دارید؟', en: 'next step', faLabel: 'شروع' })}
`,
  });
}

/* --- project detail --- */
PROJECTS.forEach((p, i) => {
  const prev = PROJECTS[(i - 1 + PROJECTS.length) % PROJECTS.length];
  const next = PROJECTS[(i + 1) % PROJECTS.length];
  emit(p.file, {
    file: p.file, navFile: 'projects.html',
    title: `${p.name} | پروژه‌های گروه مهندسی مدیس`,
    desc: `${p.name} — ${p.type}. از آرشیو پروژه‌های گروه مهندسی مدیس.`,
    slug: `projects/${p.file.replace('.html', '')}/`,
    og: `assets/img/project-0${p.img}.jpg`,
    crumb: [['صفحه اصلی', 'index.html'], ['پروژه‌ها', 'projects.html'], [p.name]],
    en: 'project', faLabel: 'پروژه',
    h1: p.name,
    lede: '',
    narrow: true,
    tags: `<div class="ph-tags"><span class="tag">${p.type}</span><span class="tag">آرشیو پروژه‌ها</span></div>`,
    body: `
${section({ id: 'overview', label: 'overview-h', cls: 'sec tight', inner: `
  <div class="art-in">
    <div class="art-body">
      ${secHead({ n: '۰۱', en: 'overview', faLabel: 'نمای پروژه', id: 'overview-h', h2: 'نمای پروژه' })}
      <figure class="art-hero">
        ${pic({ webp: `assets/img/project-0${p.img}-400.webp 400w, assets/img/project-0${p.img}-800.webp 800w`, jpg: `assets/img/project-0${p.img}.jpg`, w: 1710, h: 960, alt: `${p.name}، ${p.type}`, sizes: '(max-width: 900px) 92vw, 820px' })}
        <figcaption class="plate-cap"><span class="latin" lang="en">project plate</span><span class="fa">${p.type}</span></figcaption>
      </figure>
    </div>
    <aside class="art-side">
      <dl class="kv">
        <div><dt>نوع فضا</dt><dd>${p.type}</dd></div>
        <div><dt>آرشیو</dt><dd class="plain"><a href="projects.html">پروژه‌های مدیس</a></dd></div>
        <div><dt>خدمات</dt><dd class="plain"><a href="services.html">خدمات ما</a></dd></div>
      </dl>
      <a class="btn" style="margin-top:26px" href="contact.html">درخواست مشاوره</a>
    </aside>
  </div>
` })}
${section({ id: 'more', label: 'more-h', cls: 'sec alt tight', inner: `
  ${secHead({ n: '۰۲', en: 'archive', faLabel: 'بیشتر', id: 'more-h', h2: 'ادامهٔ آرشیو' })}
  <div class="pager">
    <a class="prev" href="${prev.file}"><span class="lbl">پروژهٔ پیشین</span><b>${prev.name}</b></a>
    <a class="next" href="${next.file}"><span class="lbl">پروژهٔ بعدی</span><b>${next.name}</b></a>
  </div>
` })}
${ctaBlock({ n: '۰۳', h2: 'پروژهٔ مشابهی در نظر دارید؟', en: 'next step', faLabel: 'شروع' })}
`,
  });
});

/* --- services index --- */
{
  const cards = SERVICES.map((s, i) => `<a class="card reveal" href="${s.file}" style="--d:${(i % 3) * 0.06}s">
    <div class="card-img">
      ${pic({ webp: `assets/img/svc-${s.img}-480.webp 480w, assets/img/svc-${s.img}-960.webp 960w`, jpg: `assets/img/svc-${s.img}-480.jpg`, w: 480, h: 270, alt: s.alt, sizes: '(max-width: 700px) 92vw, (max-width: 1180px) 46vw, 410px' })}
    </div>
    <div class="card-body">
      <span class="card-top"><span class="card-n">${s.n}</span>
        <svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round">${s.ico}</svg>
      </span>
      <h3>${s.title}</h3>
      <p>${s.full}</p>
    </div>
  </a>`).join('\n');

  emit('services.html', {
    file: 'services.html', navFile: 'services.html',
    title: 'خدمات ما | گروه مهندسی مدیس',
    desc: 'شش خدمت مدیس: طراحی و اجرای آکوستیک معماری، آکوستیک صنعتی، سینما و سالن‌های همایش، الکتروآکوستیک و محصولات آکوستیک ـ دکوراتیو.',
    slug: 'services/',
    crumb: [['صفحه اصلی', 'index.html'], ['خدمات ما']],
    en: 'six practices', faLabel: 'خدمات',
    h1: 'خدمات ما',
    lede: 'از تحلیل فضا تا ساخت پنل؛ هر خدمت، ادامهٔ دیگری است. شش میدان، یک زبان مشترک.',
    body: `
${section({ id: 'practices', label: 'practices-h', cls: 'sec tight', inner: `
  ${secHead({ n: '۰۱', en: 'practices', faLabel: 'شش میدان', id: 'practices-h', h2: 'شش میدان، یک پیوستار', note: 'هر کارت به صفحهٔ همان خدمت می‌رود؛ توضیح‌ها متن واقعی سایت است.' })}
  <div class="svc-grid">${cards}</div>
` })}
${processSection()}
${ctaBlock({ n: '۰۳', h2: 'از کجا شروع کنیم؟', en: 'next step', faLabel: 'شروع', text: 'ما در تمام مراحل پروژه کنار شما هستیم …!' })}
`,
  });
}

/* --- service detail --- */
SERVICES.forEach((s, i) => {
  const picks = [PROJECTS[i % 8], PROJECTS[(i + 3) % 8], PROJECTS[(i + 5) % 8]];
  const plates = picks.map((p) => `<figure class="plate third reveal">
    <a class="ph" href="${p.file}">${pic({ webp: `assets/img/project-0${p.img}-400.webp 400w, assets/img/project-0${p.img}-800.webp 800w`, jpg: `assets/img/project-0${p.img}.jpg`, w: 1710, h: 960, alt: `${p.name}، ${p.type}`, sizes: '(max-width: 700px) 46vw, 300px' })}</a>
    <figcaption><h3>${p.name}</h3></figcaption>
  </figure>`).join('\n');

  emit(s.file, {
    file: s.file, navFile: 'services.html',
    title: `${s.title} | گروه مهندسی مدیس`,
    desc: s.full.slice(0, 150),
    slug: `services/${s.file.replace('.html', '')}/`,
    crumb: [['صفحه اصلی', 'index.html'], ['خدمات ما', 'services.html'], [s.title]],
    en: 'practice', faLabel: 'خدمت',
    h1: s.title,
    lede: s.short,
    narrow: true,
    tags: `<div class="ph-tags"><span class="tag">طراحی</span><span class="tag">اجرا</span><span class="tag">نظارت</span></div>`,
    art: `<figure class="frame">${pic({ webp: `assets/img/svc-${s.img}-480.webp 480w, assets/img/svc-${s.img}-960.webp 960w`, jpg: `assets/img/svc-${s.img}-480.jpg`, w: 480, h: 270, alt: s.alt, sizes: '(max-width: 900px) 90vw, 420px' })}</figure>`,
    body: `
${section({ id: 'about-service', label: 'about-service-h', cls: 'sec tight', inner: `
  <div class="art-in">
    <div class="art-body">
      ${secHead({ n: '۰۱', en: 'scope', faLabel: 'این خدمت', id: 'about-service-h', h2: 'این خدمت چه می‌کند' })}
      <div class="prose">
        <p>${s.full}</p>
      </div>
      <div class="ph-actions" style="margin-top:30px">
        <a class="btn" href="contact.html">درخواست مشاوره</a>
        ${link('services.html', 'همهٔ خدمات')}
      </div>
    </div>
    <aside class="art-side">
      <dl class="kv" style="margin-top:0">
        <div><dt>میدان</dt><dd>${s.title}</dd></div>
        <div><dt>مرحله</dt><dd class="plain">تحلیل، طراحی، اجرا</dd></div>
        <div><dt>محصولات</dt><dd class="plain"><a href="products.html">آکوستیک ـ دکوراتیو</a></dd></div>
      </dl>
    </aside>
  </div>
` })}
${section({ id: 'from-archive', label: 'from-archive-h', cls: 'sec alt tight', inner: `
  ${secHead({ n: '۰۲', en: 'from the archive', faLabel: 'آرشیو', id: 'from-archive-h', h2: 'از آرشیو پروژه‌ها', note: 'نمونه‌هایی از سالن، سینما، مسجد و ساختمان اداری.' })}
  <div class="plates">${plates}
    <div class="plate-cta reveal">
      <b>پروژه‌ای در ذهن دارید؟</b>
      <p>۴۲ پروژه تکمیل شده؛ اگر فضای شما در این فهرست نیست، گفت‌وگو را از همین‌جا شروع کنیم.</p>
      <a class="link" href="contact.html">درخواست مشاوره${ARROW}</a>
    </div>
  </div>
` })}
${ctaBlock({ n: '۰۳', h2: 'برای این خدمت گفت‌وگو کنیم', en: 'next step', faLabel: 'شروع' })}
`,
  });
});

/* --- products --- */
{
  const tiles = PRODUCTS.map((p, i) => `<article class="card reveal" id="${p.id}" style="--d:${(i % 2) * 0.05}s">
    <div class="card-img">${pic({ webp: `assets/img/panel-${p.img}.webp`, jpg: `assets/img/panel-${p.img}.jpg`, w: 182, h: 103, alt: p.alt, sizes: '(max-width: 900px) 92vw, 560px' })}</div>
    <div class="card-body">
      <span class="card-top"><span class="card-n">${fa(i + 1)}</span><span class="latin" lang="en">acoustic product</span></span>
      <h3>${p.title}</h3>
      <p>${p.line}</p>
    </div>
  </article>`).join('\n');

  emit('products.html', {
    file: 'products.html', navFile: 'products.html',
    title: 'محصولات آکوستیک ـ دکوراتیو | گروه مهندسی مدیس',
    desc: 'جاذب‌های صدا، دیفیوزرها، بیس‌ترپ و پوشش‌های دکوراتیو آکوستیک برای سقف، کف و دیوار.',
    slug: 'products/',
    crumb: [['صفحه اصلی', 'index.html'], ['محصولات']],
    en: 'materials', faLabel: 'محصولات',
    h1: 'محصولات آکوستیک ـ دکوراتیو',
    lede: 'پوشش‌ها، جاذب‌ها و دیفیوزرها؛ همان موادی که فضا را نرم می‌کنند. چهار خانوادهٔ محصول، یک زبان طراحی.',
    actions: `${link('catalog.html', 'درخواست کاتالوگ محصولات')}`,
    body: `
${section({ id: 'families', label: 'families-h', cls: 'sec tight', inner: `
  ${secHead({ n: '۰۱', en: 'families', faLabel: 'چهار خانواده', id: 'families-h', h2: 'چهار خانوادهٔ محصول', note: 'توضیح‌ها همان یک‌خطی‌های واقعی سایت است؛ بدون ضخامت، درجهٔ حریق یا ضریب جذب.' })}
  <div class="cards-2">${tiles}</div>
` })}
${section({ id: 'material', label: 'material-h', cls: 'sec alt tight', inner: `
  <div class="split">
    <div class="split-txt">
      ${secHead({ n: '۰۲', en: 'material', faLabel: 'متریال', id: 'material-h', h2: 'روکش، رنگ، بافت' })}
      <p class="lead" style="margin-top:22px">سطح محصول، بخشی از طراحی است: روکش چوب، رنگ و بافت، همان‌قدر که جذب و پخش صدا مهم است، در دیده‌شدن فضا اثر می‌گذارد.</p>
      <div class="ph-actions" style="margin-top:26px">${link('catalog.html', 'کاتالوگ‌ها')}${link('contact.html', 'درخواست نمونه')}</div>
    </div>
    <div class="split-fig">
      <figure>
        <div class="frame">${pic({ webp: 'assets/img/service-06-560.webp 560w, assets/img/service-06-1120.webp 1120w', jpg: 'assets/img/service-06.jpg', w: 1800, h: 972, alt: 'نمونه‌های روکش چوب در رنگ‌های طبیعی، برای پوشش‌های آکوستیک', sizes: '(max-width: 900px) 90vw, 520px' })}</div>
        <figcaption class="material-cap"><span class="latin" lang="en">wood veneer samples</span><span class="fa">نمونه‌های پوشش</span></figcaption>
      </figure>
    </div>
  </div>
` })}
${ctaBlock({ n: '۰۳', h2: 'کاتالوگ را بفرستیم؟', en: 'catalogues', faLabel: 'کاتالوگ', text: 'چهار کاتالوگ چاپی؛ با یک تماس یا ایمیل ارسال می‌شود.', more: `<a class="c-site" href="catalog.html">catalog</a>` })}
`,
  });
}

/* --- catalog --- */
{
  const cards = CATALOGUES.map((c, i) => `<article class="tile reveal" style="--d:${(i % 4) * 0.05}s">
    <span class="tile-top"><span class="n">${fa(i + 1)}</span>
      <svg class="ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h9l4 4v14H6z"/><path d="M9 12h7"/><path d="M9 16h5"/></svg>
    </span>
    <h3>${c}</h3>
    <a class="link" style="margin-top:auto;padding-top:18px" href="contact.html">درخواست کاتالوگ${ARROW}</a>
  </article>`).join('\n');

  const scope = CATALOG_SCOPE.map((g, i) => `<article class="tile reveal" style="--d:${(i % 3) * 0.05}s">
    <span class="tile-top"><span class="n">${fa(i + 1)}</span></span>
    <h3>${g.title}</h3>
    <ul role="list">${g.items.map((x) => `<li>${x}</li>`).join('')}</ul>
  </article>`).join('\n');

  emit('catalog.html', {
    file: 'catalog.html', navFile: 'catalog.html',
    title: 'کاتالوگ‌ها | گروه مهندسی مدیس',
    desc: 'کاتالوگ‌های مدیس دیزاین: معرفی، آکوستیک معماری، اجرای الکتروآکوستیک و محصولات آکوستیک ـ دکوراتیو.',
    slug: 'catalog/',
    crumb: [['صفحه اصلی', 'index.html'], ['کاتالوگ‌ها']],
    en: 'catalogues', faLabel: 'کاتالوگ',
    h1: 'کاتالوگ‌ها',
    lede: 'چهار کاتالوگ، به‌همراه فهرست خدماتی که در کاتالوگ معرفی آمده است.',
    body: `
${section({ id: 'catalogues', label: 'catalogues-h', cls: 'sec tight', inner: `
  ${secHead({ n: '۰۱', en: 'four books', faLabel: 'کاتالوگ', id: 'catalogues-h', h2: 'چهار کاتالوگ', note: 'برای دریافت فایل، یک تماس یا ایمیل کافی است.' })}
  <div class="cards-4">${cards}</div>
` })}
${section({ id: 'scope', label: 'scope-h', cls: 'sec alt tight', inner: `
  ${secHead({ n: '۰۲', en: 'scope of work', faLabel: 'محدوده', id: 'scope-h', h2: 'محدودهٔ خدمات', note: 'همان فهرستی که در صفحهٔ کاتالوگ سایت آمده است.' })}
  <div class="svc-grid">${scope}</div>
` })}
${ctaBlock({ n: '۰۳', h2: 'کاتالوگ را دریافت کنید', en: 'request', faLabel: 'درخواست', text: 'شمارهٔ تماس، ایمیل و آدرس دفتر مرکزی در پایین همین صفحه است.' })}
`,
  });
}

/* --- magazine --- */
{
  const featured = ARTICLES.map((a, i) => {
    const post = postByTitle(a.title.replace('پوشش های ضد حریق', 'پوشش های ضد حریق'));
    const date = post ? isoDay(post.date) : '';
    return `<a class="mag-item reveal" href="${a.file}" style="--d:${(i % 2) * 0.05}s">
      <div class="mag-thumb"><img src="${a.img}" width="320" height="320" loading="lazy" decoding="async" alt="${a.alt}"></div>
      <div class="mag-text">
        <span class="mag-top"><span class="idx">${fa(i + 1)}</span><time datetime="${date}">${post ? faDate.format(new Date(post.date)) : ''}</time></span>
        <h3>${a.title}</h3>
      </div>
    </a>`;
  }).join('\n');

  const byTitle = new Map(ARTICLES.map((a) => [a.title, a.file]));
  const rows = JOURNAL.map((r, i) => {
    const f = byTitle.get(r.title);
    const inner = `<span class="idx">${fa(i + 1)}</span><h3>${r.title}</h3><time datetime="${isoDay(r.date)}">${faDate.format(new Date(r.date))}</time>`;
    return f ? `<a class="row" href="${f}">${inner}</a>` : `<div class="row">${inner}</div>`;
  }).join('\n');

  emit('magazine.html', {
    file: 'magazine.html', navFile: 'magazine.html',
    title: 'مدیس مگ | یادداشت‌هایی دربارهٔ صدا و فضا',
    desc: 'مقالات گروه مهندسی مدیس دربارهٔ آکوستیک، عایق صوتی، دیفیوزر، بیس‌ترپ و طراحی فضا.',
    slug: 'magazine/',
    crumb: [['صفحه اصلی', 'index.html'], ['مدیس مگ']],
    en: 'journal', faLabel: 'مجله',
    h1: 'مدیس مگ',
    lede: 'یادداشت‌هایی دربارهٔ صدا، عایق و فضایی که می‌سازیم.',
    body: `
${section({ id: 'latest', label: 'latest-h', cls: 'sec tight', inner: `
  ${secHead({ n: '۰۱', en: 'latest', faLabel: 'تازه‌ها', id: 'latest-h', h2: 'چهار مقالهٔ کامل', note: 'متن این چهار مقاله در همین مجموعه منتشر شده است.' })}
  <div class="mag-grid">${featured}</div>
` })}
${section({ id: 'archive', label: 'journal-archive-h', cls: 'sec alt tight', inner: `
  ${secHead({ n: '۰۲', en: 'archive', faLabel: 'آرشیو', id: 'journal-archive-h', h2: 'آرشیو مجله', note: 'فهرست عنوان‌های منتشرشده در مدیس مگ؛ تاریخ‌ها از خود سایت است.' })}
  <div class="rows">${rows}</div>
` })}
${ctaBlock({ n: '۰۳', h2: 'سؤالی دربارهٔ آکوستیک دارید؟', en: 'dialogue', faLabel: 'پرسش' })}
`,
  });
}

/* --- articles --- */
ARTICLES.forEach((a, i) => {
  const post = postByTitle(a.title);
  const body = post ? bodyHtml(post) : '';
  const date = post ? isoDay(post.date) : '';
  const next = ARTICLES[(i + 1) % ARTICLES.length];
  emit(a.file, {
    file: a.file, navFile: 'magazine.html',
    title: `${a.title} | مدیس مگ`,
    desc: a.intro,
    slug: `journal/${a.file.replace('.html', '')}/`,
    og: a.img,
    crumb: [['صفحه اصلی', 'index.html'], ['مدیس مگ', 'magazine.html'], [a.title]],
    en: 'journal', faLabel: 'مقاله',
    h1: a.title,
    lede: a.intro,
    narrow: true,
    body: `
${section({ id: 'article', label: 'article-h', cls: 'sec tight', inner: `
  <div class="art-in">
    <div class="art-body">
      <figure class="art-hero" style="margin-top:0">
        <img src="${a.img}" width="${a.imgW}" height="${a.imgH}" loading="lazy" decoding="async" alt="${a.alt}">
      </figure>
      <div class="prose" style="margin-top:40px">
        ${body}
      </div>
      <div class="ph-actions" style="margin-top:44px">
        <a class="btn" href="contact.html">مشاورهٔ تخصصی</a>
        ${link('magazine.html', 'بازگشت به مدیس مگ')}
      </div>
    </div>
    <aside class="art-side">
      <dl class="art-meta">
        <div><dt>تاریخ</dt><dd><time datetime="${date}">${post ? faDate.format(new Date(post.date)) : ''}</time></dd></div>
        <div><dt>دسته</dt><dd>آکوستیک</dd></div>
        <div><dt>منبع</dt><dd>مدیس مگ</dd></div>
      </dl>
      <div class="quote">
        <p>از اولین اندازه‌گیری تا آخرین پنل.</p>
        <span class="latin" lang="en">medis design group</span>
      </div>
      <a class="link" style="margin-top:24px" href="${next.file}">مقالهٔ بعدی: ${next.title}${ARROW}</a>
    </aside>
  </div>
` })}
`,
  });
});

/* --- about --- */
{
  emit('about.html', {
    file: 'about.html', navFile: 'about.html',
    title: 'درباره ما | گروه مهندسی مدیس',
    desc: 'گروه مهندسی مدیس؛ آکوستیک، الکتروآکوستیک و معماری. از سال ۱۳۹۵ تا امروز، با ادغام علم آکوستیک، معماری و هنر.',
    slug: 'madis-design-about-us/',
    og: 'assets/img/service-06.jpg',
    crumb: [['صفحه اصلی', 'index.html'], ['درباره ما']],
    en: 'about', faLabel: 'درباره ما',
    h1: 'دو دهه تمایز',
    lede: 'گروه مهندسی مدیس در سه میدان کار می‌کند: معماری، آکوستیک و الکتروآکوستیک.',
    actions: `${link('projects.html', 'دیدن پروژه‌ها')}`,
    art: `<figure class="frame">${pic({ webp: 'assets/img/service-06-560.webp 560w, assets/img/service-06-1120.webp 1120w', jpg: 'assets/img/service-06.jpg', w: 1800, h: 972, alt: 'نمونه‌های روکش چوب برای پوشش آکوستیک', sizes: '(max-width: 900px) 90vw, 420px' })}</figure>`,
    body: `
${section({ id: 'story', label: 'story-h', cls: 'sec tight', inner: `
  <div class="art-in">
    <div class="art-body">
      ${secHead({ n: '۰۱', en: 'story', faLabel: 'معرفی', id: 'story-h', h2: 'از ۱۳۹۵ تا امروز' })}
      <div class="prose">
        <p>گروه صنعتی_هنری مدیس از سال ۱۳۹۵ فعالیت خود را در زمینه‌های اجرای سیستم‌های جریان ضعیف، اجرای سالن‌های اداری و فرهنگی، اجرای فضاهای آکوستیک و الکتروآکوستیک آغاز نمود و در این سال‌ها با انجام موفق انواع پروژه‌های ملی و خصوصی توانایی خود را به اثبات رسانده است.</p>
        <p>شرکت مدیس پیشگام در صنعت آکوستیک معماری، با اتکا به دانش و تجربیات خود و با به کارگیری مهندسین مجرب در زمینه‌های آکوستیک، الکتروآکوستیک، معماری داخلی و الکترونیک و همچنین با استفاده از به‌روزترین نرم‌افزارها و سخت‌افزارهای حوزهٔ آکوستیک، آمادهٔ ارائهٔ خدمات طراحی، مشاوره، نظارت و اجرا در انواع پروژه‌های معماری شامل سالن‌های همایش، سینما، کنفرانس، هتل، ساختمان‌های اداری و مسکونی، مساجد، کارخانه‌ها و انواع فضاهای معماری است.</p>
        <p>شرکت مدیس این افتخار را دارد که برای اولین بار در کشور رویکردی جامع را در نظر گرفته و با ادغام علم آکوستیک، معماری و هنر به مسائل حرفه‌ای آکوستیک می‌پردازد. طراحی و آنالیز آکوستیک در این شرکت زیر نظر متخصصین آکوستیک صورت گرفته و با ساخت به‌روزترین محصولات آکوستیکی، تجربهٔ حس خوب شنیدن را برای عموم مردم فراهم کرده است.</p>
      </div>
    </div>
    <aside class="art-side">
      <dl class="art-meta">
        <div><dt>زمینه</dt><dd>آکوستیک معماری</dd></div>
        <div><dt>زمینه</dt><dd>الکتروآکوستیک</dd></div>
        <div><dt>زمینه</dt><dd>معماری داخلی</dd></div>
        <div><dt>خدمات</dt><dd>طراحی، مشاوره، نظارت، اجرا</dd></div>
      </dl>
      <div class="quote">
        <p>ما در تمام مراحل پروژه کنار شما هستیم …!</p>
        <span class="latin" lang="en">medis design group</span>
      </div>
    </aside>
  </div>
` })}
${statsBand('۰۲')}
${partnersSection()}
${ctaBlock({ n: '۰۴', h2: 'در تماس باشید', en: 'dialogue', faLabel: 'تماس' })}
`,
  });
}

/* --- contact --- */
{
  emit('contact.html', {
    file: 'contact.html', navFile: 'contact.html',
    title: 'تماس با ما | گروه مهندسی مدیس',
    desc: 'دفتر مرکزی: تهران، خیابان شریعتی، خیابان ظفر، پلاک ۱۶۸، واحد ۹ — ۰۲۱-۲۶۴۱۳۳۶۹ · ۰۲۱-۲۶۷۰۹۵۷۲ · ۰۹۳۸۶۰۳۸۰۰۳',
    slug: 'contact-us-medis-design/',
    crumb: [['صفحه اصلی', 'index.html'], ['تماس با ما']],
    en: 'dialogue', faLabel: 'تماس',
    h1: 'تماس با ما',
    lede: 'ما در تمام مراحل پروژه کنار شما هستیم …! برای مشاورهٔ اولیه، تماس یا ایمیل کافی است.',
    body: `
${section({ id: 'offices', label: 'offices-h', cls: 'sec tight', inner: `
  <div class="panel reveal">
    ${field('panel-field', '-0.02', '0.003')}
    <div class="panel-in">
      <div class="c-main">
        <div class="sec-head">
          ${mark('۰۱')}
          <div class="sec-title">
            <p class="eyebrow"><span class="latin" lang="en">addresses</span><span class="rule" aria-hidden="true"></span><span class="fa">دفترها</span></p>
            <h2 id="offices-h">دفتر مرکزی و کارخانه</h2>
          </div>
        </div>
        <div class="c-address">
          <span class="lbl">دفتر مرکزی</span>
          <p>تهران، خیابان شریعتی، خیابان ظفر، پلاک ۱۶۸، واحد ۹</p>
        </div>
        <div class="c-address">
          <span class="lbl">کارخانه</span>
          <p>شهرک صنعتی صفادشت، بلوار فروردین، پلاک ۳۱۰</p>
        </div>
        <div class="ph-actions" style="margin-top:34px">
          <a class="btn" href="mailto:medisdesign.team@gmail.com">ارسال ایمیل</a>
          <a class="link" href="tel:+982126413369">تماس تلفنی${ARROW}</a>
        </div>
      </div>
      <div class="c-side">
        <span class="latin" lang="en">telephone</span>
        <a class="prow" href="tel:+982126413369"><span class="plabel">تلفن</span><span class="pnum">۰۲۱-۲۶۴۱۳۳۶۹</span></a>
        <a class="prow" href="tel:+982126709572"><span class="plabel">تلفن</span><span class="pnum">۰۲۱-۲۶۷۰۹۵۷۲</span></a>
        <a class="prow" href="tel:+989386038003"><span class="plabel">همراه</span><span class="pnum">۰۹۳۸۶۰۳۸۰۰۳</span></a>
        <span class="latin" lang="en" style="display:block;margin-top:26px">digital</span>
        <a class="prow" href="mailto:medisdesign.team@gmail.com"><span class="plabel">ایمیل</span><span class="pnum contact">medisdesign.team@gmail.com</span></a>
        <a class="prow" href="https://instagram.com/medisdesign.team" target="_blank" rel="noopener noreferrer"><span class="plabel">اینستاگرام</span><span class="pnum contact">@medisdesign.team</span></a>
        <a class="prow" href="https://wa.me/989386038003" target="_blank" rel="noopener noreferrer"><span class="plabel">واتساپ</span><span class="pnum contact">wa.me/989386038003</span></a>
        <a class="c-site" href="https://medisdesign.com">medisdesign.com</a>
      </div>
    </div>
  </div>
` })}
${section({ id: 'how', label: 'how-h', cls: 'sec alt tight', inner: `
  ${secHead({ n: '۰۲', en: 'how it starts', faLabel: 'شروع', id: 'how-h', h2: 'گفت‌وگو چطور شروع می‌شود', note: 'سه گام ساده؛ پیش از هر قرارداد.' })}
  <div class="svc-grid">
    <article class="tile reveal"><span class="tile-top"><span class="n">۰۱</span></span><h3>تماس اولیه</h3><p>نوع فضا، مرحلهٔ پروژه و محدودهٔ کار را می‌گویید؛ همان تماس کافی است.</p></article>
    <article class="tile reveal" style="--d:.06s"><span class="tile-top"><span class="n">۰۲</span></span><h3>بازدید و اندازه‌گیری</h3><p>اگر پروژه در مرحلهٔ طراحی یا اجرا باشد، فضا دیده و اندازه‌گیری می‌شود.</p></article>
    <article class="tile reveal" style="--d:.12s"><span class="tile-top"><span class="n">۰۳</span></span><h3>پیشنهاد کتبی</h3><p>دامنهٔ خدمات، مراحل و زمان‌بندی، در یک پیشنهاد روشن.</p></article>
  </div>
` })}
`,
  });
}

/* --- document pages --- */
const DOCS = [
  { file: 'privacy.html', navFile: '', title: 'سیاست حفظ حریم خصوصی', slug: 'privacy/', en: 'policy', lead: 'این صفحه در سایت اصلی، سند حریم خصوصی گروه مهندسی مدیس است.' },
  { file: 'policy.html', navFile: '', title: 'خط مشی مدیس', slug: 'policy/', en: 'policy', lead: 'خط مشی گروه مهندسی مدیس، سند تعهدهای حرفه‌ای و اجرایی مجموعه است.' },
  { file: 'strategy.html', navFile: '', title: 'سند راهبردی میداس', slug: 'strategy/', en: 'document', lead: 'سند راهبردی میداس، چارچوب بلندمدت گروه مهندسی مدیس است.' },
];
for (const d of DOCS) {
  emit(d.file, {
    file: d.file, navFile: '',
    title: `${d.title} | گروه مهندسی مدیس`,
    desc: d.lead,
    slug: d.slug,
    crumb: [['صفحه اصلی', 'index.html'], [d.title]],
    en: d.en, faLabel: 'سند',
    h1: d.title,
    narrow: true,
    body: `
${section({ id: 'document', label: 'document-h', cls: 'sec tight', inner: `
  <div class="doc-panel reveal">
    <span class="latin" lang="en">document / ${d.slug.replace('/', '')}</span>
    <h2 id="document-h" style="margin-top:0;font-size:clamp(1.3rem,1.8vw,1.6rem)">${d.title}</h2>
    <p>${d.lead}</p>
    <p>متن کامل این سند در دفتر مرکزی در دسترس است؛ برای دریافت نسخهٔ چاپی یا فایل، با ما تماس بگیرید.</p>
    <div class="ph-actions">
      <a class="btn" href="contact.html">درخواست سند</a>
      ${link('index.html', 'بازگشت به صفحهٔ اصلی')}
    </div>
  </div>
` })}
`,
  });
}

/* ------------------------------------------------------- reusable sections */
function statsBand(n = '۰۲') {
  return `<section class="band" aria-labelledby="band-h">
  ${field('band-field', '0.03', '0.004')}
  <div class="wrap band-in">
    <div class="sec-head reveal">
      ${mark(n)}
      <div class="sec-title">
        <p class="eyebrow"><span class="latin" lang="en">in numbers</span><span class="rule" aria-hidden="true"></span><span class="fa">ارقام</span></p>
        <h2 id="band-h">تجربه و تخصص مهم است</h2>
      </div>
    </div>
    <div class="stats">
      <div class="stat reveal"><b>۴۲</b><span>پروژه تکمیل شده</span></div>
      <div class="stat reveal" style="--d:.06s"><b>۱۹۰</b><span>طراحی انجام شده</span></div>
      <div class="stat reveal" style="--d:.12s"><b>۱۱۰</b><span>مشاوره و نظارت</span></div>
      <div class="stat reveal" style="--d:.18s"><b>۲۳</b><span>خدمات برون‌سپاری</span></div>
    </div>
  </div>
</section>`;
}

function processSection() {
  return `<section class="sec" id="process" aria-labelledby="process-h">
  <div class="wrap">
    ${secHead({ n: '۰۲', en: 'method', faLabel: 'فرآیند', id: 'process-h', h2: 'از تحلیل تا اجرا', note: 'سه گام، یک پیوستار؛ هیچ بخشی از پروژه به پروژهٔ بعدی سپرده نمی‌شود.' })}
    <div class="proc-in">
      <div class="proc-copy">
        <p class="lead reveal">کار از اندازه‌گیری آغاز می‌شود، نه از ایده. هندسهٔ فضا، رفتار صدا و پوشش نهایی، در یک زبان مشترک تصمیم می‌گیرند.</p>
        <ol class="proc-steps reveal" role="list">
          <li class="proc-step"><b>۰۱</b><div><h3>تحلیل و آنالیز</h3><p>اندازه‌گیری رفتار صدا در فضا و مدل‌سازی هندسه، پیش از آنکه طراحی آغاز شود.</p></div></li>
          <li class="proc-step"><b>۰۲</b><div><h3>طراحی</h3><p>طراحی معماری، آکوستیک و الکتروآکوستیک به‌صورت یکپارچه؛ از مقطع و چیدمان تا جزئیات اجرا.</p></div></li>
          <li class="proc-step"><b>۰۳</b><div><h3>اجرا و نظارت</h3><p>اجرای پوشش‌ها و سیستم‌ها، تحویل پروژه و مشاوره و نظارت در طول اجرا.</p></div></li>
        </ol>
      </div>
      <div class="proc-plates">
        <figure class="plate-sheet reveal">
          <span class="sheet-img">${pic({ webp: 'assets/img/plate-model-320.webp 320w, assets/img/plate-model-640.webp 640w', jpg: 'assets/img/plate-model-640.jpg', w: 640, h: 480, alt: 'مدل سه‌بعدی حجمی از یک فضای مذهبی با شبکهٔ آکوستیک', sizes: '(max-width: 900px) 42vw, 300px' })}</span>
          <figcaption><span class="latin" lang="en">acoustic model</span><span class="fa">مدل سه‌بعدی حجم</span></figcaption>
        </figure>
        <figure class="plate-sheet reveal">
          <span class="sheet-img">${pic({ webp: 'assets/img/plate-section-480.webp 480w, assets/img/plate-section-960.webp 960w', jpg: 'assets/img/plate-section-960.jpg', w: 960, h: 600, alt: 'مقطع خطی سالن همایش با شیب سقف و سکوها', sizes: '(max-width: 900px) 42vw, 300px' })}</span>
          <figcaption><span class="latin" lang="en">section</span><span class="fa">مقطع سالن</span></figcaption>
        </figure>
      </div>
    </div>
  </div>
</section>`;
}

function partnersSection() {
  const logos = [
    ['0000001111', 'بیمه دی'], ['00000022222', 'همیاری'], ['000003333', 'داتین'], ['00221321321', 'بانک پارسیان'],
    ['20651651', 'قوه قضائیه'], ['6120320635151', 'مؤسسه خیریه کهریزک'], ['0315165165151', 'سازمان بهزیستی'], ['251561651651', 'مرکز مدیریت حوزه‌های علمیه'],
  ].map(([f, name]) => `<li><picture><source type="image/webp" srcset="assets/brand/partners/${f}-160.webp"><img src="assets/brand/partners/${f}.png" width="768" height="768" loading="lazy" decoding="async" alt="${name}"></picture></li>`).join('\n');

  return `<section class="sec alt" aria-labelledby="partners-h">
  <div class="wrap">
    ${secHead({ n: '۰۳', en: 'with us', faLabel: 'همراهان', id: 'partners-h', h2: 'همراهان همیشگی ما' })}
    <ul class="logos reveal" role="list">${logos}</ul>
    <p class="partner-note reveal">همراهانی که در سال‌های گذشته با آن‌ها کار کرده‌ایم.</p>
  </div>
</section>`;
}

/* --------------------------------------------------------------- assemble */
for (const p of pages) {
  const html = `${head({
    title: p.title, desc: p.desc, slug: p.slug, og: p.og,
    extraLd: `
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": ${JSON.stringify(p.crumb.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], ...(c[1] && c[1] !== 'index.html' ? { item: 'https://medisdesign.com/' + c[1].replace('.html', '') } : {}) })))}
}
</script>`,
  })}
<body>

<a class="skip" href="#main">پرش به محتوای اصلی</a>

${chrome(p.file, p.navFile)}

<main id="main">
${pageHero({ crumb: p.crumb, en: p.en, faLabel: p.faLabel, h1: p.h1, lede: p.lede, actions: p.actions || '', tags: p.tags || '', art: p.art || '', narrow: p.narrow })}
${p.body}
</main>

${tail(p.file)}
</body>
</html>
`;
  fs.writeFileSync(`${DIR}/${p.file}`, html);
  console.log('wrote', p.file, (html.length / 1024).toFixed(1) + ' KB');
}
