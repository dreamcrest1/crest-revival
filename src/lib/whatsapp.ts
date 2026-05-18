// Centralised WhatsApp deep-link helper.
// Use waLink() everywhere instead of hard-coding wa.me URLs.

export const WA_NUMBER = '916357998730';
const SITE = 'https://dreamcrest.net';

export type WaContext =
  | 'generic'
  | 'all-tools'
  | 'hot-selling'
  | 'product-card'
  | 'product-detail'
  | 'footer'
  | 'navbar'
  | 'cart'
  | 'ai-tool'
  | 'chatbot';

export interface WaProductLike {
  name: string;
  price?: string | number;
  slug?: string;
  category?: string;
}

const buildText = (product?: WaProductLike, context: WaContext = 'generic', extra?: string): string => {
  if (!product) {
    return extra || "Hi! I'd like to know more about Dreamcrest tools.";
  }
  const price = typeof product.price === 'number' ? `₹${product.price}` : product.price;
  const url = product.slug ? `${SITE}/product/${product.slug}` : SITE;
  const lines = [
    `Hi! I'm interested in *${product.name}*${price ? ` (${price})` : ''}.`,
    extra ? extra : 'Please share the latest offer and how to order.',
    `Ref: ${url}`,
  ];
  // hidden tag aids analytics correlation
  lines.push(`[ctx:${context}]`);
  return lines.join('\n');
};

export const waLink = (product?: WaProductLike, context: WaContext = 'generic', extra?: string): string => {
  const text = encodeURIComponent(buildText(product, context, extra));
  return `https://wa.me/${WA_NUMBER}?text=${text}`;
};

export const waHref = waLink; // alias
