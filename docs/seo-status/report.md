# SEO status report — medisdesign.com & the Next.js replica

| | |
| --- | --- |
| **Report date** | 2026-11-12 (Asia/Tehran) |
| **Target 1** | Live site `https://medisdesign.com` — WordPress 7.1.4, Zephyr 8.32.1, WPBakery, Yoast SEO, `fa_IR` / RTL |
| **Target 2** | Local replica in this repo — Next.js 16 static export in `out/` (66 content routes), not yet deployed |
| **Method** | Read-only. Live crawl: 59/59 sitemap URLs + ~50 probes (~115 HTTP requests); all 69 exported HTML files parsed; performance measured with a local Chrome DevTools-Protocol lab (mobile + desktop); search visibility sampled via Bing-family engines (7 brand + 9 commercial queries). |
| **Evidence files** | [live.md](live.md) · [clone.md](clone.md) · [performance.md](performance.md) · [visibility.md](visibility.md) |
| **Not available** | Search Console, analytics, crawl logs, Google SERPs (blocked from this network), PageSpeed Insights / CrUX (blocked — HTTP 403), any production hosting of the replica |

---

## 1. Executive summary

**The site is technically crawlable and sees the brand queries, but the on-page SEO layer is broken on almost every template, it does not compete for a single commercial query, and the pages are slow.** Crawling is healthy (59/59 sitemap URLs return 200, `robots.txt` is open, redirects are single-hop, a real 404 is served). Everything after that is where the score collapses: **69 % of URLs have no meta description**, every sitemap URL carries **two conflicting canonical tags**, the homepage is still titled **"صفحه اصلی 2 - MedisDesign"**, a **second indexable homepage** sits in the sitemap with a self-canonical, the main navigation's "محصولات" link points at a **`noindex`** page, **38/58 pages have no H1 at all** while 19 pages have 5–14 H1s (six of them footer widget labels on every page), **69 % of images have empty alt text**, and nine content images are 404 — they are also those posts' `og:image` and are still listed in the sitemap's image entries.

Measured from Iran, the homepage ships **1.80 MiB over 50 requests**, has an **HTML TTFB median of 3.10 s**, and fails Core Web Vitals on **LCP (3.6–8.5 s mobile, target ≤2.5 s)**; CLS and TBT are fine, so the problem is the network/critical path, not JavaScript.

Externally, the brand is *mostly* won but **by the wrong pages**: on Bing/DuckDuckGo, `مدیس دیزاین` returns `/projects/` at #1 and the duplicate `/صفحه-اصلی/` at #2 — the real homepage is not in the top 10. In a sample of **9 commercial queries × 13 engine observations, medisdesign.com appeared zero times**; marketplace listings (torob, digikala, basalam) own product queries and competitor content pages / academic PDFs own design queries. Because there is no description metadata, engines invent the homepage snippet from the footer phone/address block, the navigation menu or an animated counter — each engine shows a different fragment.

**The replica is a faithful content clone, not yet an SEO-equivalent replacement.** It reproduces titles, canonicals (where present) and the `/products/` noindex, but it ships **0 JSON-LD blocks** (the live site has one Yoast `@graph` per page), **loses the canonical on all 12 category/tag/author archives**, has **36/66 pages with no description**, advertises a clean 66-URL sitemap that still contains the noindex page, redirect stubs and legacy duplicate URLs, hardcodes the production origin in three files, and drops image `srcset` (`images.unoptimized: true`) making it **1.59× heavier on images**. It wins decisively on the render path (1 blocking stylesheet vs 9, 0 parser-blocking head scripts vs 5) and is **not deployed anywhere**.

**Bottom line:** the site's problem is not crawlability — it is **metadata, page semantics, commercial content and server latency**; plus, for this repo, the SEO markup needed before it could replace the live site.

---

## 2. Status scorecard

### 2.1 Live site (medisdesign.com)

