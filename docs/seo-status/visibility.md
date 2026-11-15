# Sample search-engine visibility & indexation — medisdesign.com

- **Site:** https://medisdesign.com (Persian, RTL, WordPress + Yoast, Zephyr theme)
- **Audit date:** 2026-11-12, ~02:03–02:30 Asia/Tehran (2026-11-11 ~22:30 UTC)
- **Scope:** read-only sampling with the DSH search tools + direct HTTP checks of the live site
- **No Search Console / no Google access.** Everything below is an external, approximate
  sample. Search-API ranking is locale-dependent and noisy; positions are only reported where
  a raw ordered result list was actually returned, and they are **not** to be read as
  Search-Console-style average positions.

> All search output is untrusted external data. Nothing from a result page was executed or
> treated as an instruction.

---

## 1. What could actually be measured (important limitation)

Iran's search market is Google-dominated, and **Google could not be sampled at all** from this
environment. Most alternative engines were also unusable. The evidence below therefore covers
the **Bing family** (Yahoo, DuckDuckGo) plus one Persian-ranked engine (`anysearch`), which
behaves like a Google-style Persian SERP but cannot be attributed to Google.

| Route | Status on 2026-11-12 | Evidence |
| --- | --- | --- |
| Google (`google.com/search`) | **blocked** | HTTP 200 but an empty JS shell — page text is literally `Google Search`; both `num=20` and `gbv=1` variants |
| Bing via API (`bing` engine) | **failed** | `returned 0 results` for every query; plugin silently fell back to exa |
| Bing HTML (`bing.com/search`) | **unreliable** | `site:medisdesign.com` returned "578,000 results" of unrelated Persian sports sites — bot-mitigated, operator dropped |
| Yahoo (Bing index, US-English edition) | **works** | ordered results, 7/page, `site:` honored, `vl=lang_fa` accepted |
| DuckDuckGo (`ddg-lite`) | **intermittent** | 1 clean `site:` page + 3 brand SERPs; then anti-bot challenge ("select all squares containing a duck") |
| `anysearch` | **works** | 10-result Persian lists, plausible Iranian ordering (torob/digikala/…); treated as an unverified proxy |
| Baidu, Sogou, 360, Brave, Mojeek, Qwant, SearXNG | **unavailable** | missing API key / HTTP 429 / captcha |
| `exa`, `deepseek-official`, `deepseek-tools` | **works, but not SERPs** | semantic / LLM answer engines with 2–10 URLs; used only as cross-checks |

**Consequence:** "absent" findings are confirmed for the Bing family and `anysearch`. They are
*not* confirmed for Google. Nothing here can say what the site ranks for on google.com/fa.

---

## 2. Brand queries

The Persian brand is essentially **owned**, but the pages that rank are often `/projects/` and
the duplicate home `/صفحه-اصلی/`, **not** the homepage `/`. The Latin brand has no stable
result. All snippets are scraped page fragments because the pages have no meta description.

