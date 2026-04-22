

## Goal
Make the new product listings (and the full live catalog) survive any database outage by embedding a static snapshot in the frontend, while keeping live admin updates as the source of truth when the database is reachable.

## Approach: Static fallback + live override

```text
Page loads
   │
   ▼
useProducts() → query Supabase
   │
   ├── ✅ success → use DB data (always wins)
   │
   └── ❌ error / timeout / empty
            │
            ▼
       fallback to bundled snapshot
       (src/data/staticProducts.ts)
```

The static snapshot is the same shape as DB rows, so the UI never knows the difference.

## What gets built

**1. New file: `src/data/staticProducts.ts`**
- Exports a hand-maintained array of ~25 products in the exact `Product` shape used by `useProducts.ts` (id, name, description, price, originalPrice, discount, category, emoji, image, buyLink, isHotSelling).
- Includes all 21 newly added listings (Stealth Writer, WriteHuman, Gemini + 5TB, Gemini Ultra, HeyGen Shared/Private, Hailuo, Runway ML, Perplexity Pro 1Y, Lovable Pro, Replit Core, Notion Business+, Bolt.new, Gamma AI, Cursor Pro, Manus AI, Eleven Labs, LinkedIn Career/Business, Office 365 Copilot, Webflow CMS) plus the 4 hero OTTs (Netflix, Prime Video, Hotstar, Sony LIV) all flagged `isHotSelling: true`.
- IDs use stable `static-` prefixed strings so they never collide with DB UUIDs.

**2. Update `src/hooks/useProducts.ts`**
- Wrap the Supabase call in try/catch.
- If the query throws, returns `null`, or returns an empty array → return the static snapshot mapped through the same category/discount logic.
- If the query succeeds with rows → return DB data unchanged (live admin edits keep working).
- Keep TanStack Query's `retry`, `staleTime: 60s`, and `refetchOnWindowFocus: true` so the frontend re-syncs the moment the DB comes back online.
- Add a tiny `source: 'live' | 'fallback'` field to the returned object (handy for debugging; not shown in UI).

**3. No UI changes**
- `Products.tsx`, `HotSellingSection.tsx`, `ProductCard.tsx` already consume `useProducts()` — they automatically render whichever dataset the hook returns.

## How "DB updates still flow to frontend" is guaranteed
- Supabase remains the primary source. Static data is only used when the query fails or returns nothing.
- TanStack Query auto-refetches on window focus + every 60s of staleness, so any admin edit propagates within seconds.
- When you mark a new product hot-selling or change a price in `/admin`, the live DB result overrides the static snapshot on the next refetch — no rebuild needed.

## Maintenance note
The static snapshot is a *safety net*, not the source of truth. It only needs to be refreshed if you want newly added DB products to also appear during a future outage. I'll add a short comment at the top of `staticProducts.ts` explaining this.

## Files touched
- `src/data/staticProducts.ts` (new, ~25 entries)
- `src/hooks/useProducts.ts` (add fallback branch + retry config)

