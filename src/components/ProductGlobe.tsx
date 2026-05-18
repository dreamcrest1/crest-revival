import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useAiTools } from '@/hooks/useAiTools';
import { popularityFor } from '@/data/aiToolPopularity';
import { slugifyAiTool } from '@/lib/aiToolSeo';

/** Same image proxy as the /ai-tools page — contain-fit keeps logos crisp. */
function logoUrl(src: string, size = 256): string {
  if (!src) return '';
  const stripped = src.replace(/^https?:\/\//, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(stripped)}&w=${size}&h=${size}&fit=contain&output=webp&q=85`;
}

const GlobeCanvas = lazy(() => import('./ProductGlobeCanvas'));

export type GlobeItem = {
  name: string;
  image: string;
  href: string;
};

function useGlobeItems(isMobile: boolean): GlobeItem[] {
  const { data: aiTools } = useAiTools();

  return useMemo(() => {
    const seenName = new Set<string>();
    const seenImg = new Set<string>();
    const out: GlobeItem[] = [];
    const push = (it: GlobeItem) => {
      const nameKey = it.name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const imgKey = it.image.toLowerCase().trim();
      if (!nameKey || !imgKey) return;
      if (seenName.has(nameKey) || seenImg.has(imgKey)) return;
      seenName.add(nameKey);
      seenImg.add(imgKey);
      out.push(it);
    };

    OTT_LOGOS.forEach(push);

    const tools = [...(aiTools ?? [])]
      .filter((t) => t.image && t.image.trim().length > 0)
      .sort((a, b) => popularityFor(b.name) - popularityFor(a.name));
    tools.forEach((t) =>
      push({
        name: t.name.trim(),
        image: proxyImage(t.image, 256),
        href: `/ai-tool/${slugifyAiTool(t.name)}`,
      }),
    );

    return out.slice(0, isMobile ? 30 : 60);
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
      className="relative w-full pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden"
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
          <GlobeSkeleton />
        ) : inView ? (
          <Suspense fallback={<GlobeSkeleton />}>
            <GlobeCanvas
              items={items}
              isMobile={isMobile}
              onSelect={handleSelect}
            />
          </Suspense>
        ) : (
          <GlobeSkeleton />
        )}
        </div>
      </div>
    </section>
  );
};

const GlobeSkeleton = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="relative w-48 h-48 sm:w-64 sm:h-64">
      <div className="absolute inset-0 rounded-full border border-primary/20 animate-pulse" />
      <div className="absolute inset-4 rounded-full border border-primary/10" />
      <div className="absolute inset-8 rounded-full border border-primary/5" />
      <div className="absolute inset-0 rounded-full bg-primary/5 blur-2xl" />
    </div>
  </div>
);

export default ProductGlobe;
