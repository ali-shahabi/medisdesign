# Live-site SEO audit — medisdesign.com

| | |
| --- | --- |
| **Audited** | 2026-11-12, ~02:02–02:32 Asia/Tehran (server clock `Wed, 11 Nov 2026 22:32 GMT`) |
| **Target** | `https://medisdesign.com` (WordPress 7.1.4, Zephyr 8.32.1, WPBakery, Yoast SEO Premium 28.3 / Yoast SEO 28.8, `fa_IR`, RTL) |
| **Method** | `curl` HTTP/2 over TLS, sequential requests (~115 total, 0.3–0.5 s spacing; no parallel bursts). HTML/XML parsed with Python stdlib. Raw snapshots cached in `/tmp/liveseo/` (`pages/p01…p59.html`, child sitemaps, headers, 404/search/products pages). |
| **Coverage** | `robots.txt`, `sitemap_index.xml`, all 5 child sitemaps (59 entries), **every sitemap URL fetched** (59 GETs), 3 non-sitemap nav URLs, 9 image URLs, `/feed/`, `/wp-json/`, `/wp-login.php`, `/xmlrpc.php`, 404 and `?s=` pages, HTTP/HTTPS/www/trash-slash variants, home headers ×3 timing samples. |
| **Not verified** | Google index status / which canonical Google picks, GSC data, crawl logs, HTTP/3 (local curl lacks `--http3`; no `Alt-Svc` header; no HTTPS/SVCB DNS record returned), paginated-archive canonicalisation (only status + `rel=next` checked). |
| **Safety note** | All fetched page content was treated as untrusted data. Nothing on the site was modified; every request was a read. |

---

## 1. Summary verdict

The crawl layer is fundamentally healthy — `robots.txt` allows everything, all **59 sitemap entries return 200**, HTTPS/www/trailing-slash redirects are single-hop and a real 404 is returned for missing URLs — but the **on-page layer is broken on almost every template**: **58/58 pages carry two conflicting canonical tags**, **40/58 (69 %) have no meta description**, and **38/58 have no H1** while 19 have 5–14 H1s (mostly footer widget labels) and exactly one page has a single H1.

The highest-impact defects are self-inflicted: the homepage is still titled **"صفحه اصلی 2"**, a second indexable homepage (`/صفحه-اصلی/`) sits in the sitemap with a self-canonical, the primary **"محصولات" nav item points at a `noindex` page that is excluded from the sitemap**, and the 9 images that 404 are the only images on 3 posts — they are also those posts' `og:image` and are still listed in the XML sitemap's image entries.

Delivery is acceptable but not tuned: HTTP/2 + gzip only (no Brotli), no HSTS or any security header, no HTML cache headers, and **TTFB measured 2.25 s / 8.62 s on the homepage** across three samples. Structured data is valid Yoast output but thin (no `sameAs`/`address`/`contactPoint`, no `Product`, a `SearchAction` for a search that has no UI anywhere on the site).

---

## 2. Scorecard

| Area | Status | Evidence |
| --- | --- | --- |
| Crawl access (`robots.txt`) | ✅ OK | 200, 173 B; `User-agent: *` / `Disallow:` (allow-all) / `Sitemap: https://medisdesign.com/sitemap_index.xml`; no crawl-delay, no blocked directories |
| Sitemap discovery & status | ✅ OK | `sitemap_index.xml` 200 with 5 children; `/sitemap.xml` → **301** → `/sitemap_index.xml` (`x-redirect-by: Yoast SEO`); all **59/59** entries 200 |
| Sitemap accuracy | ⚠️ Warning | 59 entries / 58 unique (one URL in two sitemaps); 9 image entries 404; 4 empty archives listed; `/products/` missing (because noindex) |
| HTTP→HTTPS, www, trailing slash, 404 | ✅ OK | `http://` → 301 `https://`; `https://www.` → 301 non-www (`http://www.` = 2 hops); `/products` → 301 `/products/`; missing URL = **HTTP 404** with 404 template |
| Canonical tags | ❌ Fail | **2 canonical tags on 58/58 pages**, different values (Yoast percent-encoded + trailing slash vs Zephyr theme decoded, no slash); `/products/` has only the theme one |
| `<title>` | ⚠️ Warning | Median 35 chars, max **84**; 1 exact duplicate pair; 2 malformed duplicated titles; 10/58 without brand; home title = **"صفحه اصلی 2 - MedisDesign"** |
| Meta description | ❌ Fail | **18/58 present (31 %), 40 missing**; median 162 chars; **9 over 160**; home/`/products/`/all archives missing |
| Open Graph / Twitter | ⚠️ Warning | `og:image` 47/58, `og:description` 25/58, `twitter:card` 58/58 but **`twitter:image` 0/58**; every page emits **duplicate** `og:title`/`og:url`/`og:type`/`og:locale`/`og:site_name`; 3 posts' `og:image` = 404 |
| Structured data | ⚠️ Warning | 1 valid Yoast JSON-LD block/page (no second schema plugin); `Organization` lacks `sameAs`/`address`/`contactPoint`/`telephone`; `Article` has **`description` 0/27** and `image` on 23/27; no `Product`/`LocalBusiness`; `SearchAction` target is `noindex` + canonical→home |
| H1 / heading hierarchy | ❌ Fail | **38/58 with zero H1**; 19 with 5–14 H1 (6 are footer widget titles); 1 with exactly one; post titles rendered as `<h4>`; archive titles never appear as headings |
| Image alt text | ❌ Fail | 197 `<img>` on 58 pages; 0 missing the attribute but **136 (69 %) empty `alt=""`**; homepage **30/30 empty**; posts have English alts |
| Internal linking | ⚠️ Warning | **3 internal links 404**; 12 URLs have 0 internal links; posts average 3.3 internal links; `/articles/` has 1 |
| Content depth | ❌ Fail | **7 pages render zero text** (6 icon/project pages + contact), 22 URLs < 300 chars of main text, 2 image-only document pages |
| Content freshness | ⚠️ Warning | Newest post lastmod **2025-04-07 (583 days)**; newest page **2025-10-01 (406 days)**; author sitemap 2026-08-24 |
| Indexability of key pages | ❌ Fail | Main nav "محصولات" → `/products/` = **`noindex, follow`**, absent from sitemap; duplicate homepage `/صفحه-اصلی/` indexable with self-canonical |
| Site search | ❌ Fail | 0 search forms on 58 pages; `?s=` works (10 results for "آکوستیک") but is `noindex` + canonical→home; schema advertises it anyway |
| Delivery & security headers | ⚠️ Warning | HTTP/2 ✅, gzip only, no Brotli; **no HSTS, no CSP, no X-Content-Type-Options, no Referrer-Policy, no HTML Cache-Control**; assets cached 14 days |
| Server performance | ⚠️ Warning | TTFB home **2.25 s / 8.62 s**, post 3.55 s (3 samples); 9 CSS + 10 head scripts + 8 inline styles before content |
| Bot-facing exposure | ⚠️ Warning | WordPress 7.1.4 + WPBakery in `generator`; `EditURI`/RSD advertises XML-RPC (nginx returns 403); `/wp-json/` index 446,739 B; `/wp-login.php` 200; users endpoint 403 |

