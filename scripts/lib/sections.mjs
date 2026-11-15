import * as cheerio from 'cheerio';
// Shared WPBakery -> typed section model parser (used by both scrapers)
import {
  rewriteHtml, cleanRichHtml, collectCustomCss, styleFor, childStyleFor, mapFonts,
  parseStyleAttr, attrsOf, textOf, localizeUrl,
} from './convert.mjs';

export function makeCtx(cssMap) {
  return { cssMap };
}

export function gridItems($, el) {
  const items = [];
  $(el).find('article.w-grid-item, .w-grid-item').each((_, art) => {
    const $art = $(art);
    const $img = $art.find('img').first();
    const $link = $art.find('.w-post-elm.post_image a, .post_image a, .w-post-elm.post_title a').first();
    const imgSrc = $img.length ? localizeUrl($img.attr('src')) : null;
    items.push({
      id: $art.attr('data-id') || null,
      href: $link.length ? localizeUrl($link.attr('href')) : null,
      title: textOf($, $art.find('.w-post-elm.post_title').first()) || null,
      image: imgSrc,
      imageAlt: $img.attr('alt') || '',
      date: textOf($, $art.find('.w-post-elm.post_date').first()) || null,
      excerpt: textOf($, $art.find('.w-post-elm.post_content').first()) || null,
      classList: ($art.attr('class') || '').split(/\s+/),
    });
  });
  return items;
}

export function sliderItems($, el) {
  const items = [];
  $(el).find('.w-slider-item, .w-grid-item').each((_, it) => {
    const $it = $(it);
    const $img = $it.find('img, .w-slider-image').first();
    items.push({
      image: $img.length ? localizeUrl($img.attr('src')) : null,
      href: localizeUrl($it.find('a').first().attr('href') || ''),
      title: textOf($, $it.find('.w-slider-title, h1, h2').first()) || '',
    });
  });
  return items;
}

/** convert the direct children of a column-inner into typed blocks */
export function blocksOf($, $container, ctx) {
  const blocks = [];
  $container.children().each((_, el) => {
    blocks.push(blockFor($, el, ctx));
  });
  return blocks.filter(Boolean);
}

