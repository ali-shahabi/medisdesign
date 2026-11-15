# Project memory — medisdesign

Static Next.js replica of https://medisdesign.com. See `README.md` for the full report.

## Durable facts

- Source site: WordPress 7.1.4, Zephyr 8.32.1 theme, WPBakery Page Builder, Yoast SEO, RTL Persian (`fa_IR`).
- Inventory: 23 pages, 25 posts, 7 categories, 3 tags, 2 authors, 248 media items; no forms; no search.
- Measured design tokens (1440 px): section gutter 40 px, content max-width 1440 px, grid gap 48 px,
  header 113 px (122 px on 17 pages, logo 150 px there instead of 100 px), body `#f2f4f7`,
  canvas `#ffffff`, text `#35415b`, headings `#0f131f`, primary `#a18e37`, active nav `#f77656`.
- Full palette extracted 2026-11-14 from the theme's 85 `--color-*` vars + WPBakery one-off classes:
  `docs/color-palette.md` (+ `color-palette.png`). Gold `#a18e37` is the only chromatic theme
  color (hover `#c4ae45`); `#f77656` coral is a page-builder override for the active nav item,
  not a theme token — don't promote it to a global accent.
- Chosen direction: «ارگانیک» (organic), rebuilt 2026-11-14 with the palette extracted in
  session 8b3cc8d0 (gold `#a18e37`, hover `#c4ae45`, ink `#0f131f`, body `#35415b`, coral `#f77656`).
  It is the only direction left: `redesign/index.html` (reviewed mockup) + `redesign/dsh-redesign.html`
  (production build, see below) + `redesign/assets/` + `redesign/screenshots/`.
  All other proposal pages and the `medis-landing-proposals` package were deleted on request.
- **Only one direction is left: `redesign/index.html`** («ارگانیک», cream/contour). The palette/white-ground variant
  (`index-palette.html`) was built, then deleted by the user on 2026-11-14 — do not resurrect it unless asked.
  Its design decisions survive only in git-less history; the screenshots under `redesign/screenshots/palette-*` are gone too.
- Accent change (2026-11-14, on request): **terracotta `#CC7529` is `index.html`'s chromatic accent**. The old roles
  collapsed into one token — `--gold` (links/buttons/numbers/rules/contours), `--moss` (eyebrows + service icons),
  `--clay` (active-nav underline, marks, dots, chip arrows) all became `var(--primary)`; `--gold-hover` was unused and
  is gone; `--coral #F77656` stays for the tagline rule and (in the mockup) the focus ring. Brass is one edit away:
  `--primary:#A18E37` turns every role gold together (the per-role split is no longer possible without re-splitting).
  Both CTAs (header "تماس با ما", hero "شروع گفت‌وگو") are light labels on terracotta — user asked for light text, so the
  earlier ink label was reverted to `#fff`. In the mockup that is 3.4:1 (AA only at large sizes); the production build
  uses `--primary-cta:#B05A12` (4.86:1) for filled controls and keeps `#CC7529` for rules/figures.
  There are no other filled buttons — "دیدن پروژه‌ها", "درخواست کاتالوگ محصولات" and "بازگشت به بالا" are underlined text links.
  Known weak spot in the mockup: small accent labels on the sand grounds (`#E7DCCB`) sit at ~2.5:1; the production
  build adds `--accent-text:#8A4610` (5.23:1 on sand) for small accent type.
- Secondary colour (2026-11-14, on request): **`#002736` deep petrol** carries the dark structural grounds — the stats
  `.band` and `.foot` (both were cream/sand before), plus `.sec.sky` now a whisper tint
  `color-mix(in srgb, var(--secondary) 5%, var(--chalk))` instead of the old `#E8EEF6` blue. On petrol: cream
  `--on-secondary:#F8F6F0` for headings/brand, `rgba(248,246,240,.72/.66/.56)` for copy and meta,
  `rgba(248,246,240,.16–.22)` rules, terracotta `--primary` for the stat numerals (4.6:1) and footer link hover,
  coral for the band eyebrow. Contour fields inside petrol grounds flip to cream at .10–.18.
