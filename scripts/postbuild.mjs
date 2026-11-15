// Post-export: emit redirect stubs + host redirect maps for the live site's 301s.
import fs from 'node:fs/promises';
import path from 'node:path';

const OUT = path.resolve('out');
const redirects = JSON.parse(await fs.readFile('data/redirects.json', 'utf8'));

for (const { from, to } of redirects) {
  const dir = path.join(OUT, from.replace(/^\//, ''));
  await fs.mkdir(dir, { recursive: true });
  const html = `<!DOCTYPE html>
<html lang="fa-IR" dir="rtl">
<head>
<meta charset="utf-8">
<title>انتقال…</title>
<link rel="canonical" href="${to}/">
<meta http-equiv="refresh" content="0; url=${to}/">
<script>location.replace(${JSON.stringify(to + '/')});</script>
</head>
<body><p>این صفحه منتقل شده است. <a href="${to}/">ادامه</a></p></body>
</html>
`;
  await fs.writeFile(path.join(dir, 'index.html'), html);
  console.log(`redirect stub: ${from} -> ${to}`);
}

// Netlify / Cloudflare Pages style
const netlify = redirects.map((r) => `${r.from}/    ${r.to}/    301`).join('\n') + '\n';
await fs.writeFile(path.join(OUT, '_redirects'), netlify);

// nginx snippet for a self-hosted deploy
const nginx = redirects.map((r) => `location = ${encodeURI(r.from)}/ { return 301 ${r.to}/; }`).join('\n') + '\n';
await fs.writeFile(path.join(OUT, 'nginx-redirects.conf'), nginx);

console.log('postbuild done');
