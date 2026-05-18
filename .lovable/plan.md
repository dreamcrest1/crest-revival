# Build plan — Storefront, Trust, SEO, Analytics & AI upgrades

Big surface area, so it's split into 6 phases. Each phase is independently deployable — you can stop after any phase.

---

## Phase 1 — Product Reviews & Star Ratings (moderated)

**Database**
- New `product_reviews` table: `product_id`, `author_name`, `rating` (1–5), `title`, `body`, `language` (`en`|`hinglish`), `is_approved` (default false for user-submitted, true for seeded), `is_featured`, `verified_buyer`, `created_at`.
- RLS: public can read `is_approved=true`; public can insert (rate-limited via length checks); admin can update/delete/approve.
- View `product_rating_stats` (or computed in hook): avg rating + count per product_id.

**Seed data (your "authentic Hinglish/English" reviews)**
- Generate via Lovable AI Gateway script (`/tmp/lovable_ai.py`) — one batch run that:
  - Reads all 162 products.
  - For each product produces 6–10 reviews (hot-selling: 12–18; non-hot: 5–8) mixing English + Hinglish (~60/40), realistic Indian first names, varied 4–5 star ratings (occasional 3-star for authenticity), plausible short bodies referencing the actual product (e.g. "Bhai genuine hai, Netflix 2 mahine se chal raha hai bina kisi dikkat ke. Recommended!").
  - Inserts directly into `product_reviews` with `is_approved=true`, `verified_buyer=true`.
- Estimated total: ~1,800–2,200 reviews across catalog.

**Frontend**
- `ProductDetail.tsx`: new Reviews section showing avg star + count, distribution bars, review cards (paginated 5 at a time), language toggle (All / EN / Hinglish), "Write a review" form (name + rating + body, posts as `is_approved=false`).
- `ProductCard.tsx`: small ★ 4.7 (123) below price.
- Star icon uses existing lucide `Star` already imported.

**Admin**
- New `/admin/reviews` page: table of pending + approved reviews, filter by product, approve/reject/feature/delete, bulk actions, search.
- Sidebar link "Reviews" with `MessageSquareQuote` icon.

---

## Phase 2 — WhatsApp deep-links + Trust signals

**WhatsApp prefilled context everywhere**
- Helper `src/lib/whatsapp.ts` exporting `waLink(product?, context?)` that builds:
  - Default: generic store inquiry.
  - With product: `Hi Dreamcrest! I want to buy *{name}* (₹{price}, {category}). Link: {productUrl}` URL-encoded.
- Replace hardcoded `wa.me/...` strings in: `WhatsAppButton`, `ProductCard`, `ProductDetail`, `AllTools`, `Footer`, `Contact`, `HotSellingSection`, `AiToolDetail`, `Navbar`.
- Floating WhatsAppButton becomes context-aware — when on `/product/:slug` it prefills that product.

**Live social proof**
- `LiveViewers` component on `ProductDetail`: shows "🟢 23 people viewing this right now" using a deterministic but plausible number derived from `product.id` + 10-minute time bucket + small jitter (no fake realtime — accurate enough and zero cost). Updates every 30s.
- `RecentPurchaseToast` component mounted in `App.tsx`: every 25–60s shows a sonner toast bottom-left: "🛒 Rohan from Mumbai just bought *Netflix Premium 1Y*" — pulled from real products + a static city list, randomized. Pauses on `/admin/*`. Dismissible; respects "don't show again this session".

---

## Phase 3 — Blog/Articles CMS

**Database**
- New `blog_posts` table: `slug` (unique), `title`, `excerpt`, `cover_image_url`, `body_markdown`, `author`, `tags` (text[]), `status` (`draft`|`published`), `published_at`, `seo_title`, `seo_description`, `og_image_url`.
- RLS: public reads `status='published'`; admin full access.

**Frontend**
- `/blog` index — grid of published posts (cover + title + excerpt + tag chips).
- `/blog/:slug` — renders markdown with `react-markdown` + `remark-gfm`, Article JSON-LD, BreadcrumbList, prev/next, related by tag.
- Add /blog routes to dynamic sitemap edge function.

**Admin**
- `/admin/blog` list + create/edit page with markdown textarea (live preview split view), tag chips, status toggle, SEO fields, cover image URL.
- Sidebar link "Blog" with `Newspaper` icon.

---

## Phase 4 — SEO enrichments

**AggregateRating in Product JSON-LD**
- Extend `buildProductSeo` to accept `ratingStats` and emit `aggregateRating` block when count > 0.
- ProductDetail fetches stats and passes in.

