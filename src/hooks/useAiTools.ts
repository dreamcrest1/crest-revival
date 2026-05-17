import { useQuery } from '@tanstack/react-query';
import { metaForTool, type ToolMeta } from '@/data/aiToolMeta';

const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vRDvURG_Eu2-ecumNbY-FOKyhweInykVs25janeK4MJn8uGw7WLFVyyhFU_nEMbIMjKAF9aGh_-Au3e/pub?output=csv';

export type AiTool = {
  id: string;
  name: string;
  validity: string;
  price: number;
  image: string;
  symbol: string; // stock-ticker style
  // Simulated "market" signals — purely cosmetic
  change: number; // % change vs previous fetch
  trend: 'up' | 'down' | 'flat';
  spark: number[]; // tiny sparkline
  meta: ToolMeta;
};

/** Minimal CSV parser that handles quoted fields containing commas. */
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

function symbolFor(name: string): string {
  const clean = name.replace(/[^A-Za-z0-9 ]/g, '').trim();
  const parts = clean.split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 4).toUpperCase();
  return parts.slice(0, 3).map((p) => p[0]).join('').toUpperCase();
}

/** Use weserv as an image proxy — fixes hotlinking, normalises sizing/quality. */
export function proxyImage(url: string, w = 600): string {
  if (!url) return '/placeholder.svg';
  try {
    const stripped = url.replace(/^https?:\/\//, '');
    return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&w=${w}&h=${w}&fit=cover&a=attention&output=webp&q=82`;
  } catch {
    return url;
  }
}

function seededRand(seed: number): () => number {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

function buildSpark(seed: number, trendBias: number): number[] {
  const r = seededRand(seed);
  const out: number[] = [];
  let v = 50;
  for (let i = 0; i < 16; i++) {
    v += (r() - 0.5 + trendBias) * 8;
    v = Math.max(10, Math.min(90, v));
    out.push(v);
  }
  return out;
}

export function useAiTools() {
  return useQuery({
    queryKey: ['ai-tools-sheet'],
    staleTime: 60_000,
    refetchOnWindowFocus: false,
    queryFn: async (): Promise<AiTool[]> => {
      const res = await fetch(`${CSV_URL}&_=${Date.now()}`, { cache: 'no-store' });
      if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status}`);
      const text = await res.text();
      const rows = parseCsv(text);
      if (rows.length < 2) return [];
      const [, ...data] = rows; // skip header

      return data
        .map((cols, idx): AiTool | null => {
          const [name, validity, priceRaw, image] = cols;
          if (!name || !priceRaw) return null;
          const price = Number(String(priceRaw).replace(/[^\d.]/g, ''));
          if (!price) return null;

          // Deterministic "market" data per product so it looks alive but consistent
          const seed = Array.from(name + validity).reduce((a, c) => a + c.charCodeAt(0), 1);
          const r = seededRand(seed);
          const changeRaw = (r() - 0.45) * 12; // -5.4% .. +6.6%
          const change = Math.round(changeRaw * 100) / 100;
          const trend: AiTool['trend'] = change > 0.2 ? 'up' : change < -0.2 ? 'down' : 'flat';

          const trimmedName = name.trim();
          return {
            id: `${idx}-${name}-${validity}`.toLowerCase().replace(/\s+/g, '-'),
            name: trimmedName,
            validity: (validity || '').trim(),
            price,
            image: image?.trim() || '',
            symbol: symbolFor(name),
            change,
            trend,
            spark: buildSpark(seed, change / 100),
            meta: metaForTool(trimmedName),
          };
        })
        .filter((p): p is AiTool => !!p);
    },
  });
}
