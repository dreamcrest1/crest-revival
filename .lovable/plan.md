# Fix: Insights view count stuck / "7 of 0 viewers"

## Root cause
`AdminInsights.tsx` loads analytics with a single `.limit(20000)` call, but the backend enforces a hard cap (~1000 rows per response). Over 90 days there are ~7,300 events, so only the first ~1,000 (almost all `page_view`) come back. That's why:
- "Visits" shows 990 (capped at ~1000)
- `product_view` rows (208 total) get truncated to 0 → "of 0 viewers"
- Intent rate, top products, rising, categories all read from the same truncated set

## Fix
In `src/pages/admin/AdminInsights.tsx`, replace the single-shot fetches for `site_analytics` (current + previous window) and `click_events` with a paginated loader that uses `.range(from, to)` in 1000-row batches until the page returns fewer than 1000 rows or a safety cap (e.g. 30k) is hit. Order by `created_at` ascending for stable paging.

Add a small helper:

```ts
async function fetchAll<T>(build: (from: number, to: number) => PostgrestBuilder<T>, max = 30000) {
  const out: T[] = []; const size = 1000;
  for (let from = 0; from < max; from += size) {
    const { data, error } = await build(from, from + size - 1);
    if (error || !data?.length) break;
    out.push(...(data as T[]));
    if (data.length < size) break;
  }
  return out;
}
```

Use it for the three large queries; keep `exit_feedback` and `daily_insights` as-is.

## Out of scope
No schema, edge function, or UI/styling changes. `generate-insights` already runs server-side with the service role and isn't affected.
