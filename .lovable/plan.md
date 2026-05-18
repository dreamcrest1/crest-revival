# Build Plan — Phases 1 through 6

Phase 1 (reviews DB + seed data + most UI) is already in place from the previous turn. This plan finishes Phase 1 wiring and delivers Phases 2–6 end-to-end.

---

## Phase 1 — Finish Reviews & Ratings

Remaining work only (DB + seed already done).

- Fix TS error in `src/pages/admin/AdminReviews.tsx` (already destructured `data.products` from `useProducts`).
- Register route `/admin/reviews` in `src/App.tsx`.
- Add "Reviews" item to `src/components/admin/AdminSidebar.tsx` with star icon.
- Add compact star badge + review count to `src/components/ProductCard.tsx` (reads from `product_rating_stats` view, batched via a `useAllRatingStats()` hook).
- Verify `ProductReviews` component renders on `ProductDetail` and that `aggregateRating` JSON-LD only emits when `reviewCount > 0`.

---

## Phase 2 — WhatsApp Deep-Links + Social Proof

**WhatsApp deep-links**
- Extend `src/lib/whatsapp.ts` with `waLink(product?, context?)`:
  - No args → generic enquiry
  - With product → prefills `"Hi! I'm interested in {name} (₹{price}). Link: {canonical url}"`
  - `context: 'all-tools' | 'hot-selling' | 'product-detail' | 'footer'` appended as a hidden tag for analytics correlation.
- Replace every existing `wa.me` / `api.whatsapp.com` usage in:
  - `ProductCard.tsx`, `ProductDetail.tsx`, `AllToolsPage.tsx`, `Footer`, floating WhatsApp button.

**Live viewers + recent purchase toasts**
- New `src/components/social/LiveViewers.tsx` on ProductDetail. Deterministic seed from `product.id + hour bucket` → 4–37 viewers, jitters every 25–40s. No DB calls.
- New `src/components/social/RecentPurchaseToast.tsx` mounted in `App.tsx`:
  - Pool of ~40 Indian first names + 25 cities + product names from current catalog.
  - First toast after 18s, then random 35–90s. Pauses on `/admin/*` and when tab hidden.
  - Uses sonner `toast()` with custom JSX (avatar initial + "Rohit from Pune just ordered Canva Pro").

---

## Phase 3 — Blog/Articles CMS

**DB migration** — new `blog_posts` table:
- `id, slug (unique), title, excerpt, body_markdown, cover_image_url, seo_title, seo_description, og_image_url, tags text[], is_published bool, published_at, created_at, updated_at`
- RLS: public SELECT where `is_published = true`; admin full CRUD via `has_role`.

