## Goal

Replace the current `AiToolsShowcase` at the top of the homepage with a 3D sphere of ~40–60 product/AI-tool logos that auto-rotates, can be dragged to spin, and opens the product on click — fast on mobile, no jank.

## Tech choice

- **react-three-fiber `@^8.18` + drei `@^9.122` + three `>=0.133`** (pinned per project constraint).
- No models, no textures, no postprocessing. Just `<Billboard>` planes with the logo `<Image>` per item — extremely cheap to render.
- Lazy-loaded via `React.lazy` + `Suspense` so the WebGL bundle (~150KB gz) never blocks first paint. SSR-safe fallback is a static logo grid.

## Implementation

1. **New component** `src/components/ProductGlobe.tsx`
   - Builds positions on a sphere using the Fibonacci lattice (even distribution, no clumping).
   - Each logo = `<Billboard>` + `<Image>` (drei) at radius ~3, size auto-scaled by viewport.
   - Group auto-rotates on Y at ~0.15 rad/s; `OrbitControls` enabled with `enableZoom={false}`, `enablePan={false}`, damping on, autoRotate handed off to OrbitControls itself.
   - On pointer down → pause auto-rotate; on pointer up + 2s idle → resume (mirrors the AiToolsShowcase pause-on-hover behavior).
   - Click a logo → navigate to `/product/{slug}` (products) or `/ai-tools/{slug}` (AI tools) using the same slug helpers already in `src/lib/productSeo.ts` / `aiToolSeo.ts`.
   - Hover → logo scales 1.15× + soft orange glow ring (matches brand HSL 24 95% 53%).

2. **Data source** `useMemo` merging:
   - `useProducts().hotSelling` (or top ~30 by sort_order)
   - `useAiTools()` top ~20 by `popularityFor`
   - Dedupe by normalized name, cap at 60.
   - Each entry: `{ name, image, href }`.

3. **Performance guardrails**
   - `<Canvas dpr={[1, 1.5]} frameloop="demand"` then re-render on rotation tick (or `frameloop="always"` with `gl={{ antialias: false, powerPreference: 'high-performance' }}`).
   - `useReducedMotion()` → static grid fallback, no Canvas mounted.
   - `IntersectionObserver` via `react-intersection-observer`: only mount the Canvas when in viewport; unmount when scrolled away (pauses GPU work).
   - Mobile (`< 640px`): cap items to 30, smaller radius, smaller logos, `dpr={[1, 1]}`.
   - All logos preloaded through drei's `useTexture.preload` with cached URLs; `<Image>` toneMapped={false}.
   - No shadows, no lights beyond `<ambientLight intensity={1} />`.

4. **Layout** in `src/pages/Index.tsx`
   - Replace `<AiToolsShowcase />` with `<ProductGlobe />` (lazy + Suspense).
   - Section: ~520px tall desktop / 360px mobile, transparent bg so hyperspace background shows through.
   - Heading "Explore Our Universe of Tools" + small caption + scroll hint chevron under the globe.

5. **Cleanup**
   - Keep `AiToolsShowcase.tsx` file (not delete) but unused — easy revert.
   - Memory: update `mem://style/visual-identity` with the new globe section.

## Packages

```
bun add three@^0.160 @react-three/fiber@^8.18 @react-three/drei@^9.122 react-intersection-observer
```

## Files

- New: `src/components/ProductGlobe.tsx`
- Edit: `src/pages/Index.tsx` (swap component, add lazy boundary)
- Edit: `mem://style/visual-identity` + `mem://index.md`

## Mobile-perf checklist

- Lazy-load behind Suspense — homepage TTI unchanged.
- IntersectionObserver mount/unmount.
- DPR clamped to 1 on phones.
- 30-logo cap on mobile vs 60 on desktop.
- `prefers-reduced-motion` → static grid fallback.
- No shadows / lights / postprocessing.
- Single draw call per logo (Billboard plane); ~30 draw calls on mobile is comfortably 60fps even on mid-range Androids.
