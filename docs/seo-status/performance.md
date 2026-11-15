# Performance & Core Web Vitals — medisdesign.com

**Snapshot:** 2026-11-12, 02:00–02:25 Asia/Tehran · **Target:** https://medisdesign.com (WordPress 7.1.4, Zephyr 8.32.1, WPBakery/Ultimate VC Addons 3.19.14, jQuery 3.7.1) · **Method:** read-only, no site/server/config changes.

**Label legend** — every number below is tagged:
`[FIELD]` real-user CrUX data · `[LAB]` measured in a controlled browser session · `[ESTIMATE]` derived arithmetic, not directly observed · `[BLOCKED]` could not be obtained.

---

## 0. Measurement fidelity — read this before the numbers

**`[BLOCKED]` PageSpeed Insights could not be used at all.** Every request to `www.googleapis.com/pagespeedonline/v5/runPagespeed` returns **HTTP 403** from this network (client IP `205.252.135.174`, AS34369 Shatel, Iran). The block is at the Google edge, not in the API key/quota path:

| Probe | Result |
|---|---|
| `www.googleapis.com/pagespeedonline/v5/runPagespeed` (4 URLs × 3 retries) | `403` on every attempt |
| `www.googleapis.com/discovery/v1/apis` (control, no auth needed) | `403` |
| `chromeuxreport.googleapis.com` | `403` |
| `pagespeed.web.dev` (front-end only) | `200` |
| Public relay `api.allorigins.win` → PSI | `522` |

Consequences, stated plainly: **there are no Lighthouse scores (performance / SEO / accessibility / best-practices) and no CrUX field data (LCP/INP/CLS p75) in this report.** The score columns are marked `n/a` rather than filled with invented values.

**Substitute:** a local lab harness driving the installed **Google Chrome 156.0.8078.80** over the DevTools Protocol, reproducing Lighthouse's conditions — mobile `412×823` @1.75 DPR, 4× CPU throttle, 1.6 Mbps / 150 ms RTT; desktop `1350×940`, 10 Mbps / 40 ms; cold cache, `Cache-Control: no-cache`. Full field-level metrics: LCP, FCP, CLS (session-window), TBT from long tasks, TTFB, request count, per-resource `transferSize`/`encodedBodySize`/`decodedBodySize`, and the LCP element.

**One caveat that matters:** under the throttled mobile profile a control page — `https://example.com`, a single **1,679-byte** HTML document — returned **FCP 9,356 ms / LCP 10,664 ms** `[LAB]`. The international path from this network adds a ~9 s floor that Lighthouse does not see from Google's infrastructure. So the throttled absolute numbers are **inflated and must be read as relative/upper-bound**, not as PSI equivalents. Every table therefore carries a second set of **unthrottled real-network** runs, which are the honest "what an Iranian mobile user gets" figures. Repeat runs also show large variance (home LCP 3,612 ms vs 8,536 ms), which is itself a property of the origin, not just the harness — see §3 TTFB.

---

## 1. Verdict

Measured from Iran, the homepage delivers **1.88 MB over 50 requests** with **9 render-blocking stylesheets and 5 parser-blocking scripts in `<head>`**, and its **HTML TTFB has a median of 3.10 s** (p90 3.50 s, max 6.93 s) against an origin hosted in Isfahan — server latency, not bytes, is the dominant cost `[LAB]`. Core Web Vitals are at **serious risk: LCP measured 3.61–8.54 s on mobile and 6.42 s on desktop on the real network** (target ≤2.5 s), while **CLS is excellent at ≤0.0078 and TBT is ≤59 ms** — so the JS bundle is not the problem, the critical path is. The fixable weight is concentrated and cheap: **460 KB of fonts, 60 % of it icon fonts**, **1.16 MB of images with zero next-gen formats**, and **108 KB gzip / 637 KB raw of blocking CSS** — the WebP conversion alone measured a **48.9 % saving** on this site's real images.

---

## 2. Lab scores table

Scores **`n/a`** — PSI returned 403 for all four URLs; no Lighthouse scoring pass was possible. Metrics below are measured.

