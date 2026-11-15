// Convert scraped WordPress/WPBakery HTML into a clean typed page model.
import * as cheerio from 'cheerio';

export const SITE = 'https://medisdesign.com';

/* ------------------------------------------------------------------ *
 * URLs
 * ------------------------------------------------------------------ */

export function localizeUrl(u) {
  if (!u) return u;
  u = u.trim();
  if (u.startsWith('//')) u = 'https:' + u;
  if (!u.startsWith(SITE)) {
    // relative roots stay
    if (u.startsWith('/')) return u;
    return u;
  }
  const rest = u.slice(SITE.length) || '/';
  return rest;
}

/** rewrite every medisdesign.com url inside a chunk of html */
export function rewriteHtml(html) {
  if (!html) return html;
  let out = html;

  // absolute site urls -> local path (covers src, href, srcset, url())
  out = out.replace(/https?:\/\/medisdesign\.com(\/[^"'\s)>]*)?/g, (_m, p) => p || '/');

  // strip wp-content query strings (?ver=)
  out = out.replace(/(\/wp-content\/[^"'\s)>]+?)\?ver=[^"'\s)>]*/g, '$1');

  // drop WP admin-ajax / xmlrpc leftovers
  out = out.replace(/https?:\/\/[^"'\s)>]*\/xmlrpc\.php[^"'\s)>]*/g, '#');

  return out;
}

/* ------------------------------------------------------------------ *
 * Styles
 * ------------------------------------------------------------------ */

const camel = (p) => {
  if (p.startsWith('--')) return p; // css custom properties stay verbatim
  return p.replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
};

/** parse a css declaration body into a react-style object */
export function parseDecls(body) {
  const out = {};
  for (const part of body.split(';')) {
    const i = part.indexOf(':');
    if (i === -1) continue;
    const prop = part.slice(0, i).trim();
    const val = part.slice(i + 1).trim();
    if (!prop || !val) continue;
    out[camel(prop)] = val.replace(/\s*!important\s*$/, '');
  }
  return out;
}

/** parse a style="a:b;c:d" attribute */
export function parseStyleAttr(style) {
  if (!style) return {};
  return parseDecls(style);
}

/** collect `.us_custom_xxx{...}` rules from every <style> block of a page */
export function collectCustomCss(html) {
  const map = new Map();
  const blocks = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  for (const css of blocks) {
    // only simple single-selector rules of shape .us_custom_x{...}
    const re = /\.(us_custom_[a-z0-9]+|us_btn[a-z0-9_]*|ush_[a-z0-9_]+)\s*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(css))) {
      const prev = map.get(m[1]) || {};
      map.set(m[1], { ...prev, ...parseDecls(m[2]) });
    }
    // rules with descendant selectors that still only affect the element itself
    // e.g. .us_custom_x > img{...}  -> keep separately as childStyles
    const re2 = /\.(us_custom_[a-z0-9]+)\s*(>|\s)\s*(img|\.w-image-h|h1|h2|p|\.w-btn|\.w-text-h|a|\.w-ibanner-image|\.w-grid-item-h)([^{]*)\{([^}]*)\}/g;
    while ((m = re2.exec(css))) {
      const key = `${m[1]}::${m[3]}`;
      const prev = map.get(key) || {};
      map.set(key, { ...prev, ...parseDecls(m[5]) });
    }
  }
  return map;
}

const CUSTOM_RE = /^(us_custom_[a-z0-9]+|us_btn[a-z0-9_]*|ush_[a-z0-9_]+)$/;

/** merge the element's own us_custom_* rules + its style attribute */
export function styleFor(classList, styleAttr, cssMap) {
  const merged = {};
  for (const c of classList) {
    if (CUSTOM_RE.test(c) && cssMap.has(c)) Object.assign(merged, cssMap.get(c));
  }
  Object.assign(merged, parseStyleAttr(styleAttr));
  return merged;
}

/** child-specific rules, e.g. .us_custom_x img { border-radius: ... } */
export function childStyleFor(classList, tag, cssMap) {
  const merged = {};
  for (const c of classList) {
    const key = `${c}::${tag}`;
    if (cssMap.has(key)) Object.assign(merged, cssMap.get(key));
  }
  return merged;
}

/** keep the original family name (we ship the same font files) and add fallbacks */
export function mapFonts(style) {
  const st = { ...style };
  const fam = st.fontFamily;
  if (fam) {
    const key = fam.toLowerCase();
    if (key.includes('iransans') || key.includes('iranyekan') || key.includes('yekan')) {
      st.fontFamily = `${JSON.stringify(fam).replace(/"/g, "'")}, var(--font-fa), sans-serif`;
    }
  }
  return st;
}

/* ------------------------------------------------------------------ *
 * Element helpers
 * ------------------------------------------------------------------ */

export function textOf($, el) {
  return $(el).text().replace(/\s+/g, ' ').trim();
}

/** strip WP/JS noise from an element's attributes, returning a plain object */
export function attrsOf($, el, { keepId = false } = {}) {
  const a = { ...el.attribs };
  const out = {};
  for (const [k, v] of Object.entries(a)) {
    if (k.startsWith('data-us-') || k.startsWith('data-vc-') || k === 'data-wow-delay') continue;
    if (k === 'itemscope' || k === 'itemprop' || k === 'itemtype') continue;
    if (k === 'id' && !keepId) continue;
    if (k === 'class') continue;
    out[k] = v;
  }
  return out;
}

/** sanitize inner html of rich text */
export function cleanRichHtml(html) {
  if (!html) return '';
  let out = rewriteHtml(html);
  // remove empty spans that only carried builders' classes
  out = out.replace(/<span class="w-text-h">/g, '<span>').replace(/<span class="w-text-value">/g, '<span>');
  // strip WP block classes but keep the tags
  out = out.replace(/\sclass="[^"]*(?:wp-block-[^"]*|has-text-align-[^"]*)"/g, '');
  out = out.replace(/<style[^>]*>[\s\S]*?<\/style>/g, '');
  out = out.replace(/<script[^>]*>[\s\S]*?<\/script>/g, '');
  out = out.replace(/\s(?:loading|decoding|fetchpriority|sizes|srcset)="[^"]*"/g, '');
  out = out.replace(/\sdata-[a-z-]+="[^"]*"/g, '');

  // keep each image's box even when the file is missing (the live site does):
  // derive an explicit aspect-ratio from the width/height attributes
  out = out.replace(/<img\b([^>]*)>/g, (m, attrs) => {
    const w = /\bwidth="(\d+)"/.exec(attrs);
    const h = /\bheight="(\d+)"/.exec(attrs);
    if (!w || !h) return m;
    if (/\bstyle=/.test(attrs)) return m;
    return `<img${attrs} style="aspect-ratio:${w[1]}/${h[1]}">`;
  });

  return out.trim();
}