| Area | Status | Key evidence |
| --- | --- | --- |
| Crawl access & redirects | **Good** | `robots.txt` 200 (allow-all, sitemap declared); 59/59 sitemap entries 200; `http→https` and `www→apex` single-hop 301; real HTTP 404 |
| Sitemaps | **Fair** | 5 children, 59 entries / 58 unique (one slug listed twice); 9 broken `image:loc`; 4 empty archives listed; `/products/` deliberately excluded; newest post 583 days old |
| Titles | **Poor** | Median 35 chars, max 84; home = "صفحه اصلی 2 - MedisDesign"; 2 malformed titles; 1 exact duplicate title+description pair; 10/58 without brand |
| Meta descriptions | **Poor** | 18/58 present (31 %), **40 missing (69 %)**, incl. home, `/products/` and all 12 archives; 9 >160 chars; 14 of 18 are truncated auto-excerpts |
| Canonicals | **Broken** | **2 conflicting canonical tags on all 58 sitemap URLs** (Yoast encoded + trailing slash vs Zephyr theme decoded, no slash); duplicate homepage is self-canonical |
| Robots meta | **Fair** | All 58 sitemap URLs `index, follow`; `/products/` `noindex, follow`; 404 and `?s=` noindex |
| Open Graph / Twitter | **Poor** | Duplicate `og:title/url/type/locale/site_name` on every page; `og:image` 47/58 (3 are 404); `og:description` 25/58; `twitter:card` 58/58 but **`twitter:image` 0/58** |
| Structured data | **Fair** | One valid Yoast graph per page, but `Organization` has no `sameAs`/`address`/`contactPoint`/`telephone`; `Article.description` 0/27; no `Product`/`Offer`/`LocalBusiness`; `BreadcrumbList` incomplete |
| Headings | **Broken** | **38/58 pages with zero H1**; 19 pages with 5–14 H1s (6 footer widget labels on every page); post titles rendered as `<h4>`; archive titles never appear as headings |
| Images & alt text | **Poor** | 197 images, **136 (69 %) `alt=""`**, home **30/30**; **9 images return 404** (the only images on 3 posts, also their `og:image` and sitemap image entries) |
| Internal linking | **Poor** | 87 unique internal hrefs; **3 links 404**; 12 URLs with zero internal links; posts average 3.3 links; `/articles/` has 1; 404 page has 1 |
| Content quality & freshness | **Poor** | **7 pages render zero text** incl. the contact page (`<main>` = 2 bytes); 2 image-only document pages; 22/58 under 300 chars; duplicate homepage; 19 months since the last post |
| Performance / CWV | **Poor** | LCP 3.6–8.5 s mobile, 6.4 s desktop (target ≤2.5 s); TTFB median 3.10 s, max 6.93 s; 1.80 MiB/50 requests; 9 render-blocking CSS; 460 KB fonts (60 % icon fonts); CLS ≤0.0078, TBT ≤59 ms (both pass) |
| Measurement | **Missing** | No GA/GTM, no `google-site-verification`, no Bing/Yandex verification in the HTML; Search Console status cannot be confirmed from outside |
| Search visibility | **Poor (commercial)** | Brand mostly won but by `/projects/` + duplicate home; **0/9 commercial queries** in the Bing-family sample; Google could not be sampled |

### 2.2 Replica (this repo, `out/`)

