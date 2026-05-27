## 1. Remove reviews site-wide and from admin

**Storefront removals:**
- `src/pages/ProductDetail.tsx` — remove `<GeneratedReviews>` (line 421), `<ProductReviews>` (line 422), `StarRow` block (line 284), and the `useRatingStats` import/usage. Strip `aggregateRating` from `buildProductSeo` call.
- `src/pages/AiToolDetail.tsx` — remove `<GeneratedReviews>` (line 237) and import.
- `src/components/ProductCard.tsx` — remove rating badge if present.
- `src/components/HotSellingSection.tsx`, `src/pages/Index.tsx`, anywhere else surfacing `StarBadge` / rating stats — strip the rating UI.
- `src/lib/productSeo.ts` — remove `aggregateRating` injection in the JSON-LD builder.

**Admin removals:**
- Delete page `src/pages/admin/AdminReviews.tsx`.
- `src/App.tsx` — remove the `AdminReviews` import and `<Route path="reviews" …>`.
- `src/components/admin/AdminSidebar.tsx` — remove the "Reviews" menu item and `Star` icon import.
- `src/pages/admin/AdminInsights.tsx` — drop the "Review sentiment" card, "Classify new" button, the `reviews` query, and the sentiment tally.

**Files we keep but no longer reference** (safe to leave; removing them is optional cleanup):
- `src/components/ProductReviews.tsx`, `src/components/GeneratedReviews.tsx`, `src/components/StarBadge.tsx`, `src/hooks/useProductReviews.ts`, `src/lib/generateReviews.ts` — delete to avoid dead code.
- DB tables `product_reviews` and the `product_rating_stats` view remain untouched (no destructive migration) so old data is preserved.

## 2. Fix the heatmap

Two real problems:

**A. No clicks are being captured.** `click_events` table is empty. Cause: `initClickTracking` only samples 30 % of visitors AND immediately bails on `/admin/*`. Bump sampling to 100 % for now so we get real coverage, and also fire on `pointerdown` instead of `click` so taps register.

**B. Screenshot only captures the preloader.** `captureScreenshot` opens the page in a hidden iframe and snapshots after 2.2 s, but the preloader animation in `Preloader.tsx` is still on screen for ~3 s. Fix:
- Append `?nopreload=1` to the iframe URL.
- In `Preloader.tsx`, when `URLSearchParams` contains `nopreload=1`, skip the preloader entirely (call `onComplete` synchronously).
- Bump wait to 3.5 s and scroll the iframe to top before capture.

## 3. Improve Insights

Rework `AdminInsights.tsx`:
- Drop the review-sentiment block.
- Add **Headline KPIs** row: visits, unique visitors, intent rate (WA + checkout / product views), top device split.
- Add **"Searched but not bought"** card — pulls last 50 `search_query` events and flags terms where no `product_view` or `whatsapp_click` followed from the same visitor (queries `site_analytics`).
- Add **"Pages with most rage clicks"** card from `click_events`.
- Add **"Hot rising products"** — products whose 7-day view delta vs prior 7-day is largest.
- Keep top categories, top products by views/clicks, exit feedback, AI daily brief.
- Add a "What changed vs previous period" delta to each KPI card.

Update `supabase/functions/generate-insights/index.ts` daily-mode prompt:
- Remove the `reviews` fetch.
- Add `add_to_cart`, `checkout_click`, `tool_whatsapp_click` to the totals reasoning.
- Pass top searched-but-no-conversion terms into the prompt so the brief surfaces inventory gaps.
- Tighten the brief format to 4 sections (drop sentiment-related guidance).

## 4. Error logs / React error #310

Production logs show repeated `Minified React error #310` ("Rendered more hooks than during the previous render") only on `/product/<slug>` URLs. Two contributing risks in `ProductDetail.tsx`:

1. After the reviews removal above, the `useRatingStats` hook is gone — which itself was passing `''` as productId on the first render and the real UUID on the second. Removing it eliminates one moving hook.
2. As a defensive measure, also wrap the `<ProductReviews>` removal so no child component re-keys hooks mid-render. Verify by reading `errorReporter` again after a rebuild — error logs older than the next deploy will still show, but new occurrences should stop.

For `AdminErrorLogs.tsx`: add a "Clear resolved" bulk-delete button (admins only) so once we ship the fix the old #310 entries can be cleared in one click.

## Technical notes
- Reviews DB tables and storage are NOT dropped — only the UI/routes/components. Safe to revert by re-adding components.
- Click tracking change is sampling-only; data volume per visitor is unchanged (still debounced).
- No schema migration required for any of this.
- After approval, you'll need a fresh `bun run build` and re-upload of the `dist` to cPanel for the storefront fixes (especially the #310 error) to take effect — same flow as before.
