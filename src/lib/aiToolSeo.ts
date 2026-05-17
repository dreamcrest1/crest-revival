// SEO helpers for the AI Tools catalog: slugify, lookup, and full meta-bundle
// builder used by /ai-tool/:slug pages and by JSON-LD validation tests.
import type { AiTool } from '@/hooks/useAiTools';
import { metaForTool } from '@/data/aiToolMeta';

const SITE = 'https://dreamcrest.net';
const BRAND = 'Dreamcrest Solutions';
const WHATSAPP = '+91-6357998730';

export function slugifyAiTool(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function findAiToolBySlug(tools: AiTool[], slug: string): AiTool | undefined {
  if (!slug) return undefined;
  return tools.find((t) => slugifyAiTool(t.name) === slug);
}

export function aiToolUrl(tool: AiTool): string {
  return `${SITE}/ai-tool/${slugifyAiTool(tool.name)}`;
}

export interface AiToolSeo {
  slug: string;
  url: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  jsonLd: Record<string, unknown>[];
}

/**
 * Build the complete SEO bundle for an AI tool:
 *  - title / meta description / keyword cloud
 *  - Product + Offer JSON-LD (Google Rich Results compliant)
 *  - BreadcrumbList JSON-LD
 *  - FAQPage JSON-LD with buyer-intent Q&A
 *  - OG / Twitter image url (logo override → clearbit → site logo)
 */
export function buildAiToolSeo(tool: AiTool): AiToolSeo {
  const meta = metaForTool(tool.name);
  const slug = slugifyAiTool(tool.name);
  const url = `${SITE}/ai-tool/${slug}`;
  const priceStr = tool.price > 0 ? String(tool.price) : '0';
  const validity = tool.validity || '1 Month';

  const title = `Buy ${tool.name} Cheap India – Group Buy ${validity} ${
    tool.price > 0 ? `at ₹${tool.price.toLocaleString('en-IN')}` : ''
  } | ${BRAND}`.slice(0, 70);

  const description = `${meta.tagline || `Premium ${tool.name} subscription.`} Group buy ${tool.name} in India at the cheapest price${
    tool.price > 0 ? ` (₹${tool.price.toLocaleString('en-IN')} / ${validity.toLowerCase()})` : ''
  }. Genuine private account, instant email delivery, full warranty & 24/7 WhatsApp support.`;

  const keywords = [
    `group buy ${tool.name}`,
    `cheap ${tool.name}`,
    `discounted ${tool.name}`,
    `${tool.name} India`,
    `${tool.name} India price`,
    `buy ${tool.name} cheap`,
    `${tool.name} subscription cheap`,
    `${tool.name} group buy India`,
    `${tool.name} discount`,
    `${tool.name} lowest price`,
    `${meta.category} group buy`,
    `cheap ${meta.category} India`,
    'AI tools sale India',
    'discounted AI tools',
    BRAND,
  ].join(', ').toLowerCase();

  // Best-effort high-res image: curated logo > Clearbit > sheet image > site logo
  const ogImage =
    meta.logo ||
    (meta.domain ? `https://logo.clearbit.com/${meta.domain}?size=512` : '') ||
    tool.image ||
    `${SITE}/logo.png`;

  const productLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: tool.name,
    description: meta.description || description,
    image: [ogImage],
    sku: slug,
    category: meta.category,
    brand: { '@type': 'Brand', name: tool.name.split(' ')[0] },
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'INR',
      price: priceStr,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
      priceValidUntil: new Date(Date.now() + 90 * 86400 * 1000).toISOString().slice(0, 10),
      seller: { '@type': 'Organization', name: BRAND, telephone: WHATSAPP },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '137',
      bestRating: '5',
      worstRating: '1',
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: 'AI Tools', item: `${SITE}/ai-tools` },
      { '@type': 'ListItem', position: 3, name: tool.name, item: url },
    ],
  };

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `How much does ${tool.name} cost on Dreamcrest?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text:
            tool.price > 0
              ? `${tool.name} (${validity}) is available at ₹${tool.price.toLocaleString('en-IN')} via group buy at Dreamcrest Solutions — a fraction of the official price.`
              : `${tool.name} pricing is shared on request. Contact us on WhatsApp at ${WHATSAPP} for the latest group-buy price.`,
        },
      },
      {
        '@type': 'Question',
        name: `Is this ${tool.name} subscription genuine?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Yes. We deliver a private, genuine ${tool.name} subscription with full premium features for the entire ${validity.toLowerCase()} validity. Full warranty included.`,
        },
      },
      {
        '@type': 'Question',
        name: `How fast is ${tool.name} delivery?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `${tool.name} login credentials are delivered to your registered email within minutes of payment. Support is available 24/7 on WhatsApp at ${WHATSAPP}.`,
        },
      },
    ],
  };

  return {
    slug,
    url,
    title,
    description: description.slice(0, 160),
    keywords,
    ogImage,
    jsonLd: [productLd, breadcrumbLd, faqLd],
  };
}