| Area | Status | Key evidence |
| --- | --- | --- |
| Content parity | **Good** | 66 content routes, titles/canonicals/OG images match live on sampled pages; `/products/` noindex preserved |
| Titles | **Fair** | 66/66 present, 62 unique; 4 duplicate groups (2 legacy `/medismag/` twins, one duplicated post pair, 2 stubs); home title still "صفحه اصلی 2" |
| Meta descriptions | **Poor** | 30/66 (45 %) present; **36 missing**; 12 archives share the layout fallback "به شرکت مدیس دیزاین خوش آمدید" |
| Canonicals | **Poor** | 52/66 absolute and correct; **12 missing — every category/tag/author archive**; 2 relative (redirect stubs) |
| Structured data | **Broken** | **0 JSON-LD / 0 microdata in all 69 files** (live: 1 graph per page) |
| Sitemap & robots | **Poor** | 66 URLs: includes noindex `/products/`, 2 meta-refresh stubs, 2 legacy `/medismag/` duplicates, 3 pagination URLs, duplicate home; decoded Persian `<loc>`; one hardcoded `lastmod` for all |
| Redirects | **Poor** | Meta-refresh + JS stubs with relative canonical, no `noindex`, listed in sitemap; live answers the same URLs with a real 301 |
| Portability | **Poor** | Production origin hardcoded in `app/layout.tsx`, `app/robots.ts`, `app/sitemap.ts`; no env override; no deploy config / commits / remotes |
| Internal linking | **Fair** | 3 broken links inherited from live; 17 orphan routes; 12 dead-end routes |
| Headings & alt | **Poor (inherited)** | 45/66 pages zero H1 (mirrors live); alt coverage 102/209 (48.8 %); 23 % of images lack dimensions |
| Performance | **Mixed** | Render path much better (1 blocking CSS vs 9, 0 parser-blocking head JS vs 5, HTML gzip −48 %), but JS +49 % and images **1.59× heavier** because `images.unoptimized: true` disables `srcset` |

---

## 3. Live site — what is healthy

Worth stating plainly, because it narrows the work:

- **Discovery plumbing works.** `robots.txt` allows everything and declares the sitemap; `/sitemap.xml` 301s to `/sitemap_index.xml`; 5 child sitemaps are valid; **all 59 entries return HTTP 200** with `index, follow`.
- **URL canonicalisation is clean at the server level.** `http://` → 301 `https://` (1 hop), `https://www.` → 301 apex (1 hop), `/products` → 301 `/products/`, missing URLs → **real 404** (not a soft-404).
- **There is exactly one schema graph per page** (Yoast). The duplicate canonical/OG tags come from the Zephyr theme's head output, not a second SEO plugin.
- **Mobile basics are right:** `lang="fa-IR"`, `dir="rtl"`, correct viewport, lazy-loading with `fetchpriority="high"` on the LCP image.
- **CLS ≤0.0078 and TBT ≤59 ms** — layout is stable and the JavaScript executes cheaply. The performance problem is bytes and latency, not JS.

---

## 4. Live site — what is broken

### 4.1 Indexability & site structure

1. **Duplicate homepage is indexable and in the sitemap.** `/صفحه-اصلی/` returns 200 with `index, follow`, **self-canonical**, and is listed in `page-sitemap.xml`. It shares 24 image URLs with `/` and is a different variant (931 vs 3,356 chars of main text). Two competing homepages split brand signals — and the duplicate is the one ranking #2 for the brand query on Bing/DuckDuckGo.
2. **The homepage title is "صفحه اصلی 2 - MedisDesign"** — a WordPress duplicate-page counter is doing brand duty on the most-linked page.
3. **The primary nav's "محصولات" points at a `noindex` page.** `/products/` (200) is `noindex, follow`, absent from `page-sitemap.xml`, linked from the header of every page, and is the only page aimed at product intent.
4. **Sitemap hygiene:** one URL (`/طراحی-آکوستیک-معماری/`) is listed in both the post and page sitemaps; the page wins and the post is unreachable. Four archives with ≤40 chars of text are listed; 9 `image:loc` entries are 404.
5. **Content has been frozen:** newest post `lastmod` 2025-04-07 (**583 days**), newest page 2025-10-01 (**406 days**).

### 4.2 Metadata

6. **40/58 URLs (69 %) have no meta description** — home, `/products/`, every archive, 404. Google writes the snippet itself; observed snippets were the footer NAP block, the nav menu and the counter widget markup (`همیشگی ما 1 ###### پروژه ت��میل شده`).
7. **Two conflicting canonical tags on all 58 sitemap URLs.** For Persian URLs the two tags are different strings (`…/category/مقالات/` vs `…/category/%d9%85…`). This is the classic way to get "Duplicate, Google chose different canonical than user".
8. **Duplicate Open Graph tags** on every page (two `og:title`, `og:url`, `og:type`, `og:locale`, `og:site_name`), `twitter:image` on **0/58** pages, `og:image` missing on 11 and 404 on 3.
9. **Title issues:** 2 malformed titles with duplicated phrases (84 and 57 chars, one with a stray `%`), 10/58 without the brand, one exact duplicate title+description pair (`/عایق-صوتی/` and `/آکوستیک/`), and `/articles/` titled with an unrelated post headline.

