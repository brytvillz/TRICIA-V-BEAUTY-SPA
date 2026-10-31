/* Verifies that every inline <script> in dist/ has its sha256 listed in vercel.json's CSP,
   and that nothing in the HTML would be blocked by it. Run after `npm run build`. */
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const vercel = JSON.parse(readFileSync('vercel.json', 'utf8'));
const csp = vercel.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value;
const scriptSrc = (csp.match(/script-src([^;]*)/) || [, ''])[1];
const allowed = new Set([...scriptSrc.matchAll(/'sha256-([^']+)'/g)].map((m) => m[1]));
const hasUnsafeInline = /'unsafe-inline'/.test(scriptSrc);

const files = readdirSync('dist').filter((f) => f.endsWith('.html'));
let problems = 0;
const seen = new Map();
for (const f of files) {
  const html = readFileSync(join('dist', f), 'utf8');
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
    const attrs = m[1];
    if (/\bsrc=/.test(attrs) || /type="application\/ld\+json"/.test(attrs)) continue; // external, or data not code
    const hash = createHash('sha256').update(m[2]).digest('base64');
    seen.set(hash, (seen.get(hash) || 0) + 1);
    if (!allowed.has(hash)) { problems++; console.error(`${f}: inline script NOT allowed by CSP (sha256-${hash})`); }
  }
  if (/\son[a-z]+="/.test(html.replace(/<script[\s\S]*?<\/script>/g, ''))) { problems++; console.error(`${f}: inline event handler attribute found`); }
}
console.log(`${files.length} pages checked, ${seen.size} distinct inline script(s):`);
for (const [h, n] of seen) console.log(`  sha256-${h}  (${n} pages)`);
console.log(`script-src: ${scriptSrc.trim()}${hasUnsafeInline ? '   [WARNING: unsafe-inline present]' : ''}`);
if (problems || hasUnsafeInline) { console.error(`\n${problems} problem(s)`); process.exit(1); }
console.log('CSP check passed');
