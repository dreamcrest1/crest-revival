import type { Product } from '@/hooks/useProducts';

const SITE = 'https://castletools.in';
const BRAND = 'Castle Tools';

/** Slugify a product name into a URL-friendly string. */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Find a product by slug from a list (with id-suffix fallback). */
export function findProductBySlug(products: Product[], slug: string): Product | undefined {
  if (!slug) return undefined;
  const exact = products.find((p) => slugify(p.name) === slug);
  if (exact) return exact;
  // fallback: slug equals the product id (in case name was renamed)
  return products.find((p) => p.id === slug);
}

export function productUrl(product: Product): string {
  return `${SITE}/product/${slugify(product.name)}`;
}

const categoryKeywords: Record<string, string[]> = {
  'AI Tools': ['AI tool group buy', 'cheap AI tools India', 'AI subscription India', 'group buy AI tools cheap'],
  'Writing Tools': ['cheap writing tools', 'AI writer group buy', 'writing software India cheap'],
  'Video Editing': ['cheap video editing software', 'video editor group buy India', 'premium video editor cheap'],
  'Indian OTT': ['cheap OTT subscription India', 'OTT group buy India', 'Indian OTT cheap', 'streaming subscription India cheap'],
  'International OTT': ['cheap OTT subscription', 'international OTT group buy', 'streaming subscription cheap India'],
  'SEO': ['SEO tool group buy', 'cheap SEO tools India', 'SEO software cheap', 'SEO subscription group buy'],
  'VPN': ['cheap VPN India', 'VPN group buy', 'premium VPN cheap', 'VPN subscription India cheap'],
  'Lead Generation': ['lead generation tool group buy', 'cheap lead gen tools', 'B2B tool group buy'],
  'Cloud Services': ['cloud service group buy', 'cheap cloud subscription', 'cloud tool India cheap'],
  'Design Tools': ['design tool group buy', 'cheap design software', 'graphic design tool India cheap'],
  'Software': ['software group buy India', 'cheap software India', 'premium software license cheap'],
  'Other': ['group buy India', 'cheap subscription India'],
};

function priceNumber(price: string): string {
  return price.replace(/[^\d.]/g, '') || '0';
}

export interface ProductSeo {
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  jsonLd: Record<string, unknown>;
  slug: string;
}

/** Build full SEO bundle for a product — auto keyword + schema generation. */
export function buildProductSeo(product: Product): ProductSeo {
  const slug = slugify(product.name);
  const url = `${SITE}/product/${slug}`;
  const name = product.name;
  const cat = product.category;
  const price = priceNumber(product.price);
  const original = priceNumber(product.originalPrice || product.price);
  const discount = product.discount ? ` (${product.discount})` : '';

  const title = `${name} – Cheap ${name} India | Group Buy at ${product.price} | ${BRAND}`.slice(0, 70);

  const description =
    `Buy affordable ${name} in India at ${product.price}${discount}. ` +
    `Genuine group buy ${name} ${cat.toLowerCase().includes('ott') ? 'subscription' : ''} with instant WhatsApp delivery, warranty & 24/7 support. ` +
    `Cheapest ${cat} deal in India — ${BRAND}.`;

  const baseKw = [
    `cheap ${name}`,
    `affordable ${name}`,
    `${name} India`,
    `group buy ${name}`,
    `${name} group buy India`,
    `buy ${name} cheap`,
    `${name} subscription cheap`,
    `${name} discount`,
    `${name} lowest price`,
    `${name} deal India`,
    `${name} price India`,
    `where to buy ${name} cheap`,
  ];
  const catKw = categoryKeywords[cat] || categoryKeywords.Other;
  const keywords = [...baseKw, ...catKw, BRAND].join(', ').toLowerCase();

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: product.description || `Premium ${name} at affordable group buy price in India.`,
    image: product.image,
    sku: product.id,
    category: cat,
    brand: { '@type': 'Brand', name: BRAND },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price,
      ...(original !== price ? { highPrice: original } : {}),
      availability: 'https://schema.org/InStock',
      seller: { '@type': 'Organization', name: BRAND },
      priceValidUntil: new Date(Date.now() + 90 * 86400 * 1000).toISOString().slice(0, 10),
    },
  };

  return { title, description, keywords, canonical: url, jsonLd, slug };
}