### 4.3 Structured data

10. **The grid exists but is thin.** `Organization` has only name/url/logo/image — no `sameAs`, `address`, `contactPoint`, `telephone`, `email`, even though the footer publishes phones and an address. `Article.description` is missing on all 27 article graphs; `Article.image` missing on 4. No `Product`/`Offer` on the six product/service pages or `/catalog/`, no `LocalBusiness` despite being a physical Tehran business.
11. **`WebSite.potentialAction` advertises a search no user can reach:** there are 0 search forms on 58 pages, while `/?s=` returns a `noindex` page canonicalised to `/` (it does return 10 results — the endpoint works, the UI does not exist).
12. **Breadcrumbs are incomplete:** home = one item, post = "خانه → post" (category omitted), author crumb uses a machine-generated string.

### 4.4 Page semantics & content

13. **H1 structure is inverted:** 38/58 pages have **zero** H1; 19 pages have 5–14 (six are footer widget labels on every page); only `/articles/` has exactly one. Post titles are `<h4>`, and page/archive titles never appear as headings.
14. **7 pages render zero text** — six icon/project pages plus **the contact page** (`<main>` = 2 bytes). They are `index, follow` and in the sitemap. 22/58 pages have under 300 chars of main text.
15. **69 % of images have empty alt text**, including **30/30 on the homepage** (hero, project photos). The attribute is always present, so naive checkers report 100 % coverage.
16. **9 images 404** — the only images on three posts, their `og:image`, and still advertised in the sitemap.
17. **3 internal links 404**: `/services/` (post body), `/acoustics-science-sound-quality/` (product page), `/09123108464` (a phone number used as a path — should be `tel:`). 12 URLs have zero internal links; posts average 3.3 and `/articles/` has 1; the 404 page has one link.

### 4.5 Delivery & performance

18. **LCP fails** at 3.6–8.5 s on real-network mobile and 6.4 s desktop (target ≤2.5 s). **TTFB is the dominant cost: median 3.10 s, p90 3.50 s, max 6.93 s** for HTML; a 742-byte CSS file answered in 8.31 s, 3.40 s and 1.24 s within 30 s — extreme jitter from an Isfahan origin (this is the *best-case* domestic path; Googlebot is farther away).
19. **The critical path is CSS:** 9 render-blocking stylesheets (`media="all"`, all in `<head>`) plus 5 parser-blocking head scripts. On throttled mobile the last stylesheet finished at **11,163 ms** and FCP fired at **11,428 ms**.
20. **Bytes:** 1.80 MiB / 50 requests on mobile; 460 KB of fonts, **60 % of it icon fonts** (material-icons 129 KB, fa-brands 77 KB) for 5 icon references; `font-display` appears **0 times** in the theme and Persian font CSS (inline rules use `block`); **zero WebP/AVIF** in content — measured WebP q80 saving on six real page images is **48.9 %**.
21. **Delivery hygiene:** gzip only (Brotli offered, not used), **no `Cache-Control` on HTML**, no HSTS/CSP/X-Content-Type-Options/X-Frame-Options/Referrer-Policy, WordPress 7.1.4 + WPBakery disclosed in `generator`, `/wp-login.php` 200, `/xmlrpc.php` 403 but still advertised via RSD, `/wp-json/` index 446 KB.

---

## 5. Search visibility snapshot (sampled, 2026-11-12)

**Google could not be sampled from this network** (empty JS shell), so all SERP evidence below is Bing-family (DuckDuckGo, Yahoo) plus one Persian-ranked proxy engine. Treat positions as samples, not Search Console data.

