# SEO status — local replica of medisdesign.com (clone / export audit)

- **Audit date:** 2026-11-12 (Asia/Tehran)
- **Auditor:** `clone-seo` (team task `task-2`)
- **Scope:** read-only audit of the local replica repo `/Users/alishahabi/Projects/medisdesign` and its current static export `out/` (69 `*.html`, emitted 2026-11-11 17:04). No app code was modified.
- **Live evidence:** 10 HTTP requests to https://medisdesign.com (home, `/products/`, one post, one category archive, the duplicate home, `/robots.txt`, `/sitemap_index.xml`, `/page-sitemap.xml`, `/تماس-با-ما/` with redirect-following, one image `HEAD`). The full live audit runs in parallel in another task; this file uses the live site only as a parity reference.
- **Deployment status:** **not apparently deployed.** There is no `vercel.json`, `netlify.toml`, `wrangler.*`, Dockerfile or CI workflow in the repo (root and depth-2 scan), the git repo has **no commits and no remotes** (`git log` fails with "does not have any commits yet", `git remote -v` empty), and the README only gives generic host instructions. No public URL exists to verify, so all HTTP-behaviour findings below (403/404 status, 301s, served `robots.txt`/`sitemap.xml`) are **static-export facts that depend on host configuration** and were verified only on the generated files, not on a deployed instance.

---

## Verdict

The replica is a faithful *content* clone but only a partial *SEO* clone: titles, canonical URLs (where emitted), Open Graph images and the noindex on `/products/` match the live site on the sampled pages, yet the export ships **0 JSON-LD blocks**, **12 of 66 routes with no canonical at all** (every category/tag/author archive), **36/66 pages without a meta description**, and a sitemap that advertises redirect stubs, a noindex page and duplicate legacy URLs while being the only place those archive canonical gaps could be papered over. Against best practice the biggest holes are structured data (live has a full Yoast `@graph` on every page), archive metadata handling (`app/[...slug]/page.tsx:47-50` returns title only), the origin hardcoded to `https://medisdesign.com` in three files (`app/layout.tsx:6`, `app/robots.ts:8`, `app/sitemap.ts:7`) which makes preview/other-host deployments self-canonicalise to production, and an sitemap that is 66 URLs of decoded Persian with one hardcoded `lastmod` for all of them. The 69-route / 59-URL figures in the README are both inaccurate (actual: 69 HTML **files** = 66 routes + 3 not-found artifacts; 66 sitemap URLs), and the replica's redirect handling is a meta-refresh stub with a *relative* canonical and no `noindex`, not a 301.

---

## Live-vs-replica parity table

### A. Per-page head parity (5 sampled live URLs, tag by tag)