---

## 3. Sitemap inventory & indexability

### 3.1 Files

| Resource | Status | Size | Notes |
| --- | --- | --- | --- |
| `/robots.txt` | 200 | 173 B | Yoast block only: `User-agent: *`, empty `Disallow:` → **no path is blocked**, sitemap declared |
| `/sitemap_index.xml` | 200 | 908 B | 5 children (post, page, category, post_tag, author) |
| `/sitemap.xml` | **301** | 0 B | → `https://medisdesign.com/sitemap_index.xml` (`x-redirect-by: Yoast SEO`) |
| `/sitemap_index.xml/` | 200 | — | Trailing-slash duplicate of the index (cosmetic, 2 URLs for 1 sitemap) |

### 3.2 URL count per child sitemap

| Child sitemap | `<url>` entries | Newest `lastmod` | Age of newest | Median age |
| --- | --- | --- | --- | --- |
| `post-sitemap.xml` | **25** | 2025-04-07 | **583 d** | 662 d |
| `page-sitemap.xml` | **22** | 2025-10-01 | **406 d** | 584 d |
| `category-sitemap.xml` | **7** | 2025-04-07 | 583 d | 628 d |
| `post_tag-sitemap.xml` | **3** | 2025-04-07 | 583 d | 583 d |
| `author-sitemap.xml` | **2** | 2026-08-24 | 79 d | 79 d |
| **Total** | **59 entries / 58 unique URLs** | — | — | — |

Inventory reconciles exactly: **25 posts + 23 pages + 7 categories + 3 tags + 2 authors = 60 URLs**; the sitemaps expose 59 entries / 58 unique because `/products/` (the 23rd page) is `noindex` and therefore omitted, and one URL is listed twice (below).

### 3.3 Status of every sitemap URL

All **59/59 entries returned HTTP 200** when fetched directly (no redirect, no 404). Non-200 list: **empty**.

| Kind | Count | Status |
| --- | --- | --- |
| Posts | 25 | 200 |
| Pages | 22 | 200 |
| Category archives | 7 | 200 |
| Tag archives | 3 | 200 |
| Author archives | 2 | 200 |
| **Total** | **59** | **0 non-200** |

### 3.4 Sitemap defects (numbers)

1. **Duplicate entry across sitemaps — 1 URL.** `https://medisdesign.com/طراحی-آکوستیک-معماری/` appears in **both** `post-sitemap.xml` (lastmod 2024-10-07) and `page-sitemap.xml` (lastmod 2025-04-06). The URL renders the **page** (JSON-LD is `WebPage`, no `Article`), so the post that owns the same slug is not reachable at any URL.
2. **9 sitemap `image:loc` entries point to 404s.** post-sitemap declares 36 image entries; the 9 broken files (§5.2) are exactly the entries for 3 posts: `acoustic-absorbers-and-its-types/` (3/3 broken), `diffuser-panels/` (4/4), `what-is-sound-and-sound-insulation/` (2/2).
3. **Empty archives listed.** `/category/services/` (18 chars of text, 0 images, 0 internal links), `/category/معماری/` (same), `/tag/services/` (20 chars), `/author/postman/` (7 chars) — all 200, all `index,follow`, all in sitemaps.
4. **One real page is missing from the sitemap because it is accidentally `noindex`:** `/products/` returns 200 and sits in the primary nav on every page, but is `noindex, follow` and absent from `page-sitemap.xml`.

### 3.5 Duplicate homepage

