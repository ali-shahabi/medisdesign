import fs from 'node:fs';

const idx = fs.readFileSync('redesign/index.html', 'utf8');
const start = idx.indexOf('<svg class="svg-defs"');
const end = idx.indexOf('</svg>', idx.indexOf('<symbol id="contour"')) + '</svg>'.length;
let svg = idx.slice(start, end);
svg = svg.replace(/<svg class="svg-defs"[^>]*>/, '').replace(/<\/svg>$/, '').trim();
svg = svg.replace(/stroke-width/g, 'strokeWidth').replace(/vector-effect/g, 'vectorEffect');

const out = `/* The signature shape: one contour drawing, reused at every scale. */
export function SiteDefs() {
  return (
    <svg className="svg-defs" aria-hidden="true" focusable="false">
      ${svg}
    </svg>
  );
}
`;

fs.writeFileSync('components/SiteDefs.tsx', out);
console.log('wrote components/SiteDefs.tsx', (out.length / 1024).toFixed(1) + ' KB');