| Page | Signal | Live (2026-11-12) | Replica `out/` | Parity |
|---|---|---|---|---|
| `/` | title | `صفحه اصلی 2 - MedisDesign` | same | ✅ |
| | meta description | absent | absent (`app/page.tsx:4` → `metadataFor` returns `description: undefined`) | ✅ |
| | canonical | **2 tags** (`https://medisdesign.com/` + `https://medisdesign.com`) | 1 tag `https://medisdesign.com/` | ✅ (cleaner than live) |
| | `og:image` | `…/2025/05/01621651.jpg` | same | ✅ |
| | `og:image:width/height` | absent | absent | ✅ (both missing) |
| | `og:description` | absent | absent | ✅ |
| | robots | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` | `index, follow` | ❌ directives lost |
| | twitter | `card` only | `card` + `title` + `image` | ✅ (replica adds tags) |
| | JSON-LD | 1 × Yoast `@graph` (WebPage, ReadAction, BreadcrumbList, ListItem, WebSite, SearchAction, EntryPoint, PropertyValueSpecification, Organization, ImageObject) | **0** | ❌ |
| | H1 count | 8 | 8 | ✅ (poor semantics inherited) |
| `/products/` | title | `محصولات - MedisDesign` | same | ✅ |
| | description | absent | absent | ✅ |
| | canonical | 2 tags (`…/products` + `…/products/`) | 1 tag `…/products/` | ✅ |
| | robots | `noindex, follow` | `noindex, follow` | ✅ |
| | `og:image` | `…/2025/05/11981984.jpg` | same | ✅ |
| | JSON-LD | 1 block | 0 | ❌ |
| | H1 | 6 | 6 | ✅ |
| one post `/what-is-sound-and-sound-insulation/` | title | `صدا و عایق صدا چیست؟ - MedisDesign % صدا و عایق صدا چیست؟` | same | ✅ (verbatim, incl. the `%` quirk) |
| | description | same 155-char scraped text | same | ✅ |
| | canonical | 2 tags (same path) | 1 tag (same path, ASCII so decoded form) | ✅ |
| | `og:image` | `…/2024/01/what-is-sound-and-sound-insulation01.jpg` | same URL — **but live returns HTTP 404 for that file**, replica also has no local copy | ❌ (shared upstream breakage) |
| | robots | long form + `max-image-preview:large` | `index, follow` | ❌ |
| | JSON-LD | 1 block | 0 | ❌ |
| | H1 | 0 | 0 | ✅ |
| `/category/مقالات/` (archive) | title | `بایگانی‌های مقالات - MedisDesign` | same | ✅ |
| | description | absent | **`به شرکت مدیس دیزاین خوش آمدید`** (layout fallback leaks in) | ❌ replica adds a duplicate generic description |
| | canonical | **present** (decoded + percent-encoded) | **absent** | ❌ |
| | `og:title` | present | **absent** (no OG tags at all) | ❌ |
| | `og:image` | absent | absent | ✅ |
| | robots | explicit long form | no tag (defaults to index) | ~ equivalent |
| | JSON-LD | 1 block | 0 | ❌ |
| | H1 | 0 | 0 | ✅ |
| `/صفحه-اصلی/` (duplicate home) | title | `صفحه اصلی - MedisDesign` | same | ✅ |
| | canonical | present (decoded + encoded, self) | present (encoded, self) | ✅/⚠️ duplicate-home cluster kept |
| | description | absent | absent | ✅ |
| | robots | long form | `index, follow` | ❌ directives lost |

### B. SEO endpoint parity

| Endpoint | Live | Replica | Parity |
|---|---|---|---|
| `robots.txt` | Yoast block: `User-agent: *` / `Disallow:` (empty) / `Sitemap: https://medisdesign.com/sitemap_index.xml` (173 B) | `User-agent: *` / `Allow: /` / `Sitemap: https://medisdesign.com/sitemap.xml` (69 B) | ✅ functionally (allow-all, self-referential sitemap); ❌ not byte-parity; no `Host:`/`clean-param` on either |
| sitemap | 5 Yoast sub-sitemaps under `/sitemap_index.xml`; per-URL `lastmod`; percent-encoded `<loc>`; **22 pages + 25 posts + 7 cats + 3 tags + 2 authors = 59 URLs**; `image:image` entries; no `priority`/`changefreq` | one `out/sitemap.xml`, 66 URLs, **decoded Persian** `<loc>`, 1 hardcoded `lastmod`, static `priority`/`changefreq`, no image entries | ❌ (details below) |
| 404 | WordPress 404 page | `out/404.html` (+ duplicate `404/index.html`, `_not-found/index.html`), `noindex`, no canonical, generic layout description | ⚠️ content parity not checked; markup is sane |
| `/تماس-با-ما/` | **301 → `/contact-us-medis-design/`** (confirmed by curl redirect chain) | meta-refresh + JS stub `out/تماس-با-ما/index.html`, relative canonical, **no noindex**, title `انتقال…`, listed in `sitemap.xml` | ❌ soft redirect, sitemap-polluting |
| `/تماس-با-ما-2/` | 301-equivalent per `data/redirects.json` assumption | same stub pattern | ❌ |

---

## Per-signal findings

### 1. Export inventory (numbers)

Parsed all **69** exported `*.html` with Python `html.parser` (excluding `_next`, `fonts`, `wp-content`).

| Bucket | Count | Notes |
|---|---|---|
| `*.html` files in `out/` | **69** | README says "69 routes" |
| Route pages (dirs with `index.html`) | **66** | = 69 − 3 not-found artifacts |
| `404.html` + `404/index.html` + `_not-found/index.html` | 3 | All `noindex`; `/404/` and `/_not-found/` are additionally crawlable duplicate 404 documents |
| home | 1 | `/` |
| content pages (non-home) | 22 | includes `/products/` (noindex) and `/سیاست-حفظ-حریم-خصوصی/` |
| posts rendered | 24 | 25 in `data/posts.json`; one post path is shadowed by a page (see §12) |
| category archives | 7 | |
| tag archives | 3 | |
| author archives | 2 | |
| archive pagination | 3 | `/author/mahdi-moradlu/page/2|3/`, `/category/مقالات/page/2/` |
| legacy `/medismag/<slug>/` | 2 | near-duplicates of two posts |
| redirect stubs | 2 | `/تماس-با-ما/`, `/تماس-با-ما-2/` |
| **Sum** | **66** | matches route dirs |

**Sitemap cross-check:** `out/sitemap.xml` contains **66 `<loc>` URLs, all 66 map to an exported route** — 0 routes missing from the sitemap, 0 sitemap URLs missing from the export. README's "59 URLs" equals the live Yoast inventory (22 page + 25 post + 7 category + 3 tag + 2 author = 59), not the generated file; README's "69 routes" equals the HTML file count, while its own route enumeration sums to 66. `lib/data.ts:64` (`allContentPaths`) is the single source for the sitemap.

**Duplicate route:** `/طراحی-آکوستیک-معماری` exists in both `data/pages.json` and `data/posts.json`. `app/[...slug]/page.tsx:59-63` resolves pages before posts, so the **post version is unreachable** and its post metadata is silently discarded (published separately), while `generateStaticParams` de-duplicates (`app/[...slug]/page.tsx:31-38`).

