// Runs in browser via agent-browser eval --stdin
// Dumps computed styles for the design primitives we need to port.
(() => {
  const pick = (el, props) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const out = {};
    for (const p of props) out[p] = cs.getPropertyValue(p);
    const r = el.getBoundingClientRect();
    out._w = Math.round(r.width * 10) / 10;
    out._h = Math.round(r.height * 10) / 10;
    return out;
  };

  const BOX = [
    'display', 'padding-top', 'padding-bottom', 'padding-left', 'padding-right',
    'margin-top', 'margin-bottom', 'margin-left', 'margin-right',
    'background-color', 'background-image', 'border-radius', 'border',
    'max-width', 'width', 'gap', 'grid-template-columns', 'align-items', 'justify-content',
    'color', 'font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing',
    'text-align', 'flex-direction', 'position', 'top', 'height', 'min-height',
    'box-shadow', 'overflow', 'z-index', 'opacity', 'object-fit',
  ];

  const q = (s) => document.querySelector(s);
  const qa = (s) => [...document.querySelectorAll(s)];

  const report = {};

  // canvas / body
  report.html = pick(document.documentElement, BOX);
  report.body = pick(document.body, ['background-color', 'color', 'font-family', 'font-size', 'line-height', 'direction']);

  // header
  report.header = pick(q('.l-header'), BOX);
  report.headerInner = pick(q('.l-header .l-subheader'), BOX);
  report.headerRow = pick(q('.l-header .w-nav'), BOX);
  report.logo = pick(q('.l-header .w-image img, .l-header .w-logo img'), BOX);
  report.logoWrap = pick(q('.l-header .w-image, .l-header .w-logo'), BOX);
  report.navLinks = qa('.w-nav-anchor.level_1').slice(0, 3).map((el) => ({
    text: el.textContent.trim(),
    style: pick(el, BOX),
  }));

  // sections
  report.sections = qa('main .l-section').slice(0, 20).map((el) => {
    const inner = el.querySelector('.l-section-h');
    return {
      cls: el.className,
      style: pick(el, BOX),
      inner: pick(inner, BOX),
      rows: [...el.querySelectorAll(':scope > .l-section-h > .g-cols')].length,
    };
  });

  // columns
  report.cols = qa('main .g-cols').slice(0, 6).map((el) => ({
    cls: el.className,
    style: pick(el, ['display', 'grid-template-columns', 'gap', 'row-gap', 'column-gap', 'width', 'margin']),
    colWidths: [...el.children].map((c) => Math.round(c.getBoundingClientRect().width)),
  }));

  // text blocks
  report.texts = qa('main .w-text').slice(0, 12).map((el) => ({
    tag: el.tagName.toLowerCase(),
    cls: el.className,
    text: el.textContent.trim().slice(0, 40),
    style: pick(el, BOX),
    inner: pick(el.querySelector('.w-text-h'), BOX),
  }));

  // images
  report.images = qa('main .w-image').slice(0, 10).map((el) => ({
    cls: el.className,
    wrap: pick(el, BOX),
    img: pick(el.querySelector('img'), ['border-radius', 'object-fit', 'width', 'height', 'box-shadow']),
  }));

  // banners
  report.banners = qa('main .w-ibanner').slice(0, 6).map((el) => ({
    cls: el.className,
    wrap: pick(el, BOX),
    image: pick(el.querySelector('.w-ibanner-image img'), ['border-radius', 'object-fit', 'width', 'height']),
    content: pick(el.querySelector('.w-ibanner-content'), BOX),
    title: pick(el.querySelector('.w-ibanner-title'), BOX),
    desc: pick(el.querySelector('.w-ibanner-desc'), BOX),
  }));

  // buttons
  report.buttons = qa('main .w-btn').slice(0, 6).map((el) => ({
    cls: el.className,
    text: el.textContent.trim().slice(0, 30),
    style: pick(el, BOX),
  }));

  // separators
  report.separators = qa('main .w-separator').slice(0, 8).map((el) => ({
    cls: el.className,
    style: pick(el, BOX),
    h: pick(el.querySelector('.w-separator-h'), BOX),
  }));

  // grid / cards
  report.grids = qa('main .w-grid').slice(0, 3).map((el) => ({
    cls: el.className,
    list: pick(el.querySelector('.w-grid-list'), ['display', 'gap', 'grid-template-columns', 'flex-wrap']),
    item: pick(el.querySelector('.w-grid-item'), BOX),
    card: pick(el.querySelector('.w-grid-item-h'), BOX),
    img: pick(el.querySelector('.w-post-elm.post_image img, .w-grid-item img'), ['border-radius', 'object-fit', 'width', 'height', 'aspect-ratio']),
    title: pick(el.querySelector('.post_title'), BOX),
  }));

  // footer
  report.footer = pick(q('.l-footer'), BOX);
  report.footerInner = pick(q('.l-footer .l-section-h, .l-footer .w-html'), BOX);
  report.subfooter = pick(q('.l-subfooter'), BOX);

  // fonts actually loaded
  report.fonts = [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.style} ${f.status}`).slice(0, 20);

  return JSON.stringify(report, null, 1);
})();
