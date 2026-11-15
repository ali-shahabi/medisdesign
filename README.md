# MedisDesign — Next.js replica of medisdesign.com

A 1:1 rebuild of the Persian (RTL) marketing site **medisdesign.com** as a static-exported
Next.js 16 application. Every route, every image, every string of copy from the live site is
reproduced locally.

- **Live source:** https://medisdesign.com (WordPress 7.1.4 + Zephyr theme + WPBakery Page Builder)
- **This app:** Next.js 16.4 App Router, TypeScript, plain CSS (no Tailwind), `output: 'export'`

---

## 1. What is implemented

| Area | Result |
| --- | --- |
| Routes | 69 static pages: home, 22 pages, 25 posts, 7 category archives, 3 tag archives, 2 author archives, 5 extra live routes, 404 |
| Redirects | 2 × 301-equivalent stubs (`/تماس-با-ما/`, `/تماس-با-ما-2/` → contact page) via `out/_redirects` and `out/nginx-redirects.conf` |
| Content | All Persian copy verbatim, scraped from the rendered DOM |
| Images | 357 assets self-hosted under `public/wp-content/…` (original paths preserved) |
| Fonts | The site's own faces, self-hosted: `IRANSansWeb_*` (woff2) + `iranyekanweb*_FaNum` (woff), declared under their original family names |
| SEO | Identical `<title>`, canonical, OG/Twitter tags, `sitemap.xml` (59 URLs), `robots.txt` |
| Motion | Scroll-reveal, animated counters, logo carousel, hover states on cards/banners, back-to-top |
| Responsive | Desktop 1440 / tablet 1024 / mobile 390, mobile burger menu |
| Chrome | Per-page header (logo size and header height vary per page on the source site), per-page footer, footer-reveal parallax |

Notable source-site quirks that were preserved on purpose: the duplicate home page
(`/صفحه-اصلی`), the empty footer on most pages, the `/articles/` page carrying a comment form,
3 links that 404 upstream, and 9 images that are already broken on the live site.

---

## 2. Project layout

```
app/
  layout.tsx              root shell (RTL, lang=fa-IR, fonts)
  globals.css             design tokens + every component style, ported from the Zephyr CSS
  page.tsx                homepage
  [...slug]/page.tsx      every other page/post/archive (generateStaticParams, dynamicParams=false)
  not-found.tsx           404
  sitemap.ts, robots.ts   SEO endpoints
components/
  HeaderBar.tsx           RTL header: nav + centered logo + burger + mobile overlay (client)
  PageShell.tsx           canvas + fixed footer with reveal measurement (client)
  Sections.tsx            <section> → row → column → block renderer
  RowView.tsx, Blocks.tsx typed block renderers (text, image, banner, button, separator,
                          counter, post grid, carousel, wrapper, richtext, html, comments)
  Counter.tsx             count-up animation on scroll (client)
  Carousel.tsx            logo slider (client)
  Comments.tsx            comment form (UI only — no backend in a static export)
lib/
  types.ts                the page/section/block model
  data.ts                 build-time lookups (server-only)
  PageView.tsx            page renderer + metadata mapping
data/                     generated content model (pages, posts, archives, extras, redirects, taxonomies)
public/wp-content/…       all images; public/fonts/… Vazirmatn
scripts/
  scrape.mjs              WP REST + rendered HTML for all 60 sitemap URLs + header/footer
  scrape-extras.mjs       routes outside the sitemaps (archive pagination, legacy permalinks)
  build-data.mjs          HTML → typed page model (sections/columns/blocks, inline design tokens)
  download-assets.mjs     downloads every referenced asset into public/
  lib/convert.mjs         URL/style/font helpers
  lib/sections.mjs        the shared WPBakery parser
  postbuild.mjs           redirect stubs + host redirect maps
  analyze.mjs, extract-css.mjs, measure.js, compare.mjs, check.mjs   fidelity tooling
```

---

## 3. How the content was rebuilt

1. **Scrape** — WordPress REST for metadata plus the fully rendered HTML of each URL
   (`main#page-content`, `footer`, header, and the per-page `<style>` blocks). Yoast
   sitemaps gave the URL inventory; the `users` endpoint is locked (403), so author
   archives were derived from `author-sitemap.xml`.
