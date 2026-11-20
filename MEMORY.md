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
- **`redesign/autoclow-redesign.html` (2026-11-16)** — a parallel implementation of `redesign/REVIEW.md` requested
  in another session ("create new html name autoclow-redesign and implement changes"); `index.html` untouched.
  Same P0/P1 fixes as `dsh-redesign.html`, different choices: coral kept for tagline rule + band eyebrow;
  small accent text uses darker terracotta tokens `--primary-ink` #9C5713 / `--primary-deep` #8F4E0E (AA-passing)
  instead of the single-orange tradeoff; CSS-overlay nav sheet ≤900px (not `<dialog>`); content pack kept verbatim
  (four magazine titles, datetimes matched to the visible Jalali labels: 2024-10-19 / 2024-10-28 / 2024-09-29 /
  2024-10-26); featured banner (سینمای داتین) + 7 plates + «همه پروژه‌ها» closer tile keeps grids full (4×2 desktop,
  2×4 mobile); PIL WebP `srcset`/`sizes` (first load ~770 KB incl. 150 KB fonts); statement quote = real about-page
  sentence (CTA line single-use). Verified: 28/28 images load in a real browser, no overflow 1440→390, sheet
  open/close/focus/scroll-to tested; captures `redesign/screenshots/review/v2-*`. Both v2 files now coexist —
  the user should pick one before production (dsh: 208 KB first load, real routes, single orange; autoclow:
  AA-passing accent text, CONTENT.md-verbatim copy).
  Pane gotcha: the embedded browser pane freezes CSS transition clocks — computed opacity reads 0 mid-animation;
  verify transitions headless or via `getAnimations()`.