| Observation | Result |
| --- | --- |
| Brand `مدیس دیزاین` (DDG/Bing) | **#1 `/projects/`, #2 `/صفحه-اصلی/`** — the real homepage is **not in the top 10** |
| Brand `مدیس دیزاین آکوستیک` (DDG/Bing) | #1 `/catalog/`, #2 `/صفحه-اصلی/`; competitor Instagram accounts at #3–#4 |
| Brand `medisdesign` (Latin) | #1 on DDG (homepage, footer NAP snippet) but **absent from the top 10** on the proxy engine; many unrelated namesakes |
| Brand `مدیس دیزاین تماس` | **#3** — above it: neshan.org and balad.ir map listings that repeat the company's address/phone; **the contact page never surfaced** |
| Non-brand commercial queries (9 queries × 13 engine observations) | **0 appearances.** Product queries owned by torob/digikala/basalam/divar; design queries by competitor content pages (molavigroupco, avazac, electrovision, simasot…) and academic PDFs (civilica, journal.ut.ac.ir) |
| Index breadth (sample) | ≥15 distinct URLs confirmed; Bing `site:` exposes up to ~28 results vs 59 sitemap URLs; deep posts and category archives are indexed — not a sitewide failure |
| Snippets | All invented from page fragments (footer NAP, nav menu, counter block), because home/archives have no description |
| Local/presence signals | Consistent NAP in neshan.org + balad.ir (+ a few directories); **no social profile linked from the site**; no observed third-party editorial citation |
| Measurement | No analytics/verification tags in the served HTML |

**Diagnosis:** brand demand exists and reaches the site, but the *product/commercial* path is closed — no indexable product page, no description metadata, no content targeting "پنل آکوستیک / طراحی سالن / آکوستیک استودیو", and low authority (no editorial links). The Google picture could not be sampled; the on-page deficits listed above apply to Google identically.

---

## 6. Replica readiness (this repo)

**What is faithful:** content, routes, per-page titles/OG images where present, the `/products/` noindex, canonical paths (no wrong hosts), `lang`/`dir`, and the theme's (poor) H1/alt patterns. **What a cutover would lose or break:**

| # | Regression vs live / best practice | Where | Severity |
| --- | --- | --- | --- |
| 1 | **0 JSON-LD** — live has 1 Yoast `@graph` per page (WebPage, BreadcrumbList, WebSite, Organization, Article on posts) | whole export; no builder in `app/`/`lib/` | **High** |
| 2 | **12 archives lose canonical** (category/tag/author), get no OG, and inherit the generic layout description ×12 | `app/[...slug]/page.tsx:47-50` | **High** |
| 3 | **36/66 pages without description**; only 18 distinct descriptions exist | data + `lib/PageView.tsx:37` | **High** |
| 4 | **Sitemap advertises what should not be indexed:** noindex `/products/`, 2 meta-refresh stubs, 2 legacy `/medismag/` duplicates, 3 pagination URLs, duplicate home `/صفحه-اصلی/` — 66 URLs, only ~45 clean | `app/sitemap.ts`, `lib/data.ts:64` | **High** |
| 5 | **Redirect stubs are soft redirects**: meta-refresh + JS, relative canonical, **no `noindex`**, in the sitemap; live uses real 301s | `scripts/postbuild.mjs:6-25` | **High** |
| 6 | **Origin hardcoded 3×** (`https://medisdesign.com`) → preview/second-domain deploys self-canonicalise to production | `app/layout.tsx:6`, `app/robots.ts:8`, `app/sitemap.ts:7` | **High** |
| 7 | **Robots directives stripped**: live's `max-image-preview:large, max-snippet:-1, max-video-preview:-1` collapses to `index, follow` on 46 pages | `lib/PageView.tsx:52-57` | Medium |
| 8 | **Sitemap encoding/lastmod**: decoded Persian `<loc>`, one hardcoded `2025-10-01` lastmod for all 66, static priority/changefreq | `app/sitemap.ts` | Medium |
| 9 | **No `srcset`** (`images.unoptimized: true`) → same 17 images cost 1,572,824 B vs live's 989,503 B (**1.59×**) | `next.config.ts:11` | Medium |
| 10 | **Alt coverage 48.8 %**, 23 % of images missing dimensions, 45/66 pages zero H1 (inherited) | scraped data + `components/Blocks.tsx` | Medium |
| 11 | **17 orphan routes, 12 dead-end routes, 3 broken links** (2 of which are live-site bugs worth fixing rather than copying) | data/render | Medium |
| 12 | **Route collision:** `/طراحی-آکوستیک-معماری` exists as page and post; the post is unreachable and unmetadata'd | data + `[...slug]/page.tsx:59-63` | Low |