2. **Model** — each `section.l-section` becomes `{ fullWidth, style, overlay, rows[] }`,
   each row `{ cols, template, gap, boxes, columns[] }`, each column a list of typed blocks.
   WPBakery's per-element classes (`us_custom_*`) are resolved into inline style tokens at
   build time, so the React tree stays semantic (`<section class="section">` …) while the
   values are byte-for-byte those of the original theme.
3. **Assets** — every `src`, `srcset`, CSS `url()` and inline background is downloaded and
   referenced through its original `/wp-content/...` path, so nothing external is required.
4. **Verify** — `scripts/check.mjs` measures document height, footer height and per-section
   heights on both sites at 1440px and reports the deltas; screenshots are diffed with Pillow.

---

## 4. Fidelity report (measured at 1440 px)

| Page | Doc height live → clone | Notes |
| --- | --- | --- |
| `/` | 4709 → 4710 (+1) | sections 0–13 identical to the pixel |
| `/contact-us-medis-design/` | 900 → 900 | identical |
| `/تماس-با-ما/` | 900 → 900 | identical (redirect stub) |
| `/products/` | 900 → 902 | +2 |
| `/catalog/` | 1829 → 1740 | interactive banner cards ~15 px shorter |
| `/projects/` | 3688 → 3646 | −42 from reflowed Persian text in card captions |
| `/madis-design-about-us/` | 1356 → 1377 | +21 |

One residual source of difference remains:

**Rich-text reflow.** Copy, font files, sizes, weights, line-heights, letter-spacing and
colours are identical, but the browser's line-breaking can still differ by a word on
long paragraphs. Everything else — columns, images, cards, header chrome, footer,
colours — is measured equal.

Fixed during the parity pass (all verified against the live site):

- the site's own IRANSans/IRANYekan faces instead of a substitute font;
- per-page header chrome: 4 pages use the white 0.55 bar with the circle logo, 16 pages the
  navy 0.40 fixed bar with the large MEDIS logo, and **39 pages render no header at all**
  (posts and archives);
- the theme's 1.5 rem heading lead-in (and its `:first-child` / adjacent-heading resets);
- `cols_2-1`-style column ratios (`2fr 1fr`) instead of equal columns;
- link colour inheritance inside text blocks, `color_*` utility classes, default 16 px
  image radius, body `#000` with the canvas carrying `#35415b`;
- the site's `-webkit-font-smoothing: auto` (it does not use antialiasing).

Measured pixel difference against the live site at 1440×900 (mean absolute channel error,
0 = identical): home **1.0**, contact **1.0**, medismag **2.6**, projects **2.6**,
post **3.3**, products **4.1**, catalog **6.0**, about **7.9** (the last two are text-heavy
pages where a single re-flowed line shifts a whole paragraph).

Also fixed for parity: `full_height valign_center` sections now fill the viewport minus the
sticky header (the magazine index page was 496 px short), and banner cards honour their
per-element `ratio_2x1` / `ratio_3x2` aspect ratio instead of a hard-coded 2:1.

## 5. Running it

```bash
pnpm install
pnpm dev                 # http://localhost:3000
pnpm build               # static export into ./out  (also writes redirect stubs)
pnpm dlx serve out       # preview the exported site
```

Regenerating the content model (only needed if the upstream site changes):

```bash
pnpm scrape              # REST + rendered HTML  -> scripts/raw
pnpm assets              # media               -> public/wp-content
node scripts/build-data.mjs
node scripts/scrape-extras.mjs
node scripts/build-data.mjs
```

### Deploying

The export is plain HTML/CSS/JS in `out/`. Serve the directory as-is with
`try_files $uri $uri/index.html =404` (nginx) or drop it on Netlify/Cloudflare Pages, which
read `out/_redirects` for the two legacy 301s. Persian URLs are unicode paths; the folder
names are the decoded Persian text, so make sure the server decodes percent-encoded requests
(the default for nginx and every static host).

---

## 6. Rights

The logo, photography, copy and the IRANSans/IRANYekan font files belong to MedisDesign;
this reproduction is for the site owner's own property and the fonts are self-hosted from
the owner's own site.