### 2. Titles — 66 pages

- Present: **66/66 (100%)**; **62 unique** (93.9%).
- **4 duplicated groups (verbatim):**
  1. `جاذب های صوتی و انواع آن - MedisDesign` — `/acoustic-absorbers-and-its-types/` **and** `/medismag/acoustic-absorbers-and-its-types/`
  2. `بیس ترپ و انواع آن - MedisDesign بیس ترپ: انواع، کاربردها و اهمیت در بهبود کیفیت صدا` — `/bass-trap-and-its-types/` **and** `/medismag/bass-trap-and-its-types/`
  3. `عایق صوتی: راهکارهای مؤثر برای کاهش آلودگی صوتی در ساختمان‌ها` — `/آکوستیک/` **and** `/عایق-صوتی/` (two different posts, distinct body copy)
  4. `انتقال…` — `/تماس-با-ما/` **and** `/تماس-با-ما-2/`
- The home title is the live WordPress default **`صفحه اصلی 2 - MedisDesign`** — same as live, unique in the replica (not one of the duplicates), but it is a placeholder-style title and the only "2"-suffixed page; noted as Low.
- Brand suffix `… - MedisDesign`: **47/66**; 19 titles lack it (incl. both stubs, `articles`, `contact-us-medis-design`, `principles-of-*`, `projects`, `sydney-opera-house`, `bass-trap` pair).
- Length (characters): min **7**, avg **38.3**, max **84**. `>60`: **6**; `>70`: **2**.
  - 84 — `bass-trap-and-its-types` and its `/medismag/` twin
  - 63 — `principles-of-acoustic-design`
  - 61 — `articles`, `/آکوستیک/`, `/عایق-صوتی/`
  - These mirror live titles (data scraped from Yoast), so they are a parity-preserved SERP-truncation risk, not a regression.

### 3. Meta descriptions — 30/66 present (45.5% coverage)

- **36/66 missing (54.5%)**; only **18 distinct** descriptions exist.
- **12 archives share the identical generic string** `به شرکت مدیس دیزاین خوش آمدید` (the `layout.tsx:8` description) — caused by `app/[...slug]/page.tsx:47-50` returning only `{ title }` for archives, which lets the root description be inherited; every other page passes `description: undefined` (`lib/PageView.tsx:37`) which *suppresses* the same fallback. Net effect: 12 duplicate descriptions, 24 pages with none.
- **Second duplicate pair:** `با استفاده از عایق صوتی مناسب، می‌توانید آلودگی صوتی را در ساختمان‌ها کاهش دهید…` on `/آکوستیک/` and `/عایق-صوتی/`.
- Length among the 30 present: min **29**, median **130**, max **207**; **9 >160** chars (SERP truncation), **13 <70** chars (thin).
- Data-level supply: `data/pages.json` descriptions **6/23**, `data/posts.json` **12/25**, `data/archives.json` **0/12**, `data/extras.json` **0/7** (`meta` of the 7 extras contains only `title`).

### 4. Canonicals — 52/66 absolute, 12 missing, 2 relative

- **52/66 (78.8%)** absolute, correct host, correct path after percent-decoding (0 wrong-host, 0 path mismatches, 0 trailing-slash mismatches).
- **12/66 missing** — every category (7), tag (3) and author (2) archive, even though `data/archives.json` carries a valid `meta.canonical` for all 12; the archive branch in `app/[...slug]/page.tsx:47-50` drops it.
- **2/66 relative** — the redirect stubs' canonical is `href="/contact-us-medis-design/"` (`scripts/postbuild.mjs:16`); should be absolute and paired with `noindex`.
- **Encoding split:** 32 canonicals are percent-encoded (all Persian pages; built from `model.path` at `lib/PageView.tsx:42`), 20 are decoded (home + ASCII paths). The scraped `meta.canonical` in `data/*.json` is **60/60 decoded** and is never used. Live emits both decoded and encoded canonical variants; the sitemap uses decoded Persian. So three URL spellings of the same resource coexist across canonical / sitemap / internal links.
- Duplicate-home pair: `/` and `/صفحه-اصلی/` are *different* homepages (16 vs 19 sections, different copy) and both self-canonical + both in the sitemap; `/صفحه-اصلی/` has **zero inbound internal links**.

### 5. Open Graph — 42/66 images, 14 pages with no OG at all

| Tag | Coverage |
|---|---|
| `og:title` | 52/66 (78.8%) |
| `og:url` | 52/66 |
| `og:type` | 52/66 — **always `website`**, even for posts (live uses `article` on posts) |
| `og:site_name`, `og:locale` | 52/66 (`MedisDesign`, `fa_IR`) |
| `og:image` | **42/66 (63.6%)** — 24 pages without; **17 of the 42** point at files **not present in the export** |
| `og:description` | 18/66 (27.3%) — auto-derived by Next only when a `description` exists |
| `og:image:width`, `og:image:height` | **0/66** (live is also missing these) |
| Pages with **no OG tags at all** | **14** (12 archives + 2 redirect stubs) |
| `og:image` not on production host | 0 |