| URL | Strategy | Perf / SEO / A11y / BP | LCP | CLS | TBT | FCP | TTFB |
|---|---|---|---|---|---|---|---|
| `/` | mobile, throttled `[LAB]` (2 runs) | n/a | **11,536 / 9,680 ms** | 0.0007 | 35 / 59 ms | 11,428 / 9,528 ms | 4,171 / 7,067 ms |
| `/` | mobile, **real network** `[LAB]` (2 runs) | n/a | **3,612 / 8,536 ms** | 0.0007 / 0 | 0 ms | 3,372 / 8,484 ms | 1,559 / 5,036 ms |
| `/` | desktop, throttled `[LAB]` | n/a | 20,124 ms | 0.0011 | 0 ms | 18,864 ms | 5,290 ms |
| `/` | desktop, real network `[LAB]` | n/a | 6,420 ms | 0.0014 | 0 ms | 6,092 ms | 3,734 ms |
| `/products/` | mobile, throttled `[LAB]` | n/a | 17,292 ms | 0.0007 | 23 ms | 12,720 ms | 7,412 ms |
| `/products/` | mobile, real network `[LAB]` | n/a | **8,476 ms** | 0.0007 | 0 ms | 7,848 ms | 5,149 ms |
| `/principles-of-office-design/` | mobile, throttled `[LAB]` | n/a | 9,736 ms | 0 | 46 ms | 9,736 ms | 7,452 ms |
| `/principles-of-office-design/` | mobile, real network `[LAB]` | n/a | 4,680 ms | 0.0078 | 0 ms | 4,664 ms | 1,022 ms |
| `example.com` (calibration) | mobile, throttled `[LAB]` | n/a | 10,664 ms | 0 | 0 ms | 9,356 ms | 9,268 ms |

CWV status against Google thresholds (LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1) — `[LAB]` proxy:

| Metric | Threshold | Measured | Status |
|---|---|---|---|
| LCP (mobile, real net) | ≤2.5 s | 3.6–8.5 s `[LAB]` | **Fail** (1.4–3.4× over) |
| LCP (desktop, real net) | ≤2.5 s | 6.4 s `[LAB]` | **Fail** |
| CLS | ≤0.1 | 0.0007–0.0078 `[LAB]` | Pass (14–140× margin) |
| TBT (INP proxy) | — | 0–59 ms `[LAB]` | Pass (main thread is idle) |
| INP p75 | ≤200 ms | `[BLOCKED]` no CrUX | unknown |

LCP element `[LAB]`, mobile: `<img class="attachment-full size-full" src="…/2025/05/01621651-1024x576.jpg">`, 90,472 B, 106,605 px². Desktop picks the full 1366×768 original (174,442 B) instead.

### 2a. SEO / accessibility audit values (recomputed from HTML, PSI scoring unavailable)

| Audit | Value `[LAB]` (from live HTML) | Result |
|---|---|---|
| `image-alt` | 30 `<img>`, **0 missing `alt`** — but **30/30 are `alt=""`** | Pass (attribute present); every content image is declared decorative → no image-search value |
| `link-name` | **4 of 18** links have no accessible name | **Fail** |
| Button names | 2 of 3 `<button>` potentially nameless | **Fail** |
| `heading-order` | 1 skip (h2 → h6); sequence starts `h1,h1,h2,h2,h6,h6,…` | **Fail** |
| `h1` count | **8 `<h1>`** on the homepage | Structural defect |
| Meta description | **0 found** | **Fail** |
| Canonical | **2 different tags**: `https://medisdesign.com/` **and** `https://medisdesign.com` | **Fail** (conflicting) |
| Title | 25 chars — `صفحه اصلی 2 - MedisDesign` | Fail (short; leftover "2") |
| `viewport` / `lang` / `dir` | `width=device-width, initial-scale=1` / `fa-IR` / `rtl` | Pass |
| Structured data | 1 `application/ld+json` block | Pass |
| `hreflang` | 0 | n/a (single-language) |

---

## 3. Byte weight and blocking resources `[LAB]`, measured, not estimated

