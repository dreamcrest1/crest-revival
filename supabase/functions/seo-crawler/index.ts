// SEO crawler edge function: crawls a site, parses meta, validates sitemap+robots, finds broken links.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const MAX_PAGES = 60;
const TIMEOUT_MS = 12000;

interface PageReport {
  url: string;
  status: number;
  title: string | null;
  description: string | null;
  canonical: string | null;
  robots: string | null;
  indexable: boolean;
  og: Record<string, string>;
  twitter: Record<string, string>;
  jsonLd: unknown[];
  h1Count: number;
  imgMissingAlt: number;
  internalLinks: string[];
  brokenLinks: { url: string; status: number }[];
  issues: string[];
  loadMs: number;
}

interface SitemapEntry { loc: string; status?: number; note?: string }

function abs(base: string, href: string): string | null {
  try { return new URL(href, base).toString(); } catch { return null; }
}
function sameOrigin(a: string, b: string) {
  try { return new URL(a).origin === new URL(b).origin; } catch { return false; }
}
function normalize(u: string): string {
  try {
    const url = new URL(u);
    url.hash = '';
    if (url.pathname.length > 1 && url.pathname.endsWith('/')) url.pathname = url.pathname.slice(0, -1);
    return url.toString();
  } catch { return u; }
}
async function fetchWithTimeout(url: string, opts: RequestInit = {}, timeout = TIMEOUT_MS): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  try {
    return await fetch(url, {
      ...opts,
      signal: ctrl.signal,
      headers: { 'user-agent': 'Castle ToolsSEOBot/1.0', ...(opts.headers || {}) },
      redirect: 'follow',
    });
  } finally { clearTimeout(t); }
}

function extract(html: string, base: string): Omit<PageReport, 'url' | 'status' | 'loadMs' | 'brokenLinks'> {
  const head = html.split(/<\/head>/i)[0] || html;
  const get = (re: RegExp) => { const m = head.match(re); return m ? m[1].trim() : null; };
  const title = get(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i);
  const canonical = get(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
  const robots = get(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
  const indexable = !(robots || '').toLowerCase().includes('noindex');

  const og: Record<string, string> = {};
  for (const m of head.matchAll(/<meta[^>]+property=["']og:([^"']+)["'][^>]+content=["']([^"']*)["']/gi)) og[m[1]] = m[2];
  const twitter: Record<string, string> = {};
  for (const m of head.matchAll(/<meta[^>]+name=["']twitter:([^"']+)["'][^>]+content=["']([^"']*)["']/gi)) twitter[m[1]] = m[2];

  const jsonLd: unknown[] = [];
  for (const m of head.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { jsonLd.push(JSON.parse(m[1].trim())); } catch { jsonLd.push({ _parseError: true }); }
  }

  const h1Count = (html.match(/<h1\b/gi) || []).length;
  let imgMissingAlt = 0;
  for (const m of html.matchAll(/<img\b[^>]*>/gi)) if (!/\salt\s*=/.test(m[0])) imgMissingAlt++;

  const internalSet = new Set<string>();
  for (const m of html.matchAll(/<a\b[^>]+href=["']([^"']+)["']/gi)) {
    const u = abs(base, m[1]);
    if (!u) continue;
    if (u.startsWith('mailto:') || u.startsWith('tel:') || u.startsWith('javascript:')) continue;
    if (sameOrigin(u, base)) internalSet.add(normalize(u));
  }

  const issues: string[] = [];
  if (!title) issues.push('Missing <title>');
  else if (title.length < 10) issues.push(`Title too short (${title.length})`);
  else if (title.length > 70) issues.push(`Title too long (${title.length})`);
  if (!description) issues.push('Missing meta description');
  else if (description.length < 50) issues.push(`Description too short (${description.length})`);
  else if (description.length > 170) issues.push(`Description too long (${description.length})`);
  if (!canonical) issues.push('Missing canonical');
  if (h1Count === 0) issues.push('No <h1>');
  if (h1Count > 1) issues.push(`Multiple <h1> (${h1Count})`);
  if (!og.title) issues.push('Missing og:title');
  if (!og.description) issues.push('Missing og:description');
  if (imgMissingAlt > 0) issues.push(`${imgMissingAlt} <img> missing alt`);
  if (jsonLd.length === 0) issues.push('No JSON-LD');

  return {
    title, description, canonical, robots, indexable,
    og, twitter, jsonLd, h1Count, imgMissingAlt,
    internalLinks: [...internalSet], issues,
  };
}

async function checkLink(url: string): Promise<number> {
  try {
    let res = await fetchWithTimeout(url, { method: 'HEAD' }, 8000);
    if (res.status === 405 || res.status === 403) {
      res = await fetchWithTimeout(url, { method: 'GET' }, 8000);
    }
    return res.status;
  } catch { return 0; }
}

async function crawl(startUrl: string, maxPages: number) {
  const origin = new URL(startUrl).origin;
  const queue: string[] = [normalize(startUrl)];
  const visited = new Set<string>();
  const pages: PageReport[] = [];

  while (queue.length && pages.length < maxPages) {
    const url = queue.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    const t0 = Date.now();
    let res: Response;
    try { res = await fetchWithTimeout(url); }
    catch {
      pages.push({
        url, status: 0, title: null, description: null, canonical: null, robots: null,
        indexable: false, og: {}, twitter: {}, jsonLd: [], h1Count: 0, imgMissingAlt: 0,
        internalLinks: [], brokenLinks: [], issues: ['Fetch failed'], loadMs: Date.now() - t0,
      });
      continue;
    }
    const loadMs = Date.now() - t0;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('text/html')) {
      pages.push({
        url, status: res.status, title: null, description: null, canonical: null, robots: null,
        indexable: false, og: {}, twitter: {}, jsonLd: [], h1Count: 0, imgMissingAlt: 0,
        internalLinks: [], brokenLinks: [], issues: ['Not HTML'], loadMs,
      });
      continue;
    }
    const html = await res.text();
    const data = extract(html, url);
    const report: PageReport = { url, status: res.status, loadMs, brokenLinks: [], ...data };
    if (res.status >= 400) report.issues.unshift(`HTTP ${res.status}`);

    for (const link of data.internalLinks) {
      if (!visited.has(link) && pages.length + queue.length < maxPages) {
        if (link.startsWith(origin)) queue.push(link);
      }
    }
    pages.push(report);
  }

  // Broken link check: collect unique outbound links from all pages, HEAD them in parallel batches
  const allLinks = new Set<string>();
  for (const p of pages) for (const l of p.internalLinks) allLinks.add(l);
  const linkStatus = new Map<string, number>();
  const arr = [...allLinks];
  const BATCH = 10;
  for (let i = 0; i < arr.length; i += BATCH) {
    const batch = arr.slice(i, i + BATCH);
    const results = await Promise.all(batch.map((u) => checkLink(u).then((s) => [u, s] as const)));
    for (const [u, s] of results) linkStatus.set(u, s);
  }
  for (const p of pages) {
    for (const l of p.internalLinks) {
      const s = linkStatus.get(l) ?? 0;
      if (s === 0 || s >= 400) p.brokenLinks.push({ url: l, status: s });
    }
    if (p.brokenLinks.length) p.issues.push(`${p.brokenLinks.length} broken link(s)`);
  }

  return pages;
}

async function checkSitemap(origin: string): Promise<{ sitemapUrl: string; entries: SitemapEntry[]; duplicates: string[]; errors: string[] }> {
  const errors: string[] = [];
  const sitemapUrl = `${origin}/sitemap.xml`;
  let xml = '';
  try {
    const r = await fetchWithTimeout(sitemapUrl);
    if (!r.ok) errors.push(`Sitemap returned HTTP ${r.status}`);
    xml = await r.text();
  } catch { errors.push('Failed to fetch sitemap.xml'); }
  const locs: string[] = [];
  for (const m of xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)) locs.push(m[1].trim());

  const seen = new Set<string>();
  const duplicates: string[] = [];
  for (const l of locs) { if (seen.has(l)) duplicates.push(l); else seen.add(l); }

  const entries: SitemapEntry[] = [];
  const arr = [...seen];
  const BATCH = 10;
  for (let i = 0; i < arr.length; i += BATCH) {
    const batch = arr.slice(i, i + BATCH);
    const results = await Promise.all(batch.map(async (u) => {
      try {
        const r = await fetchWithTimeout(u, { method: 'HEAD' }, 8000);
        return { loc: u, status: r.status };
      } catch { return { loc: u, status: 0, note: 'fetch failed' }; }
    }));
    entries.push(...results);
  }
  return { sitemapUrl, entries, duplicates, errors };
}

