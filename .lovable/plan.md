## Goal

Match `oimo.io/works` exactly: a grid of square tool thumbnails, each visually **hung from two strings with an "×" anchor above**, gently swaying on hover. Static layout, light DOM, no Three.js / physics engine.

## What changes

### 1. New component `src/components/ai/HangingToolsGrid.tsx`

A pure CSS + SVG grid replacing the current 3D Canvas.

**Per-row structure** (each row repeats):
```text
   ×   ×   ×   ×   ×   ×          ← anchor row (small × marks)
  /\  /\  /\  /\  /\  /\          ← two diagonal SVG strings per tile
 [□] [□] [□] [□] [□] [□]          ← square tool tile
```

- Anchor `×` is a small monospace glyph (`text-foreground/40`) centered over each tile.
- Two strings drawn as a single inline `<svg>` per tile: two `<line>` elements going from the top-left and top-right corners of the tile upward to converge near the × point. Stroke `currentColor` at `text-foreground/30`, 1px.
- Tile = square `aspect-square` div containing the existing `BrandLogo` (we already have it) + a small caption strip at the bottom with the tool name and price.
- Tile shadow + subtle rounded corners; click navigates to `/ai-tool/<slug>` or opens the WhatsApp/checkout flow.

**Sway interaction** (the only "animation"):
- Each tile uses `transform-origin: top center` and a CSS variable `--sway` driven by `transform: rotate(var(--sway))`.
- Idle state: each tile has a tiny randomized infinite keyframe `swayIdle` (±0.4deg, 6–9s, random delay) so the whole grid breathes like hung objects.
- On hover of a tile: amplitude bumps to ±2deg for ~1.2s via a `:hover` keyframe override, then settles back.
- Strings are siblings inside the same wrapper that also rotates → they swing together with the tile.

**Responsive layout**:
- 6 columns on `lg`, 4 on `md`, 3 on `sm`, 2 on mobile.
- Rows are separated by `gap-y-10` to leave room for the next row's strings + ×.
- The whole thing lives inside a max-width container, no canvas.

### 2. `src/pages/AiTools.tsx`

- Remove the `lazy(() => import('@/components/ai/PhysicsPlayground'))` import and its `<Suspense>` wrapper.
- Replace with a direct import of `HangingToolsGrid` and render it in the same slot (above the trust strip), fed by `trending` (all tools, not capped at 28).
- The existing filter / search / category grid below stays untouched — the hanging grid is the "Works" style hero, the filter grid below is the real shopping UI.

### 3. Cleanup

- Delete `src/components/ai/PhysicsPlayground.tsx`.
- Remove `@react-three/cannon` and `cannon-es` from `package.json` (`bun remove`). `three`, `@react-three/fiber`, `@react-three/drei` stay since other components use them.

## Technical notes (for the implementer)

- Pure presentational component, no state, no refs to physics — entirely DOM + CSS.
- Strings drawn with SVG (not CSS borders) so they stay crisp at any zoom and can use the row's text color token.
- Randomization of sway delay/duration is computed once per tile from a hash of `tool.id` so it's stable across renders (no hydration flicker, no `Math.random()` in render).
- All colors via design tokens (`text-foreground`, `border-border`, `bg-card`) — no raw hex in JSX.
- No `framer-motion` or extra deps. Plain `@keyframes` in `tailwind.config.ts`.

## Out of scope

- No drag/drop, no gravity, no click-to-throw. The original oimo grid doesn't have those either on `/works`.
- No changes to the search/filter grid, SEO, or any other Castle Tools content.
