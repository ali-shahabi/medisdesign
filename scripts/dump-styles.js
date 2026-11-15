// Dump computed styles for a set of selectors on the current page.
(() => {
  const PROPS = ['display','position','box-sizing','width','height','max-width','min-width',
    'padding-top','padding-right','padding-bottom','padding-left',
    'margin-top','margin-right','margin-bottom','margin-left',
    'background-color','background-image','background-size','background-position','background-repeat',
    'border-radius','border','box-shadow','overflow','opacity','z-index',
    'color','font-family','font-size','font-weight','line-height','letter-spacing','text-align','text-transform','direction',
    'grid-template-columns','gap','row-gap','column-gap','align-items','justify-content','flex-direction','flex-wrap',
    'aspect-ratio','object-fit','transform','transition','top','right','bottom','left','inset'];

  const dump = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const o = { _tag: el.tagName.toLowerCase(), _cls: (el.className || '').toString().slice(0, 120), _w: Math.round(r.width * 100) / 100, _h: Math.round(r.height * 100) / 100, _x: Math.round(r.left), _y: Math.round(r.top) };
    for (const p of PROPS) {
      const v = cs.getPropertyValue(p);
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== '0px' && v !== 'rgba(0, 0, 0, 0)') o[p] = v;
    }
    return o;
  };

  const sels = JSON.parse(window.__SELS__ || '[]');
  const out = {};
  for (const s of sels) {
    const el = document.querySelector(s);
    const d = dump(el);
    if (!d) { out[s] = null; continue; }
    // add first few children (one level) for structural insight
    if (el) {
      d._children = [...el.children].slice(0, 4).map((c) => ({ tag: c.tagName.toLowerCase(), cls: (c.className || '').toString().slice(0, 60), h: Math.round(c.getBoundingClientRect().height), w: Math.round(c.getBoundingClientRect().width) }));
    }
    out[s] = d;
  }
  return JSON.stringify(out, null, 1);
})();