async function checkRobots(origin: string) {
  const url = `${origin}/robots.txt`;
  try {
    const r = await fetchWithTimeout(url);
    const text = await r.text();
    return { url, status: r.status, content: text.slice(0, 4000) };
  } catch { return { url, status: 0, content: '' }; }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  try {
    const body = await req.json().catch(() => ({}));
    const target = String(body.url || '').trim();
    const maxPages = Math.min(Math.max(Number(body.maxPages) || 30, 1), MAX_PAGES);
    if (!target) return new Response(JSON.stringify({ error: 'url is required' }), { status: 400, headers: { ...corsHeaders, 'content-type': 'application/json' } });
    let startUrl: URL;
    try { startUrl = new URL(target); } catch { return new Response(JSON.stringify({ error: 'invalid url' }), { status: 400, headers: { ...corsHeaders, 'content-type': 'application/json' } }); }

    const [pages, sitemap, robots] = await Promise.all([
      crawl(startUrl.toString(), maxPages),
      checkSitemap(startUrl.origin),
      checkRobots(startUrl.origin),
    ]);

    const summary = {
      crawledAt: new Date().toISOString(),
      origin: startUrl.origin,
      pagesCrawled: pages.length,
      pagesWithIssues: pages.filter((p) => p.issues.length > 0).length,
      totalIssues: pages.reduce((s, p) => s + p.issues.length, 0),
      brokenLinkCount: pages.reduce((s, p) => s + p.brokenLinks.length, 0),
      sitemap: {
        url: sitemap.sitemapUrl,
        total: sitemap.entries.length,
        ok: sitemap.entries.filter((e) => e.status && e.status >= 200 && e.status < 400).length,
        broken: sitemap.entries.filter((e) => !e.status || e.status >= 400).length,
        duplicates: sitemap.duplicates.length,
        errors: sitemap.errors,
      },
    };

    return new Response(JSON.stringify({ summary, pages, sitemap, robots }), {
      headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String((e as Error).message || e) }), {
      status: 500, headers: { ...corsHeaders, 'content-type': 'application/json' },
    });
  }
});
