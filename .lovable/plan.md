## Goal
Swap the current favicon/avatar placeholders for Lumen5, Wideo Pro, and VidScribe on the Products page with the three logos the user just uploaded.

## Steps
1. Copy the uploaded files into `src/assets/product-logos/`:
   - `user-uploads://unnamed.png` → `wideo.png` (orange "w" mark)
   - `user-uploads://lumen5.jpg` → `lumen5.jpg` (purple S mark)
   - `user-uploads://vidscribe-ai.webp` → `vidscribe.webp` (speech-bubble mark)
2. Upload each file to the project's backend storage so the `products.image_url` column can reference a stable public URL (the products grid is driven by the DB, not by bundled imports).
   - Create a public `product-logos` storage bucket if it doesn't exist.
   - Upload the 3 files there and grab their public URLs.
3. Run a small data update to set `image_url` on the matching rows:
   - `Lumen5 Premium` → new Lumen5 public URL
   - `Wideo Pro Lifetime` and `Wideo Pro (one month)` → new Wideo public URL
   - `VidScribe Pro` → new VidScribe public URL
4. Verify on `/products` that all three cards render the new logos (1:1 contained, no broken images).

## Notes
- No UI/component code changes required — only assets + one data update.
- Other 9 products from the previous batch remain untouched.