**Deployment:** no commits, no remotes, no host config — the replica has never been served publicly, so server-dependent behaviour (404 status, 301s, served robots/sitemap) is unverified by definition.

**Performance trade-off:** the replica is the better *architecture* (SSR HTML, 1 render-blocking stylesheet vs 9, no parser-blocking head JS, `font-display: swap`, HTML 48 % smaller gzipped) but has 49 % more JS and heavier images until image optimisation is restored. Fix `images.unoptimized` / add a WebP+srcset step (91 WebP files are already sitting in `wp-content/` unused by the homepage).

---

## 7. Prioritized remediation plan

### P0 — this week (config-level, hours of work, largest effect)

1. **Remove `noindex` from `/products/`**, add it back to the sitemap, give it a commercial title/description (`محصولات آکوستیک | پنلهای آکوستیکی مدیس دیزاین`). This is the cheapest path into the product SERPs and the page already exists.
2. **Consolidate the two front pages:** 301 `/صفحه-اصلی/` → `/` (or canonicalise it) and remove it from the sitemap. Fix the home title to something like `طراحی آکوستیک و پنلهای صوتی | مدیس دیزاین` (drop the "2").
3. **Write meta descriptions for the 40 URLs that lack one** — home, `/products/`, `/projects/`, `/articles/`, all 12 archives, service pages. Target 120–155 chars with a commercial hook. This alone changes every snippet Google currently invents.
4. **Remove the duplicate canonical/OG layer** (theme head output) so only Yoast emits canonicals/OG; keep Yoast's encoded + trailing-slash form. Ensure one canonical per page and one `og:*` set.
5. **Fix headings:** demote the six footer widget `<h1>`s to `<h2>`, render page/archive titles as the single `<h1>`, and give post titles an `<h1>` instead of `<h4>`. Fix heading order on WPBakery rows.
6. **Fill the empty pages:** contact page has no content (2 bytes in `<main>`), six icon/project pages have zero text. Add real copy, or `noindex` the ones that cannot be filled.

### P1 — next 2–4 weeks (content + media)

7. **Fix the 9 broken images** (the only images on 3 posts, also their `og:image` and sitemap image entries) — re-upload or remove, and remove them from the image sitemap.
8. **Fix the 3 broken internal links** (`/services/` → `/category/services/`, `/acoustics-science-sound-quality/` → correct URL or remove, phone path → `tel:`). Add a real footer/header to posts and archives (they currently have none) and link posts back to the commercial pages; add ≥2 links to the 12 zero-link URLs.
9. **Alt text for the 136 empty alts**, starting with the homepage (30/30) and the six product pages; write Persian, keyword-relevant descriptions, not English.
10. **Structured data:** extend `Organization` with `sameAs` (Instagram), `address`, `telephone`, `contactPoint`, `email`; add `description` to all 27 `Article` graphs; add `Product`/`Offer` to the six product/catalog pages; add `LocalBusiness`; complete `BreadcrumbList` (post → category → post).
11. **Publish 3–4 intent-matched landing pages** (سالن همایش، سینمای خانگی، آکوستیک استودیو، پنل دیواری) with project proof, FAQ schema, and internal links from `/projects/`. Every ranking competitor for those queries is a content page — content is the entry ticket.
12. **Revive the editorial cadence** (last post 19 months ago): 1–2 posts/month on acoustic topics, each linking to a service page.
13. **Performance block:** add a full-page cache/CDN in front of the origin (TTFB 3.10 s → sub-0.8 s, LCP −1.5 to −3 s), inline critical CSS and defer the other 8 stylesheets (FCP gate), drop unused icon fonts + `font-display: swap` (−250–300 KB), and convert images to WebP with a 768 w candidate (−568 KB measured). Enable Brotli, HTML `Cache-Control`, HSTS and basic security headers.

