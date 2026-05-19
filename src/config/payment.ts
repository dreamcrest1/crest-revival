// Centralized payment/checkout URL.
// Update this single value (or set VITE_PAYMENT_URL in .env) to change every
// "Buy Now" / Checkout link across the entire app — products, AI tools,
// cart drawer, and admin defaults.
export const PAYMENT_URL: string =
  (import.meta.env.VITE_PAYMENT_URL as string | undefined) ||
  'https://secure.paypur.in/p/8694eb3e2afeadce';