### Per-page totals

| Page | HTML | CSS | JS | Fonts | Images | **Total** | Requests |
|---|---|---|---|---|---|---|---|
| `/` mobile | 123,366 raw / **18,920 gz** | **108,425** (9 files, 637,316 raw) | **124,313** (9 files, 440,575 raw) | **470,530** (10 files) | **1,161,887** (21 files) | **1,884,075 B = 1.80 MiB** | **50** |
| `/` desktop | 18,920 gz | 108,425 | 124,313 | 470,530 | 783,197 (21) | 1,505,385 B = 1.44 MiB | 50 |
| `/products/` mobile | 87,333 raw / 15,296 gz | 96,504 (5) | 111,237 (5) | **375,333 (6)** | 160,555 (3) | 758,925 B = 741 KiB | 20 |
| `/principles-of-office-design/` mobile | 55,939 raw / 13,267 gz | 96,504 (5) | 111,237 (5) | **226,598 (4)** | 20,005 (3) | 467,611 B = 457 KiB | 18 |

Fonts are **49.5 % of `/products/`** (375,333 / 758,925 B) and **48.5 %** of the blog post — on lighter templates the font payload outranks the content.

### Blocking resources

| Page | Render-blocking CSS | Parser-blocking JS in `<head>` | Sync JS in body | Defer / async | Inline `<style>` in head | Inline `<script>` in head |
|---|---|---|---|---|---|---|
| `/` | **9** `<link rel=stylesheet>`, all `media="all"`, all in `<head>` | **5** (jQuery 3.7.1 + 4 Ultimate VC Addons) | 2 (`magnific-popup`, `us.core.min`) | 1 (defer) | **8 blocks, 56,116 B = 45 % of the HTML** | 5 blocks, 2,182 B |
| `/products/`, blog post | 5 | 3 | — | — | — | — |

The critical path is measurable: on throttled mobile the **last blocking stylesheet finished at 11,163 ms and FCP fired at 11,428 ms** — CSS completion *is* the FCP gate. `[LAB]`

### Server & protocol facts (curl, n=12 samples each) `[LAB]`

| Measurement | min | median | mean | p90 | max |
|---|---|---|---|---|---|
| HTML TTFB, `/` (12 runs) | 1.02 s | **3.10 s** | 3.25 s | 3.50 s | **6.93 s** |
| TTFB, a **742-byte** static CSS (12 runs) | 0.17 s | 0.92 s | 1.43 s | 2.76 s | 4.51 s |

- Connection breakdown: DNS 3 ms, TCP connect 431 ms, **TLS 1.34 s**, TTFB 3.21 s → **server render ≈ 1.9 s** per uncached HTML request.
- Origin `195.28.169.68`, **Isfahan, Iran**, AS212216 Netafraz, nginx, HTTP/2. This is the *best-case* path (domestic), so Googlebot from a US IP measures worse.
- A 742-byte file returned in 8.31 s, then 3.40 s, then 1.24 s within 30 s — **extreme latency jitter**.
- Compression: **gzip only** (HTML 123,366 → 18,919 B). Brotli was offered via `Accept-Encoding: br` and **not used** `[LAB]`; a `gzip -9`-equivalent re-encode of the same HTML yields 18,772 B, so brotli would save roughly a further 10–15 % `[ESTIMATE]`.
- Caching: HTML has **no `Cache-Control`** header at all; static assets `max-age=1209600` (14 days). No `ETag`/`Last-Modified` on the document.
- Missing headers: `Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, CSP. `http://` → `https://` costs 1 redirect; `http://www.` costs 2 (~2 extra RTT per cold visit).

### Images `[LAB]`

30 `<img>` in the homepage markup: **20 JPG + 10 PNG, zero WebP/AVIF** in content (the only 3 `.webp` are favicons). 34 of 36 images are `loading="lazy"`; the LCP image correctly carries `fetchpriority="high"` + `loading="eager"` — but there is **no `<link rel=preload>`** (0 preload, preconnect, or dns-prefetch hints on the page).