### P2 — hygiene / measurement

14. **Set up measurement:** Google Search Console (no verification tag exists today) + Bing Webmaster Tools, submit the sitemap, add GA4/GTM, and re-baseline after 4 weeks. None of the current shortcomings can be *tracked* until this exists.
15. **Sitemap cleanup:** remove the duplicate slug entry, remove empty archives from the sitemap (or fill them), add per-URL `lastmod`, and fix the 9 image entries.
16. **404 page:** add header/footer and ≥5 links (currently 1).
17. **Replica-only before any cutover:** JSON-LD `@graph` builder; archive metadata branch; one `SITE_URL` constant; sitemap allow-list; real 301s at host level (or `_redirects` on Netlify/CF Pages with encoded paths + absolute canonical + `noindex` stubs); restore `max-image-preview` directives; restore responsive images/WebP; add `srcset` and dimensions; keep `og:type: article` + `article:published_time` for posts; fix alt/H1 at render time; resolve the page/post slug collision.
18. **Low priority:** `twitter:site`, `og:image:width/height`, per-page OG defaults, favicon `.ico` fallback, `manifest`, remove `EditURI`/RSD advertising of XML-RPC, consider closing comment forms on pages that have zero comments.

---

## 8. How this was measured / limits

- **Live site:** ~115 sequential requests on 2026-11-12 (02:02–02:32 Tehran) — `robots.txt`, all 5 child sitemaps, **all 59 sitemap URLs**, 3 non-sitemap nav URLs, 9 image URLs, `/feed/`, `/wp-json/`, `/wp-login.php`, `/xmlrpc.php`, 404, `?s=` (EN + FA), HTTP/HTTPS/www/slash variants, timing samples. Raw evidence in `/tmp/liveseo/` (`parsed.json`, `status.tsv`, page snapshots).
- **Replica:** all 69 `out/*.html` parsed (head, JSON-LD, H1, img/alt, links), `sitemap.xml`, `robots.txt`, `_redirects`, `nginx-redirects.conf`, 404 artifacts, source files cited above. No build/dev server run.
- **Performance:** PageSpeed Insights was **blocked** (HTTP 403 from this network for all `*.googleapis.com`), so Lighthouse scores and CrUX field data are **not** included; metrics come from a local Chrome 156 CDP harness under Lighthouse-equivalent throttling, cross-checked with unthrottled real-network runs. A control page (`example.com`) showed a ~9 s international-path floor, so throttled absolutes are upper bounds. Raw JSON + harness in `/tmp/perf/`.
- **Visibility:** Google blocked (empty JS shell); Bing-family (DDG, Yahoo) + one Persian proxy engine sampled. Positions are samples, not Search Console averages; snippets vary by engine and date. Evidence in [visibility.md](visibility.md).
- **Not verified anywhere:** Google index status and chosen canonicals, CrUX field INP, tap-target compliance, Google Business Profile, backlink profile, replica's production HTTP behaviour (not deployed).

*All page content was treated as untrusted data; nothing on the live site was modified. Every request was a read.*

---

## 9. Evidence index

| File | Contents |
| --- | --- |
| [live.md](live.md) | Full live-site audit: 59/59 sitemap status, per-template head tables, schema graphs, content/heading/alt/link analysis, delivery headers, 26 prioritized issues |
| [clone.md](clone.md) | Replica audit: 69-file inventory, head-tag parity table, sitemap/robots/redirect analysis, code-level gaps with `file:line`, 22 prioritized fixes |
| [performance.md](performance.md) | Lab CWV measurements (mobile/desktop, 4 URLs), byte-weight breakdown, blocking resources, font/image analysis, replica comparison, 3 fixes |
| [visibility.md](visibility.md) | Brand/non-brand SERP samples, indexation sampling, snippet analysis, local/NAP presence, diagnosis |

---

*Prepared by the Lead with four parallel auditors (live crawl, replica parity, performance lab, search visibility).*
