# Design review — `redesign/index.html` («ارگانیک» direction)

**Reviewed:** 2026-11-15 · single-file mockup (66 KB HTML, self-hosted fonts/assets, no dependencies)
**Method:** full code read against `CONTENT.md` / `MEMORY.md`; rendered captures at 1440 desktop (6843 px doc), 768 tablet and 390-class mobile widths; live DOM checks in a real browser session; WCAG contrast computed on the actual token stack (alpha-blended); asset-weight audit. Evidence captures are in [`redesign/screenshots/review/`](screenshots/review/).

**Verdict:** a disciplined, genuinely designed mockup — the strongest piece of design in this repo. It is presentation-ready as a direction. Below the fold it holds up visually at every width I rendered. Four things I would fix before showing it to anyone else, a handful of quality items, and a short list for the day it becomes the real site.

---

## What is already working well — keep all of this

1. **One signature motif, used with restraint.** A single contour path reused 13× (hero, section marks, stats band, contact panel), constant 1 px non-scaling stroke, slow drift + quiet reveals, everything switched off under `prefers-reduced-motion`. This is the page's identity and it survives all eight sections without becoming wallpaper.
2. **Palette provenance and discipline.** Terracotta as the single chromatic accent on chalk/sand/petrol grounds; the petrol band and footer carry cream type with correct token splits (all measured 5.2–8.4 : 1).
3. **Content fidelity.** Every string, project name, stat (۴۲/۱۹۰/۱۱۰/۲۳), phone and address traces to `CONTENT.md`; Persian digits throughout; no invented facts. The h1 «آرامش، شنیده می‌شود» is proposal copy in the spirit of the pack's headline list.
4. **RTL engineering.** Logical properties everywhere (`inset-inline`, `border-inline-start`, `padding-inline-start`), phone numbers isolated LTR, `scroll-padding-top` for anchors under the sticky mast. Very few RTL pages are this clean.
5. **Accessibility baseline.** Skip link, `:focus-visible`, landmarks + `aria-labelledby`, `aria-current`, real alt text, a 4-second failsafe so nothing can stay invisible. Lazy-loading verified working in a real browser (all 24 images load on scroll); every image has `width`/`height`, so no CLS.
6. **Zero dependencies, one file.** Portable, reviewable, diffable.

---

## P0 — fix before the next round

### 1. There is no navigation below 900 px
`.nav{display:none}` at ≤900 px has no replacement — no burger, no alternative (verified in the rendered tablet and mobile captures: the mast is brand + «تماس با ما» only). That hits **tablets at 768 px**, not just phones, and `CONTENT.md`'s own prototype rules list navigation as a required, responsive section. Everything below the hero is effectively unreachable except by thumb-scrolling.
*Cheap fixes, in order of effort:* (a) a horizontally scrollable chip-nav row under the mast; (b) a burger opening a simple full-screen sheet — a dependency-free `<details>`/`<dialog>` version fits this file's ethos.

### 2. The scroll-cue dot travels the wrong way (RTL motion bug)
The dot starts at the line's inline-start — the physical **right** end (verified: dot right edge = line right edge) — but the `cue` keyframe animates `translateX(0 → +46px)`, which is physically rightward. The dot leaves the 54 px line within the first frames and fades in empty space. It should be `translateX(-46px)`. Small, but it is the first motion a visitor sees.

### 3. Product chips look clickable but are not links
All four chips are `<article class="chip">` (verified) with an arrow glyph and a hover slide — a textbook affordance mismatch. Wrap them in `<a href="#products">` like the project plates, or drop the arrow.

### 4. A gold literal survived the accent migration
`.frame{border:1px solid rgba(161,142,55,.38)}` — that is the retired gold `#A18E37`, hard-coded. It contradicts the single-accent decision in the file header, and per `MEMORY.md` the "one edit to brass" token switch (`--primary:#A18E37`) would **not** flip it, because it isn't a token. Use `color-mix(in srgb, var(--primary) 38%, transparent)` so the frame follows the system.

---

## P1 — quality items

### 5. Contrast on small text (computed WCAG ratios)

| Pair | Ratio | Needs | Note |
|---|---|---|---|
| Button label `#fff` on `#CC7529` | **3.42** | 4.5 | Your accepted call (`MEMORY.md`) — see below |
| `--muted #727F9F` on sand panel | **2.95** | 4.5 | The known weak spot, now with a number |
| `ink-52` micro-labels on chalk/sand (`.latin`, `.ptype`, mag dates, partner note) | **3.56–3.66** | 4.5 | |
| `.card-n` terracotta numerals, 11 px | **3.16** | 4.5 | |
| Footer `h4` cream-48 on petrol | **4.35** | 4.5 | One alpha step short |
| Focus ring coral on chalk | **2.53** | 3.0 (2.2, non-text) | See item 6 |

Fix path that keeps the look: raise `ink-52 → ink-64` (5.4 : 1 — the token already exists), darken `--muted` to ~`#5C6880` where it sits on sand, footer `h4` alpha `.48 → .55`. On the button: white-on-terracotta is your decision and hover already goes to navy/white at ~10 : 1 — if you ever want AA **while keeping the light label**, ~`#B05A12` measures 4.9 : 1 at the current 12.5 px size, or keep `#CC7529` and push label size/weight into large-text territory (≥ 18.66 px bold).

