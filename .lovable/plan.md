## Goal

Make `/alltools` show **everything** — the curated `toolCategories` list + all products from `useProducts` + all AI tools from `useAiTools` — on a single page, deduplicated, with the most-searched tools (per `popularityFor`) at the top.

## Changes to `src/pages/AllTools.tsx`

1. **Pull live data**
   - `const { data: productsData } = useProducts();`
   - `const { data: aiTools = [] } = useAiTools();`

2. **Build a unified tool list** (`useMemo`)
   - Start with all names from `toolCategories` (keep their category + emoji).
   - Append every `productsData.products[].name` → category = product's category, emoji = product's emoji.
   - Append every `aiTools[].name` → category = "AI Tools", emoji = "🤖".
   - **Dedupe** by a normalized key: `name.toLowerCase().replace(/[^a-z0-9]/g,'')`. First occurrence wins (so curated `toolCategories` entries keep their original category).

3. **Sort by Google popularity**
   - Import `popularityFor` from `@/data/aiToolPopularity`.
   - Sort the unified list descending by `popularityFor(name)`.

4. **Single-page layout (top trending first)**
   - Replace the tabbed category view with one continuous grid of all tools, already sorted.
   - Add a "🔥 Top Trending" badge/section header at the top (first ~12 cards highlighted with a subtle ring/primary border), then the rest in the same grid.
   - Keep search bar — it now filters across the entire unified list.
   - Keep the existing card style, WhatsApp link behavior, and Streaming Deals section below untouched.
   - Remove category tabs (no longer needed). Optionally keep a small "filter by category" pill row as a secondary filter — **omit unless you want it**; default plan = no tabs.

5. **Counter update**
   - `totalTools` = unified list length (shown in the header chip).

## Files touched
- `src/pages/AllTools.tsx` only.

## Out of scope
- No changes to `useProducts`, `useAiTools`, product data, or other pages.
- Streaming Deals section unchanged.