export function blockFor($, el, ctx) {
  const $el = $(el);
  const tag = (el.tagName || '').toLowerCase();
  if (!tag) return null;
  if (['script', 'style', 'noscript', 'link', 'meta'].includes(tag)) return null;

  const classList = ($el.attr('class') || '').split(/\s+/).filter(Boolean);
  const has = (c) => classList.includes(c);
  const style = mapFonts(styleFor(classList, $el.attr('style'), ctx.cssMap));

  // --- text -------------------------------------------------------
  if (has('w-text')) {
    const $h = $el.find('> .w-text-h').first();
    const $a = $h.is('a') ? $h : $el.find('> .w-text-h > a').first();
    const $value = $el.find('.w-text-value').first();
    const inner = $value.length ? $value.html() : $h.length ? $h.html() : $el.html();
    const icon = $el.find('i.fas, i.fab, i.far, i.material-icons').first();
    return {
      type: 'text',
      tag: tag === 'span' || tag === 'div' ? 'div' : tag,
      html: cleanRichHtml(inner),
      href: $a.length ? localizeUrl($a.attr('href')) : null,
      icon: icon.length ? { cls: icon.attr('class'), text: icon.text().trim() } : null,
      style,
    };
  }

  // --- image ------------------------------------------------------
  if (has('w-image')) {
    const $img = $el.find('img').first();
    if (!$img.length) return { type: 'html', html: cleanRichHtml($.html($el)), style };
    const $a = $el.find('a.w-image-h, a').first();
    const imgStyle = mapFonts({});
    Object.assign(imgStyle, childStyleFor(classList, 'img', ctx.cssMap));
    return {
      type: 'image',
      align: classList.find((c) => c.startsWith('align_'))?.replace('align_', '') || null,
      src: localizeUrl($img.attr('src')),
      alt: $img.attr('alt') || '',
      width: $img.attr('width') ? Number($img.attr('width')) : undefined,
      height: $img.attr('height') ? Number($img.attr('height')) : undefined,
      href: $a.length ? localizeUrl($a.attr('href')) : null,
      ariaLabel: $a.attr('aria-label') || null,
      style,
      imgStyle,
    };
  }

  // --- image banner ----------------------------------------------
  if (has('w-ibanner')) {
    const bg = ($el.find('.w-ibanner-image').attr('style') || '').match(/url\(([^)]+)\)/);
    const image = bg ? localizeUrl(bg[1].replace(/['"]/g, '')) : null;
    const $content = $el.find('> .w-ibanner-h > .w-ibanner-content').first();
    const $title = $el.find('.w-ibanner-title').first();
    const $desc = $el.find('.w-ibanner-desc').first();
    return {
      type: 'banner',
      image,
      title: textOf($, $title),
      titleTag: ($title[0]?.tagName || 'h1').toLowerCase(),
      desc: cleanRichHtml($desc.html() || ''),
      href: localizeUrl($el.find('> a').attr('href') || ''),
      animation: classList.find((c) => c.startsWith('animation_')) || null,
      ratio: classList.find((c) => c.startsWith('ratio_')) || null,
      textColor: classList.find((c) => c.startsWith('color_')) || null,
      style,
      contentStyle: mapFonts(styleFor(($content.attr('class') || '').split(/\s+/), $content.attr('style'), ctx.cssMap)),
      titleStyle: mapFonts(styleFor(($title.attr('class') || '').split(/\s+/), $title.attr('style'), ctx.cssMap)),
      descStyle: mapFonts(styleFor(($desc.attr('class') || '').split(/\s+/), $desc.attr('style'), ctx.cssMap)),
    };
  }

  // --- button -----------------------------------------------------
  if (has('w-btn')) {
    const $a = $el.is('a') ? $el : $el.find('a.w-btn, a').first();
    const label = textOf($, $el.find('.w-btn-label').length ? $el.find('.w-btn-label').first() : $el);
    return {
      type: 'button',
      label,
      href: $a.length ? localizeUrl($a.attr('href')) : null,
      target: $a.attr('target') || null,
      variant: classList.find((c) => c.startsWith('us-btn-style_')) || null,
      icon: ($el.find('i').first().attr('class')) || null,
      style,
    };
  }

  // --- separator --------------------------------------------------
  if (has('w-separator')) {
    const size = classList.find((c) => c.startsWith('size_'))?.replace('size_', '') || 'medium';
    const align = classList.find((c) => c.startsWith('align_'))?.replace('align_', '') || 'center';
    const color = classList.find((c) => c.startsWith('color_'))?.replace('color_', '') || null;
    const thick = classList.find((c) => c.startsWith('thick_')) || null;
    const width = classList.find((c) => c.startsWith('width_')) || null;
    return {
      type: 'separator',
      size,
      align,
      color,
      thick,
      width,
      withLine: has('with_line'),
      style,
    };
  }

  // --- counter ----------------------------------------------------
  if (has('w-counter')) {
    const parts = [];
    $el.find('.w-counter-value-part').each((_, p) => {
      const $p = $(p);
      parts.push({
        kind: ($p.attr('class') || '').includes('type_number') ? 'number' : 'text',
        value: $p.attr('data-final') ?? textOf($, $p),
      });
    });
    return {
      type: 'counter',
      parts,
      title: textOf($, $el.find('.w-counter-title').first()),
      titleTag: ($el.find('.w-counter-title')[0]?.tagName || 'h6').toLowerCase(),
      style,
      valueStyle: parseStyleAttr($el.find('.w-counter-value').attr('style')),
    };
  }

  // --- post grid --------------------------------------------------
  if (has('w-grid')) {
    const cls = classList;
    const cols = cls.find((c) => /^cols_\d/.test(c))?.replace('cols_', '') || '1';
    return {
      type: 'grid',
      layout: cls.find((c) => c.startsWith('layout_')) || null,
      cols: Number(cols) || 1,
      gap: parseStyleAttr($el.attr('style')).gap || null,
      items: gridItems($, $el),
      style,
    };
  }

  // --- slider -----------------------------------------------------
  if (has('w-slider')) {
    return { type: 'slider', items: sliderItems($, $el), style, classList };
  }

  // --- comments ---------------------------------------------------
  if (has('w-comments')) {
    return { type: 'comments' };
  }

  // --- vertical / horizontal wrapper ------------------------------
  if (has('w-vwrapper') || has('w-hwrapper')) {
    const align = classList.find((c) => c.startsWith('align_'))?.replace('align_', '') || null;
    const valign = classList.find((c) => c.startsWith('valign_'))?.replace('valign_', '') || null;
    return {
      type: 'wrapper',
      kind: has('w-hwrapper') ? 'h' : 'v',
      align,
      valign,
      style,
      blocks: blocksOf($, $el, ctx),
    };
  }

  // --- ultimate-vc carousel (client logos) ------------------------
  if (has('ult-carousel-wrapper')) {
    const items = [];
    $el.find('.ult-item-wrap').each((_, it) => {
      const $img = $(it).find('img').first();
      if (!$img.length) return;
      items.push({
        image: localizeUrl($img.attr('src')),
        width: Number($img.attr('width')) || null,
        height: Number($img.attr('height')) || null,
        alt: $img.attr('alt') || '',
      });
    });
    return {
      type: 'carousel',
      items,
      gutter: Number($el.attr('data-gutter')) || 11,
      style,
    };
  }

  // --- button wrapper (theme wraps buttons in a centred div) -----
  if (has('w-btn-wrapper')) {
    const $a = $el.find('a.w-btn').first();
    if ($a.length) {
      const aCls = ($a.attr('class') || '').split(/\s+/).filter(Boolean);
      return {
        type: 'button',
        label: textOf($, $a.find('.w-btn-label').length ? $a.find('.w-btn-label').first() : $a),
        href: localizeUrl($a.attr('href')),
        target: $a.attr('target') || null,
        variant: aCls.find((c) => c.startsWith('us-btn-style_')) || null,
        icon: $a.find('i').first().attr('class') || null,
        align: classList.find((c) => c.startsWith('align_'))?.replace('align_', '') || null,
        style: mapFonts(styleFor(aCls, $a.attr('style'), ctx.cssMap)),
      };
    }
  }

  // --- nested row (sub-row) --------------------------------------
  if (has('g-cols') || has('vc_row')) {
    return { type: 'row', row: rowOf($, $el, ctx, 'nested'), style };
  }

  // --- wpbakery text column --------------------------------------
  if (has('wpb_text_column')) {
    const $wrap = $el.find('.wpb_wrapper').first();
    return {
      type: 'richtext',
      html: cleanRichHtml(($wrap.length ? $wrap.html() : $el.html()) || ''),
      style,
    };
  }

  // --- generic wpbakery wrapper ----------------------------------
  if (has('wpb_wrapper') && $el.children().length) {
    return { type: 'wrapper', kind: 'v', align: null, valign: null, style, blocks: blocksOf($, $el, ctx) };
  }

  // --- heading / paragraph / list in rich content -----------------
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'blockquote', 'figure'].includes(tag)) {
    return { type: 'html', html: cleanRichHtml($.html($el)), style };
  }

  // --- generic passthrough ---------------------------------------
  const inner = $.html($el);
  return { type: 'html', html: cleanRichHtml(inner), style };
}