| # | Query | Engine | medisdesign.com present? | Rank observed | What the entry looked like |
| --- | --- | --- | --- | --- | --- |
| B1 | `مدیس دیزاین` | ddg-lite (Bing) | **Yes, #1 and #2** | 1, 2 | #1 `/projects/` — "شرکت مدیس دیزاین: خدمات طراحی و معماری حرفه‌ای"; #2 `/صفحه-اصلی/` — "صفحه اصلی - MedisDesign". Homepage `/` **not in top 10**; then balad.ir, neshan.org, and unrelated `medis.land`, `medusadesign.co`, `mzdesign.ir`, `modexco.com`, `mitidesign.ir` |
| B2 | `مدیس دیزاین` | anysearch | **Yes, #2** | 2 | #1 is `instagram.com/madis.decor` (unrelated decor shop); #2 homepage with body-text snippet "گروه مهندسی مدیس دیزاین…"; #3 `neshan.org`, #4 `balad.ir` |
| B3 | `مدیس دیزاین` | exa | Yes, #1 | 1 | Homepage + balad.ir + unrelated namesakes |
| B4 | `مدیس دیزاین` | Yahoo (Bing) | **no organic list returned** | — | Only an **image pack** (the site's own project/catalogue images) — no web results in the captured page. Treated as *no reliable SERP data* for this query |
| B5 | `مدیس دیزاین آکوستیک` | ddg-lite (Bing) | **Yes, #1 and #2** | 1, 2 | #1 `/catalog/` — "کاتالوگ - MedisDesign"; #2 `/صفحه-اصلی/`; **#3–#4 are competitor Instagram accounts** (`@acoustic__design`, `@acoustic._.design`), #7 balad.ir |
| B6 | `مدیس دیزاین آکوستیک` | anysearch | **Yes, #2** | 2 | #1 `instagram.com/medis.designs` (a different, 51-follower account); #3 `molavigroupco.com`; #4 `namadmemari.com` |
| B7 | `medisdesign` (Latin) | ddg-lite (Bing) | **Yes, #1** | 1 | Homepage — title "صفحه اصلی 2 - MedisDesign", snippet is the **footer NAP block** (phones + Tehran/Safadasht addresses); #2 `metisdesign.com`, #3 `/صفحه-اصلی/`, #4 `instagram.com/medisdesign` |
| B8 | `medisdesign` (Latin) | anysearch | **No — outside top 10** | absent | `medisimaging.com`, `getmedis.com`, `instagram.com/medismir`, `medis.com`, YouTube… |
| B9 | `medisdesign.com` | exa / bing-fallback | **Yes, #1** | 1 | Homepage |
| B10 | `مدیس دیزاین تماس` | anysearch | **Yes, #3** | 3 | #1 `neshan.org`, #2 `balad.ir`, **#3 homepage** (nav-menu snippet: "صفحه اصلی · پروژه ها · محصولات · …"), #4+ unrelated. The **contact page `/contact-us-medis-design/` itself does not surface** |
| B11 | `مدیس دیزاین تماس` | exa | Yes, #1 | 1 | Homepage; snippet is a **counter widget fragment**: "همیشگی ما 1 ###### پروژه تکمیل شده" |

### Snippet quality for the homepage (no meta description)

Because there is no description, each engine invents one from a different block of the page:

| Fragment used as snippet | Where it comes from | Seen on |
| --- | --- | --- |
| `021-26413369 09386038003 دفتر مرکزی: تهران، خیابان شریعتی، خیابان ظفر، پلاک ۱۶۸، واحد ۹ کارخانه: شهرک صنعتی صفادشت…` | footer NAP | ddg-lite, Yahoo |
| `گروه مهندسی مدیس # خدمات گروه مهندسی مدیس طراحی سالن همایش تلفیقی از هنر و علم` | hero headings + stray `#` | exa, anysearch (variant starts mid-word: `ت گروه فنی مهندسی مدیس…`) |
| `صفحه اصلی · پروژه ها · محصولات · خدمات ما · مدیس مگ · کاتالوگ ها · درباره ما · تماس با ما` | navigation menu | anysearch (B10) |
| `همیشگی ما 1 ###### پروژه تکمیل شده` | animated counter block | exa (B11) |

So yes — engines **do** compensate for the missing description, but with unstable fragments
(N.A.P., menus, counter markup). A given user sees a different "description" per engine and
per query, and the counter/nav fragments read like broken text.

---

## 3. Indexation sample (`site:medisdesign.com`)

Sample, not a total. No engine gave a trustworthy result count.

### 3.1 DuckDuckGo (Bing index) — page 1, 10/10 captured

| # | URL | Type |
| --- | --- | --- |
| 1 | `https://medisdesign.com/` | home — "صفحه اصلی 2 - MedisDesign" |
| 2 | `/wp-content/uploads/2025/04/Medis-Catalogue.pdf` | PDF (title "PDF medisdesign.com", snippet is raw `%PDF-1.6` bytes) |
| 3 | `/صفحه-اصلی/` | duplicate home — "صفحه اصلی - MedisDesign" |
| 4 | `/catalog/` | page |
| 5 | `/projects/` | page |
| 6 | `/category/medismag/` | category archive |
| 7 | `/madis-design-about-us/` | page (About) |
| 8 | `/diffuser-panels/` | post |
| 9 | `/acoustic-wall-panels/` | post |
| 10 | `/آیکن-بیمه-دی/` | post (project icon page) |

### 3.2 Yahoo (Bing index) — pages 1–2, 14 results (pagination shows 4 pages × 7 → ≤28 visible)

Page 1: catalogue PDF, `/`, `/صفحه-اصلی/`, `/catalog/`, `/madis-design-about-us/`, `/projects/`, `/acoustic-wall-panels/`.
Page 2: `/طراحی-آکوستیک-صنعتی/`, `/category/مقالات/`, `/خط-مشی-مدیس/`, `/diffuser-panels/`, `/ساختمان-مرکزی-بیمه-دی/`, `/آیکن-بیمه-دی/`, `/طراحی-و-اجرای-الکتروآکوستیک/`.

### 3.3 Distinct URLs actually observed across all engines (~17)

`/`, `/صفحه-اصلی/`, `/catalog/`, `/projects/`, `/madis-design-about-us/`, `/articles/`-hub **not seen**, `/diffuser-panels/`, `/acoustic-wall-panels/`, `/آیکن-بیمه-دی/`, `/ساختمان-مرکزی-بیمه-دی/`, `/خط-مشی-مدیس/`, `/طراحی-آکوستیک-صنعتی/`, `/طراحی-و-اجرای-الکتروآکوستیک/`, `/category/medismag/`, `/category/مقالات/`, `Medis-Catalogue.pdf`, plus `/amphitheater/` and `/principles-of-office-design/` seen only through semantic engines.

### 3.4 What that means for the specific routes in the brief

| Route | In sitemap? | Indexed? | Note |
| --- | --- | --- | --- |
| `/` | yes | **yes** | title carries the WordPress duplicate suffix "2" |
| `/products/` | **NO — excluded** | **NO — `noindex, follow`** | 22 URLs in `page-sitemap.xml`, `/products/` is not one of them; live header confirms `noindex, follow`. **The only commercial/product page is invisible to search.** |
| `/projects/` | yes | **yes** | actually outranks the homepage for `مدیس دیزاین` on DDG |
| `/catalog/` | yes | **yes** | #1 for `مدیس دیزاین آکوستیک` on DDG |
| `/articles/` | yes | **not in any sample** | its own categories (`/category/مقالات/`, `/category/medismag/`) do appear |
| `/contact-us-medis-design/` | yes | **not in any sample** | contact-intent queries surface map listings + homepage instead |
| `/madis-design-about-us/` | yes | **yes** | |
| posts | 25 | **yes** | deep posts confirmed (`diffuser-panels`, `acoustic-wall-panels`, project icons) |
| legacy `/contact/` | no | **stale entry** | `deepseek-official` twice returned `http://medisdesign.com/contact/` with the **old title "ارتباط با ما - medisdesign"**. Live: 301 → HTTPS and 301 → `/contact-us-medis-design/`, so this is index lag, not a live error |

### 3.5 Sitemap / on-page audit (direct HTTP of all 59 sitemap URLs)

| Item | Result |
| --- | --- |
| Sitemap inventory | 59 URLs: 25 posts, 22 pages, 7 categories, 3 tags, 2 authors (`sitemap_index.xml`) |
| `robots.txt` | `User-agent: * / Disallow:` + sitemap declared — allows everything |
| HTTP status of all 59 sitemap URLs | **59/59 HTTP 200**, all `index, follow` |
| Pages **without meta description** | **41 of 59** (16/22 pages, 13/25 posts, 10/10 taxonomies) |
| Duplicate `<title>`s | 3 ("طراحی آکوستیک معماری" exists as both a page and a post) |
| Home `og:description` | **missing** (no description to emit) |
| Structured data | Yoast `Organization` + `BreadcrumbList` only — **no `LocalBusiness`, no `FAQPage`** |
| Redirect hygiene | correct: `http→https` 301, `www→apex` 301, `/contact/`→301, `/products`→301 |
| Analytics / verification tags | **none** found (no GTM/GA, no `google-site-verification`, no Bing/Yandex verification) |
| Duplicate front pages | `/` ("صفحه اصلی 2") and `/صفحه-اصلی/` ("صفحه اصلی") are both live, both `index, follow`, **both self-canonical** — duplicate content competing with itself |
| Index breadth — approximate | ≥15 URLs confirmed; Bing's `site:` shows 4 pages of 7 → **up to ~28 results visible**; against a 59-URL sitemap this suggests roughly **a quarter to half of the sitemap is surfaced in the Bing index**. Sample only — Bing/DDG `site:` is not a total-count tool |

---

## 4. Non-brand commercial queries

**Headline: medisdesign.com did not appear in a single non-brand commercial result set** —
9 queries × 13 engine-query observations, all negative. Positions below are the observed top
of the raw list; where an engine returned fewer than 10, that is the whole list.

| # | Query (Persian) | Engine | Present? | Who ranks instead (observed order) |
| --- | --- | --- | --- | --- |
| C1 | طراحی آکوستیک سالن همایش | Yahoo (Bing) | **No** | avazac.com, molavigroupco.com, simasot.com, sadrairanian.ir, electrovision.ir, namadmemari.com, katibeisatis.com |
| C2 | طراحی آکوستیک سالن همایش | anysearch | **No** | niikan.ir, electrovision.ir, kohanayegh.ir, civilica.com (paper), rezzcogroup.com, carenaltay.com, haftshahraria.com, taninsima.com, sarirasia.com, Instagram |
| C3 | طراحی آکوستیک سالن همایش | exa | **No** | molavigroupco.com, conferencemic.ir, IS 2526 standard PDF, civilica.com ×2, journal.ut.ac.ir, avapardispardaz.ir, diacoled.com, isnac.ir, namadmemari.com |
| C4 | پنل آکوستیک دیوار | Yahoo (Bing) | **No** | torob.com, shapedesign.ir, azarakhshdecor.com, basalam.com, piltandezh.com, ayeghsoti.com, divar.ir |
| C5 | پنل آکوستیک دیوار | anysearch | **No** | digikala.com, salamacousticpanel.com, torob.com, aparat.com, kohanayegh.ir, divar.ir, blog.partfoam.com, avazgar.com, Instagram reel, panikad.com |
| C6 | پنل آکوستیک دیوار | exa | **No** | uniplex.ir, basalam.com, 06sound.com, myacoustic.ir, arambama.com, coraxads.com, molavigroupco.com, naxhome.com, payampress.com, iranloop.com |
| C7 | فروش پنل آکوستیک | anysearch | **No** | digikala, salamacousticpanel, kohanayegh, avazgar, partfoam, novin-plus, aram-gostar, davarmelody, divar |
| C8 | فروش پنل آکوستیک | exa | **No** | myacoustic.ir, salamacousticpanel.com, sowtazhang.ir, akoayegh.ir, deconik.net, iranloop.com, kalastudio.ir, emalls.ir, basalam.com |
| C9 | فروش پنل آکوستیک | deepseek-official | **No** | basalam.com ×3, emalls.ir ×3, torob.com price lists, partfoam blog |
| C10 | طراحی سالن سینما خانگی | anysearch | **No** | codalico.com, taninsima.com, fav-co.com, katibeisatis.com, sarirasia.com, aradsahandalborz.com, avasima.com, Pinterest, golshin.com, Instagram |
| C11 | طراحی سالن سینما خانگی | exa | **No** | theroom.ir, codalico.com ×2, rezzcogroup.com, taninsima.com, pto-co.com, ofoghebastam.ir, cinemaroom.co, farho.studio |
| C12 | آکوستیک اتاق | anysearch | **No** | digikala, kohanayegh.ir, madfoam.com, aparat, acousticbartar.com, avazgar, arambama, sedabardaran, faradars, sornashop (query is semantically noisy — "acoustic" also means guitars/pianos) |
| C13 | طراحی آکوستیک استودیو | anysearch | **No** | acousticbartar.com, aparat, Instagram reel, kohanayegh.ir, partfoam, avazgar, sedabardaran, sornashop, iransote, ponisha |
| C14 | کنترل صدا سالن | anysearch | **No** | izohome.com, piltandezh.com, noavaran-eng.com, sadracomputer.com, simasot.com, decomehr.com, avazac.com, horand.com, bazmara.com, YouTube |
| C15 | طراحی آکوستیک (head term) | anysearch | **No** | fa.wikipedia.org, impedance.ir, acouban.com, parsviunaco.com, faradars.org, acousticbartar.com, carenaltay.com, virgool.io, Instagram |

**Patterns (facts):**
- "پنل آکوستیک" (products) SERPs are **marketplace-dominated** (torob, digikala, basalam, divar, emalls) — a company site without a purchasable/indexed product page cannot compete there.
- "طراحی آکوستیک / سالن همایش / سینما" SERPs are **competitor content pages + academic papers** (civilica, SID, journal.ut.ac.ir) — an entry ticket medisdesign.com does not currently buy.
- Competitors that do rank for the design queries are similar-sized Iranian firms: `molavigroupco.com`, `avazac.com`, `electrovision.ir`, `namadmemari.com`, `simasot.com`, `kohanayegh.ir`, `codalico.com`, `taninsima.com`.
- Language/locale of all sampled results was Persian (`vl=lang_fa` for Yahoo; Persian lists from anysearch). Yahoo's edition is US-English, so its ranking is the weakest locale match of the set.

---

## 5. Presence / E-E-A-T signals (only what search showed)

| Signal | Observation |
| --- | --- |
| About page in index | **Yes** — `/madis-design-about-us/` appears in both DDG and Yahoo `site:` samples |
| Contact page in index | Indexable but **never seen in a SERP**; contact-intent queries return map listings + homepage |
| Map-directory listings (Iran's local-pack equivalent) | **Yes, consistent N.A.P.:** `neshan.org/maps/places/82e01d6e…` ("شرکت مدیس دیزاین زرگنده، تهران… ظفر، پلاک 168، واحد 9 — 02126413369 — medisdesign.com") and `balad.ir/p/شرکت-مدیس-دیزاین…` ("تهران، داوودیه، خ کوروش، خ دستگردی(ظفر)-پلاک 168- واحد 9 — 02126413369 — medisdesign"). These two **outrank the site for `مدیس دیزاین تماس`** |
| Other directory entries | `search.bertina.ir/place/medis-design` ("سازنده·تهران"), `avval.ir`, `iranpeida.com` (a different Mashhad "مديس ديزاين دكوراسيون" — **not** this company), `parsasaze.com`, `exa.ai` place record ("manufacturer in Tehran, 2026-09-14") |
| Google Business Profile / Google local pack | **Could not be checked** (Google blocked). No knowledge panel observed in any non-Google engine |
| Instagram | **No social link of any kind in the live HTML** (home/contact/projects/catalog). Two lookalike accounts exist — `@medisdesign` ("Medis design group", 42 posts, 93 followers) and `@medis.designs` (5 posts, 51 followers) — but neither is linked from the site and their bios point to shawl/scarf decoration, so **official ownership is not verifiable**; a competitor `@acoustic__design` ranks **above** the site for `مدیس دیزاین آکوستیک` on DDG |
| Forums / blogs / editorial mentions | **None found.** A blog profile (`voltaj.blogfa.com`, محسن کرمی, acoustic designer) surfaced once for a brand-ish query but the page contains **no MedisDesign mention** — it is a topical match, not a citation |
| Backlink-ish signals | A quoted-domain probe (`"medisdesign.com"`) returned **no third-party page citing the domain** — only the site itself and auto-generated directory pages. (No backlink database was queried; this is a SERP observation only) |
| Brand-collision noise | Many unrelated namesakes compete in the brand SERP: `meddesign.ir` (clinic interiors), `modexco.com` (fashion), `mitidesign.ir`, `medis.land`, `modisdesign.com`, `medisimaging.com`, `midis-design.hr`. Latin-script `medisdesign` is the weakest query for the brand |

---

## 6. Diagnosis

### FACTS (observed)

1. **Brand is mostly won, but by the wrong pages.** For `مدیس دیزاین`, two medisdesign.com URLs hold
   #1–#2 on DuckDuckGo/Bing — but they are `/projects/` and the duplicate `/صفحه-اصلی/`. The
   real homepage `/` was not in that top 10.
2. **The brand result is not stable across engines.** `medisdesign` is #1 on DDG but **absent
   from the top 10 on anysearch**; on Yahoo the brand query returned only an image pack.
3. **Zero non-brand visibility.** 0 appearances in 9 commercial queries across 13 engine-query
   observations (C1–C15).
4. **`/products/` is `noindex, follow` and deliberately excluded from the Yoast sitemap.** It
   never appeared in any index sample. It is the only page built for the commercial
   "پنل آکوستیک / فروش" intent.
5. **41 of 59 sitemap URLs have no meta description**, including the homepage; 10/10 taxonomy
   archives and 16/22 pages are missing one.
6. **Snippets are scraped fragments, and they vary per engine:** footer N.A.P., navigation menu,
   and an animated-counter fragment (`همیشگی ما 1 ###### پروژه ت��میل شده`) were all observed as
   the "description" of the homepage. One anysearch snippet starts mid-word (`ت گروه فنی…`).
7. **Titles are weak in places:** homepage is `صفحه اصلی 2 - MedisDesign` (WordPress duplicate
   suffix), `/articles/` uses a *post* title (`پوشش‌های حریق…`), and "طراحی آکوستیک معماری"
   exists twice (page + post).
8. **Two live front pages** (`/` and `/صفحه-اصلی/`), both `index, follow`, both self-canonical.
9. **Index breadth is partial:** ≥15 distinct URLs confirmed, ~28 max visible for `site:`, against
   59 sitemap URLs. Deep posts and category archives *are* indexed — it is not a sitewide
   indexation failure.
10. **Technical hygiene is otherwise fine:** 59/59 sitemap URLs HTTP 200 + `index, follow`;
    robots.txt open; http→https, www→apex, `/contact/`→ contact page all 301 correctly; schema
    `Organization` + `BreadcrumbList` present.
11. **Local presence is real and consistent:** neshan.org + balad.ir reproduce the site's own
    address and phone and outrank the site for contact intent.
12. **No social profile is linked from the site**, and no third-party editorial citation was
    observed.
13. **No analytics/verification tags** are present in the served HTML (no GA/GTM, no
    google-site-verification) — so Search Console coverage cannot be inferred from the page.

### INFERENCE (judgment)

- The site's problem is **not crawlability or indexation mechanics** — it is **commercial
  substance**: no indexable product page, no description metadata, no content targeting the
  commercial query set, and no page whose title/snippet promises "پنل آکوستیک" or "طراحی سالن".
- The `noindex` on `/products/` is the single most likely self-inflicted cause of the empty
  non-brand SERP for product queries; it looks like an accidental Yoast page-level setting
  rather than strategy (the page is linked in the main menu and rendered normally).
- The duplicate front page splits brand signals: engines pick `/projects/` or `/صفحه-اصلی/`
  depending on the engine, which is consistent with two self-canonical near-identical pages.
- Zero editorial links/mentions plus auto-generated directory listings only → low authority;
  that is why academic PDFs and slightly larger contractors outrank the brand for design queries.
- Because Google could not be sampled, the real Google picture may differ — but the *on-page*
  deficits found (no description, noindexed product page, no commercial content) affect Google
  exactly the same way.

### Highest-leverage visibility opportunities (ranked)

1. **Un-noindex `/products/` and add it back to the sitemap, then give it a commercial title +
   description** (`محصولات آکوستیک` / `پنل آکوستیک`). This is the cheapest change with the
   clearest path into the marketplace-dominated product SERPs.
2. **Write meta descriptions and fix titles everywhere it matters** (home: drop the "2"; a real
   description; `/articles/`: "مقالات و مدیس مگ" instead of a post title). Directly changes the
   scraped NAP/nav/counter snippets observed today and the click-through of the brand queries
   that are already ranking.
3. **Publish 3–4 intent-matched landing pages** (سالن همایش، سینمای خانگی، آکوستیک استودیو،
   پنل دیواری) with project proof, FAQ schema, and internal links from `/projects/`. Every
   ranking competitor for these queries is a content page, not a directory — content is the
   entry ticket.
4. **Consolidate the two front pages** (301 `/صفحه-اصلی/` → `/`, or canonical it) so brand
   queries resolve to one homepage.
5. **Sequence the Google work separately:** verify Search Console (no verification tag exists),
   submit the sitemap, and re-run this sample against Google — none of the above can be
   validated on the dominant engine from here.

---

### Reproducibility

- Brand / index samples: DuckDuckGo Lite (`lite.duckduckgo.com`, Bing index), Yahoo
  (`search.yahoo.com`, Bing index, `vl=lang_fa`), `anysearch`, `exa`.
- Sitemap/on-page audit: direct `curl` of `robots.txt`, `sitemap_index.xml` and all 59 URLs
  (status, `<title>`, `meta description`, `robots`, `canonical`).
- Query set: B1–B11, C1–C15 as listed. Re-running will produce different snippets and some
  different positions — that variance is itself part of the finding.