- Accent change (2026-11-14, on request): **terracotta `#CC7529` is `index.html`'s chromatic accent**. The old roles
  collapsed into one token — `--gold` (links/buttons/numbers/rules/contours), `--moss` (eyebrows + service icons),
  `--clay` (active-nav underline, marks, dots, chip arrows) all became `var(--primary)`; `--gold-hover` was unused and
  is gone; `--coral #F77656` is used in the mockup for the tagline rule and focus ring (the production
  build replaced it with the single orange on 2026-11-16). Brass is one edit away:
  `--primary:#A18E37` turns every role gold together (the per-role split is no longer possible without re-splitting).
  Both CTAs (header "تماس با ما", hero "شروع گفت‌وگو") are light labels on terracotta — user asked for light text, so the
  earlier ink label was reverted to `#fff`. That is 3.4:1 (AA only at large sizes). The production build now
  uses the exact design orange `#CC7529` (sampled #CC762A from the 2026-11-16 request screenshot) for every
  accent — the temporary `#B05A12` button and `#8A4610` small-label variants were removed on request.
  There are no other filled buttons — "دیدن پروژه‌ها", "درخواست کاتالوگ محصولات" and "بازگشت به بالا" are underlined text links.
  Known weak spot (accepted design tradeoff): small accent labels on chalk/sand sit at 3.16:1 / 2.52:1 because the
  production build uses the same `#CC7529` for them; `#8A4610` (5.23:1 sand) is the documented AA alternative.
- Secondary colour (2026-11-14, on request): **`#002736` deep petrol** carries the dark structural grounds — the stats
  `.band` and `.foot` (both were cream/sand before), plus `.sec.sky` now a whisper tint
  `color-mix(in srgb, var(--secondary) 5%, var(--chalk))` instead of the old `#E8EEF6` blue. On petrol: cream
  `--on-secondary:#F8F6F0` for headings/brand, `rgba(248,246,240,.72/.66/.56)` for copy and meta,
  `rgba(248,246,240,.16–.22)` rules, terracotta `--primary` for the stat numerals (4.6:1) and footer link hover,
  coral for the band eyebrow (the production build uses the single orange instead). Contour fields inside petrol
  grounds flip to cream at .10–.18.
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
  (Deploy status changed later — see «GitHub Pages deploy» below: the repo now has a remote and a live
  gh-pages branch.)

## Production build (2026-11-15) — `redesign/dsh-redesign.html`

`redesign/index.html` stays the reviewed mockup; `redesign/dsh-redesign.html` is the production
candidate built from it (85 KB, self-contained, relative `assets/`). Changes:

- **P0 fixed:** native `<dialog>` mobile nav ≤1024 px (burger, focus trap, Escape, scroll lock,
  two-column on ≥700); scroll-cue dot now travels right→left (`-46px`); product chips and all six
  service cards are real links; the retired gold literal became `color-mix(--primary)`.
- **Accent:** one token, `--primary:#CC7529`, for every button, label, number and rule. The darker
  `--accent-text:#8A4610` and `--primary-cta:#B05A12` variants were removed on request 2026-11-16, as was
  `--coral` (tagline rule and band eyebrow are now orange). White button label 3.42:1; small labels 3.16:1
  on chalk / 2.52:1 on sand — accepted design tradeoff, with `#B05A12`/`#8A4610` documented as AA
  alternatives but no longer in the file. Focus ring is ink, footer labels .55 cream. No coral or
  second orange remains in the production file.
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

## Spark direction + flat multi-page build (2026-11-16)

- **`redesign/index.html` is now the spark page** (cream ground, contour field, orange `--primary`,
  self-hosted Yekan/Sans), promoted from `spark-redesign.html` on request. `spark-redesign.html`,
  `autoclow-redesign.html`, `dsh-redesign.html` and `oc-redesign.html` were deleted; the notes for
  them above are history only.
- `index.html` is a thin document again: chrome + sections + JS, with the whole `<style>` block moved
  verbatim to `assets/css/spark.css` (~46 KB) plus a new **section 22 — interior pages**
  (`.page-hero`, `.crumbs`, `.prose`, `.art-in`, `.rows`, `.kv`, `.cards-4`, `.tile`, `.pager`,
  `.split`, `.doc-panel`, `.plate-cta`).
- **Relative `url()` in that file resolves from `assets/css/`**, so the four `@font-face` sources must
  be `../fonts/oc/…`. With `assets/fonts/…` they 404'd and every page silently fell back to Tahoma —
  the only real bug the extraction introduced. Everything else about the split is byte-identical.
- 28 sibling pages live **flat** in `redesign/` (no directories, so it still previews from a plain
  file server): `projects.html` + 8 `project-*.html`, `services.html` + 6 `service-*.html`,
  `products.html`, `catalog.html`, `magazine.html` + 4 `article-*.html`, `about.html`, `contact.html`,
  `privacy.html`, `policy.html`, `strategy.html`. Site routes in `index.html` were rewritten to those
  filenames (`/projects/` → `projects.html`, `/عایق-صوتی/` → `article-sound-insulation.html`,
  `/diffuser-panels/` and `/bass-trap-and-its-types/` → `magazine.html`, …).
- The pages are generated, not hand-written: `gen-spark.mjs` (kept in the session temp dir, not in the
  repo) slices the mast/dialog/footer/mcta/JS chrome out of `index.html` and emits per-page `<head>`,
  JSON-LD (Organization graph minus the home `WebPage` node + per-page WebPage + BreadcrumbList) and
  `aria-current="page"` on the matching desktop **and** mobile nav link. Re-run it after structural
  edits; edits to `index.html` itself stay manual.
- Copy stays real: only `CONTENT.md` and `data/*.json`. Four posts have real bodies (`آکوستیک`,
  `عایق صوتی و نقش آن در صنعت ساختمان`, `پوشش های ضد حریق`, `طراحی آکوستیک معماری`) → four article
  pages; every other journal title is a non-link row in the `magazine.html` archive. Project and
  service detail pages are image-led with factual meta only (name, type, links) — no invented year,
  area or capacity.
- **Verified:** 29 pages; every local `href`/`src`/`srcset` resolves (96 image URLs, all HTTP 200); no
  dead `#anchor`; one `h1` per page; one current item per nav; `scrollWidth == clientWidth` at
  390 / 768 / 1000 px; no console errors once the font paths were fixed. Lazy images that show as
  "pending" in headless captures are a background-tab artifact of the capture, not a page defect
  (`curl` + real-browser `naturalWidth` confirm they load).

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

## Next.js (Spark) home page — statement section removed (2026-11-18)

- Home section order is now: hero → **services** → process → projects → stats band → products → partners →
  magazine → contact. The «۰۱ · STATEMENT» / «دو دهه تمایز» block was deleted on request; that copy still exists on
  `/about/` (its h1 is «دو دهه تمایز», plus a .quote), so nothing was lost.
- The section after it carries the **secondary** ground on request: services is `className="sec petrol"`
  (was `sec alt`), so the cream hero still drops into a dark band. The hero scroll cue now points at
  `#services`; the `#about` anchor is gone (no other file linked it).
- Dark-ground rules for it live in globals.css §17: `.sec.petrol` h2 / .latin / .mark b / .sec-note / .link;
  the service cards keep their chalk surface, so nothing had to be inverted. Verified at 1440 and 390 px.
- Deleted as dead along with the section: the `.disc` list rules (+ their .sec.petrol variant), the
  `.sec.petrol .stmt-main` lines, and the now-unused `Mark` import. Marks still read ۰۲, ۰۲, ۰۳, ۰۴,
  ۰۵, ۰۶, ۰۸, ۰۹ (pre-existing, non-sequential) — numbering left untouched.
- Verify a visual change like this headless: `agent-browser` (headless by default; `--headed` shows it),
  `set viewport W H` → `open` → force `.reveal` (`classList.add('in')`) before the screenshot, or the
  capture comes out blank. This project’s dev server is usually already up on :3000.

- **Card copy was capped at 38ch** (.card p, globals.css), which left a wide empty gutter inside every
  service/product card; on request it is now max-width: none, so the paragraph fills .card-body
  (423px body → 375px text at 1440, 3-up). The base p{max-width:62ch} would still cut the 2-up
  /products/.card cards, so the rule has to say none, not just a larger ch value.
- **The home hero has no CTA row any more** (2026-11-18): the «شروع گفت‌وگو» button and the «دیدن پروژه‌ها»
  text link were removed on request, leaving only the eyebrow, h1, tagline, lede and the
  «معماری · آکوستیک · الکتروآکوستیک» line inside .hero-meta. The header keeps its «تماس با ما» button, so
  #contact is still reachable from every page; the .btn/.link classes are untouched and still used
  by the section-more links.
- **Hero copy rides the secondary ink** (2026-11-18, on request): `.hero-copy h1`, `.hero-tagline` →
  `var(--color-secondary)` #002736; `.h1-kicker`, `.hero-lede`, `.disc-line` → the new `--sec-64` /
  `--sec-58` tokens (same stepped fallbacks as `--cream-*`, mixed from the secondary hue), so the
  hierarchy is unchanged and only the hue moves. The eyebrow keeps its orange `.fa`; the plate caption
  (hall study / سالن، نمای داخلی) was left on ink because the crop did not include it.
- **Secondary ink also covers the hero chrome** (follow-up): `.hero-plate .plate-cap` (.fa → `--sec-64`,
  .latin → `--sec-58`) and the interior heroes (`.page-hero h1` → secondary, `.page-hero .lede` →
  `--sec-64`, `.ph-copy .latin` → `--sec-58`). Section headings (h2) and body prose are still `--color-ink`,
  so the hue step is only visible where a page h1 meets a section h2 — near-identical at #002736 vs #0f131f.
  Project-page `.plate-cap` captions outside the hero deliberately stay ink (out of scope); swap them by
  dropping the `.hero-plate` prefix if the whole caption family should follow.

## GitHub Pages deploy (verified 2026-11-18)

- **Live:** https://ali-shahabi.github.io/medisdesign/ — project pages under the `/medisdesign` base path;
  source on `main`, built site on `gh-pages` (orphan branch, one commit per deploy, no Actions workflow).
- Recipe: `NEXT_PUBLIC_BASE_PATH=/medisdesign pnpm build` → **`touch out/.nojekyll`** → publish `out/` to
  `gh-pages`. The `.nojekyll` step is mandatory and easy to lose: `next build` wipes `out/`, and without the
  marker Jekyll drops every `_next/` asset (site renders unstyled). `out/` is gitignored, so the export only
  ever exists on `gh-pages`.
- Publishing that worked: `git worktree add --detach /tmp/… origin/gh-pages` → `rsync -a --delete --exclude
  .git out/ /tmp/…/` → commit → `git push origin HEAD:gh-pages` → `git worktree remove --force`. Verified
  commit/file parity first (737 files = 737 tracked, `index.html` byte-identical).
- GitHub Pages picked the commit up in well under a minute (first poll already served the new HTML).
  Post-deploy checks that pass on the live URL: `/about/`, `/services/`, `/services/industrial/`,
  `/projects/datin-cinema/`, `/magazine/` all 200; `/not-a-page/` 404; CSS/font chunks 200 under
  `/medisdesign/_next/…`.
- Building while `next dev` (:3000) runs is safe here — the dev server still answered 200 after the
  production build (`next dev` keeps its caches in `.next/dev`).

## Product catalogue from the printed book (2026-11-20, branch `feat/catalogue-products`)

- **The printed catalogue is the source the site never had.** «Medis Catalogue.pdf» (52 pp.,
  6 chapters) documents **13 model codes in 5 families**; `content/products.ts` holds every
  value and invents nothing — the book carries no prices, no fire rating and no *numeric*
  NRC (the values live only in the printed curves), so the site never states a number.
- Families → models: `industrial` (Ce-102, Ce-103), `interior` (Fa-105, Fa-106, FD-102),
  `halls` (GM-109, DM-102), `wood` (DA-103…DA-108), `chairs` (no code). Routes:
  `/products/` (index, five anchored sections), `/products/[model]/` (`generateStaticParams`
  over the 13 slugs, `dynamicParams = false`), `/products/colours/`, `/products/chairs/`.
  The old four-card `products` array in `content/site.ts` is gone; the home chips now map
  `families` and link to `/products/#<family-id>`.
- **Assets are crops of the PDF**, not new renders: `public/assets/img/spec/<slug>.webp`
  (product photos), `chairs-*.webp`,
  `catalogue-cover.webp`; `public/assets/img/wood/<code>.webp` (the 16 swatches, cropped
  above the printed code so the code can be HTML); `public/assets/catalog/medis-catalogue-fa.pdf`
  — 31.6 MB → 2.5 MB via `doc.rewrite_images(dpi_threshold=200, dpi_target=150, quality=70)`
  plus `subset_fonts()`; text stays selectable, photos soften. (`dpi_target` must be smaller
  than `dpi_threshold` or PyMuPDF raises.)
- **The curves are live now (Chart.js), not scans.** `components/AbsorptionChart.tsx`
  (client, registers only Line+Point+Linear+Category+Tooltip, ~60 KB gz on that route)
  reads `model.curve = { freqs: 100…5000 (18 bands), series: [{ label, values[] }] }` from
  `content/products.ts`. Terracotta/petrol/brass per series; HTML legend toggles datasets;
  a `<details>` data table of the same numbers is server-rendered so the page still carries
  the data for search and screen readers. Tooltip/labels use Persian digits with «٫».
- **How those numbers were obtained** (PyMuPDF + Pillow, ad-hoc scripts, not in the repo):
  the curves are vector — `page.get_drawings()` with fill colours #37A0D8 / #2F2F87 /
  #0FA34A. The grey dashed gridlines give the y scale (each paired with its printed label
  via a least-squares fit), and the band labels under the plot (100, 125 … 5000 — **100 Hz
  is the first band**, easy to drop) give the x scale; each polyline is sampled at the band
  x positions. Note the legend order is not the colour order: check each page (e.g. FD-102
  navy = 30 mm, blue = 60 mm).