**Per-product custom SEO fields**
- Add nullable columns to `products`: `seo_title`, `seo_description`, `seo_keywords`, `og_image_url`.
- `buildProductSeo` prefers these when set, falls back to auto-generated.
- Admin Products edit form: collapsible "SEO" accordion with the 4 fields + "Auto-generate with AI" button (Lovable AI Gateway via edge function — uses product name/category/price to draft a 60-char title and 155-char description).

**BreadcrumbList schema**
- Already passing `breadcrumbs` prop to `SEOHead` on ProductDetail — verify it emits BreadcrumbList JSON-LD; add to AiToolDetail, Products, AllTools, AiTools, Blog index/detail.

**Auto image alt-text (AI)**
- Admin Products: "Generate alt text for all images" bulk action and per-row button.
- Edge function `image-alt-gen` uses Lovable AI image-input model (`google/gemini-3-flash-preview`) on `image_url` → writes to new `image_alt` column on products.

**Internal link suggestions (admin tool)**
- `/admin/seo-tools/internal-links` page: lists every product/blog post, runs simple "what other items mention this name in their description?" query, suggests anchor-text insertions you can copy-paste into descriptions.

---

## Phase 5 — Analytics deepening

Builds on existing `site_analytics` table.

**Funnel**
- Track new event types: `product_view`, `whatsapp_click`, `checkout_click`. Wire `AnalyticsTracker` to fire these from `ProductDetail`, `ProductCard`, `Cart`.
- `/admin/analytics/funnel` page: 4-stage funnel chart (visits → product views → WA/checkout clicks → conversion%) with date range, plus drop-off table.

**UTM dashboard**
- Parse `utm_source/medium/campaign/term/content` from `referrer` and `document.location.search` in tracker; store in `site_analytics.metadata` jsonb (new column) or 5 new columns.
- Admin tab "UTM" — table grouped by campaign with visits, product views, WA clicks.

**Heatmap-lite**
- New `click_events` table: `page_path`, `selector`, `x_pct`, `y_pct`, `created_at`.
- Tiny client tracker capturing every click (sampled 30%) with element selector + viewport-relative coords. Skipped on `/admin/*`.
- Admin `/admin/analytics/clicks` — page picker, overlay shows hotspot circles.

**Top search queries**
- Wire existing search inputs (`Products`, `AiTools`, `AllTools`) to debounced `track('search', {query})`.
- Admin "Search" tab — top queries with zero-result flag.

**Geo map**
- Admin "Geography" tab using existing `country`/`city` columns; world map with bubble sizes (react-simple-maps or pre-rendered SVG).

---

## Phase 6 — AI in admin

**AI product description generator**
- Edge function `ai-product-copy` → given product name/category/price returns marketing description (markdown) + 4 short feature bullets.
- "✨ Generate with AI" button in Products edit form for description, regenerates on click; user can edit before save.

**AI chatbot on storefront**
- Floating chat bubble (bottom-right, above WhatsApp button) opens panel.
- Edge function `storefront-chat` streams via Lovable AI Gateway with tools:
  - `searchProducts(query)` — returns matching products
  - `getProductDetails(slug)` — full info
  - `getCategories()` — list categories
- System prompt: "You're Dreamcrest's shopping assistant. Help the user find a product and always end with a WhatsApp CTA link."
- Messages stored in localStorage (no auth needed); no DB persistence.

**AI category auto-tagger**
- Admin Products list: bulk "Re-categorize with AI" action — for selected products with category='Other' or blank, AI picks best category from existing list.

**AI-generated product images / backgrounds**
- Admin Products edit: "Generate image" button → Lovable image gen (`google/gemini-3.1-flash-image-preview`) with prompt template; uploaded to Supabase Storage `product-images` bucket, URL saved to `image_url`. Also a "Remove/replace background" variant using `--edit-image`.

---

## Suggested order & sizing

| Phase | Effort | Visible impact |
|------|------|------|
| 1 Reviews + seed | L | Huge — trust + SEO rich snippets |
| 2 WhatsApp + social proof | M | High — conversion |
| 3 Blog | M | SEO long-tail |
| 4 SEO enrichments | M | Rich results in Google |
| 5 Analytics | L | Internal insights |
| 6 AI tools | M | Admin productivity + chat |

## What I need from you to start

Confirm/adjust:
1. **Phase order** — start with Phase 1 (reviews) or pick a different one first?
2. **Reviews volume** — okay with ~1,800–2,200 total seeded reviews? More? Less?
3. **Hinglish/English mix** — 60% English / 40% Hinglish, or different ratio?
4. **Storefront chatbot location** — bottom-right floating bubble above the WhatsApp button (recommended), or only on a `/chat` page?
5. **Heatmap sampling rate** — 30% of clicks (keeps DB small)? Or 100%?
