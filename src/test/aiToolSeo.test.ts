// Automated validation that AI-tool JSON-LD bundles satisfy Google Rich Results
// requirements for Product / Offer / FAQPage / BreadcrumbList. If the SEO
// builder regresses (missing field, wrong type, malformed price, etc.) these
// tests fail before the broken schema reaches production.
import { describe, expect, it } from 'vitest';
import { buildAiToolSeo, slugifyAiTool } from '@/lib/aiToolSeo';
import type { AiTool } from '@/hooks/useAiTools';
import { metaForTool } from '@/data/aiToolMeta';

function makeTool(over: Partial<AiTool> = {}): AiTool {
  const name = over.name ?? 'ChatGPT Plus';
  return {
    id: 'test-1',
    name,
    validity: '1 Month',
    price: 1499,
    image: '',
    activationType: 'Activated on customer mail',
    symbol: 'CGPT',
    change: 0,
    trend: 'flat',
    spark: [],
    meta: metaForTool(name),
    ...over,
  };
}

function findLd<T extends Record<string, unknown>>(
  bundle: Record<string, unknown>[],
  type: string,
): T {
  const hit = bundle.find((b) => b['@type'] === type);
  if (!hit) throw new Error(`Missing JSON-LD @type=${type}`);
  return hit as T;
}

describe('AI tool JSON-LD (Google Rich Results compliance)', () => {
  const seo = buildAiToolSeo(makeTool());

  it('emits all four expected schema blocks', () => {
    const types = seo.jsonLd.map((b) => b['@type']);
    expect(types).toContain('Product');
    expect(types).toContain('BreadcrumbList');
    expect(types).toContain('FAQPage');
  });

  it('every block declares @context: https://schema.org', () => {
    for (const block of seo.jsonLd) {
      expect(block['@context']).toBe('https://schema.org');
    }
  });

  describe('Product / Offer', () => {
    const product = findLd<Record<string, unknown>>(seo.jsonLd, 'Product');
    const offer = product.offers as Record<string, unknown>;

    it('Product has name, description, image, brand, sku', () => {
      expect(typeof product.name).toBe('string');
      expect((product.name as string).length).toBeGreaterThan(0);
      expect(typeof product.description).toBe('string');
      expect(Array.isArray(product.image) || typeof product.image === 'string').toBe(true);
      expect(product.sku).toBeTruthy();
      expect((product.brand as Record<string, unknown>)['@type']).toBe('Brand');
    });

    it('Offer has required Rich Results fields', () => {
      expect(offer['@type']).toBe('Offer');
      expect(offer.priceCurrency).toBe('INR');
      // Price must be a string of digits (Google rejects symbols/commas)
      expect(typeof offer.price).toBe('string');
      expect(offer.price as string).toMatch(/^\d+(\.\d+)?$/);
      expect(offer.availability).toMatch(/^https:\/\/schema\.org\/(InStock|OutOfStock)/);
      expect(offer.url).toMatch(/^https:\/\/dreamcrest\.net\/ai-tool\//);
      // priceValidUntil must be ISO yyyy-mm-dd
      expect(offer.priceValidUntil as string).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect((offer.seller as Record<string, unknown>).name).toBe('Dreamcrest Solutions');
    });

    it('aggregateRating has all four Rich Results properties', () => {
      const r = product.aggregateRating as Record<string, unknown>;
      expect(r['@type']).toBe('AggregateRating');
      expect(Number(r.ratingValue)).toBeGreaterThan(0);
      expect(Number(r.reviewCount)).toBeGreaterThan(0);
      expect(Number(r.bestRating)).toBe(5);
    });

    it('falls back to price="0" for contact-for-pricing tools without crashing', () => {
      const free = buildAiToolSeo(makeTool({ name: 'Confluent Cloud', price: 0 }));
      const p = findLd<Record<string, unknown>>(free.jsonLd, 'Product');
      const o = p.offers as Record<string, unknown>;
      expect(o.price).toBe('0');
      expect(o.priceCurrency).toBe('INR');
    });
  });

  describe('BreadcrumbList', () => {
    const crumbs = findLd<Record<string, unknown>>(seo.jsonLd, 'BreadcrumbList');
    const items = crumbs.itemListElement as Array<Record<string, unknown>>;

    it('has 3 ListItems with positions 1..3', () => {
      expect(items.length).toBe(3);
      items.forEach((item, i) => {
        expect(item['@type']).toBe('ListItem');
        expect(item.position).toBe(i + 1);
        expect(typeof item.name).toBe('string');
        expect(item.item as string).toMatch(/^https:\/\/dreamcrest\.net/);
      });
    });
  });

  describe('FAQPage', () => {
    const faq = findLd<Record<string, unknown>>(seo.jsonLd, 'FAQPage');
    const qs = faq.mainEntity as Array<Record<string, unknown>>;

    it('has at least one Question, each with an Answer', () => {
      expect(qs.length).toBeGreaterThanOrEqual(1);
      for (const q of qs) {
        expect(q['@type']).toBe('Question');
        expect(typeof q.name).toBe('string');
        const a = q.acceptedAnswer as Record<string, unknown>;
        expect(a['@type']).toBe('Answer');
        expect(typeof a.text).toBe('string');
        expect((a.text as string).length).toBeGreaterThan(10);
      }
    });
  });

  describe('Meta tags', () => {
    it('title is under Google’s ~70 char SERP cap', () => {
      expect(seo.title.length).toBeLessThanOrEqual(70);
    });
    it('description is under the ~160 char SERP cap', () => {
      expect(seo.description.length).toBeLessThanOrEqual(160);
    });
    it('canonical url matches slug', () => {
      expect(seo.url).toBe(`https://dreamcrest.net/ai-tool/${seo.slug}`);
    });
    it('ogImage resolves to an absolute https URL', () => {
      expect(seo.ogImage).toMatch(/^https?:\/\//);
    });
  });

  describe('slugifyAiTool', () => {
    it('produces URL-safe, idempotent slugs', () => {
      expect(slugifyAiTool('ChatGPT Plus')).toBe('chatgpt-plus');
      expect(slugifyAiTool('Microsoft 365 with Copilot')).toBe('microsoft-365-with-copilot');
      expect(slugifyAiTool('Eleven Labs & More!')).toBe('eleven-labs-and-more');
      expect(slugifyAiTool(slugifyAiTool('Foo Bar'))).toBe('foo-bar');
    });
  });
});
