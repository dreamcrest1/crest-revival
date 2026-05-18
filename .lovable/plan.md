# Fix Claude logo + Personal Email indicator

## What's wrong

**Logo issue (root cause confirmed):** The 6 new Claude rows in the Google Sheet use this image URL:

`https://static.vecteezy.com/.../claude-ai-logo-rounded-hd-free-png.png`

Vecteezy blocks hotlinking — the URL returns **HTTP 403** when fetched directly, and **HTTP 404** through our `images.weserv.nl` proxy. No amount of proxying will make it work; the source itself refuses external requests. That's why every other tool image loads but Claude's doesn't.

**Personal Email info:** The 6 listings are activated on the customer's personal email (already part of the product name "… Personal Email"), but there is no visual indicator on the card / detail page making this delivery method obvious to buyers.

## Plan

### 1. Local logo fallback (fixes Claude immediately, future-proof)

We already ship a high-quality `claude.png` in `src/assets/globe-logos/`. Add a small name → local asset map and use it as a fallback in `useAiTools`:

- New file `src/data/toolLogoFallbacks.ts` exports a `Record<string, string>` of normalized tool-name keywords → imported local PNG (start with `claude`, easy to extend later for any other broken external URL).
- In `useAiTools.ts`, when building each `AiTool`:
  - If the sheet's `image` URL is empty **or** known-broken (host matches `vecteezy.com`, etc.), use the local fallback if the name matches.
  - Otherwise keep the existing weserv-proxied URL but still set `fallbackImage` on the tool so `ProductCard` / detail page can swap on `onError`.
- Add `fallbackImage?: string` to the `AiTool` type.
- Update `ProductCard` and `AiToolDetail` `<img>` tags with `onError={() => setSrc(fallbackImage ?? '/placeholder.svg')}`.

Result: Claude logo shows the bundled asset instantly; any future broken sheet URL gracefully falls back to placeholder.

### 2. "Personal Email" delivery badge

When a tool's name contains "Personal Email" (case-insensitive):

- **Product card (`ProductCard.tsx`)**: small pill below the title — "Delivered on your personal email" with the mail icon, using existing accent (orange) tokens.
- **Detail page (`AiToolDetail.tsx`)**: a more prominent info row near the price/CTA: "✉️ Activated on your personal email — share your email at checkout." styled with existing glassmorphism card.

No business-logic changes, no DB changes — purely presentational, driven off the existing tool name.

## Files touched
- `src/data/toolLogoFallbacks.ts` (new)
- `src/hooks/useAiTools.ts` (add fallback resolution + type field)
- `src/components/ProductCard.tsx` (img onError + Personal Email pill)
- `src/pages/AiToolDetail.tsx` (img onError + Personal Email info row)

## Out of scope
- Editing the Google Sheet (you can later swap the Vecteezy URL for any hotlink-friendly one and it'll still work — the fallback only kicks in when the remote fails).
- Globe component — unaffected; it uses bundled logos already.
