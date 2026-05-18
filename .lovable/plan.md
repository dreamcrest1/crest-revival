## Goal
Take the four analytics screens (Funnel, Heatmap, Geo) from text/dots into real, decision-grade dashboards, and add a new **Top Categories & Top Products** insights section that uses product imagery. Then layer in lightweight "voice of customer" features so you can tell what users actually want and feel.

## 1. Funnel — drastically upgraded
Rebuild `AdminFunnel.tsx` from a 4-bar list into a real conversion dashboard:
- True trapezoid/horizontal funnel SVG with proportional widths.
- 5 stages: **Visits → Product views → WhatsApp clicks → Checkout clicks → (estimated) Conversions** (conversion = unique visitors who fired checkout_click + whatsapp_click).
- For each stage: count, **step-over-step %**, drop-off count, and color (green/amber/red) based on benchmark thresholds.
- Period selector adds **vs. previous period** delta (e.g. "30 d vs prior 30 d, +12%").
- "Top drop-off pages" mini-list under the funnel (pages with most product_view → no whatsapp/checkout follow-up).
- Per-device split toggle (Desktop / Mobile / Tablet) using `site_analytics.device_type`.
- "Top converting source" using captured UTM/`referrer`.

## 2. Heatmap — real heatmap, not red dots
Rebuild `AdminHeatmap.tsx`:
- Render a **true density heatmap** via a `<canvas>` with stacked radial gradients (blue → green → yellow → red), instead of 4 px circles.
- Background: a thumbnail screenshot of the selected route (capture via `html2canvas` once on demand, cached to localStorage for the admin).
- Filters: **page**, **device type**, **viewport width bucket**, **date range**.
- New side panel "**Top clicked elements**" — top 15 by `element_text` (ranked, with counts and tag chip).
- "**Rage-click**" detector — element_text values with ≥3 clicks within 1 s by same visitor, flagged at top.

## 3. Geo — visual map
Rebuild `AdminGeo.tsx`:
- Add `react-simple-maps` (~50 KB) with two tabs:
  1. **World**: choropleth + bubble overlay sized by visits per country.
  2. **India**: focused India map with city bubbles (matches the brand's India-first vibe).
- Cards alongside: Top 10 countries, Top 25 cities, **fastest-growing city this week vs last**, device split per top country.
- Region click → drill-down list of cities.
- Hour-of-day chart of visits per top country (helps decide WhatsApp reply window).

## 4. New "Top categories & top products" insights
New section on `AdminDashboard.tsx` (and link in sidebar as **Insights**):
- **Top categories visited** — horizontal bar chart, top 8 categories by `product_view` count over selected window. Each row shows category name, count, and a stack of 3 product mini-thumbnails from that category.
- **Top categories clicked** (intent) — same chart for combined `whatsapp_click + checkout_click`, side-by-side so you see "viewed vs. wanted".
- **Top products by views** — visual grid: 10 product cards (square image, name, view count, WhatsApp-click count, conversion %).
- **Top products clicked** — same grid sorted by WhatsApp clicks → shows real buying intent.
- Powered by joining `site_analytics.metadata->>product_id` with `products` (name, image_url, category). One small change to `trackEvent('product_view')` and `trackEvent('whatsapp_click')`: also include `category` in metadata so we don't need a DB join for every count.

## 5. Voice-of-customer / sentiment — recommendations
A new admin page **Insights → Voice of Customer**, powered by Lovable AI (free Gemini Flash, no API key):
- **Daily AI Summary** — once a day, an edge function reads the last 24 h of `search_queries`, `site_analytics` (product_views, clicks), `error_logs`, and `product_reviews`, and asks Gemini Flash to output a 5-bullet "What users wanted today / What blocked them / Top emerging demand" brief. Stored in a new `daily_insights` table; shown at the top of the admin dashboard.
- **Search-intent clusters** — group raw search queries into clusters ("free / lifetime / cheap", "tool name X", "missing tool Y") using Gemini Flash embeddings nightly; surface "demand we don't supply yet" so you can add the right products.
- **Review sentiment** — auto-classify every new `product_reviews` row into positive/neutral/negative + 1-line summary via Gemini Flash; show per-product sentiment bar and most-negative quotes.
- **Exit-intent micro-survey** (front-end, opt-in) — when a visitor moves cursor to close tab on `/products` or `/all-tools` without clicking, show a 1-question modal: "What were you looking for?" Free text saved to a new `exit_feedback` table. This is the highest-signal data you can collect.
- **WhatsApp question capture** (optional) — replace the WhatsApp deep-link click with a tiny modal "What's your question?" → logs the intent → then forwards to WhatsApp with the question pre-filled. Tells you what people ask before they leave the site.
- **NPS / mood widget** (optional later) — single-emoji 😡 😐 😍 footer widget on product pages.

## Tech notes
- New deps: `react-simple-maps` (geo), `d3-geo` (already a peer), `html2canvas` (heatmap screenshot, lazy-loaded inside admin only — never shipped to public bundle).
- New DB: `daily_insights` table, `exit_feedback` table, optional `review_sentiment` column on `product_reviews`. Edge function `generate-daily-insights` scheduled via pg_cron or run on first admin visit each day.
- All new charts use existing semantic tokens (orange primary, glass cards) — keeps Star Wars theme intact.
- Heatmap canvas + geo maps lazy-loaded so admin bundle stays small.

## Out of scope
Full session replay (rrweb) — recommended but expensive in storage; flagged as a follow-up.