Heaviest images on the page: 350,164 B (`…55651651651000221212-scaled.jpg`, 2560 px wide, below the fold), 246,032 B, 227,540 B, 202,280 B, 174,442 B.

Mobile oversize: a 412 px viewport at 1.75 DPR needs **721 px**; the LCP image's `srcset` jumps 600w → **1024w**, so the phone downloads **90,472 B** where a 768 w intermediate would be ≈55 KB `[ESTIMATE]`. `sizes="auto, (max-width: Npx) 100vw, Npx"` is used on 24 of 30 images — `auto` is unsupported outside Chromium, so Firefox/Safari fall back to `100vw` and pick desktop-width candidates.

**WebP saving, measured not assumed** — `[LAB]` six images downloaded from the live page and converted with `cwebp`:

| Image | Original | WebP q80 | Saving |
|---|---|---|---|
| `200651516514-1024x723.jpg` | 105,936 | 60,714 | 42.7 % |
| `0616516515-1024x723.jpg` | 102,504 | 57,428 | 44.0 % |
| `01621651-1024x576.jpg` (LCP) | 90,172 | 51,204 | 43.2 % |
| `20651651.png` | 71,109 | 24,652 | 65.3 % |
| `5116516549841-1024x723.jpg` | 68,038 | 29,858 | 56.1 % |
| `11981984-1024x723.jpg` | 66,118 | 29,884 | 54.8 % |
| **Combined** | **596,329** | **305,020** | **48.9 %** |

### Fonts `[LAB]` — 470,530 B across 10 files

| File | Bytes | Note |
|---|---|---|
| `material-icons.woff2` | **128,652** | 1 `material-icons` class in the HTML |
| `fa-solid-900.woff2` | 78,568 | `font-display:block` |
| `fa-brands-400.woff2` | **77,036** | `font-display:block` |
| `iranyekanweblightfanum.woff` | 34,241 | **legacy `.woff`**, not woff2 |
| `iranyekanwebboldfanum.woff` | 33,881 | **legacy `.woff`** |
| `IRANSansWeb_Light/UltraLight/Bold/Medium.woff2` | 115,348 (4 files) | — |
| `ult-silk.woff` | 2,804 | Ultimate VC icon font |

**Icon fonts total 284,256 B (60.4 %) for 4 FontAwesome + 1 Material Icons glyph in the markup** (`fa-regular-400.woff2`, a further 13,224 B, is declared inline but was not fetched in the measured run). `font-display` appears **0 times** in the 456,620-byte theme stylesheet and **0 times** in the 21,766-byte Persian font CSS; the 4 inline `@font-face` rules use **`font-display:block`** — the worst value, which hides text until the font loads or 3 s elapses.

---

## 4. Top 5 opportunities

| # | Opportunity | Measured value | Expected impact |
|---|---|---|---|
| 1 | **Origin/server latency** — no HTML cache, 1.9 s dynamic render, 1.34 s TLS, high jitter | HTML TTFB median **3.10 s**, p90 3.50 s, max 6.93 s `[LAB]`; TTFB is 33–82 % of total LCP time | Full-page cache + CDN edge: TTFB → sub-0.8 s, **LCP −1.5 to −3 s on every page** `[ESTIMATE]` |
| 2 | **9 render-blocking stylesheets** (108,425 B gz / 637,316 B raw), all `media=all` in `<head>`; last one ends at 11,163 ms vs FCP 11,428 ms | CSS completion *is* the FCP gate `[LAB]` | Inline critical CSS, defer the rest: **FCP −0.6 to −2 s** throttled, −300 to −700 ms real `[ESTIMATE]` |
| 3 | **460 KB of fonts, 60 % icon fonts, legacy `.woff`, `font-display:block`** | 284,256 B icon fonts for 5 icon references in the markup; 68,122 B of legacy `.woff`; 0 `font-display` declarations in CSS | Drop unused icon families + `swap`: **−250 to −300 KB** and removes invisible-text (FOIT) risk `[ESTIMATE]` |
| 4 | **Zero next-gen image formats** on 1,161,887 B of mobile images | WebP q80 measured **−48.9 %** on 6 real page images | **−568 KB on mobile** `[ESTIMATE]`, LCP image 90,472 → **51,204 B** `[LAB]`; add a 768 w candidate |
| 5 | **Per-page plugin payload** — `wp-ulike` CSS+JS, `slick`, `animate`, `magnific-popup` load on every template | `/products/` and blog post each still ship **96,504 B CSS + 111,237 B JS** for 1–3 images | Conditional loading: **−100 to −200 KB on non-home templates** `[ESTIMATE]` |

