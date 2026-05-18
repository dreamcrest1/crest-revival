## Fix missing product images/logos in AiToolsShowcase

### Root cause

`AiToolsShowcase.tsx` renders images with only `proxyImage(tool.image, 400)`. Many sheet rows have empty/broken `image` fields, and there's no fallback. The `/ai-tools` page works because it uses a `BrandLogo` component with a 4-step source chain:

1. Curated `meta.logo` (from `aiToolMeta`)
2. Clearbit: `https://logo.clearbit.com/{meta.domain}?size=256`
3. Google favicon: `https://www.google.com/s2/favicons?domain={meta.domain}&sz=256`
4. Sheet image proxied via weserv
5. Final fallback: render `tool.symbol` text on the brand color

The showcase skips all of this, so most cards end up on `/placeholder.svg`.

### Fix

1. Extract `BrandLogo` from `src/pages/AiTools.tsx` into a shared component `src/components/ai/BrandLogo.tsx` (props: `tool: AiTool`, optional `size` / `compact` for the smaller showcase cards). Keep the existing fallback chain, brand-colored gradient background, and dot pattern.
2. Update `src/pages/AiTools.tsx` to import the shared `BrandLogo` instead of its local copy.
3. In `src/components/AiToolsShowcase.tsx`, replace the three `<img src={proxyImage(tool.image, 400)} … />` blocks (mobile card, desktop/tablet card, detail panel) with `<BrandLogo t={tool} />`, wrapped in the existing `aspect-square` container. For the detail panel's small 80–128px tile, pass a `compact` variant that hides the category chip and reduces padding.
4. Remove the now-unused `proxyImage` import from `AiToolsShowcase.tsx` if nothing else uses it.

### Out of scope

No changes to data fetching, orbit animation, mobile coverflow logic, selection state, or styling beyond swapping the image element.
