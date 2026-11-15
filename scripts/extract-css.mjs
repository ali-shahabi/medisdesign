// Extract the pieces of the Zephyr theme CSS that we need to port, into a readable dump
import fs from 'node:fs';

const css = fs.readFileSync('scripts/raw/css/style.min.css', 'utf8');

// naive rule splitter that keeps at-rule context
const rules = [];
for (const chunk of css.split('}')) {
  const r = chunk.trim();
  if (!r) continue;
  const brace = r.lastIndexOf('{');
  if (brace === -1) continue;
  const selector = r.slice(0, brace).trim();
  const body = r.slice(brace + 1).trim();
  rules.push({ selector, body });
}
console.log(`parsed ${rules.length} rules`);

const queries = process.argv.slice(2);
for (const q of queries) {
  const re = new RegExp(q);
  const hits = rules.filter((r) => re.test(r.selector));
  console.log(`\n### ${q}  (${hits.length} rules)`);
  for (const h of hits.slice(0, 10)) console.log(`${h.selector} { ${h.body} }`);
}

if (queries.length === 0) {
  fs.writeFileSync('scripts/raw/css/rules.json', JSON.stringify(rules, null, 1));
  console.log('wrote scripts/raw/css/rules.json');
  // list distinct top-level element prefixes
  const prefixes = new Map();
  for (const r of rules) {
    const m = r.selector.match(/\.((?:l|w|g|h|i|m|us)-[a-z0-9-]+)/);
    if (m) prefixes.set(m[1], (prefixes.get(m[1]) || 0) + 1);
  }
  console.log([...prefixes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 60).map(([k, v]) => `${k}:${v}`).join('  '));
}