### 6. Focus indicator
Coral is 2.53 : 1 on chalk — under WCAG 2.2's 3 : 1 minimum for focus indicators. Terracotta (3.16 : 1) or ink passes; coral can keep its two decorative roles (tagline rule, band eyebrow) recorded in `MEMORY.md`.

### 7. Image weight — ~2.1 MB first load
Measured: content images 1,579 KB + partner logos 305 KB + fonts 151 KB + HTML 64 KB. The project plates are 1710 px JPGs (84–268 KB each) in ~305 px columns — 5.6× oversize; partner logos are 300×300 PNGs displayed ≤ 78 px tall. With `srcset`/`sizes` + AVIF/WebP at 2× and 160 px logos this lands well under 1 MB with no visible change. Also: preload Yekan 700 and add `fetchpriority="high"` to the hero image (both are LCP candidates).

### 8. Partner logo legibility
Grayscale + `.72` opacity at 74 px renders several logos borderline unreadable (visible in the captures). `CONTENT.md` allows "desaturated **or** single-colour where the direction allows" — slightly larger cells (~90 px) or colour-on-hover only would restore legibility while keeping the calm strip.

### 9. Small light text
Captions at 13–14.4 px inherit body weight 300. On low-DPI Windows, thin Persian strokes smear at those sizes. Weight 400 below ~15 px keeps the light-body feel where it matters (17 px paragraphs) and protects the small stuff.

---

## P2 — direction-level suggestions (judgment calls, not defects)

10. **Portfolio hierarchy.** Eight equal plates read flat, and the portfolio is this company's strongest proof. Promoting one flagship (e.g. سینمای داتین or بنیاد علوی) to a 2-column feature plate would give the section a focal point without touching the system.
11. **The CTA line appears twice.** «ما در تمام مراحل پروژه کنار شما هستیم …!» is both the §01 statement quote and the §08 contact pitch. It lands harder once — the statement aside could carry a different real line.
12. **Magazine list is all text.** One 96 px thumbnail per item (post images already exist under `public/wp-content/`) would add texture without breaking the editorial calm.
13. **Section order vs nav order.** The nav promises پروژه‌ها first; the page tells concept (۰۱) → services (۰۲) → proof (۰۳). A defensible narrative — flagged only so it's a choice, not an accident.

---

## Production-port notes (for the day this becomes the site)

14. **Meta:** the mockup has title + description + theme-color but no OG/Twitter tags or canonical. The Next.js app already has full SEO-parity tooling; the live site's on-page SEO is broken (38/58 pages with zero H1, 40/58 without description — `docs/seo-status/`). This file's clean single-H1, real-`<time>` structure is an easy win to carry over, and its `<title>` is already better than the live home's.
15. **`datetime` vs visible dates:** entries 1–2 carry `2024-10-28` / `2024-11-07`, which are ۶ آبان / ۱۶ آبان — not the visible ۲۸ مهر / ۷ آبان (entries 3–4 are consistent). Inherited from `CONTENT.md`'s data, not a mockup invention; verify against WP `post_date` before shipping machine-readable dates.
16. **Stale evidence:** `screenshots/organic-full-1440.png` shows an older draft (lead forms, different stats, «آرامش» branding) that no longer matches `index.html`. Current captures live in `screenshots/review/`; archiving the stale ones avoids confusion later.

---

## Verification log

- **Real-browser session (440 px viewport):** all 24 images load on scroll (lazy-loading works; zero failures after full-page traversal); `scrollWidth` = viewport (no horizontal overflow); DOM-verified: cue-dot position, `.frame` border color, chip tags, nav `display:none`.
- **Headless renders:** 1440×6843 full page (hero pinned to its 900 px-viewport height for capture), 768-sim and 500 px 390-sim full pages (breakpoints remapped — Chrome's minimum window is 500 px). No overflow, overlap or mis-stacking at any width; stats, products and contact restack correctly on mobile.
- **Contrast:** WCAG 2.1 ratios computed on the actual token stack with alpha blending over the real grounds (table in item 5).
- **Weights:** byte-audit of every referenced asset (`stat`/`du`).
- **Capture artifact ruled out:** first headless pass showed blank project plates (virtual-time + lazy-load interplay); the real-browser check confirms images load — not a page defect.
- **Not verified:** real-device touch behaviour, screen-reader announcement order, and Lighthouse/field performance (no deployed URL).

## Artifacts

- Desktop: [`full-1440.png`](screenshots/review/full-1440.png) + `slice-0..5.png`, [`hero-1440.png`](screenshots/review/hero-1440.png)
- Mobile (390-class): [`full-mob.png`](screenshots/review/full-mob.png) + `mob-slice-0..4.png`
- Tablet (768): [`full-tab.png`](screenshots/review/full-tab.png) + `tab-slice-0..3.png`

---

## Status update (2026-11-16) — this review is historical

The directions it reviews (`index.html` in its «ارگانیک» form, then `dsh/autoclow/oc-redesign.html`)
have been replaced. `index.html` is now the **spark** page, and the site exists as 29 flat pages in
this folder (`projects`, 8 project details, `services`, 6 service details, `products`, `catalog`,
`magazine`, 4 articles, `about`, `contact`, 3 document pages) sharing `assets/css/spark.css`.
Copy is still only `CONTENT.md` / `data/*.json`; project and service details carry factual meta only.
Verification for the multi-page build is logged in `../MEMORY.md` («Spark direction + flat multi-page build»).