- Archives: `data/archives.json` has `ogImage` for 6/12 archives, but `app/[...slug]/page.tsx:47-50` never emits `openGraph`, so those images are dropped.
- **Missing OG assets:** 20 `og:image` values in the data have no local file (`public/wp-content` holds 357 assets, none of these among them) — 10 pages, 8 posts (one of which is the path shadowed by a page) and 2 gravatar author avatars. **17 distinct rendered routes** have an `og:image` pointing at a missing file (e.g. `/2024/10/Architectural-Acoustic-Design.webp`, `/2024/10/Asset-3.webp`); the 2 gravatar images are never emitted because of the archive metadata bug. One of the missing files, `…/2024/01/what-is-sound-and-sound-insulation01.jpg` (post `/what-is-sound-and-sound-insulation/`), returns **HTTP 404 on live today**, so that post's social card is broken in both live and clone.
- `og:type` for posts is `website` (`lib/PageView.tsx:44`); no `article:published_time` / `article:modified_time` even though `data/posts.json` has `date`/`modified`.

### 6. Twitter cards — 52/66

- `twitter:card` = `summary_large_image`: **52/66**; `twitter:title`: 52; `twitter:description`: 18; `twitter:image`: 42; `twitter:site`: **0**.
- 14 pages (12 archives + 2 stubs) have no twitter tags (same branch as OG).
- Replica emits *more* twitter tags than live (live has only `card` + `twitter:label/data` pairs).

### 7. Robots meta — 46 index/follow, 1 noindex, 19 absent

| Value | Count |
|---|---|
| `index, follow` | 46 |
| no `<meta name="robots">` (defaults to index,follow) | 19 (12 archives, 3 pagination, 2 legacy medismag, 2 stubs) |
| `noindex, follow` | 1 (`/products/`, matches live) |
| `noindex` (not-found) | 3 artifacts |
| any `max-image-preview:large` | **0** |

`lib/PageView.tsx:52-57` reduces the scraped robots string to two booleans, so the live site's `max-image-preview:large, max-snippet:-1, max-video-preview:-1` is lost on all 46 pages (parity regression that weakens Discover/large-thumbnail eligibility). There is **no strict-robots policy** for tag/author archives or pagination (`noindex` would be defensible for thin/paginated archives; live keeps them indexable).

### 8. Structured data — 0/69

- `<script type="application/ld+json">`: **0 occurrences in the whole export** (`0/66` routes, `0/3` not-found artifacts).
- Microdata (`itemscope`/`itemtype`): **0**. Hreflang/alternate: **0**.
- No JSON-LD builder exists anywhere in `app/`, `components/`, `lib/` (grep for `ld+json|schema.org|Breadcrumb|breadcrumb` returns nothing).
- Live has exactly **1 `@graph` block per page** on every sampled page; home graph types: `WebPage`, `ReadAction`, `BreadcrumbList`, `ListItem`, `WebSite`, `SearchAction`, `EntryPoint`, `PropertyValueSpecification`, `Organization`, `ImageObject`.
- Therefore missing vs live: **Organization** (name/url/logo), **WebSite + SearchAction**, **WebPage**, **BreadcrumbList**, **Article/BlogPosting** (posts), **Product/ItemList** (catalog/products). This is the single largest gap and it is invisible in the rendered page (no JS needed — pure markup).

### 9. Document head chrome