- **Source-data caveat worth telling the client:** the book reuses one curve across several
  models. Extracted arrays for Fa-105 and GM-109 are identical to 2 dp, FD-102 differs only
  by sampling noise, and DA-103/104 are byte-identical; a pixel diff of the printed crops
  shows only label/legend differences. Publish these as the book's curves, and replace them
  the moment real lab data exists — the numbers now live in one file, so it is a data edit,
  not a code change.
- Two page grounds had to be removed from every crop: the chart's grey #E7E6E9 plot
  background and the DA pages' beige block. Rule used: any pixel with `min(r,g,b) > 221`
  and saturation < 16, or within 14 of the beige #CCC1B0, becomes `--color-chalk`; then
  trim to the content bbox plus a 12 px margin. Re-run that if charts are ever re-cropped.
- The DA charts keep the book's own axis title `SPECIMEN ABSORPTION (M2/OBJECT)` — it is
  the catalogue's wording, **not** a second metric; do not «fix» it into alpha without the
  source data.
- `/catalog/` now ships the real file: featured download (cover, size, page count) and the
  six-chapter index with page numbers. The `catalogue` object (file/pages/size/chapters)
  lives in `content/products.ts`.
- **Project pages gained optional facts** — `year`, `facts`, `scope`, `note` on `Project`.
  Only `baharestan` is filled (۱۴۰۲ · ۲۵۰ m² · ۲۰۰ صندلی · ۸۷→۴۸ dB) because the catalogue
  is the only placement that documents it; the rest stay name+type as before.