/* ---------------------------------------------------------------- *
 * Sections
 * ---------------------------------------------------------------- */

export function rowOf($, $row, ctx, sectionId) {
  const rowCls = ($row.attr('class') || '').split(/\s+/);
  const colsCls = rowCls.find((c) => /^cols_/.test(c)) || 'cols_1';
  const m = colsCls.match(/^cols_(\d)(?:-(\d))?$/);
  const cols = m ? Number(m[1]) : 1;
  // e.g. cols_2-1 -> "2fr 1fr", cols_3 -> "repeat(3,1fr)"
  const template = m ? (m[2] ? `${m[1]}fr ${m[2]}fr` : `repeat(${m[1]},1fr)`) : '100%';
  const rowStyle = mapFonts(styleFor(rowCls, $row.attr('style'), ctx.cssMap));
  const gap = parseStyleAttr($row.attr('style')).gap || null;

  const columns = [];
  $row.children('.wpb_column, .vc_column_container').each((_, col) => {
    const $col = $(col);
    const colCls = ($col.attr('class') || '').split(/\s+/).filter(Boolean);
    const colStyle = mapFonts(styleFor(colCls, $col.attr('style'), ctx.cssMap));
    const $inner = $col.children('.vc_column-inner').first();
    const innerStyle = mapFonts(styleFor(($inner.attr('class') || '').split(/\s+/), $inner.attr('style'), ctx.cssMap));
    const blocks = $inner.length ? blocksOf($, $inner, ctx) : [];
    columns.push({
      style: colStyle,
      innerStyle,
      stretched: colCls.includes('stretched'),
      hasScrollEffects: colCls.includes('has_scroll_effects'),
      blocks,
    });
  });

  return { id: `${sectionId}-row`, cols, template, gap, boxes: rowCls.includes('type_boxes'), style: rowStyle, columns };
}