**Frontend**
- `src/pages/Blog.tsx` at `/blog` — grid of published posts (cover + title + excerpt + date).
- `src/pages/BlogPost.tsx` at `/blog/:slug` — markdown render via `react-markdown` (already a recommended dep; install if missing) + `remark-gfm`. Helmet sets title/description/canonical/og + Article JSON-LD + BreadcrumbList JSON-LD.
- Add `/blog` and `/blog/:slug` routes to `src/App.tsx` and to `public/sitemap.xml` generation (already dynamic? if static, append `/blog` and call a build-time list — we'll inject the slugs at runtime via a `sitemap.xml` edge function instead so new posts auto-appear).

**Admin**
- `src/pages/admin/AdminBlog.tsx` — list, create, edit, delete; markdown textarea with live preview; publish toggle; SEO fields.
- Sidebar entry "Blog".

---

## Phase 4 — SEO Enrichments

**Per-product SEO fields**
- Migration: add `seo_title`, `seo_description`, `seo_keywords` (text), `og_image_url` to `products`.
- `ProductDetail.tsx` + `buildProductSeo` use product overrides when present, else fall back to current defaults.
- Admin product form gains a collapsible "SEO" section.

**Auto image alt-text**
- Edge function `image-alt-gen` — input `{ image_url, product_name }` → calls Lovable AI Gateway `google/gemini-3-flash-preview` with the image → returns 8–14 word alt.
- Admin button "Generate alt text for all missing" runs in batches of 10.
- Stored in new `image_alt` column on `products`.

**Internal link suggestions**
- Page `src/pages/admin/AdminInternalLinks.tsx`. For each product/blog post, suggest 3 related items by category overlap + tag overlap. One-click "Insert link" appends to description.

**Auto Product+Offer+AggregateRating schema**
- Already partially done; extend `buildProductSeo` to always emit `Offer` (priceCurrency INR, availability InStock, url canonical) and `AggregateRating` when stats exist.

**Breadcrumb JSON-LD**
- Helper `buildBreadcrumbJsonLd(pathSegments)` used on ProductDetail, BlogPost, AllTools.

---

## Phase 5 — Analytics Deepening

**New event types** (insert into existing `site_analytics`, no schema change needed — `event_type` is free text):
- `product_view`, `whatsapp_click`, `checkout_click`, `search_query`.

**Click tracking (heatmap-lite)**
- New table `click_events (id, page_path, x_pct, y_pct, element_tag, element_text, viewport_w, created_at)`.
- Client samples 30% of sessions (seeded by visitorId hash) and forwards clicks (debounced 250ms). Admin-only insert restriction lifted to public insert with strict size limits.
- Admin page `/admin/heatmap` renders an SVG overlay of dots per path (top 20 paths dropdown).

**UTM dashboard**
- Capture `utm_source/medium/campaign/content/term` on first load (sessionStorage) and include in every analytics insert as `metadata` jsonb (add column if missing).
- `/admin/utm` shows top campaigns, sources, conversion rate to WhatsApp/checkout click.

**Funnel view**
- `/admin/funnel`: visits → product_view → whatsapp_click OR checkout_click. Stacked bar + dropoff %.

**Top search queries**
- Wire existing `SearchBar`/`SearchModal` to log `search_query` event with the query string. Admin page shows top 50 (last 30/90/all days).

**Geo map**
- `/admin/geo`: world/India map (react-simple-maps) with circles sized by visit count, using existing `country`/`city` columns.

---

## Phase 6 — AI Tools

**AI product description generator (admin)**
- Edge function `ai-product-copy`: input `{ product_name, category, key_features?[] }` → outputs `{ description, seo_title, seo_description, keywords }` via Gemini 3 Flash with structured output.
- Button in admin product form: "✨ Generate copy" → fills the fields (user reviews before save).

**Storefront AI chatbot**
- Bottom-right floating bubble (above the WhatsApp FAB so both are visible).
- Edge function `storefront-chat` (`verify_jwt = false`) using AI SDK + tools:
  - `searchProducts({ query, category? })` — SELECT from products
  - `getProductDetails({ id_or_slug })`
  - `listCategories()`
  - `recommendProducts({ budget?, use_case? })`
- Streams responses to client via AI SDK UI (`useChat`). Markdown rendered with `react-markdown`. History persisted in `localStorage` only (no DB).
- System prompt: Dreamcrest assistant, recommends from catalog, always hands off to WhatsApp for final checkout, never invents products.

**AI category auto-tagger**
- Admin button on product list "Auto-categorize uncategorized": batches 20 products → Gemini Flash with structured output enum of existing categories → fills `category`.

---

## Technical Notes

**New tables / columns**
```
blog_posts (new)
click_events (new)
products + seo_title, seo_description, seo_keywords, og_image_url, image_alt
site_analytics + metadata jsonb (UTM + extras)
```

**New edge functions**
```
image-alt-gen        — image → alt text
ai-product-copy      — name/category → description+SEO
storefront-chat      — streaming chat with product tools
sitemap-xml          — dynamic sitemap incl. products + blog
```

**New routes**
```
/blog, /blog/:slug
/admin/reviews, /admin/blog, /admin/internal-links, /admin/heatmap,
/admin/utm, /admin/funnel, /admin/search-queries, /admin/geo
```

**Dependencies to add**
```
react-markdown, remark-gfm, react-simple-maps, d3-scale (for geo bubbles)
```

**Order of execution**
1. Finish Phase 1 wiring (smallest, immediate visible win).
2. Phase 2 (WhatsApp + social proof — pure frontend, no migrations).
3. Phase 4 SEO migration + auto schema (small migration, big SEO lift).
4. Phase 3 Blog CMS (migration + routes + admin).
5. Phase 5 Analytics (migration + 5 admin pages — largest).
6. Phase 6 AI (3 edge functions + chatbot UI).

Each phase ends with a build-pass check and a visual QA on the affected pages.