Note on what is *not* a problem: TBT 0–59 ms and raw JS 440,575 B mean the page **executes** cheaply; jQuery is not the bottleneck, the network path is.

---

## 5. Mobile-specific findings

- **Request count and weight do not shrink for mobile**: 50 requests / 1.80 MiB on a 412 px viewport — essentially the desktop payload (1.44 MiB) plus extra images pulled in as lazy ones entered the viewport.
- **LCP image is 1.4× oversized** for the device (1024 w served for a 721 px need), and 24 of 30 images use `sizes="auto, …100vw…"`, which non-Chromium mobile browsers resolve as `100vw` — guaranteeing desktop-width picks on iOS Safari/Firefox.
- **`document` height 8,204 px** with 36 images on mobile and 34 lazy — lazy-loading is correctly configured, so below-fold images do not compete with LCP.
- **Invisible-text risk on mobile:** `font-display:block` on the icon fonts plus zero `font-display` on the Persian families means first paint can show blank text for up to 3 s on a slow 3G/4G link.
- **PSI mobile-usability audits (tap targets, font-legibility, content-width) could not be run** `[BLOCKED]`. Structurally the viewport meta is correct (`width=device-width, initial-scale=1`), so no `viewport` failure is expected; tap-target compliance is unverified.
- Redirect tax on mobile: `http://www.` → 2 redirects before the HTML is even requested.

---

## 6. Replica comparison (`out/`, static Next.js export)

Static file analysis only — no server was started, so these are **file/`gzip -9` sizes, not a measured page load** `[ESTIMATE]`.

| Resource | Live (`/`, mobile) | Replica (`out/index.html`) | Delta |
|---|---|---|---|
| HTML | 123,366 raw / 18,920 gz | 87,106 raw / **9,796 gz** | **−48 %** |
| CSS | 9 files, 108,425 transfer / 637,316 raw | **1 file**, 20,461 raw / **4,567 gz** | **−96 %** |
| JS | 9 files, 124,313 transfer / 440,575 raw | 7 chunks, 601,658 raw / **185,480 gz** | **+49 %** |
| Render-blocking CSS | **9** | **1** | −8 |
| Parser-blocking JS in head | **5** | **0** (1 `async`… 6 `async` + 1 `noModule`) | −5 |
| Fonts | 470,530 B transferred (10 files) | **394,809 B on disk**, 12 files: **7 woff2 = 224,800 B**, **5 woff = 170,009 B** | see note |
| Image formats | JPG/PNG, `srcset` present (3–5 candidates) | **JPG/PNG, `srcset` absent on all 30 images** | **regression** |
| `next/image` | — | `images.unoptimized: true` in `next.config.ts` → **no responsive `srcset`** | — |
| `font-display` | 0 in CSS, `block` inline | **`swap` on every `@font-face`** | improvement |

**Image regression, quantified** `[ESTIMATE]` — same 17 images the live mobile run actually fetched, priced at full size from `out/wp-content`:

| | Bytes |
|---|---|
| Live, responsive (`srcset` picked 600–1024 w) | 989,503 |
| Replica, unoptimized (full-size originals) | **1,572,824** |
| Ratio | **1.59× heavier** (individual images up to 2.19× — `200651516514.jpg` 106,236 → 232,953 B) |

Whole-home-page `out/wp-content`: **356 images, 25.0 MB** (207 JPG, 91 WebP, 58 PNG) — WebP files exist but the homepage references **none** of them.

