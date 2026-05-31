import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  breadcrumbs?: { name: string; url: string }[];
  noindex?: boolean;
}

const baseUrl = 'https://castletools.in';

const seoDefaults: Record<string, SEOProps> = {
  '/': {
    title: 'Castle Tools – Premium Digital Products at 80% Off | India\'s #1 Store',
    description: 'Buy premium AI tools, OTT subscriptions, SEO tools, VPN & software licenses at up to 80% off. Serving 15,000+ customers since 2021. Instant delivery & 24/7 support.',
    keywords: 'premium digital products, cheap AI tools, OTT subscriptions India, software deals, Castle Tools, buy ChatGPT cheap, Netflix cheap India, Adobe cheap license, Canva Pro India, Microsoft 365 cheap',
  },
  '/products': {
    title: 'All Products – 200+ Premium Tools & Subscriptions at Best Prices | Castle Tools',
    description: 'Browse 200+ premium digital products: AI tools, video editing software, OTT subscriptions, SEO tools, VPN & more at unbeatable prices. Instant WhatsApp delivery guaranteed.',
    keywords: 'buy premium tools cheap, AI tools India, OTT subscription deals, software licenses cheap, digital products store India, Netflix Prime Hotstar cheap, ChatGPT Plus India',
  },
  '/about': {
    title: 'About Castle Tools – India\'s Most Trusted Digital Store Since 2021',
    description: 'Learn about Castle Tools – India\'s oldest & most trusted digital product marketplace. 15,000+ happy customers, 200+ products, instant delivery since 2021.',
    keywords: 'Castle Tools about, digital product store India, trusted online store, premium tools seller India, group buy India',
  },
  '/contact': {
    title: 'Contact Castle Tools – 24/7 WhatsApp Support | +91 9773453978',
    description: 'Get in touch with Castle Tools for queries, orders & support. Available 24/7 on WhatsApp at +91 9773453978. Instant responses guaranteed.',
    keywords: 'contact Castle Tools, WhatsApp support, digital products support India, customer care premium tools',
  },
  '/alltools': {
    title: 'All Tools Catalog – 200+ Premium Digital Tools & Services | Castle Tools',
    description: 'Complete catalog of 200+ premium tools: AI writers, SEO tools, VPN services, stock assets, video editors, lead generation & cloud services at best prices in India.',
    keywords: 'all digital tools, premium software catalog, AI tools list, SEO tools India, cheap premium tools, AI humanizer, stealth writer, writehuman',
  },
  '/faq': {
    title: 'FAQ – Frequently Asked Questions | Castle Tools',
    description: 'Find answers to common questions about orders, delivery, refunds, warranties & support at Castle Tools. Instant delivery & 24/7 WhatsApp support.',
    keywords: 'Castle Tools FAQ, digital products FAQ, how to buy premium tools cheap, refund policy India',
  },
  '/terms': {
    title: 'Terms & Conditions | Castle Tools',
    description: 'Read the terms and conditions for using Castle Tools digital products marketplace. Transparent policies for our customers.',
    keywords: 'terms and conditions, Castle Tools terms, digital store policies',
  },
  '/refunds': {
    title: 'Refund & Replacement Policy | Castle Tools',
    description: 'Hassle-free refund and replacement policy for digital products at Castle Tools. 7-day refund window and free warranty replacements.',
    keywords: 'refund policy, Castle Tools refund, digital products return policy, warranty replacement India',
  },
};

const SEOHead = ({
  title, description, keywords, canonical, ogImage, ogType, jsonLd, breadcrumbs, noindex,
}: SEOProps) => {
  const location = useLocation();
  const defaults = seoDefaults[location.pathname] || {};

  const finalTitle = title || defaults.title || 'Castle Tools – Premium Digital Products Store';
  const finalDesc = description || defaults.description || 'India\'s most trusted digital product store. Premium tools at unbeatable prices.';
  const finalKeywords = keywords || defaults.keywords || 'Castle Tools, digital products, premium tools India';

  // Build canonical: normalize path (lowercase, strip trailing slash except root)
  // and only keep SEO-relevant query params (category, filter) on /products.
  // Tracking params (utm_*, fbclid, gclid, ref, etc.) are always stripped to
  // prevent duplicate indexing of the same content under different URLs.
  const buildCanonical = (): string => {
    if (canonical) {
      return canonical.startsWith('http') ? canonical : `${baseUrl}${canonical}`;
    }
    let path = location.pathname.toLowerCase();
    if (path.length > 1 && path.endsWith('/')) path = path.slice(0, -1);

    const params = new URLSearchParams(location.search);
    const allowedByPath: Record<string, string[]> = {
      '/products': ['category', 'filter'],
      '/alltools': ['category'],
    };
    const allowed = allowedByPath[path] || [];
    const kept = new URLSearchParams();
    allowed.forEach((key) => {
      const v = params.get(key);
      if (v) kept.set(key, v);
    });
    const qs = kept.toString();
    return `${baseUrl}${path}${qs ? `?${qs}` : ''}`;
  };

  const finalCanonical = buildCanonical();
  const finalImage = ogImage || `${baseUrl}/logo.png`;
  const finalType = ogType || 'website';

  const orgLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Castle Tools',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: 'India\'s most trusted digital product store offering premium AI tools, OTT subscriptions, software licenses & more at unbeatable prices.',
    foundingDate: '2021',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-9773453978',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.instagram.com/Castletool99',
      'https://www.youtube.com/@Castletool99',
    ],
  };

  const breadcrumbLd = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: b.name,
      item: b.url.startsWith('http') ? b.url : `${baseUrl}${b.url}`,
    })),
  } : null;

  const allLd: Record<string, unknown>[] = [orgLd];
  if (breadcrumbLd) allLd.push(breadcrumbLd);
  if (jsonLd) {
    if (Array.isArray(jsonLd)) allLd.push(...jsonLd);
    else allLd.push(jsonLd);
  }

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalCanonical} />
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1'} />
      <meta name="author" content="Castle Tools" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Chennai, India" />
      <meta name="theme-color" content="#0F172A" />
      <meta name="format-detection" content="telephone=yes" />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content={finalType} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:alt" content={finalTitle} />
      <meta property="og:site_name" content="Castle Tools" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:site" content="@Castletool99" />

      {/* JSON-LD: emit each block separately */}
      {allLd.map((ld, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(ld)}</script>
      ))}
    </Helmet>
  );
};

export default SEOHead;
