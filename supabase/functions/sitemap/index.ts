import { createClient } from 'jsr:@supabase/supabase-js@2';
import { corsHeaders } from 'jsr:@supabase/supabase-js@2/cors';

const SITE = 'https://dreamcrest.net';
const AI_TOOLS_CSV =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDvURG_Eu2-ecumNbY-FOKyhweInykVs25janeK4MJn8uGw7WLFVyyhFU_nEMbIMjKAF9aGh_-Au3e/pub?output=csv';

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]!),
  );
}

// Minimal CSV parser supporting quoted fields
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') inQuotes = false;
      else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ',') { cur.push(field); field = ''; }
      else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
      else if (c === '\r') { /* skip */ }
      else field += c;
    }
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  return rows.filter((r) => r.some((v) => v && v.trim() !== ''));
}

async function fetchAiToolNames(): Promise<string[]> {
  try {
    const res = await fetch(`${AI_TOOLS_CSV}&_=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) return [];
    const text = await res.text();
    const rows = parseCsv(text);
    if (rows.length < 2) return [];
    const [, ...data] = rows;
    const names = new Set<string>();
    for (const cols of data) {
      const n = (cols[0] || '').trim();
      if (n) names.add(n);
    }
    return Array.from(names);
  } catch (e) {
    console.error('[sitemap] ai-tools fetch failed:', e);
    return [];
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    );

    const [productsRes, aiToolNames] = await Promise.all([
      supabase.from('products').select('name, updated_at').eq('is_active', true),
      fetchAiToolNames(),
    ]);

    if (productsRes.error) throw productsRes.error;

    const today = new Date().toISOString().slice(0, 10);
    const staticUrls = [
      { loc: '/', priority: '1.0', changefreq: 'weekly' },
      { loc: '/products', priority: '0.95', changefreq: 'daily' },
      { loc: '/ai-tools', priority: '0.95', changefreq: 'daily' },
      { loc: '/alltools', priority: '0.85', changefreq: 'weekly' },
      { loc: '/about', priority: '0.7', changefreq: 'monthly' },
      { loc: '/contact', priority: '0.7', changefreq: 'monthly' },
      { loc: '/faq', priority: '0.6', changefreq: 'monthly' },
      { loc: '/refunds', priority: '0.5', changefreq: 'yearly' },
      { loc: '/terms', priority: '0.4', changefreq: 'yearly' },
    ];

    const productUrls = (productsRes.data || []).map((p) => {
      const slug = slugify(p.name);
      const lastmod = p.updated_at ? p.updated_at.slice(0, 10) : today;
      return `  <url>\n    <loc>${SITE}/product/${slug}</loc>\n    <lastmod>${escapeXml(lastmod)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`;
    });

    const aiToolUrls = aiToolNames.map((name) => {
      const slug = slugify(name);
      return `  <url>\n    <loc>${SITE}/ai-tool/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.85</priority>\n  </url>`;
    });

    const staticBlock = staticUrls
      .map(
        (u) =>
          `  <url>\n    <loc>${SITE}${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`,
      )
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${staticBlock}\n${productUrls.join('\n')}\n${aiToolUrls.join('\n')}\n</urlset>`;

    return new Response(xml, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (err) {
    console.error('[sitemap] error:', err);
    return new Response(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`,
      { headers: { ...corsHeaders, 'Content-Type': 'application/xml' }, status: 200 },
    );
  }
});
