## PayPur UPI Gateway — Sitewide Integration

Replace the current external checkout link (`PAYMENT_URL` → `secure.paypur.in/p/...`) with a fully integrated PayPur flow that creates a signed order, redirects the user to UPI, verifies the callback, and shows a WhatsApp confirmation with prefilled order details.

### 1. Secrets (Lovable Cloud)
Store sensitive credentials as edge function secrets — **never in frontend code**:
- `PAYPUR_API_KEY` = `cfd74c05d0e9add005173b3e8f7fdeb3`
- `PAYPUR_SIGNING_SECRET` = `dbea82cbf529d53ffdc782f6005b94666a3c14acbf85f03898c66541eec0d959`

### 2. Database — `public.orders` table
Persist each payment attempt so the success page can rebuild the cart for the WhatsApp message even after the redirect.

| Column | Purpose |
|---|---|
| `order_id` (text, PK) | local id sent to PayPur |
| `txn_id` (text, nullable) | returned by PayPur |
| `amount` (numeric) | total in ₹ |
| `status` (text) | `pending` / `success` / `failed` |
| `items` (jsonb) | snapshot of cart: name, price, qty |
| `customer` (jsonb) | name, email, phone |
| `created_at`, `updated_at` | timestamps |

RLS: public insert (anon can create), public select **only by `order_id`** (needed for the success page to read the order without auth). No update/delete from client — only the edge function (service role) updates status.

### 3. Edge functions
- **`paypur-init`** (POST): receives `{ orderId, amount, items, customer }`, inserts pending row, computes `HMAC_SHA256(order_id|amount|surl|furl, signing_secret)`, calls `https://upi.paypur.in/api/merchant/init` with `X-PAYPUR-KEY`, returns `{ pay_url }`. `surl`/`furl` point to `/payment/success?order_id=...` and `/payment/failure?order_id=...` on the site.
- **`paypur-verify`** (POST): receives the callback query params from the success/failure page, recomputes `HMAC_SHA256(txn_id|order_id|status|amount, signing_secret)`, compares with `hash_equals` semantics, updates the order row, returns the verified order + items + customer.
- **`paypur-status`** (GET, optional polling fallback): calls `/api/merchant/status?txn_id=...` and updates DB.

Both deploy with `verify_jwt = false` and proper CORS.

### 4. Frontend changes
- **Mini checkout dialog** triggered from CartDrawer's "Checkout" button (replaces the external link). Collects name, email, phone (prefilled from localStorage if present), then calls `paypur-init` and `window.location.href = pay_url`.
- **New routes**:
  - `/payment/success` — calls `paypur-verify`, shows order summary card + a big WhatsApp CTA button.
  - `/payment/failure` — shows retry + WhatsApp support button.
- **WhatsApp message format** on success (prefilled, opens `wa.me/916357998730?text=...`):
  ```
  Hi! I just completed payment for my order ✅

  • Canva Pro 1 Year x1 — ₹299
  • ChatGPT Plus 1 Month x1 — ₹449

  Total Paid: ₹748
  Order ID: order_abc123
  Txn ID: PPR_xxxx

  Please activate my tools 🙏
  ```
- Cart is cleared after successful verification.
- The single product "Buy Now" buttons (product detail, hot-selling, AI tool detail) also route through the same checkout dialog with a one-item cart payload.

### 5. Files touched
**New**
- `supabase/functions/paypur-init/index.ts`
- `supabase/functions/paypur-verify/index.ts`
- `src/components/checkout/CheckoutDialog.tsx` (customer form + init call)
- `src/pages/PaymentSuccess.tsx`
- `src/pages/PaymentFailure.tsx`
- `src/lib/paypurClient.ts` (thin wrapper around `supabase.functions.invoke`)

**Edited**
- `src/components/CartDrawer.tsx` — replace external `<a href={PAYMENT_URL}>` with CheckoutDialog trigger
- `src/pages/ProductDetail.tsx` — "Buy Now" opens CheckoutDialog for that single item
- `src/App.tsx` — register `/payment/success` and `/payment/failure` routes
- `src/config/payment.ts` — keep as fallback only; mark PayPur as primary

### 6. Migration (database)
Single migration that creates `orders`, GRANTs (`anon` select+insert, `authenticated` same, `service_role` all), enables RLS, and adds policies scoped to the row's `order_id`.

### 7. Out of scope (for this pass)
- Server-to-server webhook handler (PayPur docs only describe redirect callback; we'll rely on redirect + optional `paypur-status` polling).
- Admin order dashboard (data is in DB, can be added later).
- Refunds.

### Confirmations needed before build
1. WhatsApp number `+91 6357998730` (already used elsewhere in the project) — keep for post-payment message? ✅ assumed yes.
2. Charge customer name/email/phone fields as **required** in the checkout dialog? PayPur init requires them.
3. Should "Buy Now" on a single product also go through this flow (recommended), or keep current "add to cart → checkout" only?