| | `https://medisdesign.com/` | `https://medisdesign.com/صفحه-اصلی/` |
| --- | --- | --- |
| Status / robots | 200 · `index, follow, …` | 200 · `index, follow, …` |
| `<title>` | صفحه اصلی 2 - MedisDesign | صفحه اصلی - MedisDesign |
| Canonicals | `https://medisdesign.com/` **and** `https://medisdesign.com` | `https://medisdesign.com/صفحه-اصلی/` **and** encoded no-slash |
| In sitemap | yes (lastmod 2025-06-12) | yes (lastmod 2025-04-07) |
| Main text | 931 chars | 3,356 chars |
| Images | 66 URL refs (30 `<img>`) | 54 URL refs (21 `<img>`), 24 shared |
| Canonicalised to `/`? | — | **No — self-referencing** |

The two pages are not byte-identical (word-set Jaccard 0.146, 24 shared images out of 96 unique) but they are two competing homepage variants, both indexable, both self-canonical, both in the sitemap. Nothing signals which one should rank.

---

## 4. Head-tag audit per template

All sampled templates were fetched live. "Canon" = number of `<link rel="canonical">` tags.

### 4.1 Titles and descriptions

| Template (URL) | `<title>` (raw) | len | meta description | len |
| --- | --- | --- | --- | --- |
| Home `/` | `صفحه اصلی 2 - MedisDesign` | 25 | **missing** | — |
| Page `/madis-design-about-us/` | `درباره ما - MedisDesign` | 23 | **missing** | — |
| Products `/products/` | `محصولات - MedisDesign` | 21 | **missing** | — |
| Post `/acoustic-absorbers-and-its-types/` | `جاذب های صوتی و انواع آن - MedisDesign` | 38 | `جاذب های صوتی * جاذب هادارای ساختاری هستند … قانون بقای انرژی،` (auto-excerpt, truncated mid-sentence) | 120 |
| Category `/category/مقالات/` | `بایگانی‌های مقالات - MedisDesign` | 32 | **missing** | — |
| Tag `/tag/آکوستیک/` | `بایگانی‌های آکوستیک - MedisDesign` | 33 | **missing** | — |
| Author `/author/mahdi-moradlu/` | `mahdi moradlu, نویسنده در MedisDesign` | 37 | **missing** | — |
| Articles `/articles/` | `پوشش‌های ضد حریق و راهکارهای طراحی آکوستیکی برای فضاهای اداری` | 61 | present | 162 |
| Catalog `/catalog/` | `کاتالوگ - MedisDesign` | 21 | present | 68 |
| Contact `/contact-us-medis-design/` | `شرکت مدیس دیزاین \| پیشگام در طراحی آکوستیک و الکتروآکوستیک` | 58 | present | 140 |
| 404 `/this-page-does-not-exist-12345/` | `صفحه پیدا نشد - MedisDesign` | 27 | **missing** | — |

**Title statistics (58 unique URLs):** min 21 / median **35** / max **84** chars; **5 titles > 60 chars** (84, 63, 61, 61, 61); **48/58 contain "MedisDesign"**, **10/58 have no brand suffix** (e.g. `راهنمای طراحی و ساماندهی عملکردهای اداری…`, `اپرای سیدنی: …`, `شرکت مدیس دیزاین | …`); 46 use the `" - MedisDesign"` suffix, the custom ones use `|` or nothing.

Title problems found in the full inventory:

- **1 exact duplicate title + description pair:** `/عایق-صوتی/` and `/آکوستیک/` share both `عایق صوتی: راهکارهای مؤثر برای کاهش آلودگی صوتی در ساختمان‌ها` (61 chars) and an identical 176-char description.
- **2 malformed/duplicated titles** (both 84/57 chars, phrase repeated inside `<title>`):
  - `/bass-trap-and-its-types/` → `بیس ترپ و انواع آن - MedisDesign بیس ترپ: انواع، کاربردها و اهمیت در بهبود کیفیت صدا` (**84 chars**)
  - `/what-is-sound-and-sound-insulation/` → `صدا و عایق صدا چیست؟ - MedisDesign % صدا و عایق صدا چیست؟` (stray `%` separator)
- **Homepage title leaks WordPress's duplicate-page counter:** `صفحه اصلی 2` — the page object is literally named "صفحه اصلی 2", so the brand's most important title carries a meaningless "2".
- **`/articles/` mismatch:** the URL is the magazine/blog index slug, but its title and description are about *fireproof coatings*; the page renders 1 H1, 0 images and a comment form.
- **`/products/` (noindex) title is only "محصولات"** — no category or service modifier, 21 chars.

**Description statistics (58 unique URLs):** **18 present (31 %)**, **40 missing (69 %)**; lengths min 68 / median 162 / max **207**; **9 over 160 chars** (`acoustic-wall-panels` 164, `bass-trap…` 176, `principles-of-acoustic-design` 170, `sydney-opera-house` 182, `عایق-صوتی` 176, `آکوستیک` 176, `articles` 162, `محصولات-اکوستیکی-چوب` 207, `projects` 175). 14 of the 18 are raw post excerpts, several truncated mid-sentence (the post example above even contains a typo produced by copying: `جاذب هادارای`).

### 4.2 Canonicals, robots, social tags