export function sectionsOf($, ctx, prefix) {
  const sections = [];
  let idx = 0;

  $('section.l-section').each((_, sec) => {
    // skip sections nested inside another section (defensive)
    if ($(sec).parents('section.l-section').length) return;
    const $sec = $(sec);
    const classList = ($sec.attr('class') || '').split(/\s+/).filter(Boolean);
    const id = `${prefix}s${idx++}`;

    const overlayEl = $sec.children('.l-section-overlay').first();
    const imageEl = $sec.children('.l-section-img').first();
    const $h = $sec.children('.l-section-h').first();

    const section = {
      id,
      fullWidth: classList.includes('width_full'),
      height: classList.find((c) => c.startsWith('height_')) || 'height_auto',
      fullHeight: classList.includes('full_height'),
      valignCenter: classList.includes('valign_center'),
      customPadding: classList.some((c) => c.startsWith('us_custom_')),
      style: mapFonts(styleFor(classList, $sec.attr('style'), ctx.cssMap)),
      innerStyle: mapFonts(styleFor(($h.attr('class') || '').split(/\s+/), $h.attr('style'), ctx.cssMap)),
      overlay: overlayEl.length ? parseStyleAttr(overlayEl.attr('style')) : null,
      backgroundImage: imageEl.length ? localizeUrl((imageEl.attr('style') || '').match(/url\(([^)]+)\)/)?.[1]?.replace(/['"]/g, '')) : null,
      rows: [],
      rich: null,
    };

    const $rows = $h.children('.g-cols');
    if ($rows.length) {
      $rows.each((_, r) => section.rows.push(rowOf($, $(r), ctx, id)));
    } else if ($h.length && $h.text().trim()) {
      // plain rich content section (blog posts)
      section.rich = cleanRichHtml($h.html());
    }

    if (section.rich || section.rows.length) sections.push(section);
    else if (section.overlay || section.backgroundImage) sections.push(section);
    else if ($sec.children().length) sections.push(section);
  });

  return sections;
}

/** archive pages embed the WP post grid as raw markup; turn it into a typed block */
export function gridifyArchive(section) {
  if (!section.rich || !section.rich.includes('w-grid')) return section;
  const $r = cheerio.load(section.rich, null, false);
  const $g = $r('.w-grid').first();
  if (!$g.length) return section;

  const cls = ($g.attr('class') || '').split(/\s+/);
  const cols = Number((cls.find((c) => /^cols_\d/.test(c)) || 'cols_1').replace('cols_', '')) || 1;
  const gap = ($g.attr('style') || '').match(/--gap:\s*([^;]+)/)?.[1]?.trim() || null;
  const layout = (cls.find((c) => c.startsWith('layout_')) || 'layout_blog_1').replace('layout_', '');
  const items = gridItems($r, $g);
  if (!items.length) return section;

  $g.remove();
  const leftover = ($r.html() || '').replace(/<div class="w-grid-json[\s\S]*$/, '').trim();
  const leftoverText = leftover.replace(/<[^>]+>/g, '').trim();

  return {
    ...section,
    rich: leftoverText ? leftover : null,
    rows: [
      {
        id: `${section.id}-row`,
        cols: 1,
        template: '100%',
        gap: null,
        boxes: false,
        style: {},
        columns: [
          {
            style: {},
            innerStyle: {},
            stretched: false,
            hasScrollEffects: false,
            blocks: [{ type: 'grid', layout, cols, gap, items, style: {} }],
          },
        ],
      },
    ],
  };
}

