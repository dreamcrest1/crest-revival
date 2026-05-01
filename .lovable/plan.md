## Goal
Make every product on the site automatically discoverable on Google for affordability/group-buy style searches like "cheap Netflix", "group buy ChatGPT", "affordable Canva Pro India", "buy Claude AI cheap" — with zero manual SEO work, even for products you add later in the admin panel.

## How it works (auto-generated SEO per product)

Every product the admin adds gets, automatically:

1. **A unique product page URL** — `/product/<slug>` (e.g. `/product/netflix-premium`). The slug is generated from the product name.
2. **Auto-generated SEO title** — e.g. *"Netflix Premium – Cheap Netflix Subscription India | Group Buy at ₹199 | Dreamcrest"*
3. **Auto-generated meta description** — e.g. *"Buy affordable Netflix Premium in India at ₹199 (80% OFF). Genuine group buy Netflix subscription with instant WhatsApp delivery & warranty. Cheapest in India."*
4. **Auto-generated keywords** built from a template applied to the product name + category:
   - `cheap <name>`, `affordable <name>`, `<name> India`
   - `group buy <name>`, `<name> group buy India`
   - `buy <name> cheap`, `<name> subscription cheap`
   - `<name> at lowest price`, `<name> discount`, `<name> deal India`
   - Category-specific extras (e.g. for OTT: "OTT subscription cheap"; for AI: "AI tool group buy")
5. **Product schema (JSON-LD)** — full `Product` + `Offer` + `AggregateRating` markup so Google shows price, stock, and rating in search results (rich snippets).
6. **Canonical URL** — points to `/product/<slug>` so duplicates don't compete.
7. **OpenGraph + Twitter cards** — uses the product image so WhatsApp / Twitter shares look polished.
8. **Sitemap auto-includes every product** — a runtime endpoint `/sitemap.xml` (served by an edge function) regenerates from the live database, so newly added products are discoverable by Google within hours, not after a rebuild.

## What changes in code

### 1. New helper: `src/lib/productSeo.ts`
Pure function `buildProductSeo(product)` returning `{ title, description, keywords, jsonLd, slug }`. Templates power the keywords so adding new products needs zero work.

### 2. New page: `src/pages/ProductDetail.tsx` at route `/product/:slug`
- Looks up product by slug from `useProducts()` (works live AND from the static fallback).
- Renders the existing product modal layout as a full page (image, price, description, Buy / WhatsApp / Cart buttons).
- Wraps it in `<SEOHead>` with the auto-generated title/description/keywords/JSON-LD.
- 404s gracefully if slug doesn't match.

### 3. Update `ProductCard.tsx`
- The "View Details" button becomes a `<Link to={/product/slug}>` so each card is a real crawlable page (still keeps the quick-view modal on card click for UX).
- Adds `itemProp` microdata on the card for extra signal.

### 4. Update `Products.tsx` JSON-LD
- Each `ItemList` entry uses the new `/product/<slug>` URL so Google can crawl into individual product pages.

### 5. Dynamic sitemap (edge function)
- New edge function `sitemap` that queries `products` table and returns a fresh `sitemap.xml` containing every active product URL with `lastmod` from `updated_at`.
- Update `public/.htaccess` to redirect `/sitemap.xml` to the edge function URL.
- Fallback: if the function fails, the existing static `public/sitemap.xml` still works.

### 6. Slug stability
- Slugs are derived from name (lowercased, hyphenated, stripped of special chars). To prevent broken links if the admin renames a product, we also accept lookup by **id** as a fallback (`/product/<slug>` still resolves if name changed, by checking id-suffix or by slug matching).

## Example: what Google sees for a new product

Admin adds: **"Claude AI Pro"** in category **"AI Tools"** at ₹299.

Auto-generated:
- **URL**: `https://dreamcrest.net/product/claude-ai-pro`
- **Title**: `Claude AI Pro – Cheap Claude AI India | Group Buy at ₹299 | Dreamcrest`
- **Description**: `Buy affordable Claude AI Pro in India at ₹299. Genuine group buy Claude AI subscription with instant delivery & warranty. Cheapest AI Tools deal in India — Dreamcrest Solutions.`
- **Keywords**: `cheap claude ai pro, affordable claude ai pro, claude ai pro india, group buy claude ai pro, buy claude ai pro cheap, claude ai pro subscription cheap, claude ai pro discount, claude ai pro lowest price, AI tool group buy, cheap AI tools india`
- **Sitemap**: included automatically on next crawl.

No manual work — admin just adds the product and walks away.

## Files touched
- `src/lib/productSeo.ts` (new)
- `src/pages/ProductDetail.tsx` (new)
- `src/components/ProductCard.tsx` (Link to product page)
- `src/pages/Products.tsx` (use product URLs in JSON-LD)
- `src/App.tsx` (add `/product/:slug` route)
- `supabase/functions/sitemap/index.ts` (new edge function)
- `public/.htaccess` (rewrite `/sitemap.xml` to function — with static fallback)

## Maintenance note
Once shipped, you do nothing. Every product you add via the admin panel automatically gets its own SEO-optimized page, keyword set, schema markup, and sitemap entry. Google indexing typically takes 1–7 days per new URL.