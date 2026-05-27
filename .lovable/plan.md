## Wire PayPur into Buy Now buttons + Admin Orders panel

Three places still use the old external `PAYMENT_URL`; all need to flow through the same `CheckoutDialog` + `paypur-init` pipeline built earlier. Plus add an Orders page in the admin panel.

### 1. Product detail page (`src/pages/ProductDetail.tsx`)
Replace the `<a href={product.buyLink} target="_blank">Buy Now</a>` with a button that opens `CheckoutDialog` pre-loaded with that single product (qty 1). Keep `Add to Cart` and `WhatsApp` unchanged. Tracking event `checkout_click` stays.

### 2. AI tool detail page (`src/pages/AiToolDetail.tsx`)
Replace the `<a href={COSMOFEED_URL}>Buy Now</a>` with a button that opens `CheckoutDialog` with a synthesized item:
```
{ id: `tool-${slug}`, name: `${tool.name} (${tool.validity})`, price: `₹${tool.price}`, quantity: 1 }
```
Free tools (`price === 0`) keep the Enquire → WhatsApp behaviour. Drop the `COSMOFEED_URL` / `PAYMENT_URL` import.

### 3. AI tools listing grid (`src/pages/AiTools.tsx`)
Same treatment on each card's Buy Now. Lift a single shared `CheckoutDialog` instance to the page level with `[activeTool, setActiveTool]` state so all cards share one dialog.

### 4. Admin Orders page (NEW)
- **Route**: `/admin/orders` registered in `src/App.tsx`
- **Sidebar item**: "Orders" with `ShoppingBag` icon added to `AdminSidebar.tsx`
- **Page** `src/pages/admin/AdminOrders.tsx` shows a live table from the existing `orders` table:
  - Columns: Date, Order ID, Customer (name + email + phone), Items (compact list), Amount, Status badge (pending/success/failed colored), Txn ID
  - Filter pills: All / Success / Pending / Failed
  - Search box (order_id, txn_id, email, phone)
  - Summary cards on top: Total Revenue (success only), Successful Orders, Pending, Failed (last 30 days)
  - Refresh button + auto-refetch every 30s via TanStack Query
- **Data access**: admin user is authenticated, current RLS policy `Anyone can view orders by id` (`USING true`) already lets authenticated reads work. No DB changes needed.

### 5. Tracking
Both Buy Now triggers fire `trackEvent('checkout_click', {...})` (existing pattern) so the funnel + UTM dashboards keep working. The dialog itself fires `trackEvent('checkout_started', { order_id, amount })` when the user submits the form, giving a tighter funnel signal between intent → payment redirect.

### Files
**Edited**
- `src/pages/ProductDetail.tsx`
- `src/pages/AiToolDetail.tsx`
- `src/pages/AiTools.tsx`
- `src/components/admin/AdminSidebar.tsx`
- `src/App.tsx` (route)
- `src/components/checkout/CheckoutDialog.tsx` (add `checkout_started` track event)

**New**
- `src/pages/admin/AdminOrders.tsx`

### Out of scope
- Editing/refunding orders from admin (read-only for now)
- CSV export (can add later if needed)