| Template | Canon tags | Canonical values (exact) | robots meta |
| --- | --- | --- | --- |
| Home | **2** | `https://medisdesign.com/` · `https://medisdesign.com` | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| Post | **2** | `https://medisdesign.com/acoustic-absorbers-and-its-types/` · `https://medisdesign.com/acoustic-absorbers-and-its-types` | same |
| Category | **2** | `https://medisdesign.com/category/مقالات/` · `https://medisdesign.com/category/%d9%85%d9%82%d8%a7%d9%84%d8%a7%d8%aa` | same |
| Tag | **2** | `https://medisdesign.com/tag/آکوستیک/` · `https://medisdesign.com/tag/%d8%a2%da%a9%d9%88%d8%b3%d8%aa%db%8c%da%a9` | same |
| Author | **2** | `https://medisdesign.com/author/mahdi-moradlu/` · `…/mahdi-moradlu` | same |
| `/products/` | **1** | `https://medisdesign.com/products` (theme only; Yoast omits its tag on noindex) | **`noindex, follow`** |
| 404 | 1 | canonical = the requested missing URL | `noindex, follow` |
| `?s=آکوستیک` search | 1 | `https://medisdesign.com` (search page canonicalised to home) | `noindex, follow` |

- The two canonical tags are emitted by two layers: **Yoast** (percent-encoded path, trailing slash) and the **Zephyr theme** (decoded path, no trailing slash). This is the "second SEO layer" — it is **not** a second schema plugin (§5.1), it is theme head output. For ASCII URLs the two differ only by trailing slash; for Persian URLs they are different strings for the same resource.
- **Every one of the 58 sitemap URLs is `index, follow`** — no sitemap-vs-noindex conflict exists. The only `noindex` URLs are `/products/`, the 404 template and the search template.
- No `hreflang` anywhere (correct — single `fa_IR` locale), no `meta keywords`, no `google-site-verification`, no `X-Robots-Tag` response header.

**Open Graph / Twitter inventory (home vs post):**

| Tag | Home | Post | Site-wide count |
| --- | --- | --- | --- |
| `og:locale` | fa_IR **×2** | fa_IR **×2** | 2 per page (theme + Yoast) |
| `og:type` | website **×2** | article **×2** | 2 per page |
| `og:title` | `صفحه اصلی 2` **+** `صفحه اصلی 2 - MedisDesign` | `جاذب های صوتی و انواع آن` **+** `… - MedisDesign` | 2 per page |
| `og:url` | `https://medisdesign.com/` **+** `https://medisdesign.com` | `…/acoustic-absorbers-and-its-types/` **+** no-slash variant | 2 per page |
| `og:site_name` | MedisDesign ×2 | MedisDesign ×2 | 2 per page |
| `og:image` | `…/2025/05/01621651.jpg` — **1366×768, 174,142 B** | `…/Acoustic-absorbers-and-their-types02.jpg` — **404** | 47/58 pages |
| `og:description` | missing | present (120, excerpt) | 25/58 |
| `twitter:card` | `summary_large_image` | `summary_large_image` | **58/58** |
| `twitter:image` | missing | missing | **0/58** |
| `twitter:title` / `twitter:description` | missing | missing | 4/58 · 3/58 |
| `twitter:label1/data1` | missing | `Written by` / `mahdi moradlu` | 43/58 pages |
| `twitter:label2/data2` | missing | `Est. reading time` / **`52 دقیقه`** | posts only |

Also present on every page: 2–3 RSS `<link rel="alternate">` (`/feed/`, `/comments/feed/`, per-post comments feed), 2 oEmbed alternates (JSON + XML), `<link rel="shortlink">`, a JSON alternate to `/wp-json/wp/v2/…`, 3 favicons (32×32, 192×192, apple-touch 180×180, all `.webp`), and **2 `generator` metas: `WordPress 7.1.4` and `Powered by WPBakery Page Builder`**.

`twitter:image` never being emitted is a systemic gap; the `twitter:data2` reading time ("52 دقیقه") contradicts the JSON-LD `wordCount: 112` and is cosmetic-level.

---

## 5. Structured data

### 5.1 Graph shape