| Signal | Result |
|---|---|
| `<html lang dir>` | 69/69 `lang="fa-IR" dir="rtl"` ✅ |
| charset | 69/69 `<meta charSet="utf-8">` ✅ |
| viewport | **67/69** — missing on the 2 hand-built redirect stubs (`scripts/postbuild.mjs:11-21`) |
| favicon 32×32 + 192×192 + apple-touch-icon | **67/69** (`app/layout.tsx:9-15`); missing on the 2 stubs |
| `rel="manifest"` / theme-color | 0 (low priority) |
| canonical count per page | exactly 1 where present (better than live's 2) |
| `link rel="preload"` as image | harmless, not SEO |

### 10. `robots.txt`

`out/robots.txt` (69 B, generated from `app/robots.ts:5-9`):

```
User-Agent: *
Allow: /

Sitemap: https://medisdesign.com/sitemap.xml
```

- Points at the file that exists in the export (`out/sitemap.xml`) — self-consistent. Live points to `/sitemap_index.xml`; the replica has no sitemap index (fine for 66 URLs, but not 1:1).
- No `Disallow` for `/_next/` — **correct**: assets must stay crawlable for rendering; no accidental blocking.
- No `Host:` and no `clean-param` (Yandex extensions) — acceptable, optional.
- If the export is hosted anywhere other than `medisdesign.com`, the sitemap URL (and every canonical) still points at production — see §12.

### 11. `sitemap.xml` (11,971 B / 11,380 chars, 66 URLs)

| Property | Value |
|---|---|
| URLs | **66** — exactly the 66 exported routes (0 missing/extra) |
| Persian `<loc>` encoding | **0 percent-encoded; all raw UTF-8 Persian** (live: 16/22 page-sitemap URLs percent-encoded; sitemap protocol recommends percent-encoded URLs) |
| `lastmod` | **1 distinct value for all 66**: `2025-10-01T13:13:00.000Z` (`app/sitemap.ts:8`) — copied from live page-sitemap's own lastmod |
| `changefreq` | **1 distinct value**: `monthly` ×66 |
| `priority` | 2 values: `1` for `/`, `0.7` for the other 65 |
| `<image:image>` | **none** (live page-sitemap has image entries) |
| sitemap index / self reference | none; `robots.txt` is the only pointer |
| URLs that should not be advertised | `/products/` (noindex), `/تماس-با-ما/`, `/تماس-با-ما-2/` (soft redirects), `/medismag/acoustic-absorbers-and-its-types/`, `/medismag/bass-trap-and-its-types/` (legacy duplicates of two posts), 3 `/page/N/` pagination URLs, and `/صفحه-اصلی/` (duplicate-home family) |
| Indexable URL count | 66 − 1 noindex − 2 stubs = **63**; of those **12 lack a canonical**; only **45** are clean, self-canonical, non-duplicate, non-paginated content URLs |

Live page-sitemap excludes `/products/` precisely because it is noindex (verified), so the replica's inclusion is a divergence, not parity.

### 12. 404 and redirect stubs

- `out/404.html` + `out/404/index.html` + `out/_not-found/index.html` are three copies of the same not-found document: `<meta name="robots" content="noindex">`, title `صفحه پیدا نشد - MedisDesign`, **generic layout description** (`به شرکت مدیس دیزاین خوش آمدید`), **no canonical**, viewport present, contains an H1 (`۴۰۴`) and a link home. Serving `/404/` and `/_not-found/` as normal 200 URLs (host-dependent) creates two crawlable soft-404 duplicates; they are not in the sitemap.
- Both redirect stubs (`scripts/postbuild.mjs:6-25`) emit: `title="انتقال…"` (7 chars), **relative canonical** `href="/contact-us-medis-design/"`, `<meta http-equiv="refresh" content="0; url=…">`, a JS `location.replace`, **no `robots` meta (indexable)**, **no viewport**, **no description/favicon**, and they are **listed in `sitemap.xml`**. Live answers these URLs with a real `301` (curl followed to `/contact-us-medis-design/`), so on live they are not indexable at all.
- `out/_redirects` (116 B) syntax `/<source>/    /<target>/    301` is valid Netlify/Cloudflare-Pages line syntax; portability caveats: (a) it is ignored by plain nginx/S3/GitHub Pages, where the stub HTML is served with HTTP 200; (b) the non-ASCII source paths are not URL-encoded (Cloudflare Pages has historically required encoded paths — verify on target host); (c) it covers the trailing-slash request only.
- `out/nginx-redirects.conf` (214 B) uses `location = /%D8%AA%D9%85%D8%A7%D8%B3-…/` percent-encoded literals, while nginx matches `location` strings against the **normalized, percent-decoded** URI; the decoded Persian request is therefore unlikely to hit these locations (needs verification on nginx).
- The `data/redirects.json` stubs overwrite the exported *content* pages of the same paths (extras scrape produced real contact-page content under `/تماس-با-ما/`, then postbuild replaced it), which is why sitemap `<lastmod>`/URLs still list them.

### 13. Code-level gaps and portability

- **Hardcoded origin, single point of failure:** `app/layout.tsx:6` (`metadataBase`), `app/robots.ts:8` (sitemap URL) and `app/sitemap.ts:7` (`origin`) all hardcode `https://medisdesign.com`. There is no env var. Consequences: (i) any preview/second-domain deploy emits canonicals pointing at production, so the preview instance cannot be indexed as itself; (ii) `robots.txt` advertises a sitemap on a host where it may not exist; (iii) the export is not portable as a generic template.
- **No dynamic OG image:** all `og:image` values are static scraped paths (`lib/PageView.tsx:49`); no `opengraph-image.tsx`/`ImageResponse`, no per-page generated 1200×630 cards, no default social image at layout level, so 24 pages have no image and 20 point at non-exported files.
- **No JSON-LD builders / breadcrumb schema:** see §8; `app/layout.tsx` has no `<script type="application/ld+json">`, and no page component emits one.
- **Archive metadata:** `app/[...slug]/page.tsx:47-50` returns `{ title }` only → archive pages lose canonical, description, OG, robots (12 routes).
- **Canonical source of truth:** `lib/PageView.tsx:42` rebuilds the canonical from `model.path` and ignores `model.meta.canonical` (data has 60/60 valid canonicals) and never normalises encoding; `lib/PageView.tsx:52-57` truncates robots directives.
- **Sitemap dataset:** `lib/data.ts:64` concatenates pages + posts + archives, including the two redirect stubs, the noindex page, the legacy `medismag` duplicates, pagination and the duplicate home; `app/sitemap.ts:7-15` maps it 1:1 with static `lastmod`/`priority`/`changefreq`.
- **No `alternates.languages` / hreflang:** correct for a single-language site (`fa-IR` only); documented, no action.
- **Trailing slash policy:** `next.config.ts:9` `trailingSlash: true`; the export's directories are decoded Persian names; static hosts decode percent-encoded requests so `/…/` and `/%D9%85…/` both resolve. Canonicals always add `/` (`lib/PageView.tsx:42`), but 52 data canonicals are stored decoded and some live canonicals omit the slash — spellings vary across signals.
- **Unicode URL policy:** mixed, mirroring live: header/nav hrefs are lowercase percent-encoded (`data/site.json` → `%d8%ae…`), body links are mostly raw Persian `<Link>`-to-`href` copies (live also mixes absolute + relative + raw + encoded), sitemap decoded, canonical encoded. Functionally equivalent on static hosts, but any host that does not decode or normalise will see several URL variants.
- **Route collision:** `/طراحی-آکوستیک-معماری` page vs post (see §1) — one post unreachable; no 404, no redirect, no canonical to the page.

### 14. Internal linking, crawl graph, orphan pages, broken links

- Internal `<a href>` links checked: **636**; **3 broken targets (4 link occurrences)** — these are the "3 links that 404 upstream" preserved on purpose:
  - `/services/` (from `/acoustic-absorbers-and-its-types/` and `/medismag/acoustic-absorbers-and-its-types/`; the exported archive lives at `/category/services/`)
  - `/acoustics-science-sound-quality/` (from `/محصولات-آکوستیک-دکوراتیو/`)
  - `/09123108464` (phone number used as a path, from `/محصولات-اکوستیکی-چوب/`; should be `tel:`)
- **12 routes have zero outbound internal links** (no header, no footer, no content links): `category/services`, `category/معماری`, `principles-of-acoustic-design`, `principles-of-office-design`, `sydney-opera-house`, `آیکن-بانک-پاسارگاد`, `آیکن-بیمه-دی`, `آیکن-مرکز-مدیریت-حوزه-های-علمیه`, `بنیاد-علوی`, `ساختمان-مرکزی-بیمه-دی`, `سیاست-حفظ-حریم-خصوصی`, `سینمای-داتین`.
- **17 real routes have zero inbound HTML links (orphans reachable only via sitemap):** all **12 archives**, the 3 pagination URLs, `/صفحه-اصلی/`, `/سیاست-حفظ-حریم-خصوصی/`. (Plus `/404`, `/_not-found` artifacts.)
- Chrome coverage explains this: only **21/66** routes render a header (17 pages + 4 posts) and **23/66** a non-empty footer (`components/HeaderBar.tsx`, `components/PageShell.tsx:36-38`); archives and most posts have no header/footer, matching the live site's quirk.
- Homepage is the most linked target (25 inbound); `/contact-us-medis-design/` 22, `/products/` 20.

### 15. Images: alt text, dimensions, missing assets

| Metric | Value |
|---|---|
| `<img>` tags in route pages | **209** |
| non-empty `alt` | **102 (48.8%)** |
| `alt=""` (empty, decorative or missing copy) | **107 (51.2%)** |
| missing `alt` attribute entirely | **0** |
| `width` + `height` present (both) | **161 (77.0%)**; 48 (23.0%) lack at least one dimension → CLS risk |
| missing local image files referenced by HTML | **9** (across 4 pages) — matches README's "9 images broken on live": `Acoustic-absorbers-and-their-types02/03/04.jpg`, `what-is-sound-and-sound-insulation01/02.jpg`, `Diffuser-panels01–04.jpg` |
| `og:image` URLs with no local file | **20** (§5) |
| Alt coverage outliers | home **1/30** non-empty alt (29 raw photos with `alt=""`), `صفحه-اصلی` 2/20, `انتقال-صدای-دیواره-ها` 0/7, `خدمات-سالن-همایش` 1/8, `خط-مشی-مدیس` 1/6, `سند-راهبردی-میداس` 1/6 |

Alt values are scraped verbatim (`components/Blocks.tsx:74` passes `block.alt`; grid items use `imageAlt || title || ''` at `:156`; carousel uses `it.title` at `:177`), so the 51.2% empty rate is inherited from the source rather than introduced; still, many empty-alt images are informative (hero/project photography) on the home page.

### 16. Headings (H1)

- **45/66 pages have zero `<h1>`** (all 12 archives, all 24 posts, most pages without header/hero heading, etc.).
- **1/66 has exactly one `<h1>`** (`/articles/`).
- **20/66 have more than one `<h1>`**; worst: `/catalog/` **12**, `/medismag/…/` index **11**, home **8**, `/آکوستیک/` 8, `/خدمات-سالن-همایش/` 7, `/عایق-صوتی/` 7, `/پوشش-های-ضد-حریق/` 7, `صفحه-اصلی` 7.
- This mirrors live on the samples (home 8 vs live 8, `/products/` 6 vs 6, post 0 vs 0, category 0 vs 0), i.e. the replica reproduces the theme's WPBakery heading markup faithfully. It is a semantic/a11y gap but **not a replica regression**; fixing it is a deviation from live and should be coordinated with the redesign.

### 17. Accessibility/SEO-adjacent extras

- Header nav has `aria-label` on both `<nav>`s and the burger (`components/HeaderBar.tsx:85,111,118`); logo `<img alt="مدیس دیزاین">` with width/height — good.
- No `<main>` landmark issue (all routes render `<main className="main">`), one `lang`/`dir` on `<html>` only.
- No `theme-color`, no `<meta name="author">`/`keywords` (not required).

---

## Prioritized fix list

> Description of fixes only — **no code was changed** in this audit. File:line points at the exact place to change.

### High

1. **Add JSON-LD.** Emit a site-wide `@graph` (Organization with logo, WebSite + SearchAction, WebPage, BreadcrumbList) from `app/layout.tsx:18-26`, per-post `Article`/`BlogPosting` with `datePublished`/`dateModified` from `data/posts.json` via `lib/PageView.tsx:35-58`, and `Product`/`ItemList` for `/products/` and `/catalog/`. Today **0/66** pages have structured data vs 1 Yoast graph on every live page. Needs no client JS.
2. **Stop dropping archive metadata.** In `app/[...slug]/page.tsx:47-50` build archive `Metadata` like pages: canonical from `model.path`, `openGraph` (title/description/`ogImage` when present, 6/12 archives have one), `robots`, and a real description. Today 12/66 sitemap URLs have no canonical and all 12 inherit the generic layout description.
3. **Clean the sitemap before it is submitted.** `app/sitemap.ts:7-15` + `lib/data.ts:64`: exclude `/تماس-با-ما/`, `/تماس-با-ما-2/` (stubs), `/products/` (noindex), the 3 `/page/N/` pagination URLs (or keep them with self-canonical), the 2 legacy `/medismag/` duplicates (canonicalise them to the post URLs), and consolidate or drop `/صفحه-اصلی/`; percent-encode Persian `<loc>` values; use per-URL `lastmod` from `data/*.json` (`modified`/`date`) instead of the single `2025-10-01T13:13:00.000Z`.
4. **Single origin constant.** Replace the three hardcodings `app/layout.tsx:6`, `app/robots.ts:8`, `app/sitemap.ts:7` with one `SITE_URL` (e.g. `NEXT_PUBLIC_SITE_URL`, fallback `https://medisdesign.com`) so a preview/staging deploy does not self-canonicalise to production and `robots.txt` points at a sitemap that exists on that host.
5. **Fix description supply and duplicates.** Data: 36/66 pages have no description and 12 archives share `به شرکت مدیس دیزاین خوش آمدید`. Add `meta.description` for the 17 pages/13 posts/12 archives lacking one (or generate a fallback from `excerpt`/first paragraph in `lib/PageView.tsx:37`, `app/[...slug]/page.tsx:47-50`), and rewrite the duplicated pair on `/آکوستیک/` + `/عایق-صوتی/` and the `/medismag/` twins.
6. **Resolve duplicate titles/content pairs.** 4 duplicated title groups (§2) — canonicalise or `noindex` `/medismag/acoustic-absorbers-and-its-types/` and `/medismag/bass-trap-and-its-types/` to their canonical post URLs (or remove them from the export), and de-duplicate the `عایق صوتی…` pair. Keep the `transport…` stubs out of canonical metadata (they redirect).
7. **Make redirect stubs safe** (`scripts/postbuild.mjs:11-23`): absolute canonical (`https://medisdesign.com/contact-us-medis-design/`), add `<meta name="robots" content="noindex">`, `<meta name="viewport">`, a real title/description, and remove these URLs from the sitemap. Prefer a server-level 301 where the host allows; fix the nginx map (`scripts/postbuild.mjs:32`) to use decoded Persian locations (or regex locations) and the `_redirects` non-ASCII/Trailing-slash caveat.
8. **Preserve the robots directives** the live site ships: `lib/PageView.tsx:52-57` should reuse the scraped `model.meta.robots` string (or at least append `max-image-preview:large, max-snippet:-1, max-video-preview:-1` for indexable pages) instead of collapsing to two booleans.

### Medium

9. **OG completeness.** Add a layout-level default `openGraph.images` fallback in `app/layout.tsx:5-16` (24/66 pages have no `og:image`), emit archive OG from `data/archives.json` (6/12 available), download or generate the 18 production OG assets + 2 gravatar avatars locally (or replace with a brand card), add `og:image:width/height`, and set `og:type: 'article'` + `article:published_time`/`modified_time` for posts (`lib/PageView.tsx:43-50`; live uses `article` on posts).
10. **Unify URL encoding.** Pick one spelling for canonical/sitemap/internal links (currently 32 encoded canonicals, decoded sitemap, mixed links; `lib/PageView.tsx:42`, `app/sitemap.ts:11`, `data/site.json`). Percent-encoded everywhere is the safest sitemap-spec choice; also decide whether `model.meta.canonical` (60 stored values) or `model.path` is the source of truth.
11. **Internal link graph.** 12 routes are dead ends and 17 routes are orphans (§14). Add a footer/breadcrumb block to headerless templates (posts/archives currently render no nav: `components/PageShell.tsx:36-38`), link archives from posts (category/tag/author), and fix the 3 broken targets: `/services/` → `/category/services/`, `/acoustics-science-sound-quality/` (remove or map), `/09123108464` → `tel:`.
12. **Alt text + CLS.** 48.8% non-empty alt, home 1/30; add alt from scraped captions/titles and a fallback in `components/Blocks.tsx:74,156,177`; pass width/height (or CSS aspect-ratio) for the grid/carousel images at `components/Blocks.tsx:156,177` so 48 missing dimensions stop shifting layout.
13. **H1 discipline (deviation from live, do with redesign).** 45/66 pages have no H1 and 20/66 have several (max 12). Map the first visible heading block to `<h1>` and demote the rest in `components/Sections.tsx`/`components/Blocks.tsx` heading rendering; coordinate because live has the same defect and pixel parity is a stated goal.
14. **Not-found hygiene.** Three 404 artifacts inflate the file count (69 vs 66 routes); ensure the host serves `404.html` with a 404 status and does not expose `/404/` or `/_not-found/` as 200 pages (already `noindex`); document the required `try_files $uri $uri/index.html =404` in the deploy notes (`README.md` deploy section).
15. **No-index decisions.** `/products/` is `noindex, follow` (live parity, and linked from the main nav) yet appears in the sitemap; tag/author archives and pagination are indexable with no unique descriptions (thin). Decide a policy (exclude from sitemap, canonicalise pagination) and record it.

### Low

16. **Sitemap signal noise.** Drop static `priority` (`0.7` ×65, `1` ×1) and `changefreq` (`monthly` ×66) — live's Yoast sitemap omits both — and add `<image:image>` entries for pages with images (`app/sitemap.ts:12-14`).
17. **Title length.** Trim the two 84-char titles (`bass-trap` pair), 63-char `principles-of-acoustic-design`, 61-char trio, and give the 19 un-suffixed titles a brand suffix policy (47/66 have one today).
18. **`/صفحه-اصلی/` duplicate home.** It is self-canonical, in the sitemap, and has zero inbound links; keep for parity or canonicalise to `/` and decide whether it stays in the sitemap (`data/pages.json`, `app/sitemap.ts`).
19. **Redirect stub chrome** (see High 7) and the relative canonical are the only canonical-encoding outliers; also add `viewport`/favicon — the two stubs are the only 2 of 69 files without them.
20. **PWA/meta niceties:** `manifest.webmanifest`, `theme-color`, optional `twitter:site` — none are SEO blockers.
21. **No hreflang** — correct for a monolingual `fa-IR` site; explicitly leave absent rather than adding hreflang for a single locale.
22. **Route collision** `/طراحی-آکوستیک-معماری` (page + post): choose one model and delete the shadowed entry from `data/posts.json` (or merge its canonical), so future route generation/sitemap maintenance cannot regress.

---

## Method & evidence limits

- Local: parsed all 69 `out/*.html` with Python `html.parser` (head tags, JSON-LD, lang/dir, viewport, icons, body `<h1>`/`<img>`/`<a>`), XML-checked `out/sitemap.xml`, read `out/robots.txt`, `out/_redirects`, `out/nginx-redirects.conf`, `out/404.html`, both stub files, and the source files cited above. Counts are static-export facts.
- Live: 10 requests on 2026-11-12 (home, `/products/`, one post, one category archive, duplicate home, `robots.txt`, `sitemap_index.xml`, `page-sitemap.xml`, one redirect-follow to contact, one image `HEAD`). Live canonical duplication, Yoast `@graph` types, exclusion of `/products/` from `page-sitemap.xml`, percent-encoded sitemap locs and the `تماس-با-ما` 301 were verified directly.
- The replica is **not deployed** (no commit, no remote, no host config); 404/301/canonical *status-code* behaviour and the sitemap/robots URLs as served cannot be verified publicly. All server-dependent items are marked as host-configuration dependent.
- This is a read-only audit: no file other than `docs/seo-status/clone.md` was written, and no build/dev server was run (the existing export was audited as-is).
