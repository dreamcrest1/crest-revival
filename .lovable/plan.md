## Goal
The 3D globe should show **all AI tools** as **perfect circles with crisp, high-quality logos** — using the exact same multi-source logo fallback chain as the `/ai-tools` page (which currently looks great).

## Problem
- `src/components/ProductGlobe.tsx` only resolves logos from a tiny `GLOBE_ICON_OVERRIDES` map (15 brands). Every other tool returns an empty `images` array, so `LogoTile` renders nothing → far fewer circles than the catalog.
- Textures are loaded at 256 px and the plane is masked by a circle disc behind it, so SVGs come out pixelated and the white square edge can poke past the circle.

## Fix

### 1. `src/components/ProductGlobe.tsx` — same logo chain as `BrandLogo` in `src/pages/AiTools.tsx`
Replace `logoSourcesForTool` so each tool returns the same ordered list of sources used on `/ai-tools`, all proxied through weserv at 512 px square (`fit=contain`) for crisp CORS-safe textures in WebGL:

```
1. meta.logo                                (curated SVG override)
2. https://logo.clearbit.com/<domain>?size=512
3. https://www.google.com/s2/favicons?domain=<domain>&sz=256
4. weserv(t.image)                          (sheet image, contain 512²)
```

Each entry is wrapped with `https://images.weserv.nl/?url=<encoded>&w=512&h=512&fit=contain&output=webp&q=90` so three.js can sample them via CORS and they stay sharp.

Keep `GLOBE_ICON_OVERRIDES` (iconify SVGs for top brands) prepended for the few cases where it improves on Clearbit.

Then in `useGlobeItems`:
- Build items from every AI tool (no filtering by override), keeping `popularityFor` sort.
- Only skip when the final source list is empty (no domain and no `t.image`).
- Raise caps to mobile 48 / desktop 96 so the sphere is well-populated.

### 2. `src/components/ProductGlobeCanvas.tsx` — perfect circles, no pixelation
- Bump texture quality: `t.anisotropy = renderer.capabilities.getMaxAnisotropy()` (cap 8), set `t.minFilter = THREE.LinearMipmapLinearFilter`, `t.magFilter = THREE.LinearFilter`, `t.generateMipmaps = true` in `useSafeTexture`.
- Shrink the logo plane from `0.58` to `0.5` so it fits cleanly **inside** the `0.52`-radius white disc — no square corners ever poke past the circle, giving a true circular logo at every angle.
- Keep the white circular plate as the visible "circle"; the logo image sits centered inside.

### 3. Result
Every AI tool with a brand domain or sheet image becomes a circle on the globe. Logos look identical in quality to the `/ai-tools` cards.

## Files touched
- `src/components/ProductGlobe.tsx`
- `src/components/ProductGlobeCanvas.tsx`
