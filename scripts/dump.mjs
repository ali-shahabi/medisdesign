// Usage: node scripts/dump.mjs <url> <selectors.json> <out>
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const [url, selFile, outFile] = process.argv.slice(2);
const sels = JSON.parse(fs.readFileSync(selFile, 'utf8'));

const body = fs.readFileSync('scripts/dump-styles.js', 'utf8');

function run(args, input) {
  return execFileSync('agent-browser', args, {
    input,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, AGENT_BROWSER_SESSION: process.env.AGENT_BROWSER_SESSION || 'medis-2b3639223cdc' },
  });
}

run(['open', url]);
const script = `window.__SELS__ = ${JSON.stringify(JSON.stringify(sels))};\n${body}`;
const res = run(['eval', '--stdin'], script);
let data = res.trim();
try {
  const once = JSON.parse(data);
  data = typeof once === 'string' ? once : JSON.stringify(once);
} catch {
  /* keep raw */
}
fs.writeFileSync(outFile, data);
console.log('wrote', outFile, data.length, 'chars');
