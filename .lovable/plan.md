# Globe overhaul + India map masking + logo→product mapping

## 1. Asset import & rename

Copy all 40 PNGs from `user-uploads://logos_new-2.zip` into `src/assets/globe-logos/` with brand-named filenames (kebab-case), so the bundler hashes them and they're cached forever.

Identified mapping from numeric filenames (verified by viewing each):

```text
2.png  → jasper.png            3.png  → deepgram.png
4.png  → gemini.png            5.png  → perplexity.png
6.png  → claude.png            7.png  → bolt-new.png
8.png  → lovable.png           9.png  → netflix.png
10.png → prime-video.png       11.png → zee5.png
12.png → sonyliv.png           13.png → jiohotstar.png
14.png → hoichoi.png           15.png → chaupal.png
16.png → iptv.png              17.png → hbo-max.png
18.png → crunchyroll.png       20.png → firecrawl.png
21.png → canva.png             23.png → adobe-cc.png
24.png → figma.png             25.png → envato-elements.png
26.png → heygen.png            27.png → elevenlabs.png
28.png → runway.png            30.png → gamma.png
31.png → semrush.png           32.png → office-365.png
33.png → notion-plus.png       34.png → linkedin.png
35.png → quillbot.png          36.png → coursera.png
37.png → datacamp.png          38.png → nordvpn.png
39.png → turnitin.png
chatgpt.png · supabase.png · replit.png · wondershare-filmora.png · youtube.png
```

Total: **40 brand-named PNGs**.

## 2. New globe data source

Create `src/data/globeLogos.ts` — a single source of truth that imports each PNG via ES module and pairs it with a deep-link target:

```text
{ name, image, href }   // href = '/ai-tool/<slug>' OR '/products/<slug>'
```

Mapping rules:
- **OTT / streaming → Products page detail**: Netflix, Prime Video, JioHotstar, SonyLiv, Zee5, Hoichoi, Chaupal, HBO Max, Crunchyroll, YouTube, IPTV
- **Everything else → AI tool detail page**: ChatGPT, Jasper, Gemini, Perplexity, Claude, Bolt.new, Lovable, Firecrawl, Canva, Adobe CC, Figma, Envato Elements, HeyGen, ElevenLabs, Runway, Gamma, Deepgram, Semrush, Office 365, Notion Plus, LinkedIn, QuillBot, Coursera, Datacamp, NordVPN, Turnitin, Supabase, Replit, Wondershare Filmora

I'll match against existing product names in `src/data/staticProducts.ts` and AI tool names from the Google-Sheet `useAiTools` data. For any logo with no match in either dataset, the href will fall back to `/ai-tools` (the listing page) so nothing 404s.

## 3. `ProductGlobe.tsx` rewrite

- **Drop** `useAiTools` + `metaForTool` + iconify / weserv / clearbit chain → use the static `globeLogos` array. No more dynamic logo fetching, no proxied URLs, no Sheet dependency for the globe.
- **Remove the radial backdrop disc** behind each logo on the canvas (the round halo behind logos).
- **Keep the wireframe sphere itself** (per your answer).
- **Boot-up animation**: when the globe canvas mounts, animate `scale` from `0.15 → 1` over ~1400ms with a soft `easeOut` curve while opacity fades 0→1 and blur 12px→0. Use Framer Motion (already a dependency). This both hides perceived load time and gives the "small sphere forms then expands" feel you asked for.
- Keep mobile size at the already-reduced 285px and desktop at 560px.
- Keep the "Explore AI Tools" CTA below the globe.

## 4. `ProductGlobeCanvas.tsx` adjustments

- Remove the per-logo circular disc/plane backing — render only the logo texture on a transparent quad.
- Slightly increase logo plane size to compensate for the missing disc so logos remain readable.
- Keep rotation, hover scale, click handler.

## 5. India map masking

In `src/components/IndiaMapBackground.tsx` (fixed full-viewport background): wrap the SVG layer in a container with a **radial CSS mask** centered on the top of the viewport, fading transparent in the globe area and opaque elsewhere:

```text
mask-image: radial-gradient(ellipse 55% 40% at 50% 18%, transparent 55%, black 80%);
```

Result: India map renders globally, but the area visually occupied by the globe (top of the homepage) shows none of the map — so the globe stays clean. Everywhere else on the page India remains visible as today. No JS scroll-listener needed.

## 6. Memory update

Add a new memory file `mem://features/globe` recording: PNG-only globe logo set in `src/assets/globe-logos/`, no halo discs, mapped via `src/data/globeLogos.ts` to AI tool or product detail routes, scale-in boot animation.

## 7. Build & ship

After implementing, run `npm run build` and re-package `dreamcrest-dist.zip` (with `.htaccess` + new hashed `index-*.js`) for your manual cPanel upload. Same upload procedure as before — delete old `public_html/index.html` + `assets/`, extract zip.

---

## Files touched

- **new**: `src/assets/globe-logos/*.png` (40 files), `src/data/globeLogos.ts`, `mem://features/globe`
- **edited**: `src/components/ProductGlobe.tsx`, `src/components/ProductGlobeCanvas.tsx`, `src/components/IndiaMapBackground.tsx`
- **removed code paths**: globe's dependency on `useAiTools`, `aiToolMeta` GLOBE_ICON_OVERRIDES, weserv/clearbit URL chain

## Out of scope (won't touch)

- AI tools page and OTT products page themselves
- Sheet-driven `useAiTools` (still used elsewhere, just not by the globe)
- GitHub deploy workflow