- **New CSS is §20** (`20 · catalogue products`), inserted **before** §19 breakpoints:
  `.fam*`, `.model-row`, `.spec-*`, `.chart-*`, `.swatch*`, `.chair-*`, `.mat*`, `.dl*`,
  `.art-note`, `.scope-tags`, with its own 1180/900/600 rules. Gotcha: global `.latin` is
  `direction: ltr`, so a Latin code stacked in an RTL grid starts at the *left* — that is
  why `.mr-txt .latin` carries `text-align: right`.
- **Model pages: no Latin code in the h1.** A code prefixed inside the RTL heading
  bidi-mangles (Yekan draws the digits Persian-shaped and the run reorders, so «Ce-102»
  rendered as garbage). The h1 is the Persian title alone; the code stays in the eyebrow
  (`.latin`, `direction: ltr`), the spec table, and at the END of `<title>`
  («تایل چوبی دکوراتیو — DA-106») where the LTR run stays isolated. JSON-LD keeps the
  code first — it is never rendered.
- **Verified:** `pnpm build` = 47 pages incl. the 13 model routes; Product JSON-LD with
  `sku` in the export; `scrollWidth === clientWidth` at 390 px on /, /products/, a model,
  `/products/colours/`, `/products/chairs/`, `/catalog/`, `/projects/baharestan/`; the PDF
  is in `out/assets/catalog/`. Full-page Chrome captures leave the footer band empty —
  viewport captures show it correctly, so do not chase that as a bug.

