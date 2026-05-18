## Glide-style coverflow for Hot Selling

Replace the 12-card grid with a 3D coverflow carousel inspired by the Glide reference: one large center cover, side covers angled like open book panels receding into perspective, plus prev/next arrows and dot indicators.

### Build

Rewrite `src/components/HotSellingSection.tsx`:

- Keep header + "View all" link unchanged.
- Below header, render a new `<HotSellingCoverflow items={items} />` component (defined in the same file or a sibling `HotSellingCoverflow.tsx`).
- Carousel stage: `relative h-[520px] md:h-[600px]` with `perspective: 1400px`, gradient edge fades on left/right.
- Track 5 visible cards at a time (`offsets -2..+2`); cards outside that range are not rendered.
- Per-card transform driven by signed offset from active:
  - `translateX = offset * 240px` (desktop) / `170px` (mobile)
  - `rotateY = offset * -45deg` (book-door angle from the gif)
  - `translateZ = -|offset| * 120px`
  - `scale = 1 - |offset| * 0.12`
  - `opacity = offset===0 ? 1 : |offset|===1 ? 0.85 : 0.45`
  - `zIndex = 10 - |offset|`
  - Use `framer-motion` `animate` with spring `stiffness: 220, damping: 28`.
- Card itself: ~`240×340px` desktop / `170×240px` mobile, glassmorphic with primary glow on the focused card (`shadow-[0_30px_80px_-15px_hsl(var(--primary)/0.7)]`, `border-primary`), dimmer border for side cards.
- Card content uses the existing `ProductCard` look distilled: square product image up top (reuse the product's image, fallback `/placeholder.svg`), gradient overlay, name + price + discount badge + HOT badge — matching the style in the second uploaded screenshot.
- Center card is clickable → navigates to product detail; side cards click → set that index as active (no navigation).

### Controls and interaction

- Prev/Next round arrow buttons absolutely positioned left/right center, like the Glide reference (`bg-card/60 border border-white/10 hover:border-primary`).
- Dot indicators below, active dot wider (matches existing `AiToolsShowcase` pattern).
- Auto-advance every 4500ms; pause while user is hovering the stage or has just interacted.
- Touch/pointer drag: horizontal swipe past 60px advances ±1. Use the same `dragging`/`movedSinceDown`/`DRAG_THRESHOLD = 6` ref pattern as `AiToolsShowcase` so taps on the center card still navigate.
- Keyboard: ArrowLeft/ArrowRight when the stage is focused.

### Responsive

- Mobile (`<768px`): smaller card 170×240, translateX 95px, render only offsets -1..+1, stage height 380px.
- Tablet (`768–1024px`): 210×290, translateX 180px, offsets -2..+2, stage height 500px.
- Desktop (`≥1024px`): 240×340, translateX 240px, offsets -2..+2, stage height 600px.
- Use a `useEffect` resize listener with a `tablet` boolean, mirroring the existing `AiToolsShowcase` approach.

### Out of scope

- Data source stays `useProducts().hotSelling.slice(0, 12)`.
- No changes to `ProductCard.tsx`, routing, or other sections.
- No new dependencies — built on existing `framer-motion`.

### Files

- Edit: `src/components/HotSellingSection.tsx`
- New (optional, only if file grows past ~250 lines): `src/components/HotSellingCoverflow.tsx`
