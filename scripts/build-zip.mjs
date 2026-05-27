#!/usr/bin/env node
// Build the app and package /dist into dreamcrest-dist.zip for cPanel upload.
// Guarantees .htaccess is present so SPA routes (e.g. /product/:slug) resolve.

import { execSync } from 'node:child_process';
import { existsSync, copyFileSync, statSync, rmSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

const root = resolve(process.cwd());
const dist = join(root, 'dist');
const out = join(root, 'dreamcrest-dist.zip');
const htaccessSrc = join(root, 'public', '.htaccess');

const log = (m) => console.log(`\x1b[36m[build-zip]\x1b[0m ${m}`);
const die = (m) => { console.error(`\x1b[31m[build-zip] ${m}\x1b[0m`); process.exit(1); };

// 1. Clean previous artifacts
if (existsSync(dist)) { log('Cleaning previous dist/'); rmSync(dist, { recursive: true, force: true }); }
if (existsSync(out))  { log('Removing previous zip'); rmSync(out, { force: true }); }

// 2. Build
log('Running vite build (production)…');
try { execSync('npx vite build', { stdio: 'inherit', cwd: root }); }
catch { die('vite build failed'); }
if (!existsSync(dist)) die('dist/ was not produced');

// 3. Ensure .htaccess is in dist (Vite copies public/* automatically, but verify)
const htaccessDst = join(dist, '.htaccess');
if (!existsSync(htaccessDst)) {
  if (!existsSync(htaccessSrc)) die('public/.htaccess missing — cannot ship SPA without it');
  log('Copying .htaccess into dist/');
  copyFileSync(htaccessSrc, htaccessDst);
} else {
  log('.htaccess already present in dist/');
}

// 4. Sanity-check core SPA files
for (const f of ['index.html', '.htaccess']) {
  if (!existsSync(join(dist, f))) die(`dist/${f} missing`);
}

// 5. Verify .htaccess has SPA fallback rule
const ht = readFileSync(htaccessDst, 'utf8');
if (!/RewriteRule.*index\.html/i.test(ht)) {
  log('WARNING: .htaccess does not seem to contain SPA fallback rule');
}

// 6. Zip via system `zip` (preferred) or fallback to Node JSZip
log(`Creating ${out}…`);
let zipped = false;
try {
  // -r recurse, -q quiet, -X strip extra fields, include dotfiles
  execSync(`zip -rqX "${out}" .`, { cwd: dist, stdio: 'inherit' });
  zipped = true;
} catch {
  log('System zip unavailable, falling back to JSZip');
}

if (!zipped) {
  const { default: JSZip } = await import('jszip').catch(() => ({ default: null }));
  if (!JSZip) die('Neither `zip` CLI nor `jszip` available. Install one: `npm i -D jszip`');
  const zip = new JSZip();
  const walk = (dir, base = '') => {
    for (const name of readdirSync(dir)) {
      const full = join(dir, name);
      const rel = base ? `${base}/${name}` : name;
      const s = statSync(full);
      if (s.isDirectory()) walk(full, rel);
      else zip.file(rel, readFileSync(full));
    }
  };
  walk(dist);
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE', compressionOptions: { level: 9 } });
  writeFileSync(out, buf);
}

const sizeMB = (statSync(out).size / 1024 / 1024).toFixed(2);
log(`Done → ${out} (${sizeMB} MB)`);
log('Upload this zip to cPanel File Manager → public_html, then Extract.');
