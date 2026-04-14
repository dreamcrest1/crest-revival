import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: Record<string, unknown>;
}

const seoDefaults: Record<string, SEOProps> = {
  '/': {
    title: 'Dreamcrest Solutions – Premium Digital Products at 80% Off | India\'s #1 Store',
    description: 'Buy premium AI tools, OTT subscriptions, SEO tools, VPN & software licenses at up to 80% off. Serving 15,000+ customers since 2021. Instant delivery & 24/7 support.',
    keywords: 'premium digital products, cheap AI tools, OTT subscriptions India, software deals, Dreamcrest Solutions, buy ChatGPT cheap, Netflix cheap India, Adobe cheap license',
  },
  '/products': {
    title: 'All Products – Premium Tools & Subscriptions at Best Prices | Dreamcrest',
    description: 'Browse 200+ premium digital products: AI tools, video editing software, OTT subscriptions, SEO tools, VPN & more at unbeatable prices. Instant delivery guaranteed.',
    keywords: 'buy premium tools cheap, AI tools India, OTT subscription deals, software licenses cheap, digital products store India',
  },
  '/about': {
    title: 'About Dreamcrest Solutions – India\'s Most Trusted Digital Store Since 2021',
    description: 'Learn about Dreamcrest Solutions – India\'s oldest & most trusted digital product marketplace. 15,000+ happy customers, 200+ products, instant delivery since 2021.',
    keywords: 'Dreamcrest Solutions about, digital product store India, trusted online store, premium tools seller India',
  },
  '/contact': {
    title: 'Contact Dreamcrest Solutions – 24/7 WhatsApp Support | +91 6357998730',
    description: 'Get in touch with Dreamcrest Solutions for queries, orders & support. Available 24/7 on WhatsApp at +91 6357998730. Instant responses guaranteed.',
    keywords: 'contact Dreamcrest Solutions, WhatsApp support, digital products support India',
  },
  '/alltools': {
    title: 'All Tools Catalog – 200+ Premium Digital Tools & Services | Dreamcrest',
    description: 'Complete catalog of 200+ premium tools: AI writers, SEO tools, VPN services, stock assets, video editors, lead generation & cloud services at best prices.',
    keywords: 'all digital tools, premium software catalog, AI tools list, SEO tools India, cheap premium tools',
  },
  '/faq': {
    title: 'FAQ – Frequently Asked Questions | Dreamcrest Solutions',
    description: 'Find answers to common questions about orders, delivery, refunds & support at Dreamcrest Solutions. We deliver instantly and support 24/7.',
    keywords: 'Dreamcrest FAQ, digital products FAQ, how to buy premium tools cheap',
  },
  '/terms': {
    title: 'Terms & Conditions | Dreamcrest Solutions',
    description: 'Read the terms and conditions for using Dreamcrest Solutions digital products marketplace.',
    keywords: 'terms and conditions, Dreamcrest terms, digital store policies',
  },
  '/refunds': {
    title: 'Refund Policy | Dreamcrest Solutions',
    description: 'Learn about our hassle-free refund and replacement policy for digital products at Dreamcrest Solutions.',
    keywords: 'refund policy, Dreamcrest refund, digital products return policy',
  },
};

const SEOHead = ({ title, description, keywords, canonical, ogImage, ogType, jsonLd }: SEOProps) => {
  const location = useLocation();
  const defaults = seoDefaults[location.pathname] || {};
  const baseUrl = 'https://dreamcrest.net';

  const finalTitle = title || defaults.title || 'Dreamcrest Solutions – Premium Digital Products Store';
  const finalDesc = description || defaults.description || 'India\'s most trusted digital product store. Premium tools at unbeatable prices.';
  const finalKeywords = keywords || defaults.keywords || 'Dreamcrest Solutions, digital products, premium tools India';
  const finalCanonical = canonical || `${baseUrl}${location.pathname}`;
  const finalImage = ogImage || `${baseUrl}/logo.png`;
  const finalType = ogType || 'website';

  const defaultJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Dreamcrest Solutions',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description: finalDesc,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+91-6357998730',
      contactType: 'customer service',
      availableLanguage: ['English', 'Hindi'],
    },
    sameAs: [
      'https://www.instagram.com/dreamcrestsolutions',
      'https://www.youtube.com/@dreamcrestsolutions',
    ],
  };

  return (
    <Helmet>
      <title>{finalTitle}</title>
      <meta name="description" content={finalDesc} />
      <meta name="keywords" content={finalKeywords} />
      <link rel="canonical" href={finalCanonical} />

      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDesc} />
      <meta property="og:type" content={finalType} />
      <meta property="og:url" content={finalCanonical} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:site_name" content="Dreamcrest Solutions" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDesc} />
      <meta name="twitter:image" content={finalImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="author" content="Dreamcrest Solutions" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="Chennai, India" />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(jsonLd || defaultJsonLd)}
      </script>
    </Helmet>
  );
};

export default SEOHead;