### Deploy from this network (2026-11-20) — SSH is blocked, use gh over HTTPS

- `git@github.com` (port 22) **times out** here and `ssh-add -l` reports no identities, so
  the old SSH recipe fails. The `gh` CLI is logged in (keyring) and `gh auth setup-git` installs
  a credential helper — but the global config also rewrites `https://github.com/` →
  `https://ghfast.top/https://github.com/`, so a plain HTTPS push asks for a username.
- Working recipe: disable the global config for the command (drops the rewrite) and re-add
  only the gh helper:
  `GIT_CONFIG_GLOBAL=/dev/null GIT_TERMINAL_PROMPT=0 git -c credential.helper='!gh auth git-credential' push https://github.com/ali-shahabi/medisdesign.git HEAD:gh-pages`
  Commits need identity explicitly when the global config is off (`-c user.name=… -c user.email=…`).
- Deployed 2026-11-20: gh-pages `acc24da` (319 files) serves the catalogue build —
  `/products/`, 13 model pages, `/products/colours/`, `/products/chairs/`, `/catalog/` with the
  2.5 MB PDF, Baharestan facts, Chart.js curves, 86 px header. Branch
  `feat/catalogue-products` pushed (source), gh-pages carries the build.
- Live smoke test after deploy: `/`, `/products/`, `/products/ce-102/`, `/products/da-106/`,
  `/products/colours/`, `/products/chairs/`, `/catalog/`, `/projects/baharestan/` → 200;
  the PDF is 2 523 866 B; the canvas draws and the chips point at `/medisdesign/products/#<family>`.

- **Stats band has no rules (2026-11-20, on request).** `.stats` lost its `border-top`, the
  `cream-16` dividers between `.stat`s (desktop, 2-col and 1-col breakpoints) and the 26 px
  `padding-inline-start` that used to separate them; spacing is a plain `gap: 26px` now, so the
  numbers align to their column starts. Re-adding a divider means putting back both the border
  and the padding, or the first column looks wider than the rest.

### Header lockup (2026-11-20, on request “make the logo bigger”)

- Mark 34 → **46 px**, brand name 14.5 → **17 px**, latin line 9.5 → **11 px**, gap 12 → 14 px,
  bar 78 → **86 px**; `.hero-in` min-height follows (`100svh - 86px - 58px`) — change both or the
  home hero overflows the fold by the delta. Mobile (≤900): mark 38, name 15, latin 10, bar 76.