**Exactly one JSON-LD block per page** (Yoast's `yoast-schema-graph`). There is **no duplicate schema graph from a second plugin** — the duplicate canonicals/OG tags come from the Zephyr theme, not from another SEO extension. `@type` coverage per template:

| Template | `@type` nodes present |
| --- | --- |
| Home | `WebPage`, `BreadcrumbList`, `WebSite`, `Organization` (+`ImageObject` logo) |
| Page (about, catalog, contact, products) | `WebPage`, `BreadcrumbList`, `WebSite`, `Organization` |
| Post (24 reachable) | `Article`, `WebPage`, `Person`, `CommentAction`, `BreadcrumbList`, `WebSite`, `Organization` — 27 `Article`/`TechArticle` graphs in total |
| Two "product" pages | `Article` unexpectedly (`/محصولات-اکوستیکی-چوب/`, `/محصولات-آکوستیک-دکوراتیو/`) |
| `/articles/` | `TechArticle` (page carrying the magazine title) |
| Category / tag (10) | `CollectionPage`, `BreadcrumbList`, `WebSite`, `Organization` |
| Author (2) | `ProfilePage`, `Person`, `BreadcrumbList`, `WebSite`, `Organization` |
| 404 | `WebSite`, `Organization` only (no `WebPage`) |
| Search | `CollectionPage` + `SearchResultsPage` |

### 5.2 Missing / invalid fields

| Node | Present | Missing (recommended) |
| --- | --- | --- |
| `Organization` (`#organization`) | `name`, `url`, `logo` (600×406 `.webp`), `image` | **`sameAs`, `address`, `contactPoint`, `telephone`, `email`, `description`** — the footer publishes `021-26413369`, `09386038003` and one Instagram profile link, none of it in schema |
| `WebSite` | `name`, `url`, `description`, `inLanguage`, `publisher` | — |
| `WebSite.potentialAction` | `SearchAction` → `https://medisdesign.com/?s={search_term_string}` | **Target is unusable as a search box:** 0 search forms on 58 pages, `/?s=` returns a `noindex` page canonicalised to the homepage. (Verified the endpoint does return results — 10 post results for `آکوستیک` — but no user can reach it.) |
| `Article` (27 graphs) | `headline` 27/27, `datePublished` 27/27, `author` 27/27 (Person `mahdi moradlu`, gravatar `d=mm`), `publisher` 27/27, `dateModified` 26/27, `image` 23/27 (`#primaryimage` entity resolves), `mainEntityOfPage`, `articleSection: [medismag]`, `wordCount: 112` | **`description` 0/27**; `image` missing on 4; one post (unmodified) has no `dateModified` |
| `Person` | `name`, `image`, `url` | `sameAs`, `description` |
| `BreadcrumbList` | Home: **1 item** (`خانه`); Post: 2 (`خانه > post`); Category: 2 (`خانه > مقالات`); Author: 2 (`خانه > بایگانی‌ها برای mahdi moradlu`) | Post breadcrumb omits the category; home breadcrumb of one item is meaningless; author crumb name is a machine-generated string |
| `Product` / `Offer` / `LocalBusiness` | **absent** | The commercial pages (`/products/`, 6 product/service pages, `/catalog/`) have no product or price markup and the company has no `LocalBusiness` node despite a physical address in the footer |

No use of `service`/`aggregateRating`; no `Organization` `logo` mismatch (file exists).

---

## 6. Content & template quality

### 6.1 Headings (H1 and order)

| H1 count | Pages | Which |
| --- | --- | --- |
| **0** | **38/58** | all 12 category/tag/author archives, 21 of 25 posts, and 5 pages (`سیاست-حفظ-حریم-خصوصی/` + the four `انتقال-صدای…/` pages) — i.e. every template whose title is not a WPBakery/footer heading block |
| 1 | 1 | `/articles/` only |
| 5–14 | 19 | home (8), contact (5), catalog (12), projects (14), product/service pages (5–6), 3 posts (7–8), … |

Root causes (verified in the markup):

- **Footer widget titles are H1.** Every page that renders the footer gets six `<h1>`s: `دسترسی ها`, `سند راهبردی مدیس`, `مقاله ها`, `درباره مدیس`, `خط مشی میداس`, `ارتباط با ما`. These are 6 of the 8 H1s on the homepage and all 5–6 of the H1s on most inner pages.
- **Post titles are not headings.** On `/acoustic-absorbers-and-its-types/` the post title appears as `<h4>جاذب های صوتی و انواع آن</h4>` (the content image is also wrapped in an `<h4>`); there is no `h1`, `h2` or `h3` in the article body at all — the only `h3` is the comment form's "دیدگاهتان را بنویسید".
- **Page titles are never headings** (e.g. `/madis-design-about-us/` has 5 H1s — all footer — and none says "درباره ما").
- **Archive titles are absent from the body entirely** (category/tag/author titles exist only in `<title>`), so archive pages have no H1 and no visible page name.
- **Heading order is broken**: posts start at `h4` (skipping h1–h3), while WPBakery sections use `h1` for every section heading (catalog: 12 H1 / 5 H2; projects: 14 H1). No sampled template has a clean `h1 → h2 → h3` outline.

### 6.2 Images and alt text

| Page | `<img>` tags | missing `alt` attr | `alt=""` | meaningful alt |
| --- | --- | --- | --- | --- |
| Home `/` | 30 | 0 | **30 (100 %)** | 0 |
| Post `/acoustic-absorbers-and-its-types/` | 3 | 0 | 0 | 3 (English: "Acoustic absorbers and their types") |
| Product `/محصولات-آکوستیک-دکوراتیو/` | 4 | 0 | **4 (100 %)** | 0 |
| Catalog `/catalog/` | 12 | 0 | 6 (50 %) | 6 |
| **All 58 URLs** | **197** | **0** | **136 (69 %)** | 61 (31 %) |

The `alt` attribute is always *present* (so an "alt coverage" checker that only looks for the attribute reports 100 %), but **69 % of images carry empty alt text**, and on the homepage that is **30/30** — the hero, project cards and section imagery contribute nothing to image search or accessibility. Where editorial posts do have alts they are English descriptions on a Persian site (e.g. `alt="Acoustic absorbers and their types"`).

**Broken images: 9 live 404s**, all on 3 posts (verified by GET on the live files):

| Post | Broken images |
| --- | --- |
| `/acoustic-absorbers-and-its-types/` | `Acoustic-absorbers-and-their-types02.jpg`, `…03.jpg`, `…04.jpg` |
| `/diffuser-panels/` | `Diffuser-panels01.jpg`, `…02.jpg`, `…03.jpg`, `…04.jpg` |
| `/what-is-sound-and-sound-insulation/` | `what-is-sound-and-sound-insulation01.jpg`, `…02.jpg` |

All 9 are the *only* content images of those posts, all 9 are also the posts' `og:image` (for the 3 posts), and all 9 are still advertised in `post-sitemap.xml`'s `image:image` entries.

### 6.3 Internal linking

- **87 unique internal hrefs** across the 58 pages; **1 external** link (instagram.com).
- **3 internal links return 404** (matches the known "3 links that 404 upstream"):
  1. `/services/` — anchor `دیوار های استودیو` in the body of `/acoustic-absorbers-and-its-types/`
  2. `/acoustics-science-sound-quality/` — anchor `آکوستیکی` (on `/محصولات-آکوستیک-دکوراتیو/`)
  3. `/09123108464` — a phone number written as a path instead of `tel:` (empty anchor, `/محصولات-اکوستیکی-چوب/`)
- **2 internal links 301** (fine, but chains): `/تماس-با-ما/` → `/contact-us-medis-design/` and `/تماس-با-ما-2/` → `/تماس-با-ما/` → contact page (2 hops); `/medismag/<slug>/` legacy URLs 301 to the posts.
- **12 URLs have zero internal links** — 6 icon/project pages, `principles-of-office-design`, `principles-of-acoustic-design`, `sydney-opera-house`, privacy policy, `/category/services/`, `/category/معماری/`. They are only reachable via the XML sitemap.
- **Link density is very uneven**: homepage 15 internal links, product page 14–16, category archive 18, author archive 22, but **posts average 3.3 internal links** and `/articles/` has **1**. Post and category templates render `header_none` and an **empty `<footer>` (0 bytes)**, so they carry no sitewide navigation and offer almost no paths back into the commercial pages.
- `rel="nofollow"` appears 25 times, all on comment-form/reply links (`#respond`, `cancel-comment-reply-link`) — normal.
- Pagination uses `rel="next"` correctly on first pages (`/category/مقالات/`, `/author/mahdi-moradlu/` → `…/page/2/`); paginated pages return 200 but are not in the sitemaps (Yoast default).

### 6.4 Thin and duplicate content

| Bucket | Count | Examples / numbers |
| --- | --- | --- |
| **Zero text in `<main>`** | **7** | `/آیکن-مرکز-مدیریت-حوزه-های-علمیه/`, `/ساختمان-مرکزی-بیمه-دی/`, `/سینمای-داتین/`, `/بنیاد-علوی/`, `/آیکن-بیمه-دی/`, `/آیکن-بانک-پاسارگاد/` (all 200, 0 images, 0 links) and **`/contact-us-medis-design/`** — `<main>` is 2 bytes long, so the contact page is an empty shell |
| Image-only documents | 2 | `/سند-راهبردی-میداس/`, `/خط-مشی-مدیس/` — 4 scans each, 0 text, all `alt=""` |
| Main text < 300 chars | **22/58** | includes the 9 zero-text pages, `/author/postman/` (7 chars), 4 archives under 70 chars, `/مجله-تخصصی…/` (195) |
| Main text < 1,000 chars | **30/58** | — |
| Duplicate homepage pair | 2 URLs | §3.5 |
| Duplicate title + description pair | 2 URLs | `/عایق-صوتی/` + `/آکوستیک/` (identical 61-char title, identical 176-char description) |
| Slug collision | 1 | `/طراحی-آکوستیک-معماری/` in post + page sitemap; page wins, post unreachable |

The six empty "icon" pages and the empty contact page are in the XML sitemap and are `index,follow`, so Google is invited to index blank pages — a classic site-quality signal problem. The contact page being empty is also a conversion problem, not just SEO.

### 6.5 Comment forms / user-generated content

**24/58 pages render a comment form** — **14 posts and 10 pages**, the pages including 5 product/service pages (`طراحی-آکوستیک-صنعتی/`, `طراحی-و-اجرای-الکتروآکوستیک/`, `محصولات-اکوستیکی-چوب/`, `سینما-و-سالن-های-همایش/`, `محصولات-آکوستیک-دکوراتیو/`), the 4 `انتقال-صدای…` pages and `/articles/`. Comments are open, `commentCount: 0` in `Article` schema, and no anti-spam field (CAPTCHA/Akismet marker) appears in the server HTML. No search form and no other forms exist anywhere on the site.

---

## 7. Delivery, headers & indexability plumbing

### 7.1 Response headers (home, `GET /`)

```
HTTP/2 200
server: nginx
content-type: text/html; charset=UTF-8
content-length: 18920
content-encoding: gzip
vary: Accept-Encoding,User-Agent
link: <https://medisdesign.com/wp-json/>; rel="https://api.w.org/",
      <https://medisdesign.com/wp-json/wp/v2/pages/6509>; rel="alternate"; title="JSON"; type="application/json",
      <https://medisdesign.com/>; rel=shortlink
```

| Check | Result |
| --- | --- |
| HTTP version | **HTTP/2** confirmed (`HTTP/2 200`). HTTP/3: **unverified** — local curl has no `--http3`, no `Alt-Svc` header, no HTTPS/SVCB answer recorded |
| Compression | **gzip only** (`content-encoding: gzip`); Brotli not offered |
| HTML caching | **no `Cache-Control`, no `ETag`, no `Last-Modified`** on HTML |
| Static assets | `cache-control: max-age=1209600` (14 days), `ETag` present, no `immutable` |
| HSTS | **absent** (no `Strict-Transport-Security`) |
| Security headers | **absent** — no `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `CSP`, `Permissions-Policy` |
| Server | nginx, no version disclosure |
| Performance | TTFB 8.62 s (cold) / 2.25 s (warm) on `/`, 3.55 s on a post; 9 stylesheets + 8 inline `<style>` + 10 head scripts render-blocking; 30 `<img>` on home, 28 lazy, all with `srcset` |

### 7.2 Redirects and URL canonicalisation

| Request | Result |
| --- | --- |
| `http://medisdesign.com/` | **301** → `https://medisdesign.com/` (1 hop) |
| `https://www.medisdesign.com/` | **301** → `https://medisdesign.com/` (1 hop) |
| `http://www.medisdesign.com/` | **301** → `https://www.medisdesign.com/` → 301 non-www (**2 hops**) |
| `https://medisdesign.com/products` | **301** → `/products/` |
| `https://medisdesign.com/sitemap.xml` | **301** → `/sitemap_index.xml` |
| Missing URL | **404** with the site's 404 template (not a soft-404) |
| Persian URL, percent-encoded vs decoded | both 200 (same content) — but the two canonical tags disagree on which form is canonical (§4.2) |

### 7.3 Bot-facing endpoints

| Endpoint | Status | Size/consequence |
| --- | --- | --- |
| `/feed/` | 200 `application/rss+xml` | 46,977 B; 2 RSS + per-post comment feeds advertised |
| `/wp-json/` | 200 `application/json` | **446,739 B** route index; `Link: rel="https://api.w.org/"` on every page |
| `/wp-json/wp/v2/users` | **403** | author enumeration blocked (good) |
| `/wp-login.php` | **200** | login form exposed, `wordpress_test_cookie` set |
| `/xmlrpc.php` (POST) | **403** from nginx | blocked, yet `<link rel="EditURI" … rsd>` and RSD still advertise it |
| `generator` meta | — | `WordPress 7.1.4`, `WPBakery Page Builder` — stack + version disclosure |
| 404 page | 404, `noindex,follow`, title `صفحه پیدا نشد`, H1 `برگه پیدا نشد`, canonical = missing URL | **only 1 internal link** — a dead end for users and crawlers |
| `?s=` search | 200, `noindex,follow`, canonical → `/`, **no H1**, 0 search forms on the site | 10 post results rendered for `آکوستیک`, but the page is suppressed from the index |

---

## 8. Prioritized issue list

### High

| # | Issue | Evidence (1 line) | Why it matters |
| --- | --- | --- | --- |
| H1 | **Duplicate homepage is indexable and in the sitemap** | `https://medisdesign.com/صفحه-اصلی/` → 200, `index,follow`, 2 self-canonicals, listed in `page-sitemap.xml`; shares 24 image URLs with `/` | Two competing homepages split internal links/signals; Google may pick either and the brand SERP snippet can flip between "صفحه اصلی" and "صفحه اصلی 2" |
| H2 | **Homepage title is "صفحه اصلی 2 - MedisDesign"** | exact `<title>`, 25 chars, plus `og:title` duplicated in both forms | The most-linked page in the site announces a leftover copy number as its brand title |
| H3 | **40/58 URLs (69 %) have no meta description** | 18 present / 40 missing; home, `/products/`, all 12 archives have none; 14 of 18 present ones are truncated auto-excerpts | Google writes its own snippet from whatever is on the page; home and archive snippets are uncontrolled |
| H4 | **Two conflicting canonical tags on 58/58 pages** | `…/products/` vs `…/products`; Persian: `…/category/مقالات/` vs `…/category/%d9%85…` | Conflicting canonical hints are the top cause of "Duplicate, Google chose different canonical" and dilute consolidation |
| H5 | **Primary nav "محصولات" points to a `noindex` page** | `/products/` → 200, `noindex, follow`, not in `page-sitemap.xml`, yet linked from the header of every page | The main commercial entry point is deliberately excluded from search; every internal link to it passes no ranking value |
| H6 | **38/58 pages have zero H1; 19 have 5–14** | 6 footer widget labels are `<h1>` on every page; post title is an `<h4>`; archive titles never appear as headings | The site gives search engines no single topical heading per page and floods it with boilerplate H1s |
| H7 | **9 content images return 404 — and they are the `og:image`s** | all 9 files 404 on GET; on 3 posts; `post-sitemap.xml` still lists them as `image:loc` | Broken images = lost image-search traffic, broken social cards, and sitemap errors in GSC |
| H8 | **3 internal links 404** | `/services/` (post body), `/acoustics-science-sound-quality/` (product page), `/09123108464` (phone as path) | Wasted crawl paths and a bad UX on money pages; `tel:` link bug is trivial to fix |
| H9 | **Homepage TTFB 2.25–8.62 s** | 3 timed samples; 9 CSS + 10 head scripts blocking; 18.9 KB gzip HTML | LCP/Core Web Vitals risk on the highest-value page |

### Medium

| # | Issue | Evidence | Why it matters |
| --- | --- | --- | --- |
| M1 | **69 % of images have empty alt** | 136/197 `alt=""`; home 30/30; product pages 4/4 | No image-search visibility, accessibility failure |
| M2 | **Organization schema has no identity/contact data** | only `name`/`url`/`logo`/`image`; no `sameAs`, `address`, `contactPoint`, `telephone`, `email`; Instagram link exists in the footer | No entity consolidation, no knowledge-panel signals, no local intent support |
| M3 | **`WebSite.potentialAction` advertises a search no user can reach** | 0 search forms on 58 pages; `?s=` is `noindex` + canonical→home; 0 H1 on it | Misleading markup; the advertised target is not a search destination for Google |
| M4 | **7 pages render zero text (incl. the contact page)** | `<main>` = 2 bytes on `/contact-us-medis-design/`; 6 icon/project pages 0 text / 0 images / 0 links | Blank pages in the sitemap degrade site-quality signals and the contact page fails conversions |
| M5 | **12 URLs have no internal links; posts average 3.3** | 0-link list includes 3 editorial posts + privacy page; `/articles/` has 1 link | Orphan-ish pages get little crawl attention; editorial posts never funnel users to products |
| M6 | **Duplicate title + description pair** | `/عایق-صوتی/` and `/آکوستیک/` identical 61-char title & 176-char description | Two URLs compete for the same query with identical snippets |
| M7 | **Slug collision: one URL listed in two sitemaps** | `/طراحی-آکوستیک-معماری/` in post- and page-sitemap; renders as a page (`WebPage`), post unreachable | Duplicate sitemap entry; one of the two content objects is lost |
| M8 | **Content has not been updated in 13+ months** | newest post lastmod 2025-04-07 (583 d), newest page 2025-10-01 (406 d) | Freshness/re-crawl frequency for a news-adjacent Persian niche |
| M9 | **4 empty archives are indexable and in sitemaps** | `/category/services/`, `/category/معماری/`, `/tag/services/` (< 40 chars text), `/author/postman/` (7 chars) | Thin archive pages compete with real category pages |
| M10 | **No security headers / no HSTS; WordPress 7.1.4 + WPBakery disclosed** | home headers show none of HSTS/CSP/XCTO/XFO/Referrer-Policy; 2 `generator` metas; `/wp-login.php` 200 | Trust/security baseline; version disclosure eases targeted attacks |
| M11 | **Duplicate `og:*` tags and 0 `twitter:image`** | 2 × `og:title`/`og:url`/`og:type`/`og:locale`/`og:site_name` per page; `twitter:image` 0/58 | Inconsistent social previews (URL with/without slash, branded/unbranded title) |
| M12 | **404 page is a dead end** | 404 template has **1** internal link, no header, H1 `برگه پیدا نشد` | Users/crawlers hitting 404 have no path back to the site |
| M13 | **Title inconsistencies** | 10/58 without brand; 2 malformed duplicated titles (84 and 57 chars); separator switches between ` - ` and a pipe; `/articles/` title unrelated to its slug | Inconsistent SERP branding and truncated/wasted title space |
| M14 | **`Article` schema has no `description` (0/27); no `Product` markup** | 27 Article/TechArticle graphs checked; 6 product/service pages + `/catalog/` expose only `WebPage` | Loses rich-result eligibility (article description, product/offer) on commercial templates |

### Low

| # | Issue | Evidence | Why it matters |
| --- | --- | --- | --- |
| L1 | Comment forms open on 24 pages with 0 comments | 14 posts + 10 pages render `#commentform`; `commentCount: 0`; `/articles/` (a page) among them | Spam/moderation surface; not an SEO penalty by itself |
| L2 | Paginated archives (200) are outside the sitemap | `/category/مقالات/page/2/`, `/author/…/page/2/`, `…/page/3/` → 200, `rel=next` present | Normal Yoast behaviour; only relevant if deep archive content should be indexed |
| L3 | `/sitemap_index.xml/` (trailing slash) also returns 200 | duplicate of the index | Cosmetic duplicate URL |
| L4 | `EditURI`/RSD still advertise XML-RPC although it is blocked | `<link rel="EditURI">` + RSD present; POST `/xmlrpc.php` → 403 | Inconsistent signals for scanners |
| L5 | Favicons are `.webp` only | 3 `<link rel="icon">`, no `.ico`/SVG fallback | Some crawlers/clients ignore webp favicons |
| L6 | No HTML caching / Brotli | no `Cache-Control` on HTML; `content-encoding: gzip` only | Small edge/CDN win |
| L7 | `twitter:data2` reading time contradicts schema | "52 دقیقه" vs `wordCount: 112` | Cosmetic inconsistency in social previews |
| L8 | 2 image-only document pages have no text | `/سند-راهبردی-میداس/`, `/خط-مشی-مدیس/` (4 scans, `alt=""`) | OCR/alt would add indexable text; low priority business-wise |

---

## 9. Evidence index (cached locally)

| File | Content |
| --- | --- |
| `/tmp/liveseo/robots.txt`, `*.hdr` | robots, sitemap, delivery headers |
| `/tmp/liveseo/sitemap_index.xml`, `post-sitemap.xml`, `page-sitemap.xml`, `category-sitemap.xml`, `post_tag-sitemap.xml`, `author-sitemap.xml` | raw sitemaps |
| `/tmp/liveseo/pages/p01.html … p59.html` | one snapshot per sitemap entry (order = `status.tsv`) |
| `/tmp/liveseo/status.tsv` | URL, HTTP status, redirect target for all 59 entries |
| `/tmp/liveseo/parsed.json` | per-page extraction: titles, descriptions, canonicals, robots, OG/Twitter, JSON-LD types, H1/H2, images/alt, links, forms |
| `/tmp/liveseo/notfound.html`, `search_s.html`, `search_fa.html`, `products.html` | 404, English search, Persian search, noindex products page |
| `/tmp/liveseo/og_home.jpg` | 1366×768, 174,142 B |

*Request budget: ~115 HTTP requests, sequential, 0.3–0.5 s apart, no concurrent bursts, no authenticated or state-changing requests.*