- Logo colour follows the grounds: the mark is line art on transparency, so two recoloured copies were generated from
  `assets/brand/medis-mark.png` (alpha kept, RGB replaced) — `medis-mark-secondary.png` (#002736) in the **header**,
  `medis-mark-cream.png` (#F8F6F0) in the **footer**. Regenerate with the same recipe if the palette changes again;
  the original file is untouched.
  (If a dark-ground variant is ever rebuilt: a `.band .stat + .stat` override out-specifies the theme's mobile resets,
  so the stacked band needs its own `@media (max-width:900px/460px)` rules to drop `border-inline-start`.)
- Separator scale: small 1.5rem, medium 3rem, large 4.5rem, huge 6rem; with-line 4/6/7/9rem.
- The theme gives the first in-flow section `padding-top: var(--header-height)` (absolute header).
  Pages without that CSS variable (posts/archives) get none — that is faithful, not a bug.
- Fonts: the site's own files are self-hosted in `public/fonts/site/` and declared under the
  original family names (`iranyekanweblight_FaNum`, `IRANSansWeb_Medium`, …). Do not swap in a
  substitute — text layout depends on these exact metrics.
- Chrome is per page: `data/pages.json` carries `header` (null for posts/archives, `light` =
  white 0.55 bar + circle logo + 113 px, `dark` = navy 0.40 fixed bar + large logo + 122 px).
- Image default radius is 16 px; the theme rounds images, so never leave `border-radius: 0`.

## SEO status (audited 2026-11-12)

Full report: `docs/seo-status/report.md` (+ `live.md`, `clone.md`, `performance.md`, `visibility.md`).

- Live site crawl layer is healthy (59/59 sitemap URLs 200, robots open, 301s clean, real 404) but on-page is broken:
  **2 conflicting canonicals on all 58 sitemap URLs** (Yoast encoded+slash vs Zephyr decoded, no slash),
  **40/58 URLs without meta description**, **38/58 pages with zero H1** (6 footer widget `<h1>`s sitewide),
  **136/197 images `alt=""`**, home title still `صفحه اصلی 2 - MedisDesign`, duplicate indexable homepage
  `/صفحه-اصلی/` self-canonical + in sitemap, and nav "محصولات" → `/products/` is **`noindex, follow`** and
  excluded from the sitemap (verified with a Googlebot UA; the page is indexable=false by Yoast setting).
- 9 content images are 404 (the only images on 3 posts; also their `og:image` and sitemap `image:loc`).
  3 internal links 404 (`/services/`, `/acoustics-science-sound-quality/`, phone-as-path `/09123108464`).
  7 pages render zero text incl. the contact page (`<main>` = 2 bytes). Newest post is 583 days old.
- Performance (Iran network, CDP lab; PSI/CrUX are HTTP-403-blocked from here): 1.80 MiB / 50 requests on
  mobile, HTML TTFB median 3.10 s, LCP 3.6–8.5 s (fails), CLS ≤0.0078 and TBT ≤59 ms (pass). 9
  render-blocking stylesheets gate FCP; 460 KB fonts (60 % icon fonts); zero WebP in content.
- Visibility sample (Bing-family only; Google unavailable): brand queries are won by `/projects/` and the
  duplicate home, not `/`; **zero appearances in 9 commercial queries**. Snippets are invented from the
  footer NAP/nav/counter because descriptions are missing. No GA/GTM/GSC verification tags exist.
- Replica: content parity is good but SEO parity is partial — **0 JSON-LD** (live has 1 Yoast `@graph`/page),
  12 archives lose their canonical (`app/[...slug]/page.tsx:47-50`), 36/66 pages have no description,
  sitemap includes the noindex page + 2 legacy `/medismag/` duplicates + stubs + pagination, canonical
  origin hardcoded in 3 files, and `images.unoptimized: true` makes images 1.59× heavier than live's srcset.
  Not deployed (no commits/remotes/host config).

## Production build (2026-11-15) — `redesign/dsh-redesign.html`

`redesign/index.html` stays the reviewed mockup; `redesign/dsh-redesign.html` is the production
candidate built from it (85 KB, self-contained, relative `assets/`). Changes:

- **P0 fixed:** native `<dialog>` mobile nav ≤1024 px (burger, focus trap, Escape, scroll lock,
  two-column on ≥700); scroll-cue dot now travels right→left (`-46px`); product chips and all six
  service cards are real links; the retired gold literal became `color-mix(--primary)`.
- **Tokens:** `--muted:#55607A` (4.64:1 sand), `--accent-text:#8A4610` (small accent type,
  5.23:1 sand), `--primary-cta:#B05A12` (filled buttons, white label 4.86:1); focus ring is ink,
  footer labels .55 cream. Coral stays decorative only.
- **Type:** h1 line-height 1.16, `text-wrap:balance` on h1/h2, weight 400 for all ≤15 px text,
  Georgia-first serif stack, Latin labels carry `lang="en"`.
- **Content:** «ارگانیک» → «طراحی آکوستیک»; the duplicated CTA quote became «از اولین اندازه‌گیری
  تا آخرین پنل.»; band h2 shortened to «تجربه و تخصص مهم است»; magazine dates corrected
  (۷ آبان / ۱۸ فروردین ۱۴۰۴ / ۸ مهر / ۵ آبان) and the non-existent «آکوستیک چیست؟» replaced by the
  real «آکوستیک» (2025-04-07); email, Instagram, WhatsApp and the factory address added;
  footer rebuilt to 4 columns + legal links; 8 fake partner `href="#"` anchors removed.
- **Links:** 23 internal routes, all verified against `data/pages.json` + `data/posts.json`;
  nav remains in-page anchors (single-page design), cards/plates/magazine point at real pages.
- **SEO/a11y:** title+description, canonical, OG/Twitter, Organization+LocalBusiness+WebSite
  JSON-LD, 32/180 favicons, font+hero preloads, one h1, no empty anchors, no-JS nav fallback.
- **Images:** WebP derivatives generated with `cwebp` — projects `-400/-800`, hero `-640/-1280`,
  service `-560/-1120`, panels, partners `-160` — served via `<picture>`. All images total 219 KB;
  first load 208 KB / 8 requests (85 KB HTML + 154 KB fonts + 43 KB hero + logo + favicon).
- **Verified:** no horizontal overflow 320–1440 (header CTA hidden ≤360), burger at ≤1024,
  dialog Escape/link-close/scroll-lock, scrollspy sets aria-current, JSON-LD parses, no 404s.
  Captures: `redesign/screenshots/production/`.
- **Still open:** H1 is the poetic line (keywords live in title/description — decide before launch);
  port into Next with shared chrome first; subset WOFF2 fonts; 1200×630 OG image; analytics/host.

## Pipeline

`scripts/scrape.mjs` → `scripts/raw` → `scripts/build-data.mjs` → `data/*.json` → Next pages.
`scripts/scrape-extras.mjs` covers routes outside the Yoast sitemaps (archive `/page/N/`,
legacy `/medismag/<slug>/`). `scripts/download-assets.mjs` fills `public/wp-content`.
Fidelity tooling: `scripts/check.mjs` (geometry deltas) and `/tmp/shoot.mjs`-style screenshot diffs.

## Gotchas learned

- `pnpm next build` runs TypeScript strict; guards needed for optional `html` fields.
- Row templates must go through the `--cols` CSS variable: inline `gridTemplateColumns`
  beats the mobile media query.
- `.col-inner` must stay `display: block` (margins escape like the original); headings carry the
  1.5rem bottom margin, plain `div.w-text` does not, and the last child sits flush.

## Dev vs prod routing (learned the hard way)

- `output: 'export'` is applied **only** for `next build` (`NODE_ENV=production` in `next.config.ts`).
  Keep it that way: with export in dev, any path missing from `generateStaticParams` returns a
  dev 500 (`Page "/[...slug]/page" is missing param …`) instead of a 404.
- `dynamicParams` must be a **literal** boolean (`false`); Next rejects expressions and
  `true` is illegal with `output: export`.
- `generateStaticParams` must emit **decoded** segments (`decodeURIComponent`), otherwise the
  request's decoded param never matches and every Persian URL 500s in dev.
- Static hosts decode percent-encoded URLs before mapping to files, so the export's Persian
  directory names serve both `/مجله-…/` and `/%D9%85…/` correctly.

## Header menu placement

- In RTL the **first** menu in the DOM sits to the RIGHT of the logo. The live site puts
  `ush_menu_1` (صفحه اصلی · پروژه ها · محصولات · خدمات ما) on the right and `ush_menu_2`
  (مدیس مگ · کاتالوگ ها · درباره ما · تماس با ما) on the left — `HeaderBar` must pass
  `menus[0]` to the right-hand nav.
- The two menus have different link padding in the theme: 11px for menu 1, 9px for menu 2.
  Getting this wrong shifts the centred logo by ~8px.

## Component parity notes (round 3)

- **Archive grids** come from `w-grid` markup; `gridifyArchive()` (in `scripts/lib/sections.mjs`)
  converts it to a typed `grid` block. It must run for the extras scraper too, otherwise
  `/author/.../page/2/` renders the raw grid stacked (+1.5k px).
- **Post content images** need WordPress' `.aligncenter{display:block}` — without it a broken
  image collapses to its alt-text box instead of its `width`/`height` attributes.
- **Comment forms** (both the WP markup and our own component) use: title 18px/1.71 + 18px
  margin, notes 16px + 16px, textarea 144px, inputs 48px, submit 12.8/20.8 padding, radius 4.8px.
- `--h4/h5/h6-line-height` tokens are referenced by the heading rules — they must exist (1.2).
- Buttons live inside `.w-btn-wrapper` in the source; convert the inner `a.w-btn` to a button
  block or they render unstyled.

## Mobile scale (390px) — theme breakpoints

The theme uses 1380 / 1024 / 600 for CSS and 900 for the nav collapse:

| | >1024 | 601–1024 | ≤600 |
|---|---|---|---|
| header height | per page (`--header-h`) | 93px | **87px** |
| logo | per page (`--logo-h`) | 95px | **95px** |
| section gutter | 40px | 40px | **1.5rem (24px)** |
| row gap `--gap` | 3rem | 2rem | **1.5rem** |

- Separators shrink under 1024px with the theme's formulas
  (`size_medium: calc(1rem + 2.5vw)` → 26px at 390).
- The mobile logo is **centred** with the menu button absolutely positioned at the edge —
  `justify-content: space-between` pushes the logo to the left edge and is wrong.
- `.col.is-stretched` must keep its negative margins on mobile: the hero is 438px wide
  inside a 390px viewport, which is what makes its height match.
- Do NOT append CSS after the `@media (max-width: 900px)` block and then replace from that
  marker — it silently deletes every rule that follows.