**Verdict on the replica:** it wins decisively on the **render path** (1 blocking CSS vs 9, 0 parser-blocking head scripts vs 5, `font-display:swap`, HTML 48 % smaller) and loses on **bytes** (JS +49 %, images +59 %). Net transfer for the comparable image set is roughly a wash — **≈1.77 MB before fonts vs live's 1.71 MB including its 460 KB of fonts** — so the replica is *better for FCP/LCP-discovery* and *worse for total mobile bytes*. Two things to fix before shipping: enable `next/image` optimisation (or a build-time WebP/srcset step, since `unoptimized:true` disables it), and add `srcset`/`sizes` to the 30 content images. Note the 91 WebP files already in `wp-content` could be referenced with `<picture>` immediately.

---

## 7. Three concrete fixes, in priority order

**Fix 1 — Put a cache and an edge in front of the origin.**
Serve the 3 templates as full-page cache with `Cache-Control: public, max-age=600, s-maxage=86400, stale-while-revalidate=86400`, terminate TLS at the edge, and enable keep-alive/HTTP3. Measured baseline: HTML TTFB median **3.10 s** (max 6.93 s), of which ~1.9 s is server render and 1.34 s is TLS; TTFB currently accounts for 33–82 % of total LCP time `[LAB]`. **Expected impact: TTFB → sub-0.8 s, LCP −1.5 to −3 s on all three templates**, the single largest CWV gain available.

**Fix 2 — Take the 9 stylesheets and 5 head scripts off the critical path.**
Inline the above-the-fold critical CSS (the 8 existing inline blocks already total 56,116 B, so the inlining infrastructure exists), then load `Zephyr/css/style.min.css` (81,417 B), `animate-rtl` (6,313 B), `slick-rtl` (1,817 B) and the 4 remaining VC/plugin sheets with `media="print" onload="this.media='all'"`; move the 5 parser-blocking head scripts (jQuery + Ultimate VC params/slick/appear/slick-custom) to `defer`. Measured baseline: the **last blocking stylesheet finished at 11,163 ms and FCP fired at 11,428 ms** `[LAB]` — CSS completion is literally the FCP gate. **Expected impact: FCP −0.6 to −2 s throttled / −300 to −700 ms real, and LCP follows FCP.**

**Fix 3 — Cut bytes where they are unambiguous: WebP/AVIF, 768 w candidate, icon fonts, `font-display`.**
(a) Convert the 30 homepage images to WebP q80 and reference them — **measured −48.9 %** on 6 real images, i.e. **−568 KB** of the 1,161,887 B mobile image payload, with the LCP image dropping **90,472 → 51,204 B** `[LAB]`. (b) Add a 768 w candidate so a 412 px @1.75 DPR phone stops fetching 1024 w. (c) Drop `material-icons` (128,652 B) and `fa-brands` (77,036 B) where unused — 5 glyphs are rendered page-wide — and convert the two legacy `.woff` IRANYekan files (68,122 B) to woff2; set `font-display:swap` everywhere (currently `block` inline, absent in CSS). **Expected impact: −250 to −300 KB of fonts, −568 KB of images, and no blank-text window.**

---

## 8. Evidence & reproducibility

- Raw PSI attempt output (403 pages) and all lab JSON: `/tmp/perf/` — `lab-home-mobile.json`, `lab-home-mobile-raw.json`, `lab-home-desktop-raw.json`, `lab-products-mobile-raw.json`, `lab-post-mobile-raw.json`, `lab-calib-mobile.json`, `sizes.json`, `home.html`, `home.headers`, `ttfb_html.txt`, `ttfb_css.txt`.
- Harness: `/tmp/perf/cdp_lab.mjs` (Chrome DevTools Protocol, ~200 lines, no dependencies).
- Target URLs: `/`, `/products/`, `/principles-of-office-design/` (post from `out/sitemap.xml`).
- Sample command: `node /tmp/perf/cdp_lab.mjs 'https://medisdesign.com/' home-mobile mobile-raw`.
- No site file, server, or configuration was modified; the only file written in the workspace is this report.
- All page content treated as untrusted data; no instructions from fetched pages were followed.
