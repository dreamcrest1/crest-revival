import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useAiTools, proxyImage } from '@/hooks/useAiTools';
import { popularityFor } from '@/data/aiToolPopularity';
import { slugifyAiTool } from '@/lib/aiToolSeo';

const GlobeCanvas = lazy(() => import('./ProductGlobeCanvas'));

export type GlobeItem = {
  name: string;
  image: string;
  href: string;
};

// Curated OTT brand logos via Clearbit (square, mostly transparent/dark)
const OTT_LOGOS: GlobeItem[] = [
  { name: 'Netflix', image: 'https://logo.clearbit.com/netflix.com', href: '/all-tools' },
  { name: 'Prime Video', image: 'https://logo.clearbit.com/primevideo.com', href: '/all-tools' },
  { name: 'Hotstar', image: 'https://logo.clearbit.com/hotstar.com', href: '/all-tools' },
  { name: 'Zee5', image: 'https://logo.clearbit.com/zee5.com', href: '/all-tools' },
  { name: 'SonyLIV', image: 'https://logo.clearbit.com/sonyliv.com', href: '/all-tools' },
].map((o) => ({ ...o, image: proxyImage(o.image, 256) }));

function useGlobeItems(isMobile: boolean): GlobeItem[] {
  const { data: aiTools } = useAiTools();

  return useMemo(() => {
    const seen = new Set<string>();
    const out: GlobeItem[] = [];
    const push = (it: GlobeItem) => {
      const key = it.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!key || seen.has(key) || !it.image) return;
      seen.add(key);
      out.push(it);
    };

    // OTT logos first (always crisp via Clearbit)
    OTT_LOGOS.forEach(push);

    // Then AI tools — only those that actually have a logo image
    const tools = [...(aiTools ?? [])]
      .filter((t) => t.image && t.image.trim().length > 0)
      .sort((a, b) => popularityFor(b.name) - popularityFor(a.name));
    tools.forEach((t) =>
      push({
        name: t.name,
        image: proxyImage(t.image, 256),
        href: `/ai-tool/${slugifyAiTool(t.name)}`,
      }),
    );

    return out.slice(0, isMobile ? 28 : 45);
  }, [aiTools, isMobile]);
}

const ProductGlobe = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  const { ref, inView } = useInView({ rootMargin: '200px', triggerOnce: false });

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 640px)');
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMq = () => setIsMobile(mq.matches);
    const updateRm = () => setReduced(rm.matches);
    updateMq();
    updateRm();
    mq.addEventListener('change', updateMq);
    rm.addEventListener('change', updateRm);
    return () => {
      mq.removeEventListener('change', updateMq);
      rm.removeEventListener('change', updateRm);
    };
  }, []);

  const items = useGlobeItems(isMobile);

  const handleSelect = (href: string) => navigate(href);

  return (
    <section
      ref={ref}
      className="relative w-full pt-20 sm:pt-24 pb-12 sm:pb-16 overflow-hidden"
      aria-label="Explore Our Universe of Tools"
    >
      <div className="text-center mb-6 sm:mb-10 px-4">
        <h2 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl text-foreground">
          Explore Our <span className="text-primary">Universe of Tools</span>
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base mt-2">
          Drag to spin · Tap a logo to open
        </p>
      </div>

      <div
        className="relative w-full mx-auto"
        style={{ height: isMobile ? 380 : 560, maxWidth: 1100 }}
      >
        {/* Radial backdrop to dim background bleed-through */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, hsl(var(--background) / 0.85) 0%, hsl(var(--background) / 0.55) 45%, transparent 75%)',
          }}
        />
        <div className="relative w-full h-full">
        {reduced || items.length === 0 ? (
          <StaticGrid items={items} />
        ) : inView ? (
          <Suspense fallback={<StaticGrid items={items.slice(0, 24)} />}>
            <GlobeCanvas
              items={items}
              isMobile={isMobile}
              onSelect={handleSelect}
            />
          </Suspense>
        ) : (
          <div className="w-full h-full" />
        )}
        </div>
      </div>
    </section>
  );
};

const StaticGrid = ({ items }: { items: GlobeItem[] }) => (
  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 px-4">
    {items.slice(0, 24).map((it) => (
      <a
        key={it.name}
        href={it.href}
        className="aspect-square rounded-2xl bg-card/60 backdrop-blur border border-border/60 p-2 flex items-center justify-center hover:border-primary/40 transition-colors"
        title={it.name}
      >
        <img
          src={it.image || '/placeholder.svg'}
          alt={it.name}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </a>
    ))}
  </div>
);

export default ProductGlobe;
